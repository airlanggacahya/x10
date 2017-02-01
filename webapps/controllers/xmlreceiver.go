package controllers

import (
	"bytes"
	. "eaciit/x10/consoleapps/OmnifinMaster/models"
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"encoding/json"
	"errors"
	// "encoding/xml"
	"fmt"
	"io"
	"io/ioutil"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/eaciit/cast"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type XMLReceiverController struct {
	*BaseController
}

func xmlToJson(r io.Reader) (*bytes.Buffer, error) {
	root := &Node{}
	err := NewDecoder(r).Decode(root)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	err = NewEncoder(buf).Encode(root)
	if err != nil {
		return nil, err
	}

	return buf, nil
}

func (c *XMLReceiverController) GetOmnifinData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputHtml
	LogID := bson.NewObjectId()
	LogData := tk.M{}
	LogData.Set("_id", LogID)
	LogData.Set("createddate", time.Now().UTC())
	LogData.Set("error", nil)
	LogData.Set("xmlstring", "")
	LogData.Set("xmltkm", "")
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

	// Source xml is not escaped
	xmlstr := strings.NewReader(CleaningXMLText(string(bs)))

	// Convert to JSON
	// TODO: Probably simplify this routine
	resjson, err := xmlToJson(xmlstr)
	if err != nil {
		LogData.Set("error", err.Error())
		CreateLog(LogData)
		return resFail
	}

	var msg interface{}
	err = json.Unmarshal([]byte(resjson.String()), &msg)
	if err != nil {
		LogData.Set("error", err.Error())
		CreateLog(LogData)
		return resFail
	}

	msgMap, ok := msg.(map[string]interface{})
	if !ok {
		LogData.Set("error", "Unknown Error")
		CreateLog(LogData)
		return resFail
	}

	LogData.Set("xmltkm", msgMap)
	CreateLog(LogData)

	if err != nil {
		fmt.Println("Payload Decode Error: " + err.Error() + " .Bytes Data: " + string(bs))
		LogData.Set("error", err.Error())
		CreateLog(LogData)
		return resFail
	}
	// Decode done

	// Some data scrambling
	content := tk.M(msgMap)
	contentbody := tk.M(content.Get("crDealDtl").(map[string]interface{}))
	crList := []tk.M{}
	crL := contentbody.Get("crDealCustomerRoleList").([]interface{})

	for _, varL := range crL {
		crList = append(crList, tk.M(varL.(map[string]interface{})))
	}

	cid := contentbody.GetString("dealCustomerId")
	dealno := contentbody.GetString("dealNo")
	dataid := cid + "|" + dealno

	LogData.Set("dataid", dataid)
	CreateLog(LogData)

	// Build Customer Profile
	cp, err := BuildCustomerProfile(contentbody, crList, cid, dealno)
	if err != nil {
		LogData.Set("error", err.Error())
		CreateLog(LogData)
	}

	// Build Account Detail
	ad, err := BuildAccountDetail(contentbody, crList, cid, dealno)
	if err != nil {
		LogData.Set("error", err.Error())
		CreateLog(LogData)
	}

	// Build Internal RTR
	irtr, err := BuildInternalRTR(contentbody, cid, dealno)
	if err != nil {
		LogData.Set("error", err.Error()+" | InternalRTR")
		CreateLog(LogData)
	}

	// Save OmnifinXML
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

	contentbody.Set("_id", bson.NewObjectId())
	csc := map[string]interface{}{"data": contentbody}
	err = qinsert.Exec(csc)
	if err != nil {
		fmt.Print(err.Error())
		return resFail
	}

	// Save Account Setup
	qAccountSetup := conn.NewQuery().
		From("AccountSetup").
		SetConfig("multiexec", true).
		Save()

	csc = map[string]interface{}{"data": map[string]interface{}{
		"_id":             bson.NewObjectId(),
		"customerprofile": cp,
		"accountdetails":  ad,
		"internalrtr":     irtr,
		"info":            BuildInfo(),
	}}
	err = qAccountSetup.Exec(csc)
	if err != nil {
		fmt.Print(err.Error())
		return resFail
	}

	LogData.Set("iscomplete", true)
	CreateLog(LogData)
	return res
}

func BuildInfo() tk.M {
	infoNA := tk.M{
		"updateTime": time.Now(),
		"status":     "NA",
	}

	infoQueue := tk.M{
		"updateTime": time.Now(),
		"status":     "In queue",
	}

	info := tk.M{
		"myInfo":    infoQueue,
		"caInfo":    infoNA,
		"cibilInfo": infoNA,
		"bsiInfo":   infoNA,
		"sdbInfo":   infoNA,
		"adInfo":    infoNA,
		"baInfo":    infoNA,
		"ertrInfo":  infoNA,
		"irtrInfo":  infoNA,
		"ddInfo":    infoNA,
	}

	return info
}

var ErrorStatusNotZero = errors.New("Status Not Zero")
var ErrorDealCustomerIdEmpty = errors.New("Deal Customer Id Empty")

