package controllers

import (
	. "eaciit/x10/webapps/connection"
	// "bytes"
	. "eaciit/x10/webapps/models"
	"encoding/xml"
	"fmt"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/gomail.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type XMLReceiverController struct {
	*BaseController
}

func (c *XMLReceiverController) GetOmnifinData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputHtml
	LogID := bson.NewObjectId()
	LogData := tk.M{}
	LogData.Set("_id", LogID)
	LogData.Set("createddate", time.Now().UTC())
	LogData.Set("error", nil)
	LogData.Set("xmlstring", "")
	LogData.Set("iscomplete", false)

	res := `<return>
	            <operationMessage>Operation Successful</operationMessage>
	            <operationStatus>1</operationStatus>
	         </return>`

	resFail := `<return>
	            <operationMessage>Operation Failed</operationMessage>
	            <operationStatus>0</operationStatus>
	         </return>`

	bs, e := ioutil.ReadAll(r.Request.Body)
	if e != nil {
		fmt.Errorf("Unable to read body: " + e.Error())
		LogData.Set("error", e.Error())
		CreateLog(LogData)
		return resFail
	}
	defer r.Request.Body.Close()

	LogData.Set("xmlstring", string(bs))
	CreateLog(LogData)

	IsNew := true
	IsConfirmed := false
	IsSavedCP := true
	// IsSavedAD := true

	Soap := []byte(string(bs))

	obj := MyRespEnvelope{}

	err := xml.Unmarshal(Soap, &obj)

	if err != nil {
		fmt.Println("Payload Decode Error: " + err.Error() + " .Bytes Data: " + string(bs))
		LogData.Set("error", err.Error())
		CreateLog(LogData)
		return resFail
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		fmt.Println(err.Error())
		LogData.Set("error", err.Error())
		CreateLog(LogData)
		return resFail
	}

	qinsert := conn.NewQuery().
		From("OmnifinXML").
		SetConfig("multiexec", true).
		Save()

	obj.Body.GetResponse.Id = obj.Body.GetResponse.GcdCustomerId + "|" + obj.Body.GetResponse.DealNo
	content := obj.Body.GetResponse

	LogData.Set("dataid", obj.Body.GetResponse.Id)
	CreateLog(LogData)

	IsNew, IsConfirmed, err = GenerateCustomerProfile(content)

	if err != nil {
		IsSavedCP = false
		LogData.Set("error", err.Error())
		CreateLog(LogData)
	}

	LogInfos := tk.M{}

	obj.Body.GetResponse.LogInfos = tk.M{}.Set("CreateDate", time.Now().UTC()).Set("IsSaved", IsSavedCP).Set("IsNew", IsNew).Set("IsConfirmed", IsConfirmed)
	LogInfos.Set("cpinfos", obj.Body.GetResponse.LogInfos)

	LogData.Set("infos", LogInfos)
	CreateLog(LogData)

	IsNew, IsConfirmed, err = GenerateAccountDetail(content)

	if err != nil {
		IsSavedCP = false
		LogData.Set("error", err.Error())
		CreateLog(LogData)
	}
	obj.Body.GetResponse.LogInfos = tk.M{}.Set("CreateDate", time.Now().UTC()).Set("IsSaved", IsSavedCP).Set("IsNew", IsNew).Set("IsConfirmed", IsConfirmed)
	LogInfos.Set("adinfos", obj.Body.GetResponse.LogInfos)

	LogData.Set("infos", LogInfos)
	CreateLog(LogData)

	csc := map[string]interface{}{"data": &obj.Body.GetResponse}
	err = qinsert.Exec(csc)
	if err != nil {
		fmt.Print(err.Error())
		return resFail
	}

	LogData.Set("iscomplete", true)
	CreateLog(LogData)
	return res
}

