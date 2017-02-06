package models

import (
	"github.com/eaciit/orm"
	// "gopkg.in/mgo.v2/bson"
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/cast"
	// tk "github.com/eaciit/toolkit"
	"time"
)

type ApplicantDetail struct {
	DealID                     string    `bson:"DealID"`
	CustomerId                 int       `bson:"CustomerId"`
	DealNo                     string    `bson:"DealNo"`
	CustomerName               string    `bson:"CustomerName"`
	CustomerConstitution       string    `bson:"CustomerConstitution"`
	DateOfIncorporation        time.Time `bson:"DateOfIncorporation"`
	AnyOther                   string    `bson:"AnyOther"`
	TIN                        string    `bson:"TIN"`
	TAN                        string    `bson:"TAN"`
	CustomerRegistrationNumber string    `bson:"CustomerRegistrationNumber"`
	CustomerPan                string    `bson:"CustomerPan"`
	CIN                        string    `bson:"CIN"`
	NatureOfBussiness          string    `bson:"NatureOfBussiness"`
	YearsInBusiness            int       `bson:"YearsInBusiness"`
	NoOfEmployees              int       `bson:"NoOfEmployees"`
	AnnualTurnOver             float64   `bson:"AnnualTurnOver"`
	UserGroupCompanies         string    `bson:"UserGroupCompanies"`
	CapitalExpansionPlans      int       `bson:"CapitalExpansionPlans"`
	GroupTurnOver              string    `bson:"GroupTurnOver"`
	AmountLoan                 float64   `bson:"AmountLoan"`
	RegisteredAddress          RegisteredAddress
	AddressCorrespondence      AddressCorrespondence
	SiteWorkAddress            SiteWorkAddress
}

type FinancialReport struct {
	PreviousLoansDetail     []PreviousLoansDetail
	DetailsPertainingBanker []DetailsPertainingBanker
	ExistingRelationship    []ExistingRelationship
}

type FinancialReportGen struct {
	PreviousLoansDetail     []PreviousLoansDetail
	DetailsPertainingBanker []DetailsPertainingBankerGen
	ExistingRelationship    []ExistingRelationshipGen
}

type NonRefundableProcessingFeesDetails struct {
	InstrumentType string    `bson:"InstrumentType"`
	InstrumentNo   string    `bson:"InstrumentNo"`
	InstrumentDate time.Time `bson:"InstrumentDate"`
	BankName       string    `bson:"BankName"`
	Amount         float64   `bson:"Amount"`
}

type NonRefundableProcessingFeesDetailsGen struct {
	InstrumentType interface{} `bson:"InstrumentType"`
	InstrumentNo   interface{} `bson:"InstrumentNo"`
	InstrumentDate interface{} `bson:"InstrumentDate"`
	BankName       interface{} `bson:"BankName"`
	Amount         interface{} `bson:"Amount"`
}

type DetailOfPromoters struct {
	Biodata           []Biodata
	DetailOfReference []DetailOfReference
}

type DetailOfPromotersGen struct {
	Biodata           []BiodataGen
	DetailOfReference []DetailOfReference
}

type CustomerProfilesGen struct {
	orm.ModelBase                      `bson:"-",json:"-"`
	Id                                 string `bson:"_id" , json:"_id" `
	ApplicantDetail                    ApplicantDetail
	FinancialReport                    FinancialReport
	NonRefundableProcessingFeesDetails NonRefundableProcessingFeesDetails
	DetailOfPromoters                  DetailOfPromoters
	LastUpdate                         time.Time `bson:"LastUpdate,omitempty"`
	UpdatedBy                          string    `bson:"UpdatedBy,omitempty"`
	VerifiedBy                         string    `bson:"VerifiedBy,omitempty"`
	VerifiedDate                       time.Time `bson:"VerifiedDate,omitempty"`
	ConfirmedBy                        string    `bson:"ConfirmedBy,omitempty"`
	ConfirmedDate                      time.Time `bson:"ConfirmedDate,omitempty"`
	Status                             int       `bson:"Status,omitempty"`
	StatusCibil                        int       `bson:"StatusCibil,omitempty"`
}