func BuildCustomerProfile(body tk.M, crList []tk.M, cid string, dealno string) (*CustomerProfiles, error) {
	current := CustomerProfiles{}
	stat := current.Status
	comp := FindCompany(crList, body.GetString("dealCustomerId"))
	valid := comp.GetString("dealCustomerId")

	if stat != 0 {
		return nil, ErrorStatusNotZero
	}

	if len(valid) == 0 {
		return nil, ErrorDealCustomerIdEmpty
	}

	customerDtl := tk.M(comp.Get("customerDtl").(map[string]interface{}))
	loanDtl := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

	//================ APPLICANT DETAIL START ================
	current.ApplicantDetail.CustomerName = customerDtl.GetString("customerName")
	current.ApplicantDetail.CustomerConstitution = customerDtl.GetString("customerConstitutionDesc")
	if customerDtl.GetString("customerDob") != "" {
		current.ApplicantDetail.DateOfIncorporation = DetectDataType(customerDtl.GetString("customerDob"), "yyyy-MM-dd").(time.Time)
	}
	current.ApplicantDetail.CustomerRegistrationNumber = customerDtl.GetString("customerRegistrationNo")
	current.ApplicantDetail.TIN = customerDtl.GetString("salesTaxTinNo")
	current.ApplicantDetail.CustomerPan = customerDtl.GetString("custmerPan")
	current.ApplicantDetail.NatureOfBussiness = customerDtl.GetString("natureOfBusiness")
	current.ApplicantDetail.YearsInBusiness = DetectDataType(customerDtl.GetString("yearOfEstblishment"), "")
	current.ApplicantDetail.NoOfEmployees = DetectDataType(customerDtl.GetString("noOfEmployees"), "")
	current.ApplicantDetail.UserGroupCompanies = customerDtl.GetString("customerGroupDesc")
	current.ApplicantDetail.AmountLoan = DetectDataType(loanDtl.GetString("dealLoanAmount"), "")
	//================ APPLICANT DETAIL END ================

	//================ EXISTING LOAN START =================
	exist := CheckArray(body.Get("existingDealDetails"))
	Ld := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

	current.FinancialReport.ExistingRelationship = []ExistingRelationshipGen{}
	if len(exist) > 0 {
		for _, val := range exist {
			ld := CheckArray(val.Get("loanDetails"))
			for _, valx := range ld {
				ex := ExistingRelationshipGen{}
				ex.LoanNo = valx.GetString("loanNo")
				ex.TypeOfLoan = Ld.GetString("loanTypeDesc")
				ex.LoanAmount = valx.GetInt("loanAmount")
				ex.Payment = tk.M(valx.Get("crInstrumentDtl").(map[string]interface{})).GetString("instrumentAmount")
				current.FinancialReport.ExistingRelationship = append(current.FinancialReport.ExistingRelationship, ex)
			}
		}
	}
	//================ EXISTING LOAN END =================
	BioS := []BiodataGen{}
	current.DetailOfPromoters.DetailOfReference = []DetailOfReference{}
	for _, val := range crList {
		dtl := tk.M(val.Get("customerDtl").(map[string]interface{}))
		reff := CheckArray(dtl.Get("crDealReferenceM"))
		addr := CheckArray(dtl.Get("customerAddresses"))

		//=============== REFERENCE START =========================
		for _, revl := range reff {
			rr := DetailOfReference{}
			rr.Name = revl.GetString("fName") + " " + revl.GetString("lName")
			rr.Address = revl.GetString("refAddress")
			rr.ContactNo = revl.GetString("mobileNumber")
			rr.RelationAplicant = revl.GetString("relationship")
			current.DetailOfPromoters.DetailOfReference = append(current.DetailOfPromoters.DetailOfReference, rr)
		}
		//=============== REFERENCE END =========================

		//=============== OFFICE ADDRESS =========================
		for _, ad := range addr {
			adt := ad.GetString("addressType")

			if strings.Contains(adt, "REGOFF") {
				current.ApplicantDetail.RegisteredAddress.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
				current.ApplicantDetail.RegisteredAddress.PhoneRegistered = ad.GetString("alternatePhone")
				current.ApplicantDetail.RegisteredAddress.MobileRegistered = ad.GetString("primaryPhone")
				current.ApplicantDetail.RegisteredAddress.LandmarkRegistered = ad.GetString("landmark")
				current.ApplicantDetail.RegisteredAddress.CityRegistered = ad.GetString("districtDesc")
				current.ApplicantDetail.RegisteredAddress.StateRegistered = ad.GetString("stateDesc")
				current.ApplicantDetail.RegisteredAddress.PincodeRegistered = ad.GetString("pincode")
				current.ApplicantDetail.RegisteredAddress.Ownership = ad.GetString("addressDetailDesc")
				current.ApplicantDetail.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = ad.GetFloat64("noOfYears")
				current.ApplicantDetail.RegisteredAddress.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
			} else if strings.Contains(adt, "REI") || strings.Contains(adt, "RES") {
				current.ApplicantDetail.AddressCorrespondence.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
				current.ApplicantDetail.AddressCorrespondence.PhoneRegistered = ad.GetString("alternatePhone")
				current.ApplicantDetail.AddressCorrespondence.MobileRegistered = ad.GetString("primaryPhone")
				current.ApplicantDetail.AddressCorrespondence.LandmarkRegistered = ad.GetString("landmark")
				current.ApplicantDetail.AddressCorrespondence.CityRegistered = ad.GetString("districtDesc")
				current.ApplicantDetail.AddressCorrespondence.StateRegistered = ad.GetString("stateDesc")
				current.ApplicantDetail.AddressCorrespondence.PincodeRegistered = ad.GetString("pincode")
				current.ApplicantDetail.AddressCorrespondence.Ownership = ad.GetString("addressDetailDesc")
				current.ApplicantDetail.AddressCorrespondence.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
			} else if strings.Contains(adt, "OFFICE") {
				current.ApplicantDetail.SiteWorkAddress.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
				current.ApplicantDetail.SiteWorkAddress.PhoneRegistered = ad.GetString("alternatePhone")
				current.ApplicantDetail.SiteWorkAddress.MobileRegistered = ad.GetString("primaryPhone")
				current.ApplicantDetail.SiteWorkAddress.LandmarkRegistered = ad.GetString("landmark")
				current.ApplicantDetail.SiteWorkAddress.CityRegistered = ad.GetString("districtDesc")
				current.ApplicantDetail.SiteWorkAddress.StateRegistered = ad.GetString("stateDesc")
				current.ApplicantDetail.SiteWorkAddress.PincodeRegistered = ad.GetString("pincode")
				current.ApplicantDetail.SiteWorkAddress.Ownership = ad.GetString("addressDetailDesc")
				current.ApplicantDetail.SiteWorkAddress.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
			}
		}
		//=============== OFFICE ADDRESS END =========================

		//================ PROMOTOR START ======================
		if val.GetString("dealCustomerId") == comp.GetString("dealCustomerId") {
			continue
		}
		// stkhold := CheckArray(dtl.Get("crDealCustomerStakeholderM"))

		Bio := BiodataGen{}
		Bio.Name = dtl.GetString("customerName")
		Bio.FatherName = dtl.GetString("fatherHusbandName")
		Bio.Gender = dtl.GetString("genderDesc")
		Bio.DateOfBirth = DetectDataType(dtl.GetString("customerDob"), "yyyy-MM-dd")
		Bio.MaritalStatus = dtl.GetString("maritalStatusDesc")
		roletype := strings.ToLower(val.GetString("dealCustomerRoleTypeDesc"))

		if roletype == "guarantor" {
			if strings.ToLower(val.GetString("dealCustomerTypeDesc")) != "individual" {
				continue
			}
			Bio.Guarantor = "Yes"
		} else {
			Bio.Guarantor = "No"
			Bio.Position = append(Bio.Position, ToWordCase(val.GetString("dealCustomerRoleTypeDesc")))
			Bio.Designation = append(Bio.Designation, val.GetString("dealCustomerRoleType"))
			// add position
		}

		// if len(stkhold) > 0 {
		// 	Bio.ShareHoldingPercentage = stkhold[0].GetFloat64("stakeholderPercentage")
		// 	Bio.Designation = stkhold[0].GetString("stakeholderPosition")
		// }
		Bio.Education = dtl.GetString("eduDetail")
		Bio.PAN = dtl.GetString("custmerPan")

		if len(addr) > 0 {
			Bio.Address = addr[0].GetString("addressLine1") + ", " + addr[0].GetString("addressLine2") + ", " + addr[0].GetString("addressLine3")
			Bio.Landmark = addr[0].GetString("landmark")
			Bio.City = addr[0].GetString("districtDesc")
			Bio.State = addr[0].GetString("stateDesc")
			Bio.Pincode = addr[0].GetString("pincode")
			Bio.Phone = addr[0].GetString("alternatePhone")
			Bio.Mobile = addr[0].GetString("primaryPhone")
			Bio.Ownership = addr[0].GetString("addressDetailDesc")
			Bio.NoOfYears = addr[0].GetFloat64("noOfYears")
		}

		Bio.Email = dtl.GetString("customerEmail")

		BioS = append(BioS, Bio)
	}

	//================ PROMOTOR FROM STAKEHOLDER=======================
	stkhold := CheckArray(customerDtl.Get("crDealCustomerStakeholderM"))

	for _, val := range stkhold {
		Bio := BiodataGen{}
		bb, bbs := FindSamePromotor(BioS, val)
		position := strings.ToLower(val.GetString("stakeholderPositionDesc"))
		if bb.Name != nil { // promotor exists
			BioS = bbs
			Bio = bb
		} else {
			Bio.Name = val.GetString("stakeholderName")
			// Bio.FatherName = val.GetString("FatherHusbandName") -- gak onok
			// Bio.Gender = val.GetString("genderDesc") -- gak onok
			Bio.DateOfBirth = DetectDataType(val.GetString("stakeholderDob"), "yyyy-MM-dd")
			// Bio.MaritalStatus = val.GetString("maritalStatusDesc") -- gak onok
			// Bio.Education = dtl.GetString("eduDetail") -- gak onok
			Bio.PAN = val.GetString("stakeholderPan")
			Bio.Mobile = val.GetString("stakeholderPrimaryPhone")
			Bio.ShareHoldingPercentage = val.GetFloat64("stakeholderPercentage")
			// Bio.Designation = ToWordCase(val.GetString("stakeholderPositionDesc"))
		}

		if position == "promoter" {
			Bio.Promotor = "Yes"
		} else if position == "director" {
			Bio.Director = "Yes"
		} else {
			Bio.Position = append(Bio.Position, ToWordCase(val.GetString("stakeholderPositionDesc")))
			Bio.Designation = append(Bio.Designation, val.GetString("stakeholderPosition"))
			//add ke position
		}
		BioS = append(BioS, Bio)
	}

	//================ PROMOTOR FROM STAKEHOLDER END=======================

	current.DetailOfPromoters.Biodata = BioS
	//================ PROMOTOR END ================

	current.Id = cid + "|" + dealno
	current.ApplicantDetail.CustomerID = DetectDataType(cid, "")
	current.ApplicantDetail.DealID = DetectDataType(body.GetString("dealId"), "")
	current.ApplicantDetail.DealNo = dealno

	return &current, nil
}

