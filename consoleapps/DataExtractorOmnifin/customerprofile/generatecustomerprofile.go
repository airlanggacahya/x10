package main

import (
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/json"
	_ "github.com/eaciit/dbox/dbc/mongo"
	_ "github.com/eaciit/dbox/dbc/mysql"
	tk "github.com/eaciit/toolkit"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"
)

var Conf = tk.M{}
var anyChanges = false
var ErrList = []tk.M{}
var ProcessStart = time.Now().UTC()
var muinsert = &sync.Mutex{}

func delayMinute(n time.Duration) {
	time.Sleep(n * time.Minute)
}

func main() {
	tk.Println("--------Syncronizing EACIIT - X10----------")
	runtime.GOMAXPROCS(4)
	// ErrList = []tk.M{}
	// anyChanges = false
	// ProcessStart = time.Now().UTC()

	GetDBConfig()

	//My SQL Connection
	cSQL, e := GetMySQLConnection()
	defer cSQL.Close()
	if e != nil {
		errorHandling(e, true, "GetMySQLConnection")
	}

	//Mongo Connection
	cMongo, em := GetMongoConnection()
	defer cMongo.Close()
	if em != nil {
		errorHandling(e, true, "GetMongoConnection")
	}

	// //Get DataLog
	// LogData := GetDataLog(cMongo)
	// //Get Data MySQL
	// MySQLData := GetDataMySQL(cSQL)
	// anyChanges = DataCheck(LogData, MySQLData, cMongo, cSQL)

	// SaveLog()
	GenerateCustomerProfile(cMongo, cSQL)
	// GenerateMasterCustomer(cMongo, cSQL)
}

var config_file = func() string {
	d, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	d += "/conf.json"
	return d
}()

func GetDBConfig() {
	ci := &dbox.ConnectionInfo{config_file, "", "", "", nil}
	conn, e := dbox.NewConnection("json", ci)
	if e != nil {
		errorHandling(e, true, "GetDBConfig")
		return
	}
	e = conn.Connect()
	defer conn.Close()
	csr, e := conn.NewQuery().Select("*").Cursor(nil)
	if e != nil {
		errorHandling(e, true, "GetDBConfig")
		return
	}
	defer csr.Close()
	data := []tk.M{}
	e = csr.Fetch(&data, 0, false)
	if e != nil {
		errorHandling(e, true, "GetDBConfig")
		return
	}
	for _, d := range data {
		Conf = d
	}

	return
}

func GetMongoConnection() (dbox.IConnection, error) {
	ci := &dbox.ConnectionInfo{Conf["mongohost"].(string), Conf["mongodbname"].(string), Conf["mongouser"].(string), Conf["mongopassword"].(string), nil}
	conn, e := dbox.NewConnection("mongo", ci)
	e = conn.Connect()
	if e != nil {
		errorHandling(e, true, "GetMongoConnection")
	}
	return conn, nil
}

func GetMySQLConnection() (dbox.IConnection, error) {
	ci := &dbox.ConnectionInfo{Conf["mysqlhost"].(string), Conf["mysqldbname"].(string), Conf["mysqluser"].(string), Conf["mysqlpassword"].(string), tk.M{}.Set("autocasting", true)}
	conn, e := dbox.NewConnection("mysql", ci)
	e = conn.Connect()
	if e != nil {
		return nil, e
	}
	return conn, nil
}

func errorHandling(err error, isPanic bool, functionname string) {
	if err != nil {
		if strings.Contains(err.Error(), "No more data to fetched!") || strings.Contains(err.Error(), "not found") {
			return
		} else {
			ErrList = append(ErrList, tk.M{}.Set("Error", err).Set("FuncName", functionname))
			if isPanic {
				// SaveLog()
				panic(err)
			}
		}
	}
}

func ConvertObject(in tk.M) tk.M {
	for idx, val := range in {
		tp := reflect.TypeOf(val).String()
		if tp == "string" {
			in.Set(idx, DetectDataType(val.(string), "yyyy-MM-dd"))
		} else if tp == "[]toolkit.M" {
			varr := val.([]tk.M)
			for iddx, val := range varr {
				varr[iddx] = ConvertObject(val)
			}
		}
	}
	return in
}