func GenerateCustomerProfile(data ContentXML) (bool, bool, error) {
	cd, err := CheckOnCP(data.GcdCustomerId, data.DealNo)
	if err != nil {
		fmt.Println(err.Error())
		return false, false, err
	}

	IsNew := true
	IsConfirmed := false

	current := CustomerProfiles{}

	if len(cd) > 0 {
		IsNew = false
		current = cd[0]
	}

	stat := current.Status

	comp := FindCompany(data.CrDealCustomerRoleList)

	if stat == 0 && len(cd) == 0 { //data baru

		//================ APPLICANT DETAIL START ================
		current.ApplicantDetail.CustomerName = comp.CustomerDtl.CustomerName
		current.ApplicantDetail.CustomerConstitution = comp.CustomerDtl.CustomerConstitution
		current.ApplicantDetail.DateOfIncorporation = DetectDataType(comp.CustomerDtl.CustomerDob, "yyyy-MM-dd").(time.Time)
		current.ApplicantDetail.CustomerRegistrationNumber = comp.CustomerDtl.CustomerRegistrationNo
		current.ApplicantDetail.CustomerPan = comp.CustomerDtl.CustmerPan
		current.ApplicantDetail.NatureOfBussiness = comp.CustomerDtl.CustomerBusinessSegment
		current.ApplicantDetail.YearsInBusiness = DetectDataType(comp.CustomerDtl.NoBvYears, "")
		// customer.AnnualTurnOver = DetectDataType(val.GetString("turnover"), "yyyy-MM-dd")
		current.ApplicantDetail.UserGroupCompanies = comp.CustomerDtl.CustomerGroupDesc
		current.ApplicantDetail.AmountLoan = DetectDataType(data.DealLoanDetails.DealLoanAmount, "")
		current.ApplicantDetail.RegisteredAddress.AddressRegistered = comp.CustomerDtl.CustomerAddresses.AddressLine1
		// customer.RegisteredAddress.ContactPersonRegistered =  DetectDataType(val.GetString("contact_person"), "yyyy-MM-dd")
		current.ApplicantDetail.RegisteredAddress.PhoneRegistered = comp.CustomerDtl.CustomerAddresses.PrimaryPhone
		current.ApplicantDetail.RegisteredAddress.EmailRegistered = comp.CustomerDtl.CustomerEmail
		current.ApplicantDetail.RegisteredAddress.MobileRegistered = comp.CustomerDtl.CustomerAddresses.AlternatePhone
		// customer.RegisteredAddress.Ownership = comp.CustomerDtl.CustomerAddresses
		current.ApplicantDetail.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
		// customer.RegisteredAddress.CityRegistered = val.GetString("lead_generation_city")
		//================ APPLICANT DETAIL END ================

		//================ PROMOTOR START ======================
		BioS := []BiodataGen{}

		for _, val := range data.CrDealCustomerRoleList {
			if val.DealCustomerType == "C" {
				continue
			}
			Bio := BiodataGen{}
			Bio.Name = val.CustomerDtl.CustomerName
			Bio.FatherName = val.CustomerDtl.FatherHusbandName
			Bio.Gender = val.CustomerDtl.Gender
			Bio.DateOfBirth = DetectDataType(val.CustomerDtl.CustomerDob, "yyyy-MM-dd")
			Bio.MaritalStatus = val.CustomerDtl.MaritalStatus
			// Bio.AnniversaryDate = DetectDataType(val.GetString("date_of_incorporation"), "yyyy-MM-dd")
			Bio.Education = val.CustomerDtl.EduDetail
			Bio.PAN = val.CustomerDtl.CustmerPan
			Bio.Address = val.CustomerDtl.CustomerAddresses.AddressLine1
			Bio.City = val.CustomerDtl.CustomerAddresses.AddressLine2 + " " + val.CustomerDtl.CustomerAddresses.AddressLine3
			// Bio.State = DetectDataType(val.GetString("state"), "yyyy-MM-dd")
			Bio.Pincode = val.CustomerDtl.CustomerAddresses.Pincode
			Bio.Phone = val.CustomerDtl.CustomerAddresses.PrimaryPhone
			Bio.Mobile = val.CustomerDtl.CustomerAddresses.AlternatePhone
			Bio.NoOfYears = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
			Bio.Email = comp.CustomerDtl.CustomerEmail
			BioS = append(BioS, Bio)
		}
		current.DetailOfPromoters.Biodata = BioS
		//================ PROMOTOR END ================

		current.Id = data.Id
		current.ApplicantDetail.CustomerID = DetectDataType(data.GcdCustomerId, "")
		current.ApplicantDetail.DealID = DetectDataType(data.DealId, "")
		current.ApplicantDetail.DealNo = data.DealNo
	} else if stat == 0 && len(cd) > 0 { //data sudah ada

		//================ APPLICANT DETAIL START ================
		current.ApplicantDetail.CustomerName = comp.CustomerDtl.CustomerName
		current.ApplicantDetail.CustomerConstitution = comp.CustomerDtl.CustomerConstitution
		current.ApplicantDetail.DateOfIncorporation = DetectDataType(comp.CustomerDtl.CustomerDob, "yyyy-MM-dd").(time.Time)
		current.ApplicantDetail.CustomerRegistrationNumber = comp.CustomerDtl.CustomerRegistrationNo
		current.ApplicantDetail.CustomerPan = comp.CustomerDtl.CustmerPan
		current.ApplicantDetail.NatureOfBussiness = comp.CustomerDtl.CustomerBusinessSegment
		current.ApplicantDetail.YearsInBusiness = DetectDataType(comp.CustomerDtl.NoBvYears, "")
		// customer.AnnualTurnOver = DetectDataType(val.GetString("turnover"), "yyyy-MM-dd")
		current.ApplicantDetail.UserGroupCompanies = comp.CustomerDtl.CustomerGroupDesc
		current.ApplicantDetail.AmountLoan = DetectDataType(data.DealLoanDetails.DealLoanAmount, "")
		current.ApplicantDetail.RegisteredAddress.AddressRegistered = comp.CustomerDtl.CustomerAddresses.AddressLine1
		// customer.RegisteredAddress.ContactPersonRegistered =  DetectDataType(val.GetString("contact_person"), "yyyy-MM-dd")
		current.ApplicantDetail.RegisteredAddress.PhoneRegistered = comp.CustomerDtl.CustomerAddresses.PrimaryPhone
		current.ApplicantDetail.RegisteredAddress.EmailRegistered = comp.CustomerDtl.CustomerEmail
		current.ApplicantDetail.RegisteredAddress.MobileRegistered = comp.CustomerDtl.CustomerAddresses.AlternatePhone
		// customer.RegisteredAddress.Ownership = comp.CustomerDtl.CustomerAddresses
		current.ApplicantDetail.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
		// customer.RegisteredAddress.CityRegistered = val.GetString("lead_generation_city")
		//================ APPLICANT DETAIL END ================

		//================ PROMOTOR START ======================
		BioS := []BiodataGen{}

		for _, val := range data.CrDealCustomerRoleList {
			if val.DealCustomerType == "C" {
				continue
			}
			Bio := BiodataGen{}
			Bio.Name = val.CustomerDtl.CustomerName
			Bio.FatherName = val.CustomerDtl.FatherHusbandName
			Bio.Gender = val.CustomerDtl.Gender
			Bio.DateOfBirth = DetectDataType(val.CustomerDtl.CustomerDob, "yyyy-MM-dd")
			Bio.MaritalStatus = val.CustomerDtl.MaritalStatus
			// Bio.AnniversaryDate = DetectDataType(val.GetString("date_of_incorporation"), "yyyy-MM-dd")
			Bio.Education = val.CustomerDtl.EduDetail
			Bio.PAN = val.CustomerDtl.CustmerPan
			Bio.Address = val.CustomerDtl.CustomerAddresses.AddressLine1
			Bio.City = val.CustomerDtl.CustomerAddresses.AddressLine2 + " " + val.CustomerDtl.CustomerAddresses.AddressLine3
			// Bio.State = DetectDataType(val.GetString("state"), "yyyy-MM-dd")
			Bio.Pincode = val.CustomerDtl.CustomerAddresses.Pincode
			Bio.Phone = val.CustomerDtl.CustomerAddresses.PrimaryPhone
			Bio.Mobile = val.CustomerDtl.CustomerAddresses.AlternatePhone
			Bio.NoOfYears = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
			Bio.Email = comp.CustomerDtl.CustomerEmail
			BioS = append(BioS, Bio)
		}
		current.DetailOfPromoters.Biodata = BioS
		//================ PROMOTOR END ================

	} else {
		IsConfirmed = true
	}

	if !IsConfirmed {
		conn, err := GetConnection()
		defer conn.Close()
		if err != nil {
			fmt.Println(err.Error())
			return IsNew, IsConfirmed, err
		}

		qinsert := conn.NewQuery().
			From("CustomerProfile").
			SetConfig("multiexec", true).
			Save()

		csc := map[string]interface{}{"data": &current}
		err = qinsert.Exec(csc)
		if err != nil {
			fmt.Print(err.Error())
			return IsNew, IsConfirmed, err
		}
	}

	return IsNew, IsConfirmed, nil
}