// func GenerateCustomerProfile(body tk.M, crList []tk.M, cid string, dealno string) (bool, bool, error) {

// 	cd, err := CheckOnCP(cid, dealno)
// 	if err != nil {
// 		fmt.Println(err.Error())
// 		return false, false, err
// 	}

// 	IsNew := true
// 	IsConfirmed := false

// 	current := CustomerProfiles{}

// 	if len(cd) > 0 {
// 		IsNew = false
// 		current = cd[0]
// 	}

// 	stat := current.Status

// 	comp := FindCompany(crList, body.GetString("dealCustomerId"))

// 	valid := comp.GetString("dealCustomerId")

// 	if stat == 0 && valid != "" {
// 		customerDtl := tk.M(comp.Get("customerDtl").(map[string]interface{}))
// 		loanDtl := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

// 		//================ APPLICANT DETAIL START ================
// 		current.ApplicantDetail.CustomerName = customerDtl.GetString("customerName")
// 		current.ApplicantDetail.CustomerConstitution = customerDtl.GetString("customerConstitutionDesc")
// 		if customerDtl.GetString("customerDob") != "" {
// 			current.ApplicantDetail.DateOfIncorporation = DetectDataType(customerDtl.GetString("customerDob"), "yyyy-MM-dd").(time.Time)
// 		}
// 		current.ApplicantDetail.CustomerRegistrationNumber = customerDtl.GetString("customerRegistrationNo")
// 		current.ApplicantDetail.TIN = customerDtl.GetString("salesTaxTinNo")
// 		current.ApplicantDetail.CustomerPan = customerDtl.GetString("custmerPan")
// 		current.ApplicantDetail.NatureOfBussiness = customerDtl.GetString("natureOfBusiness")
// 		current.ApplicantDetail.YearsInBusiness = DetectDataType(customerDtl.GetString("yearOfEstblishment"), "")
// 		current.ApplicantDetail.NoOfEmployees = DetectDataType(customerDtl.GetString("noOfEmployees"), "")
// 		current.ApplicantDetail.UserGroupCompanies = customerDtl.GetString("customerGroupDesc")
// 		current.ApplicantDetail.AmountLoan = DetectDataType(loanDtl.GetString("dealLoanAmount"), "")
// 		//================ APPLICANT DETAIL END ================

// 		//================ EXISTING LOAN START =================
// 		exist := CheckArray(body.Get("existingDealDetails"))
// 		Ld := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

// 		current.FinancialReport.ExistingRelationship = []ExistingRelationshipGen{}
// 		if len(exist) > 0 {
// 			for _, val := range exist {
// 				ld := CheckArray(val.Get("loanDetails"))
// 				for _, valx := range ld {
// 					ex := ExistingRelationshipGen{}
// 					ex.LoanNo = valx.GetString("loanNo")
// 					ex.TypeOfLoan = Ld.GetString("loanTypeDesc")
// 					ex.LoanAmount = valx.GetInt("loanAmount")
// 					ex.Payment = tk.M(valx.Get("crInstrumentDtl").(map[string]interface{})).GetString("instrumentAmount")
// 					current.FinancialReport.ExistingRelationship = append(current.FinancialReport.ExistingRelationship, ex)
// 				}
// 			}
// 		}
// 		//================ EXISTING LOAN END =================

// 		BioS := []BiodataGen{}
// 		current.DetailOfPromoters.DetailOfReference = []DetailOfReference{}
// 		for _, val := range crList {
// 			dtl := tk.M(val.Get("customerDtl").(map[string]interface{}))
// 			reff := CheckArray(dtl.Get("crDealReferenceM"))
// 			addr := CheckArray(dtl.Get("customerAddresses"))