func DetectDataType(in string, dateFormat string) interface{} {
	res := ""
	var ret interface{}
	if in != "" {
		matchNumber := false
		matchFloat := false
		matchDate := false

		formatDate := "((^(0[0-9]|[0-9]|(1|2)[0-9]|3[0-1])(\\.|\\/|-)(0[0-9]|[0-9]|1[0-2])(\\.|\\/|-)[\\d]{4}$)|(^[\\d]{4}(\\.|\\/|-)(0[0-9]|[0-9]|1[0-2])(\\.|\\/|-)(0[0-9]|[0-9]|(1|2)[0-9]|3[0-1])$))"
		matchDate, _ = regexp.MatchString(formatDate, in)

		if !matchDate && dateFormat != "" {
			d := cast.String2Date(strings.Split(in, " ")[0], dateFormat)
			if d.Year() > 1 {
				matchDate = true
			}

			if !matchDate && dateFormat != "" {
				d := cast.String2Date(strings.Split(in, "T")[0], dateFormat)
				if d.Year() > 1 {
					matchDate = true
				}
				return d
			}
		}

		x := strings.Index(in, ".")
		if x > 0 {
			matchFloat = true
		}

		innum := ""
		innum = strings.Replace(in, ".", "", -1)

		matchNumber, _ = regexp.MatchString("^\\d+$", innum)

		if strings.TrimSpace(in) == "true" || strings.TrimSpace(in) == "false" {
			res = "bool"
		} else {
			res = "string"
			if matchNumber {
				res = "int"
				if matchFloat {
					res = "float"
				}
			}

			if matchDate {
				res = "date"
			}
		}
	}

	if res == "int" {
		ret = cast.ToInt(in, cast.RoundingAuto)
	} else if res == "float" {
		ret, _ = strconv.ParseFloat(in, 64)
	} else if res == "date" {
		ret = cast.String2Date(strings.Split(in, " ")[0], dateFormat)
	} else if res == "bool" {
		ret, _ = strconv.ParseBool(in)
	} else {
		ret = in
	}

	return ret
}