func GenerateAccountDetail(data ContentXML) (bool, bool, error) {
	cd, err := CheckOnAD(data.GcdCustomerId, data.DealNo)
	if err != nil {
		fmt.Println(err.Error())
		return false, false, err
	}

	IsNew := true
	IsConfirmed := false

	current := AccountDetail{}

	if len(cd) > 0 {
		IsNew = false
		current = cd[0]
	}
	stat := current.Status

	if stat == 0 && len(cd) == 0 {
		current.Id = data.Id
		current.CustomerId = data.GcdCustomerId
		current.DealNo = data.DealNo
		current.AccountSetupDetails.DealNo = data.DealNo

		current.AccountSetupDetails.LoginDate = DetectDataType(data.DealEncodedDate, "yyyy-MM-dd").(time.Time)
		current.AccountSetupDetails.RmName = data.UserDetailsForRM.UserName
		current.AccountSetupDetails.LeadDistributor = data.DealSourceName
	} else if stat == 0 && len(cd) > 0 {
		current.AccountSetupDetails.LoginDate = DetectDataType(data.DealEncodedDate, "yyyy-MM-dd").(time.Time)
		current.AccountSetupDetails.RmName = data.UserDetailsForRM.UserName
		current.AccountSetupDetails.LeadDistributor = data.DealSourceName
	} else {
		IsConfirmed = true
	}

	if !IsConfirmed {
		conn, err := GetConnection()
		defer conn.Close()
		if err != nil {
			fmt.Println(err.Error())
			return IsNew, IsConfirmed, err
		}

		qinsert := conn.NewQuery().
			From("AccountDetails").
			SetConfig("multiexec", true).
			Save()

		csc := map[string]interface{}{"data": &current}
		err = qinsert.Exec(csc)
		if err != nil {
			fmt.Print(err.Error())
			return IsNew, IsConfirmed, err
		}
	}

	return IsNew, IsConfirmed, nil
}