// 			//=============== REFERENCE START =========================
// 			for _, revl := range reff {
// 				rr := DetailOfReference{}
// 				rr.Name = revl.GetString("fName") + " " + revl.GetString("lName")
// 				rr.Address = revl.GetString("refAddress")
// 				rr.ContactNo = revl.GetString("mobileNumber")
// 				rr.RelationAplicant = revl.GetString("relationship")
// 				current.DetailOfPromoters.DetailOfReference = append(current.DetailOfPromoters.DetailOfReference, rr)
// 			}
// 			//=============== REFERENCE END =========================

// 			//=============== OFFICE ADDRESS =========================
// 			for _, ad := range addr {
// 				adt := ad.GetString("addressType")
// 				if strings.Contains(adt, "REGOFF") {
// 					current.ApplicantDetail.RegisteredAddress.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
// 					current.ApplicantDetail.RegisteredAddress.PhoneRegistered = ad.GetString("alternatePhone")
// 					current.ApplicantDetail.RegisteredAddress.MobileRegistered = ad.GetString("primaryPhone")
// 					current.ApplicantDetail.RegisteredAddress.LandmarkRegistered = ad.GetString("landmark")
// 					current.ApplicantDetail.RegisteredAddress.CityRegistered = ad.GetString("districtDesc")
// 					current.ApplicantDetail.RegisteredAddress.StateRegistered = ad.GetString("stateDesc")
// 					current.ApplicantDetail.RegisteredAddress.PincodeRegistered = ad.GetString("pincode")
// 					current.ApplicantDetail.RegisteredAddress.Ownership = ad.GetString("addressDetailDesc")
// 					current.ApplicantDetail.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = ad.GetFloat64("noOfYears")
// 					current.ApplicantDetail.RegisteredAddress.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
// 				} else if strings.Contains(adt, "REI") || strings.Contains(adt, "RES") {
// 					current.ApplicantDetail.AddressCorrespondence.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
// 					current.ApplicantDetail.AddressCorrespondence.PhoneRegistered = ad.GetString("alternatePhone")
// 					current.ApplicantDetail.AddressCorrespondence.MobileRegistered = ad.GetString("primaryPhone")
// 					current.ApplicantDetail.AddressCorrespondence.LandmarkRegistered = ad.GetString("landmark")
// 					current.ApplicantDetail.AddressCorrespondence.CityRegistered = ad.GetString("districtDesc")
// 					current.ApplicantDetail.AddressCorrespondence.StateRegistered = ad.GetString("stateDesc")
// 					current.ApplicantDetail.AddressCorrespondence.PincodeRegistered = ad.GetString("pincode")
// 					current.ApplicantDetail.AddressCorrespondence.Ownership = ad.GetString("addressDetailDesc")
// 					current.ApplicantDetail.AddressCorrespondence.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
// 				} else if strings.Contains(adt, "OFFICE") {
// 					current.ApplicantDetail.SiteWorkAddress.AddressRegistered = ad.GetString("addressLine1") + ", " + ad.GetString("addressLine2") + ", " + ad.GetString("addressLine3")
// 					current.ApplicantDetail.SiteWorkAddress.PhoneRegistered = ad.GetString("alternatePhone")
// 					current.ApplicantDetail.SiteWorkAddress.MobileRegistered = ad.GetString("primaryPhone")
// 					current.ApplicantDetail.SiteWorkAddress.LandmarkRegistered = ad.GetString("landmark")
// 					current.ApplicantDetail.SiteWorkAddress.CityRegistered = ad.GetString("districtDesc")
// 					current.ApplicantDetail.SiteWorkAddress.StateRegistered = ad.GetString("stateDesc")
// 					current.ApplicantDetail.SiteWorkAddress.PincodeRegistered = ad.GetString("pincode")
// 					current.ApplicantDetail.SiteWorkAddress.Ownership = ad.GetString("addressDetailDesc")
// 					current.ApplicantDetail.SiteWorkAddress.CorrespondeceAddress = ad.GetString("communicationAddressDesc")
// 				}
// 			}
// 			//=============== OFFICE ADDRESS END =========================

// 			//================ PROMOTOR START ======================
// 			if val.GetString("dealCustomerId") == comp.GetString("dealCustomerId") {
// 				continue
// 			}
// 			// stkhold := CheckArray(dtl.Get("crDealCustomerStakeholderM"))

// 			Bio := BiodataGen{}
// 			Bio.Name = dtl.GetString("customerName")
// 			Bio.FatherName = dtl.GetString("fatherHusbandName")
// 			Bio.Gender = dtl.GetString("genderDesc")
// 			Bio.DateOfBirth = DetectDataType(dtl.GetString("customerDob"), "yyyy-MM-dd")
// 			Bio.MaritalStatus = dtl.GetString("maritalStatusDesc")
// 			roletype := strings.ToLower(val.GetString("dealCustomerRoleTypeDesc"))

// 			if roletype == "guarantor" {
// 				if strings.ToLower(val.GetString("dealCustomerTypeDesc")) != "individual" {
// 					continue
// 				}
// 				Bio.Guarantor = "Yes"
// 			} else {
// 				Bio.Guarantor = "No"
// 				Bio.Position = append(Bio.Position, ToWordCase(val.GetString("dealCustomerRoleTypeDesc")))
// 				Bio.Designation = append(Bio.Designation, val.GetString("dealCustomerRoleType"))
// 				// add position
// 			}

// 			// if len(stkhold) > 0 {
// 			// 	Bio.ShareHoldingPercentage = stkhold[0].GetFloat64("stakeholderPercentage")
// 			// 	Bio.Designation = stkhold[0].GetString("stakeholderPosition")
// 			// }
// 			Bio.Education = dtl.GetString("eduDetail")
// 			Bio.PAN = dtl.GetString("custmerPan")

// 			if len(addr) > 0 {
// 				Bio.Address = addr[0].GetString("addressLine1") + ", " + addr[0].GetString("addressLine2") + ", " + addr[0].GetString("addressLine3")
// 				Bio.Landmark = addr[0].GetString("landmark")
// 				Bio.City = addr[0].GetString("districtDesc")
// 				Bio.State = addr[0].GetString("stateDesc")
// 				Bio.Pincode = addr[0].GetString("pincode")
// 				Bio.Phone = addr[0].GetString("alternatePhone")
// 				Bio.Mobile = addr[0].GetString("primaryPhone")
// 				Bio.Ownership = addr[0].GetString("addressDetailDesc")
// 				Bio.NoOfYears = addr[0].GetFloat64("noOfYears")
// 			}