type CustomerProfilesGenNew struct {
	orm.ModelBase                      `bson:"-",json:"-"`
	Id                                 string `bson:"_id" , json:"_id" `
	ApplicantDetail                    ApplicantDetailGenNew
	FinancialReport                    FinancialReportGen
	NonRefundableProcessingFeesDetails NonRefundableProcessingFeesDetailsGen
	DetailOfPromoters                  DetailOfPromotersGen
	LastUpdate                         time.Time `bson:"LastUpdate,omitempty"`
	UpdatedBy                          string    `bson:"UpdatedBy,omitempty"`
	VerifiedBy                         string    `bson:"VerifiedBy,omitempty"`
	VerifiedDate                       time.Time `bson:"VerifiedDate,omitempty"`
	ConfirmedBy                        string    `bson:"ConfirmedBy,omitempty"`
	ConfirmedDate                      time.Time `bson:"ConfirmedDate,omitempty"`
	Status                             int       `bson:"Status,omitempty"`
	StatusCibil                        int       `bson:"StatusCibil,omitempty"`
}

type CustomerProfiles struct {
	orm.ModelBase                      `bson:"-",json:"-"`
	Id                                 string `bson:"_id" , json:"_id" `
	ApplicantDetail                    ApplicantDetailGen
	FinancialReport                    FinancialReportGen
	NonRefundableProcessingFeesDetails NonRefundableProcessingFeesDetailsGen
	DetailOfPromoters                  DetailOfPromotersGen
	LastUpdate                         time.Time `bson:"LastUpdate"`
	UpdatedBy                          string    `bson:"UpdatedBy"`
	VerifiedBy                         string    `bson:"VerifiedBy"`
	VerifiedDate                       time.Time `bson:"VerifiedDate"`
	ConfirmedBy                        string    `bson:"ConfirmedBy"`
	ConfirmedDate                      time.Time `bson:"ConfirmedDate"`
	Status                             int       `bson:"Status"`
	StatusCibil                        int       `bson:"StatusCibil"`
	DateSave                           string    `bson: "DateSave,omitempty"`
	DateFreeze                         string    `bson: "DateFreeze,omitempty"`
}

type RegisteredAddress struct {
	AddressRegistered                 string `bson:"AddressRegistered"`
	CityRegistered                    string `bson:"CityRegistered"`
	StateRegistered                   string `bson:"StateRegistered"`
	PhoneRegistered                   string `bson:"PhoneRegistered"`
	MobileRegistered                  string `bson:"MobileRegistered"`
	ContactPersonRegistered           string `bson:"ContactPersonRegistered"`
	EmailRegistered                   string `bson:"EmailRegistered"`
	OfficeRegistered                  string `bson:"OfficeRegistered"`
	Ownership                         string `bson:"Ownership"`
	NoOfYearsAtAboveAddressRegistered int    `bson:"NoOfYearsAtAboveAddressRegistered"`
	AreaOfPlotRegistered              string `bson:"AreaOfPlotRegistered"`
	BuiltUpAreaRegistered             string `bson:"BuiltUpAreaRegistered"`
	AddressType                       string `bson:"AddressType,omitempty"`
	CorrespondeceAddress              string `bson:"CorrespondeceAddress"`
}

type AddressCorrespondence struct {
	AddressRegistered                 string `bson:"AddressRegistered"`
	CityRegistered                    string `bson:"CityRegistered"`
	StateRegistered                   string `bson:"StateRegistered"`
	PhoneRegistered                   string `bson:"PhoneRegistered"`
	MobileRegistered                  string `bson:"MobileRegistered"`
	ContactPersonRegistered           string `bson:"ContactPersonRegistered"`
	EmailRegistered                   string `bson:"EmailRegistered"`
	OfficeRegistered                  string `bson:"OfficeRegistered"`
	Ownership                         string `bson:"Ownership"`
	NoOfYearsAtAboveAddressRegistered int    `bson:"NoOfYearsAtAboveAddressRegistered"`
	AreaOfPlotRegistered              string `bson:"AreaOfPlotRegistered"`
	BuiltUpAreaRegistered             string `bson:"BuiltUpAreaRegistered"`
	ValueRegistered                   string `bson:"ValueRegistered,omitempty"`
	LandmarkRegistered                string `bson:"LandmarkRegistered,omitempty"`
	PincodeRegistered                 string `bson:"PincodeRegistered,omitempty"`
	AddressType                       string `bson:"AddressType,omitempty"`
	CorrespondeceAddress              string `bson:"CorrespondeceAddress"`
}