func FindCompany(datas []CrDealCustomerRoleList) CrDealCustomerRoleList {
	for _, val := range datas {
		if val.DealCustomerType == "C" {
			return val
		}
	}
	return *new(CrDealCustomerRoleList)
}

func CreateLog(LogData tk.M) error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	qinsert := conn.NewQuery().
		From("OmnifinXMLLog").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": LogData}
	err = qinsert.Exec(csc)
	if err != nil {
		fmt.Print(err.Error())
		return err
	}

	if LogData.Get("error") != nil {
		SendMail(LogData.GetString("error"), LogData.GetString("_id"))
	}

	return nil
}

func CheckOnCP(custid string, dealno string) ([]CustomerProfiles, error) {
	cn, err := GetConnection()
	results := []CustomerProfiles{}

	defer cn.Close()
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("_id", custid+"|"+dealno))).
		From("CustomerProfile").
		Cursor(nil)

	if e != nil {
		return results, e
	} else if csr == nil {
		return results, nil
	}

	defer csr.Close()

	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return results, err
	}

	return results, nil
}

func CheckOnAD(custid string, dealno string) ([]AccountDetail, error) {
	cn, err := GetConnection()
	results := []AccountDetail{}

	defer cn.Close()
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("_id", custid+"|"+dealno))).
		From("AccountDetails").
		Cursor(nil)

	if e != nil {
		return results, e
	} else if csr == nil {
		return results, nil
	}

	defer csr.Close()

	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return results, err
	}

	return results, nil
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
					return d

				}
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

func SendMail(em string, logID string) {
	conf := gomail.NewDialer("smtp.office365.com", 587, "admin.support@eaciit.com", "B920Support")
	s, err := conf.Dial()
	if err != nil {
		panic(err)
	}
	mailsubj := tk.Sprintf("%v", "[noreply] CAT XML Error Reminder")
	mailmsg := tk.Sprintf("%v", "XML receiver has some error.</br>Error Message : "+em+".</br> Log ID : "+logID)
	m := gomail.NewMessage()

	m.SetHeader("From", "admin.support@eaciit.com")
	m.SetHeader("To", "yanda.widagdo@eaciit.com")
	m.SetHeader("Subject", mailsubj)
	m.SetBody("text/html", mailmsg)

	if err := gomail.Send(s, m); err != nil {
		fmt.Println(err.Error(), "-----------ERROR")
	} else {
		fmt.Println("Successfully Send Mails")
	}
	m.Reset()
}