// 			Bio.Email = dtl.GetString("customerEmail")

// 			BioS = append(BioS, Bio)
// 		}

// 		//================ PROMOTOR FROM STAKEHOLDER=======================
// 		stkhold := CheckArray(customerDtl.Get("crDealCustomerStakeholderM"))

// 		for _, val := range stkhold {
// 			Bio := BiodataGen{}
// 			bb, bbs := FindSamePromotor(BioS, val)
// 			position := strings.ToLower(val.GetString("stakeholderPositionDesc"))
// 			if bb.Name != nil { // promotor exists
// 				BioS = bbs
// 				Bio = bb
// 			} else {
// 				Bio.Name = val.GetString("stakeholderName")
// 				// Bio.FatherName = val.GetString("FatherHusbandName") -- gak onok
// 				// Bio.Gender = val.GetString("genderDesc") -- gak onok
// 				Bio.DateOfBirth = DetectDataType(val.GetString("stakeholderDob"), "yyyy-MM-dd")
// 				// Bio.MaritalStatus = val.GetString("maritalStatusDesc") -- gak onok
// 				// Bio.Education = dtl.GetString("eduDetail") -- gak onok
// 				Bio.PAN = val.GetString("stakeholderPan")
// 				Bio.Mobile = val.GetString("stakeholderPrimaryPhone")
// 				Bio.ShareHoldingPercentage = val.GetFloat64("stakeholderPercentage")
// 				// Bio.Designation = ToWordCase(val.GetString("stakeholderPositionDesc"))
// 			}

// 			if position == "promoter" {
// 				Bio.Promotor = "Yes"
// 			} else if position == "director" {
// 				Bio.Director = "Yes"
// 			} else {
// 				Bio.Position = append(Bio.Position, ToWordCase(val.GetString("stakeholderPositionDesc")))
// 				Bio.Designation = append(Bio.Designation, val.GetString("stakeholderPosition"))
// 				//add ke position
// 			}
// 			BioS = append(BioS, Bio)
// 		}

// 		//================ PROMOTOR FROM STAKEHOLDER END=======================

// 		current.DetailOfPromoters.Biodata = BioS
// 		//================ PROMOTOR END ================

// 		current.Id = cid + "|" + dealno
// 		current.ApplicantDetail.CustomerID = DetectDataType(cid, "")
// 		current.ApplicantDetail.DealID = DetectDataType(body.GetString("dealId"), "")
// 		current.ApplicantDetail.DealNo = dealno
// 	} else {
// 		IsConfirmed = true
// 	}
// 	// else if stat == 0 && len(cd) > 0 { //data sudah ada

// 	// //================ APPLICANT DETAIL START ================
// 	// current.ApplicantDetail.CustomerName = comp.CustomerDtl.CustomerName
// 	// current.ApplicantDetail.CustomerConstitution = comp.CustomerDtl.CustomerConstitution
// 	// current.ApplicantDetail.DateOfIncorporation = DetectDataType(comp.CustomerDtl.CustomerDob, "yyyy-MM-dd").(time.Time)
// 	// current.ApplicantDetail.CustomerRegistrationNumber = comp.CustomerDtl.CustomerRegistrationNo
// 	// current.ApplicantDetail.CustomerPan = comp.CustomerDtl.CustmerPan
// 	// current.ApplicantDetail.NatureOfBussiness = comp.CustomerDtl.CustomerBusinessSegment
// 	// current.ApplicantDetail.YearsInBusiness = DetectDataType(comp.CustomerDtl.NoBvYears, "")
// 	// // customer.AnnualTurnOver = DetectDataType(val.GetString("turnover"), "yyyy-MM-dd")
// 	// current.ApplicantDetail.UserGroupCompanies = comp.CustomerDtl.CustomerGroupDesc
// 	// current.ApplicantDetail.AmountLoan = DetectDataType(data.DealLoanDetails.DealLoanAmount, "")
// 	// current.ApplicantDetail.RegisteredAddress.AddressRegistered = comp.CustomerDtl.CustomerAddresses.AddressLine1
// 	// // customer.RegisteredAddress.ContactPersonRegistered =  DetectDataType(val.GetString("contact_person"), "yyyy-MM-dd")
// 	// current.ApplicantDetail.RegisteredAddress.PhoneRegistered = comp.CustomerDtl.CustomerAddresses.PrimaryPhone
// 	// current.ApplicantDetail.RegisteredAddress.EmailRegistered = comp.CustomerDtl.CustomerEmail
// 	// current.ApplicantDetail.RegisteredAddress.MobileRegistered = comp.CustomerDtl.CustomerAddresses.AlternatePhone
// 	// // customer.RegisteredAddress.Ownership = comp.CustomerDtl.CustomerAddresses
// 	// current.ApplicantDetail.RegisteredAddress.NoOfYearsAtAboveAddressRegistered = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
// 	// // customer.RegisteredAddress.CityRegistered = val.GetString("lead_generation_city")
// 	// //================ APPLICANT DETAIL END ================

// 	// //================ PROMOTOR START ======================
// 	// BioS := []BiodataGen{}

// 	// for _, val := range data.CrDealCustomerRoleList {
// 	// 	if val.DealCustomerType == "C" {
// 	// 		continue
// 	// 	}
// 	// 	Bio := BiodataGen{}
// 	// 	Bio.Name = val.CustomerDtl.CustomerName
// 	// 	Bio.FatherName = val.CustomerDtl.FatherHusbandName
// 	// 	Bio.Gender = val.CustomerDtl.Gender
// 	// 	Bio.DateOfBirth = DetectDataType(val.CustomerDtl.CustomerDob, "yyyy-MM-dd")
// 	// 	Bio.MaritalStatus = val.CustomerDtl.MaritalStatus
// 	// 	// Bio.AnniversaryDate = DetectDataType(val.GetString("date_of_incorporation"), "yyyy-MM-dd")
// 	// 	Bio.Education = val.CustomerDtl.EduDetail
// 	// 	Bio.PAN = val.CustomerDtl.CustmerPan
// 	// 	Bio.Address = val.CustomerDtl.CustomerAddresses.AddressLine1
// 	// 	Bio.City = val.CustomerDtl.CustomerAddresses.AddressLine2 + " " + val.CustomerDtl.CustomerAddresses.AddressLine3
// 	// 	// Bio.State = DetectDataType(val.GetString("state"), "yyyy-MM-dd")
// 	// 	Bio.Pincode = val.CustomerDtl.CustomerAddresses.Pincode
// 	// 	Bio.Phone = val.CustomerDtl.CustomerAddresses.PrimaryPhone
// 	// 	Bio.Mobile = val.CustomerDtl.CustomerAddresses.AlternatePhone
// 	// 	Bio.NoOfYears = DetectDataType(comp.CustomerDtl.CustomerAddresses.NoOfYears, "")
// 	// 	Bio.Email = comp.CustomerDtl.CustomerEmail
// 	// 	BioS = append(BioS, Bio)
// 	// }
// 	// current.DetailOfPromoters.Biodata = BioS
// 	// //================ PROMOTOR END ================