type SiteWorkAddress struct {
	AddressRegistered                 string `bson:"AddressRegistered"`
	CityRegistered                    string `bson:"CityRegistered"`
	StateRegistered                   string `bson:"StateRegistered"`
	PhoneRegistered                   string `bson:"PhoneRegistered"`
	MobileRegistered                  string `bson:"MobileRegistered"`
	ContactPersonRegistered           string `bson:"ContactPersonRegistered"`
	EmailRegistered                   string `bson:"EmailRegistered"`
	OfficeRegistered                  string `bson:"OfficeRegistered"`
	Ownership                         string `bson:"Ownership"`
	NoOfYearsAtAboveAddressRegistered int    `bson:"NoOfYearsAtAboveAddressRegistered"`
	AreaOfPlotRegistered              string `bson:"AreaOfPlotRegistered"`
	BuiltUpAreaRegistered             string `bson:"BuiltUpAreaRegistered"`
	ValueRegistered                   string `bson:"ValueRegistered,omitempty"`
	LandmarkRegistered                string `bson:"LandmarkRegistered,omitempty"`
	PincodeRegistered                 string `bson:"PincodeRegistered,omitempty"`
	AddressType                       string `bson:"AddressType,omitempty"`
	CorrespondeceAddress              string `bson:"CorrespondeceAddress"`
}

type PreviousLoansDetail struct {
	SrNo               string  `bson:"SrNo"`
	BanksFls           string  `bson:"BanksFls"`
	LoanAmount         float64 `bson:"LoanAmount"`
	Tenure             float64 `bson:"Tenure"`
	MonthlyInstallment float64 `bson:"MonthlyInstallment"`
	OutstandingAmount  float64 `bson:"OutstandingAmount"`
	SecuredUnsecured   string  `bson:"SecuredUnsecured"`
}

type DetailsPertainingBanker struct {
	SrNo             string `bson:"SrNo"`
	NameOfBanks      string `bson:"NameOfBanks"`
	AddressContactNo string `bson:"AddressContactNo"`
	AcNo             string `bson:"AcNo"`
	TypeOfAc         string `bson:"TypeOfAc"`
	YearOpening      int    `bson:"YearOpening"`
}

type ExistingRelationship struct {
	LoanNo     string `bson:"LoanNo"`
	TypeOfLoan string `bson:"TypeOfLoan"`
	LoanAmount int    `bson:"LoanAmount"`
	Payment    string `bson:"Payment"`
}

type Biodata struct {
	Name                   string          `bson:"Name"`
	FatherName             string          `bson:"FatherName"`
	Gender                 string          `bson:"Gender"`
	DateOfBirth            time.Time       `bson:"DateOfBirth"`
	MaritalStatus          string          `bson:"MaritalStatus"`
	AnniversaryDate        time.Time       `bson:"AnniversaryDate"`
	ShareHoldingPercentage float64         `bson:"ShareHoldingPercentage"`
	Guarantor              interface{}     `bson:"Guarantor"`
	Promotor               interface{}     `bson:"Promotor"`
	Director               interface{}     `bson:"Director"`
	Education              string          `bson:"Education"`
	Designation            []string        `bson:"Designation"`
	PAN                    string          `bson:"PAN"`
	Position               []string        `bson:"Position,omitempty"`
	Address                string          `bson:"Address"`
	Landmark               string          `bson:"Landmark"`
	City                   string          `bson:"City"`
	State                  string          `bson:"State"`
	Pincode                string          `bson:"Pincode"`
	Phone                  string          `bson:"Phone"`
	Mobile                 string          `bson:"Mobile"`
	Ownership              string          `bson:"Ownership"`
	NoOfYears              int             `bson:"NoOfYears"`
	ValueOfPot             int             `bson:"ValueOfPot"`
	VehiclesOwned          int             `bson:"VehiclesOwned"`
	NetWorth               int             `bson:"NetWorth"`
	Email                  string          `bson:"Email"`
	CIBILScore             float64         `bson:"CIBILScore"`
	PropertyOwned          []PropertyOwned `bson:"PropertyOwned,omitempty"`
	FilePhoto              string          `bson:"FilePhoto,omitempty"`
}

type PropertyOwned struct {
	PropertyType string  `bson:"PropertyType"`
	Address      string  `bson:"Address"`
	MarketValue  float64 `bson:"MarketValue"`
}

type DetailOfReference struct {
	Name             string `bson:"Name"`
	Address          string `bson:"Address"`
	ContactNo        string `bson:"ContactNo"`
	RelationAplicant string `bson:"RelationAplicant"`
}