func GenerateMasterCustomer(cMongo dbox.IConnection, cSQL dbox.IConnection) {
	resultscustomer := make([]tk.M, 0)
	querycustomer := `select cust.customer_id,cust. customer_name, dtl.deal_no from gcd_customer_m cust 
				join cr_deal_dtl dtl on dtl.gcd_customer_id = cust.customer_id
				join cr_lead_dtl lead on dtl.lead_id = lead.lead_id where cust.customer_type ="C"`
	csr, e := cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", querycustomer)).Cursor(nil)
	errorHandling(e, true, "GenerateMasterCustomer")

	if csr != nil {
		e = csr.Fetch(&resultscustomer, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateMasterCustomer")
	}

	defer csr.Close()

	for _, val := range resultscustomer {
		qinsert := cMongo.NewQuery().
			From("MasterCustomer").
			SetConfig("multiexec", true).
			Insert()
		defer qinsert.Close()
		insdata := map[string]interface{}{"data": ConvertObject(val)}
		e = qinsert.Exec(insdata)
		errorHandling(e, true, "GenerateMasterCustomer")
	}
}

func GenerateCustomerProfile(cMongo dbox.IConnection, cSQL dbox.IConnection) {
	resultscustomer := make([]tk.M, 0)

	querycustomer := `select *,lead.address_line1 address_line1,IFNULL(no_bv_years,0) no_bv_years,IFNULL(customer_group_desc,"") customer_group_desc  from gcd_customer_m cust 
				join cr_deal_dtl dtl on dtl.gcd_customer_id = cust.customer_id
				join cr_lead_dtl lead on dtl.lead_id = lead.lead_id
                join cr_customer_search_dtl search on cust.customer_id = search.customer_id`

	resultguarantor := make([]tk.M, 0)

	queryguarantor := `select *, IFNULL((select CUSTOMER_ID from cr_customer_search_dtl where deal_id = search.deal_id and CUSTOMER_TYPE = "C" LIMIT 1),-1) company_id
						from cr_customer_search_dtl search
 						join gcd_customer_m cust on search.customer_id = cust.customer_id where search.CUSTOMER_TYPE = "I"`

	resultexistingrelation := make([]tk.M, 0)

	queryexistingrelation := `select cust.customer_name, cust.customer_id,dtl.deal_id,dtl.deal_no, loan_no,loan_loan_amount,loan_product_type, pay.instl_amount
				from cr_deal_dtl dtl 
				join gcd_customer_m cust on dtl.gcd_customer_id = cust.customer_id 
				join cr_loan_dtl loan on dtl.deal_id = loan.loan_deal_id
				join cr_repaysch_dtl pay on loan.loan_id = pay.loan_id`

	resultdatabank := make([]tk.M, 0)

	querydatabank := `select bm.BANK_NAME, cust.customer_name,cust.customer_id,bm.*,bank.ACCOUNT_NO,bank.ACCOUNT_TYPE, dtl.deal_id,dtl.deal_no
				from cr_deal_dtl dtl 
				join gcd_customer_m cust on dtl.gcd_customer_id = cust.customer_id 
				join cr_bank_analysis_dtl bank on dtl.deal_id = bank.deal_id
				join com_bank_m bm on bank.bank_name = bm.bank_id`

	resultrefundable := make([]tk.M, 0)

	queryrefundable := `select cust.customer_name,cust.customer_id,dtl.deal_id, dtl.deal_no, ins.instrument_type,ins.instrument_no, bank_name, ins.instrument_amount,ins.instrument_date 
				from cr_txnadvice_dtl txn 
				join cr_instrument_dtl ins on txn.txn_id = ins.txnid 
				join com_bank_m bm on ins.issueing_bank_id = bm.bank_id
				join cr_deal_dtl dtl on txn.deal_id = dtl.deal_id 
				join gcd_customer_m cust on dtl.gcd_customer_id = cust.customer_id`

	csr, e := cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", querycustomer)).Cursor(nil)
	errorHandling(e, true, "GenerateCustomerProfile")
	if csr != nil {
		e = csr.Fetch(&resultscustomer, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateCustomerProfile")
	}

	defer csr.Close()
	tk.Println("Get Data===========")

	csr, e = cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", queryguarantor)).Cursor(nil)
	errorHandling(e, true, "GenerateCustomerProfile")
	if csr != nil {
		e = csr.Fetch(&resultguarantor, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateCustomerProfile")
	}

	csr, e = cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", queryexistingrelation)).Cursor(nil)
	errorHandling(e, true, "GenerateCustomerProfile")
	if csr != nil {
		e = csr.Fetch(&resultexistingrelation, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateCustomerProfile")
	}

	csr, e = cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", querydatabank)).Cursor(nil)
	errorHandling(e, true, "GenerateCustomerProfile")
	if csr != nil {
		e = csr.Fetch(&resultdatabank, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateCustomerProfile")
	}

	csr, e = cSQL.NewQuery().Command("freequery", tk.M{}.Set("syntax", queryrefundable)).Cursor(nil)
	errorHandling(e, true, "GenerateCustomerProfile")
	if csr != nil {
		e = csr.Fetch(&resultrefundable, 0, false)
	} else if e != nil {
		errorHandling(e, true, "GenerateCustomerProfile")
	}

	results := map[string]CustomerProfilesGenNew{}
	for _, val := range resultscustomer {
		key := val["customer_id"].(string) + "|" + val["deal_no"].(string)

		CP := CustomerProfilesGenNew{}
		customer := ApplicantDetailGenNew{}
		customer.CustomerID = DetectDataType(val.GetString("customer_id"), "yyyy-MM-dd")
		customer.DealNo = DetectDataType(val.GetString("deal_no"), "yyyy-MM-dd")
		customer.DealID = DetectDataType(val.GetString("deal_id"), "yyyy-MM-dd")
		customer.CustomerName = DetectDataType(val.GetString("customer_name"), "yyyy-MM-dd")
		customer.CustomerConstitution = DetectDataType(val.GetString("customer_constitution"), "yyyy-MM-dd")
		customer.DateOfIncorporation = DetectDataType(val.GetString("date_of_incorporation"), "yyyy-MM-dd")
		customer.AnyOther = ""
		customer.TIN = ""
		customer.TAN = ""
		customer.CustomerRegistrationNumber = DetectDataType(val.GetString("customer_registration_no"), "yyyy-MM-dd")
		customer.CustomerPan = DetectDataType(val.GetString("custmer_pan"), "yyyy-MM-dd")
		customer.CIN = ""
		customer.NatureOfBussiness = DetectDataType(val.GetString("customer_business_segment"), "yyyy-MM-dd")
		customer.YearsInBusiness = DetectDataType(val.GetString("no_bv_years"), "yyyy-MM-dd")
		customer.NoOfEmployees = 0
		customer.AnnualTurnOver = DetectDataType(val.GetString("turnover"), "yyyy-MM-dd")
		customer.UserGroupCompanies = DetectDataType(val.GetString("customer_group_desc"), "yyyy-MM-dd")
		customer.CapitalExpansionPlans = ""
		customer.GroupTurnOver = 0
		customer.AmountLoan = DetectDataType(val.GetString("amount_required"), "yyyy-MM-dd")

		customer.RegisteredAddress.AddressRegistered = DetectDataType(val.GetString("address_line1"), "yyyy-MM-dd")
		customer.RegisteredAddress.ContactPersonRegistered = DetectDataType(val.GetString("contact_person"), "yyyy-MM-dd")
		customer.RegisteredAddress.PhoneRegistered = val.GetString("primary_phone")
		customer.RegisteredAddress.EmailRegistered = DetectDataType(val.GetString("customer_email"), "yyyy-MM-dd")
		customer.RegisteredAddress.MobileRegistered = val.GetString("source_executive_phone")
		customer.RegisteredAddress.Ownership = DetectDataType(val.GetString("ownership"), "yyyy-MM-dd")
		customer.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = DetectDataType(val.GetString("no_of_years"), "yyyy-MM-dd")
		customer.RegisteredAddress.CityRegistered = val.GetString("lead_generation_city")

		CP.ApplicantDetail = customer
		CP.Id = key
		results[key] = CP
	}

	for _, val := range resultrefundable {
		key := val["customer_id"].(string) + "|" + val["deal_no"].(string)
		if _, ok := results[key]; ok {
			cust := results[key]

			refundable := NonRefundableProcessingFeesDetailsGen{}
			refundable.InstrumentType = DetectDataType(val.GetString("instrument_type"), "yyyy-MM-dd")
			refundable.InstrumentNo = DetectDataType(val.GetString("instrument_no"), "yyyy-MM-dd")
			refundable.InstrumentDate = DetectDataType(val.GetString("instrument_date"), "yyyy-MM-dd")
			refundable.BankName = DetectDataType(val.GetString("bank_name"), "yyyy-MM-dd")
			refundable.Amount = DetectDataType(val.GetString("instrument_amount"), "yyyy-MM-dd")
			cust.NonRefundableProcessingFeesDetails = refundable
			results[key] = cust
		}
	}

	for _, val := range resultdatabank {
		key := val["customer_id"].(string) + "|" + val["deal_no"].(string)
		if _, ok := results[key]; ok {
			cust := results[key]
			bank := DetailsPertainingBankerGen{}
			bank.SrNo = val.GetString("")
			bank.NameOfBanks = DetectDataType(val.GetString("bank_name"), "yyyy-MM-dd")
			bank.AddressContactNo = ""
			bank.AcNo = val.GetString("account_no")
			bank.TypeOfAc = DetectDataType(val.GetString("account_type"), "yyyy-MM-dd")
			bank.YearOpening = DetectDataType(val.GetString("statement_year"), "yyyy-MM-dd")

			arr := cust.FinancialReport.DetailsPertainingBanker
			arr = append(arr, bank)
			cust.FinancialReport.DetailsPertainingBanker = arr
			results[key] = cust
		}
	}

	for _, val := range resultguarantor {
		key := val["company_id"].(string) + "|" + val["deal_no"].(string)
		if _, ok := results[key]; ok {
			cust := results[key]
			Bio := BiodataGen{}
			Bio.Name = DetectDataType(val.GetString("customer_name"), "yyyy-MM-dd")
			Bio.FatherName = DetectDataType(val.GetString("father_husband_name"), "yyyy-MM-dd")
			Bio.Gender = DetectDataType(val.GetString("gender"), "yyyy-MM-dd")
			Bio.DateOfBirth = DetectDataType(val.GetString("customer_dob"), "yyyy-MM-dd")
			Bio.MaritalStatus = DetectDataType(val.GetString("marital_status"), "yyyy-MM-dd")
			Bio.AnniversaryDate = DetectDataType(val.GetString("date_of_incorporation"), "yyyy-MM-dd")
			Bio.ShareHoldingPercentage = 0
			Bio.Guarantor = true
			Bio.Education = ""
			Bio.Designation = ""
			Bio.PAN = DetectDataType(val.GetString("custmer_pan"), "yyyy-MM-dd")
			Bio.Address = DetectDataType(val.GetString("address_line1"), "yyyy-MM-dd")
			Bio.Landmark = ""
			Bio.City = val.GetString("address_line2") + " " + val.GetString("address_line3")
			Bio.State = DetectDataType(val.GetString("state"), "yyyy-MM-dd")
			Bio.Pincode = val.GetString("pincode")
			Bio.Phone = val.GetString("primary_phone")
			Bio.Mobile = ""
			Bio.Ownership = ""
			Bio.NoOfYears = 0
			Bio.ValueOfPot = 0
			Bio.VehiclesOwned = 0
			Bio.NetWorth = 0
			Bio.Email = DetectDataType(val.GetString("customer_email"), "yyyy-MM-dd")
			Bio.CIBILScore = 0
			Bio.Director = false
			Bio.Promotor = false

			arr := cust.DetailOfPromoters.Biodata
			arr = append(arr, Bio)
			cust.DetailOfPromoters.Biodata = arr
			results[key] = cust
		}
	}

	for _, val := range resultexistingrelation {
		key := val["customer_id"].(string) + "|" + val["deal_no"].(string)
		if _, ok := results[key]; ok {
			cust := results[key]
			relation := ExistingRelationshipGen{}
			relation.LoanNo = DetectDataType(val.GetString("loan_no"), "yyyy-MM-dd")
			relation.TypeOfLoan = DetectDataType(val.GetString("loan_product_type"), "yyyy-MM-dd")
			relation.LoanAmount = DetectDataType(val.GetString("loan_loan_amount"), "yyyy-MM-dd")
			relation.Payment = DetectDataType(val.GetString("instl_amount"), "yyyy-MM-dd")

			arr := cust.FinancialReport.ExistingRelationship
			arr = append(arr, relation)
			cust.FinancialReport.ExistingRelationship = arr
			results[key] = cust
		}
	}
	tk.Println("Saving==============")
	for _, val := range results {
		qinsert := cMongo.NewQuery().
			From("BETAX").
			SetConfig("multiexec", true).
			Insert()
		defer qinsert.Close()
		val.Status = 0
		val.LastUpdate = time.Time{}
		val.VerifiedDate = time.Time{}
		val.ConfirmedDate = time.Time{}
		val.UpdatedBy = ""
		val.VerifiedBy = ""
		val.ConfirmedBy = ""
		insdata := map[string]interface{}{"data": val}
		e = qinsert.Exec(insdata)
		errorHandling(e, true, "ActionDo")
	}
}