// 	// }

// 	if !IsConfirmed {
// 		conn, err := GetConnection()
// 		defer conn.Close()
// 		if err != nil {
// 			fmt.Println(err.Error())
// 			return IsNew, IsConfirmed, err
// 		}

// 		qinsert := conn.NewQuery().
// 			From("CustomerProfile").
// 			SetConfig("multiexec", true).
// 			Save()

// 		csc := map[string]interface{}{"data": &current}
// 		err = qinsert.Exec(csc)
// 		if err != nil {
// 			fmt.Print(err.Error())
// 			return IsNew, IsConfirmed, err
// 		}
// 	}

// 	customerDtl := tk.M(comp.Get("customerDtl").(map[string]interface{}))

// 	err = SaveMaster(cid, dealno, customerDtl.GetString("customerName"))

// 	return IsNew, IsConfirmed, err
// }

func BuildAccountDetail(body tk.M, crList []tk.M, cid string, dealno string) (*AccountDetail, error) {
	current := AccountDetail{}

	stat := current.Status

	comp := FindCompany(crList, body.GetString("dealCustomerId"))
	Ld := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

	valid := comp.GetString("dealCustomerId")
	existdeal := CheckArray(body.Get("existingDealDetails"))

	if stat != 0 {
		return nil, ErrorStatusNotZero
	}

	if len(valid) == 0 {
		return nil, ErrorDealCustomerIdEmpty
	}

	dtl := tk.M(comp.Get("customerDtl").(map[string]interface{}))

	current.Id = cid + "|" + dealno
	current.CustomerId = cid
	current.DealNo = dealno
	current.AccountSetupDetails.DealNo = dealno

	current.AccountSetupDetails.LoginDate = DetectDataType(body.GetString("dealInitiationDate"), "yyyy-MM-dd").(time.Time)
	current.AccountSetupDetails.RmName = body.GetString("dealRmDesc")
	current.AccountSetupDetails.LeadDistributor = ToWordCase(body.GetString("dealSourceName"))
	current.AccountSetupDetails.CreditAnalyst = body.GetString("makerIdDesc")
	current.AccountSetupDetails.Product = ToWordCase(Ld.GetString("dealProductDesc"))
	current.AccountSetupDetails.Scheme = ToWordCase(Ld.GetString("dealSchemeDesc"))
	current.BorrowerDetails.BorrowerConstitution = dtl.GetString("customerConstitutionDesc")

	current.LoanDetails.ProposedLoanAmount = Ld.GetFloat64("dealAssetCost")
	current.LoanDetails.RequestedLimitAmount = Ld.GetFloat64("dealLoanAmount") / 100000
	current.LoanDetails.LimitTenor = Ld.GetFloat64("dealTenure")
	current.LoanDetails.ProposedRateInterest = Ld.GetFloat64("dealFinalRate")

	current.LoanDetails.IfExistingCustomer = false
	if strings.ToLower(body.GetString("dealExistingCustomerDesc")) == "yes" {
		current.LoanDetails.IfExistingCustomer = true
	}

	sanctionedLimit := 0.0
	currentmax := 0.0
	for _, val := range existdeal {
		id := val.GetFloat64("dealId")
		if id > currentmax {
			currentmax = id
			sanctionedLimit = val.GetFloat64("sanctionedLimit")
			tk.Println(val.GetFloat64("sanctionedLimit"))
		}
	}
	current.LoanDetails.IfYesEistingLimitAmount = sanctionedLimit
	current.LoanDetails.ExistingRoi = body.GetFloat64("existingROI")
	current.LoanDetails.ExistingPf = body.GetFloat64("existingPf")
	current.LoanDetails.FirstAgreementDate = DetectDataType(body.GetString("firstAgreementDate"), "yyyy-MM-dd").(time.Time)
	current.LoanDetails.RecenetAgreementDate = DetectDataType(body.GetString("recentAgreementDate"), "yyyy-MM-dd").(time.Time)
	current.LoanDetails.VintageWithX10 = body.GetFloat64("vinatgeInMonths")

	return &current, nil
}

// func GenerateAccountDetail(body tk.M, crList []tk.M, cid string, dealno string) (bool, bool, error) {
// 	cd, err := CheckOnAD(cid, dealno)
// 	if err != nil {
// 		fmt.Println(err.Error())
// 		return false, false, err
// 	}

// 	IsNew := true
// 	IsConfirmed := false

// 	current := AccountDetail{}

// 	if len(cd) > 0 {
// 		IsNew = false
// 		current = cd[0]
// 	}
// 	stat := current.Status

// 	comp := FindCompany(crList, body.GetString("dealCustomerId"))
// 	Ld := tk.M(body.Get("dealLoanDetails").(map[string]interface{}))

// 	valid := comp.GetString("dealCustomerId")
// 	existdeal := CheckArray(body.Get("existingDealDetails"))

// 	if stat == 0 && valid != "" {
// 		dtl := tk.M(comp.Get("customerDtl").(map[string]interface{}))

// 		current.Id = cid + "|" + dealno
// 		current.CustomerId = cid
// 		current.DealNo = dealno
// 		current.AccountSetupDetails.DealNo = dealno

// 		current.AccountSetupDetails.LoginDate = DetectDataType(body.GetString("dealInitiationDate"), "yyyy-MM-dd").(time.Time)
// 		current.AccountSetupDetails.RmName = body.GetString("dealRmDesc")
// 		current.AccountSetupDetails.LeadDistributor = ToWordCase(body.GetString("dealSourceName"))
// 		current.AccountSetupDetails.CreditAnalyst = body.GetString("makerIdDesc")
// 		current.AccountSetupDetails.Product = ToWordCase(Ld.GetString("dealProductDesc"))
// 		current.AccountSetupDetails.Scheme = ToWordCase(Ld.GetString("dealSchemeDesc"))
// 		current.BorrowerDetails.BorrowerConstitution = dtl.GetString("customerConstitutionDesc")

// 		current.LoanDetails.ProposedLoanAmount = Ld.GetFloat64("dealAssetCost")
// 		current.LoanDetails.RequestedLimitAmount = Ld.GetFloat64("dealLoanAmount") / 100000
// 		current.LoanDetails.LimitTenor = Ld.GetFloat64("dealTenure")
// 		current.LoanDetails.ProposedRateInterest = Ld.GetFloat64("dealFinalRate")