type ApplicantDetailGen struct {
	CustomerID                 interface{} `bson:"CustomerID"`
	DealID                     interface{} `bson:"DealID"`
	DealNo                     interface{} `bson:"DealNo"`
	CustomerName               interface{} `bson:"CustomerName"`
	CustomerConstitution       interface{} `bson:"CustomerConstitution"`
	DateOfIncorporation        time.Time   `bson:"DateOfIncorporation"`
	AnyOther                   interface{} `bson:"AnyOther"`
	TIN                        interface{} `bson:"TIN"`
	TAN                        interface{} `bson:"TAN"`
	CustomerRegistrationNumber interface{} `bson:"CustomerRegistrationNumber"`
	CustomerPan                interface{} `bson:"CustomerPan"`
	CIN                        interface{} `bson:"CIN"`
	NatureOfBussiness          interface{} `bson:"NatureOfBussiness"`
	YearsInBusiness            interface{} `bson:"YearsInBusiness"`
	NoOfEmployees              interface{} `bson:"NoOfEmployees"`
	AnnualTurnOver             interface{} `bson:"AnnualTurnOver"`
	UserGroupCompanies         interface{} `bson:"UserGroupCompanies"`
	CapitalExpansionPlans      interface{} `bson:"CapitalExpansionPlans"`
	CapitalExpansionPlansBool  bool        `bson:"CapitalExpansionPlansBool,omitempty"`
	GroupTurnOver              interface{} `bson:"GroupTurnOver"`
	AmountLoan                 interface{} `bson:"AmountLoan"`
	RegisteredAddress          RegisteredAddressGen
	AddressCorrespondence      AddressCorrespondence
	SiteWorkAddress            SiteWorkAddress
}

type ApplicantDetailGenNew struct {
	CustomerID                 interface{} `bson:"CustomerID"`
	DealID                     interface{} `bson:"DealID"`
	DealNo                     interface{} `bson:"DealNo"`
	CustomerName               interface{} `bson:"CustomerName"`
	CustomerConstitution       interface{} `bson:"CustomerConstitution"`
	DateOfIncorporation        interface{} `bson:"DateOfIncorporation"`
	AnyOther                   interface{} `bson:"AnyOther"`
	TIN                        interface{} `bson:"TIN"`
	TAN                        interface{} `bson:"TAN"`
	CustomerRegistrationNumber interface{} `bson:"CustomerRegistrationNumber"`
	CustomerPan                interface{} `bson:"CustomerPan"`
	CIN                        interface{} `bson:"CIN"`
	NatureOfBussiness          interface{} `bson:"NatureOfBussiness"`
	YearsInBusiness            interface{} `bson:"YearsInBusiness"`
	NoOfEmployees              interface{} `bson:"NoOfEmployees"`
	AnnualTurnOver             interface{} `bson:"AnnualTurnOver"`
	UserGroupCompanies         interface{} `bson:"UserGroupCompanies"`
	CapitalExpansionPlans      interface{} `bson:"CapitalExpansionPlans"`
	CapitalExpansionPlansBool  bool        `bson:"CapitalExpansionPlansBool,omitempty"`
	GroupTurnOver              interface{} `bson:"GroupTurnOver"`
	AmountLoan                 interface{} `bson:"AmountLoan"`
	RegisteredAddress          RegisteredAddressGen
	AddressCorrespondence      AddressCorrespondence
	SiteWorkAddress            SiteWorkAddress
}

type BiodataGen struct {
	Name                   interface{}     `bson:"Name"`
	FatherName             interface{}     `bson:"FatherName"`
	Gender                 interface{}     `bson:"Gender"`
	DateOfBirth            interface{}     `bson:"DateOfBirth"`
	MaritalStatus          interface{}     `bson:"MaritalStatus"`
	AnniversaryDate        interface{}     `bson:"AnniversaryDate"`
	ShareHoldingPercentage interface{}     `bson:"ShareHoldingPercentage"`
	Guarantor              interface{}     `bson:"Guarantor"`
	Promotor               interface{}     `bson:"Promotor"`
	Director               interface{}     `bson:"Director"`
	Education              interface{}     `bson:"Education"`
	Designation            []string        `bson:"Designation"`
	PAN                    interface{}     `bson:"PAN"`
	Position               []string        `bson:"Position,omitempty"`
	Address                interface{}     `bson:"Address"`
	Landmark               interface{}     `bson:"Landmark"`
	City                   interface{}     `bson:"City"`
	State                  interface{}     `bson:"State"`
	Pincode                interface{}     `bson:"Pincode"`
	Phone                  interface{}     `bson:"Phone"`
	Mobile                 interface{}     `bson:"Mobile"`
	Ownership              interface{}     `bson:"Ownership"`
	NoOfYears              interface{}     `bson:"NoOfYears"`
	ValueOfPot             interface{}     `bson:"ValueOfPot"`
	VehiclesOwned          interface{}     `bson:"VehiclesOwned"`
	NetWorth               interface{}     `bson:"NetWorth"`
	Email                  interface{}     `bson:"Email"`
	CIBILScore             interface{}     `bson:"CIBILScore"`
	PropertyOwned          []PropertyOwned `bson:"PropertyOwned,omitempty"`
	FilePhoto              string          `bson:"FilePhoto,omitempty"`
}