// 		exists := false

// 		if strings.ToLower(body.GetString("dealExistingCustomerDesc")) == "yes" {
// 			exists = true
// 		}

// 		current.LoanDetails.IfExistingCustomer = exists

// 		sanctionedLimit := 0.0
// 		currentmax := 0.0

// 		for _, val := range existdeal {
// 			id := val.GetFloat64("dealId")
// 			if id > currentmax {
// 				currentmax = id
// 				sanctionedLimit = val.GetFloat64("sanctionedLimit")
// 				tk.Println(val.GetFloat64("sanctionedLimit"))
// 			}
// 		}
// 		current.LoanDetails.IfYesEistingLimitAmount = sanctionedLimit
// 		current.LoanDetails.ExistingRoi = body.GetFloat64("existingROI")
// 		current.LoanDetails.ExistingPf = body.GetFloat64("existingPf")
// 		current.LoanDetails.FirstAgreementDate = DetectDataType(body.GetString("firstAgreementDate"), "yyyy-MM-dd").(time.Time)
// 		current.LoanDetails.RecenetAgreementDate = DetectDataType(body.GetString("recentAgreementDate"), "yyyy-MM-dd").(time.Time)
// 		current.LoanDetails.VintageWithX10 = body.GetFloat64("vinatgeInMonths")

// 	} else {
// 		IsConfirmed = true
// 	}

// 	if !IsConfirmed {
// 		conn, err := GetConnection()
// 		defer conn.Close()
// 		if err != nil {
// 			fmt.Println(err.Error())
// 			return IsNew, IsConfirmed, err
// 		}

// 		qinsert := conn.NewQuery().
// 			From("AccountDetails").
// 			SetConfig("multiexec", true).
// 			Save()

// 		csc := map[string]interface{}{"data": &current}
// 		err = qinsert.Exec(csc)
// 		if err != nil {
// 			fmt.Print(err.Error())
// 			return IsNew, IsConfirmed, err
// 		}
// 	}

// 	return IsNew, IsConfirmed, nil
// }

func FindCompany(datas []tk.M, custid string) tk.M {
	for _, val := range datas {
		if val.GetString("dealCustomerId") == custid {
			return val
		}
	}
	return tk.M{}
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
		// SendMail(LogData.GetString("error"), LogData.GetString("_id"))
	}

	return nil
}

// func CheckOnCP(custid string, dealno string) ([]CustomerProfiles, error) {
// 	cn, err := GetConnection()
// 	results := []CustomerProfiles{}

// 	defer cn.Close()
// 	csr, e := cn.NewQuery().
// 		Where(dbox.And(dbox.Eq("_id", custid+"|"+dealno))).
// 		From("CustomerProfile").
// 		Cursor(nil)

// 	if e != nil {
// 		return results, e
// 	} else if csr == nil {
// 		return results, nil
// 	}

// 	defer csr.Close()

// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return results, err
// 	}

// 	return results, nil
// }

// func CheckOnAD(custid string, dealno string) ([]AccountDetail, error) {
// 	cn, err := GetConnection()
// 	results := []AccountDetail{}

// 	defer cn.Close()
// 	csr, e := cn.NewQuery().
// 		Where(dbox.And(dbox.Eq("_id", custid+"|"+dealno))).
// 		From("AccountDetails").
// 		Cursor(nil)

// 	if e != nil {
// 		return results, e
// 	} else if csr == nil {
// 		return results, nil
// 	}

// 	defer csr.Close()

// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return results, err
// 	}

// 	return results, nil
// }

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

// func SendMail(em string, logID string) {
// 	conf := gomail.NewDialer("smtp.office365.com", 587, "admin.support@eaciit.com", "B920Support")
// 	s, err := conf.Dial()
// 	if err != nil {
// 		panic(err)
// 	}
// 	mailsubj := tk.Sprintf("%v", "[noreply] CAT XML Error Reminder")
// 	mailmsg := tk.Sprintf("%v", "XML receiver has some error.</br>Error Message : "+em+".</br> Log ID : "+logID)
// 	m := gomail.NewMessage()

// 	m.SetHeader("From", "admin.support@eaciit.com")
// 	m.SetHeader("To", "yanda.widagdo@eaciit.com")
// 	m.SetHeader("Subject", mailsubj)
// 	m.SetBody("text/html", mailmsg)

// 	if err := gomail.Send(s, m); err != nil {
// 		fmt.Println(err.Error(), "-----------ERROR")
// 	} else {
// 		fmt.Println("Successfully Send Mails")
// 	}
// 	m.Reset()
// }

// func SaveMaster(cid string, dealno string, cname string) error {
// 	//========== Master Customer ======================
// 	cn, err := GetConnection()
// 	if err != nil {
// 		return err
// 	}

// 	results := []tk.M{}

// 	defer cn.Close()
// 	csr, e := cn.NewQuery().
// 		Where(dbox.And(dbox.Eq("customer_id", cast.ToInt(cid, cast.RoundingUp)), dbox.Eq("deal_no", dealno))).
// 		From("MasterCustomer").
// 		Cursor(nil)

// 	if e != nil {
// 		return e
// 	}

// 	defer csr.Close()

// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return err
// 	}

// 	obj := tk.M{}

// 	if len(results) > 0 {
// 		obj = results[0]
// 		obj.Set("customer_name", cname)
// 	} else {
// 		obj.Set("customer_id", cast.ToInt(cid, cast.RoundingUp))
// 		obj.Set("customer_name", cname)
// 		obj.Set("deal_no", dealno)
// 	}

// 	qinsert := cn.NewQuery().
// 		From("MasterCustomer").
// 		SetConfig("multiexec", true).
// 		Save()

// 	csc := map[string]interface{}{"data": obj}
// 	err = qinsert.Exec(csc)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// 	//========== Master Customer END======================
// }

func CheckArray(dt interface{}) []tk.M {
	if fmt.Sprintf("%v", reflect.TypeOf(dt)) == "[]interface {}" {
		arr := dt.([]interface{})
		arrf := []tk.M{}
		for _, vf := range arr {
			arrf = append(arrf, tk.M(vf.(map[string]interface{})))
		}
		return arrf
	}

	if dt != nil {
		return []tk.M{tk.M(dt.(map[string]interface{}))}
	}

	return []tk.M{}
}

func BuildInternalRTR(body tk.M, cid string, dealno string) (tk.M, error) {
	exs := CheckArray(body.Get("existingDealDetails"))

	arr := []tk.M{}
	arrb := []tk.M{}
	fin := tk.M{}
	for _, val := range exs {
		ar := tk.M{}
		arb := tk.M{}
		ar.Set("NoActiveLoan", val.GetFloat64("NoOfActiveLoans"))
		ar.Set("AmountOutstandingAccured", val.GetFloat64("AmountOutstandingAccrued"))
		ar.Set("AmountOutstandingDelinquent", val.GetFloat64("AmountOutstandingDelinquent"))
		ar.Set("TotalAmount", val.GetFloat64("AmountOutstandingAccrued")+val.GetFloat64("AmountOutstandingDelinquent"))
		ar.Set("NPRDelays", val.GetFloat64("NoOfPrincipalRepaymentDelays"))
		ar.Set("NPREarlyClosures", val.GetFloat64("NoOfPrincipalRepaymentEarlyClosures"))
		ar.Set("NoOfPaymentDueDate", val.GetFloat64("NoOfPaymentOnDueDate"))
		ar.Set("MaxDPDDays", val.GetFloat64("MaxDPDInClosedLoanInDays"))
		ar.Set("MaxDPDDAmount", val.GetFloat64("NoOfActiveLoans"))
		ar.Set("AVGDPDDays", CheckNan(val.GetFloat64("MaxDPDInClosedLoanInDays")/val.GetFloat64("NoOfActiveLoans")))
		ar.Set("Minimum", CheckNan(val.GetFloat64("Minimum")))
		ar.Set("Average", CheckNan(val.GetFloat64("Average")))
		ar.Set("Maximum", CheckNan(val.GetFloat64("Maximum")))

		arb.Set("DealNo", val.GetString("dealNo"))
		arb.Set("Product", ToWordCase(val.GetString("product")))
		arb.Set("Scheme", ToWordCase(val.GetString("scheme")))
		arb.Set("AgreementDate", val.GetString("agreementDate"))
		arb.Set("DealSanctionTillValidate", val.GetString("dealSanctionTillValidate"))
		arb.Set("TotalLoanAmount", CheckNan(val.GetFloat64("sanctionedLimit")))
		arb.Set("ProductId", val.GetString("productId"))
		arb.Set("SchemeId", val.GetString("schemeId"))

		arr = append(arr, ar)
		arrb = append(arrb, arb)
	}

	fin.Set("_id", cid+"|"+dealno)
	fin.Set("snapshot", arr)
	fin.Set("deallist", arrb)

	return fin, nil
}

// func GenerateInternalRTR(body tk.M, cid string, dealno string) error {
// 	exs := CheckArray(body.Get("existingDealDetails"))

// 	arr := []tk.M{}
// 	arrb := []tk.M{}
// 	fin := tk.M{}
// 	for _, val := range exs {
// 		ar := tk.M{}
// 		arb := tk.M{}
// 		ar.Set("NoActiveLoan", val.GetFloat64("NoOfActiveLoans"))
// 		ar.Set("AmountOutstandingAccured", val.GetFloat64("AmountOutstandingAccrued"))
// 		ar.Set("AmountOutstandingDelinquent", val.GetFloat64("AmountOutstandingDelinquent"))
// 		ar.Set("TotalAmount", val.GetFloat64("AmountOutstandingAccrued")+val.GetFloat64("AmountOutstandingDelinquent"))
// 		ar.Set("NPRDelays", val.GetFloat64("NoOfPrincipalRepaymentDelays"))
// 		ar.Set("NPREarlyClosures", val.GetFloat64("NoOfPrincipalRepaymentEarlyClosures"))
// 		ar.Set("NoOfPaymentDueDate", val.GetFloat64("NoOfPaymentOnDueDate"))
// 		ar.Set("MaxDPDDays", val.GetFloat64("MaxDPDInClosedLoanInDays"))
// 		ar.Set("MaxDPDDAmount", val.GetFloat64("NoOfActiveLoans"))
// 		ar.Set("AVGDPDDays", CheckNan(val.GetFloat64("MaxDPDInClosedLoanInDays")/val.GetFloat64("NoOfActiveLoans")))
// 		ar.Set("Minimum", CheckNan(val.GetFloat64("Minimum")))
// 		ar.Set("Average", CheckNan(val.GetFloat64("Average")))
// 		ar.Set("Maximum", CheckNan(val.GetFloat64("Maximum")))

// 		arb.Set("DealNo", val.GetString("dealNo"))
// 		arb.Set("Product", ToWordCase(val.GetString("product")))
// 		arb.Set("Scheme", ToWordCase(val.GetString("scheme")))
// 		arb.Set("AgreementDate", val.GetString("agreementDate"))
// 		arb.Set("DealSanctionTillValidate", val.GetString("dealSanctionTillValidate"))
// 		arb.Set("TotalLoanAmount", CheckNan(val.GetFloat64("sanctionedLimit")))
// 		arb.Set("ProductId", val.GetString("productId"))
// 		arb.Set("SchemeId", val.GetString("schemeId"))

// 		arr = append(arr, ar)
// 		arrb = append(arrb, arb)
// 	}

// 	fin.Set("_id", cid+"|"+dealno)
// 	fin.Set("snapshot", arr)
// 	fin.Set("deallist", arrb)

// 	cn, err := GetConnection()
// 	if err != nil {
// 		return err
// 	}

// 	defer cn.Close()

// 	qinsert := cn.NewQuery().
// 		From("InternalRTR").
// 		SetConfig("multiexec", true).
// 		Save()

// 	csc := map[string]interface{}{"data": fin}
// 	err = qinsert.Exec(csc)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

func CleaningXMLText(xml string) string {
	xml = strings.Replace(xml, "&", "&amp;", -1)
	xml = strings.Replace(xml, "\"", "&quot;", -1)
	xml = strings.Replace(xml, "'", "&apos;", -1)
	return xml
}

func FindSamePromotor(listprom []BiodataGen, prom tk.M) (BiodataGen, []BiodataGen) {

	for idx, val := range listprom {
		name := prom.GetString("stakeholderName")
		dob := DetectDataType(prom.GetString("stakeholderDob"), "yyyy-MM-dd")
		pan := prom.GetString("stakeholderPan")

		if val.Name == name && val.DateOfBirth == dob && pan == val.PAN {
			listprom = append(listprom[:idx], listprom[idx+1:]...)
			return val, listprom
		}
	}

	return BiodataGen{}, listprom
}

func ToWordCase(word string) string {
	replace := func(wordx string) string {
		return strings.Title(wordx)
	}
	reg := regexp.MustCompile(`\w+`)
	return reg.ReplaceAllStringFunc(strings.ToLower(word), replace)
}