type RegisteredAddressGen struct {
	AddressRegistered                 interface{} `bson:"AddressRegistered"`
	CityRegistered                    interface{} `bson:"CityRegistered"`
	StateRegistered                   interface{} `bson:"StateRegistered"`
	PhoneRegistered                   interface{} `bson:"PhoneRegistered"`
	MobileRegistered                  interface{} `bson:"MobileRegistered"`
	ContactPersonRegistered           interface{} `bson:"ContactPersonRegistered"`
	EmailRegistered                   interface{} `bson:"EmailRegistered"`
	OfficeRegistered                  interface{} `bson:"OfficeRegistered"`
	Ownership                         interface{} `bson:"Ownership"`
	NoOfYearsAtAboveAddressRegistered interface{} `bson:"NoOfYearsAtAboveAddressRegistered"`
	AreaOfPlotRegistered              interface{} `bson:"AreaOfPlotRegistered"`
	BuiltUpAreaRegistered             interface{} `bson:"BuiltUpAreaRegistered"`
	ValueRegistered                   interface{} `bson:"ValueRegistered,omitempty"`
	LandmarkRegistered                interface{} `bson:"LandmarkRegistered,omitempty"`
	PincodeRegistered                 interface{} `bson:"PincodeRegistered,omitempty"`
	CorrespondeceAddress              string      `bson:"CorrespondeceAddress"`
}

type DetailsPertainingBankerGen struct {
	SrNo             interface{} `bson:"SrNo"`
	NameOfBanks      interface{} `bson:"NameOfBanks"`
	AddressContactNo interface{} `bson:"AddressContactNo"`
	AcNo             interface{} `bson:"AcNo"`
	TypeOfAc         interface{} `bson:"TypeOfAc"`
	YearOpening      interface{} `bson:"YearOpening"`
}

type ExistingRelationshipGen struct {
	LoanNo     interface{} `bson:"LoanNo"`
	TypeOfLoan interface{} `bson:"TypeOfLoan"`
	LoanAmount interface{} `bson:"LoanAmount"`
	Payment    interface{} `bson:"Payment"`
}

func NewCustomerProfiles() *CustomerProfiles {
	m := new(CustomerProfiles)
	return m
}
func (e *CustomerProfiles) RecordID() interface{} {
	return e.Id
}

func (m *CustomerProfiles) TableName() string {
	return "CustomerProfile"
}

func (m *CustomerProfiles) SyncCustomerData(cust, dealno string) error {

	unconfirmid := cust + "_" + dealno
	custint := cast.ToInt(cust, "RoundAuto")

	cn, err := GetConnection()
	defer cn.Close()
	if err != nil {
		return err
	}

	modelCibilIndividual := new(ReportData)
	modelCibilReport := new(CibilReportModel)

	dataCibilIndividual, err := modelCibilIndividual.GetPromotorFinalByUnconfirmID(unconfirmid)
	dataCibilReport, err := modelCibilReport.GetReportDataByUnconfirmID(unconfirmid)

	if len(dataCibilIndividual) > 0 {
		qinsert := cn.NewQuery().
			From(modelCibilIndividual.TableName()).
			SetConfig("multiexec", true).
			Save()
		defer qinsert.Close()

		for _, val := range dataCibilIndividual {
			val.ConsumersInfos.CustomerId = custint
			val.ConsumersInfos.DealNo = dealno
			val.IsMatch = true

			insdata := map[string]interface{}{"data": val}
			err := qinsert.Exec(insdata)

			if err != nil {
				return err
			}
		}
	}

	if len(dataCibilReport) > 0 {
		qinsert := cn.NewQuery().
			From(modelCibilReport.TableName()).
			SetConfig("multiexec", true).
			Save()
		defer qinsert.Close()

		for _, val := range dataCibilReport {
			val.Profile.CustomerId = custint
			val.Profile.DealNo = dealno
			val.IsMatch = true

			insdata := map[string]interface{}{"data": val}
			err := qinsert.Exec(insdata)

			err = qinsert.Exec(insdata)
			if err != nil {
				return err
			}
		}
	}

	return err
}
