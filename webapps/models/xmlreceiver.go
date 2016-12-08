package models

import (
	"encoding/xml"
	tk "github.com/eaciit/toolkit"
	// "github.com/eaciit/orm"
)

type ContentXML struct {
	Id                     string                   `bson:"_id",json:"_id"`
	LeadId                 string                   `xml:"leadId"`
	DealId                 string                   `xml:"dealId"`
	DealNo                 string                   `xml:"dealNo"`
	DealPm                 string                   `xml:"dealPm"`
	UserDetailsForPM       UserDetailForPM          `xml:"userDetailsForPM"`
	DealRm                 string                   `xml:"dealRm"`
	UserDetailsForRM       UserDetailForPM          `xml:"userDetailsForRM"`
	DealSourceName         string                   `xml:"dealSourceName"`
	DealSourceType         string                   `xml:"dealSourceType"`
	DealVendorCode         string                   `xml:"dealVendorCode"`
	FiDecision             string                   `xml:"fiDecision"`
	GcdCustomerId          string                   `xml:"gcdCustomerId"`
	GeneratedBy            string                   `xml:"generatedBy"`
	DealApplicationFormNo  string                   `xml:"dealApplicationFormNo"`
	DealApprovalDate       string                   `xml:"dealApprovalDate"`
	DealCategory           string                   `xml:"dealCategory"`
	DealCustomerId         string                   `xml:"dealCustomerId"`
	DealCustomerType       string                   `xml:"dealCustomerType"`
	DealDate               string                   `xml:"dealDate"`
	DealEncodedDate        string                   `xml:"dealEncodedDate"`
	DealExistingCustomer   string                   `xml:"dealExistingCustomer"`
	DealForwardedDate      string                   `xml:"dealForwardedDate"`
	DealInitiationDate     string                   `xml:"dealInitiationDate"`
	DealBranch             string                   `xml:"dealBranch"`
	BranchDetails          BranchDetails            `xml:"branchDetails"`
	CrDealCustomerRoleList []CrDealCustomerRoleList `xml:"crDealCustomerRoleList"`
	CrDealRepayschDtl      []CrDealRepayschDtl      `xml:"crDealRepayschDtl"`
	DealLoanDetails        DealLoanDetails          `xml:"dealLoanDetails"`
	MakerDate              string                   `xml:"makerDate"`
	MakerId                string                   `xml:"makerId"`
	PdStatus               string                   `xml:"pdStatus"`
	QualityCheckCmDate     string                   `xml:"qualityCheckCmDate"`
	QualityCheckCmFlag     string                   `xml:"qualityCheckCmFlag"`
	QualityCheckDcDate     string                   `xml:"qualityCheckDcDate"`
	QualityCheckDcFlag     string                   `xml:"qualityCheckDcFlag"`
	QualityCheckDcMakerId  string                   `xml:"qualityCheckDcMakerId"`
	RecStatus              string                   `xml:"recStatus"`
	RefreshFlag            string                   `xml:"refreshFlag"`
	UserDetailsForMAKER    UserDetailForPM          `xml:"userDetailsForMAKER"`
	LogInfos               tk.M
}

type DealLoanDetails struct {
	DealAdvanceInstl        string `xml:"dealAdvanceInstl"`
	DealAssetCost           string `xml:"dealAssetCost"`
	DealCreditPeriod        string `xml:"dealCreditPeriod"`
	DealDueDay              string `xml:"dealDueDay"`
	DealEffRate             string `xml:"dealEffRate"`
	DealFinalRate           string `xml:"dealFinalRate"`
	DealFlatRate            string `xml:"dealFlatRate"`
	DealFloatingFixedPeriod string `xml:"dealFloatingFixedPeriod"`
	DealId                  string `xml:"dealId"`
	DealInstallmentMode     string `xml:"dealInstallmentMode"`
	DealInstallmentType     string `xml:"dealInstallmentType"`
	DealIrr1                string `xml:"dealIrr1"`
	DealIrr2                string `xml:"dealIrr2"`
	DealLoanAmount          string `xml:"dealLoanAmount"`
	DealLoanId              string `xml:"dealLoanId"`
	DealLoanPurpose         string `xml:"dealLoanPurpose"`
	DealMarginAmount        string `xml:"dealMarginAmount"`
	DealMarginRate          string `xml:"dealMarginRate"`
	DealMarkup              string `xml:"dealMarkup"`
	DealNoOfInstallment     string `xml:"dealNoOfInstallment"`
	DealProduct             string `xml:"dealProduct"`
	DealProductCategory     string `xml:"dealProductCategory"`
	DealProductType         string `xml:"dealProductType"`
	DealRateMethod          string `xml:"dealRateMethod"`
	DealRateType            string `xml:"dealRateType"`
	DealRepaymentFreq       string `xml:"dealRepaymentFreq"`
	DealRepaymentMode       string `xml:"dealRepaymentMode"`
	DealRepaymentType       string `xml:"dealRepaymentType"`
	DealSanctionAmount      string `xml:"dealSanctionAmount"`
	DealSanctionDate        string `xml:"dealSanctionDate"`
	DealSanctionValidTill   string `xml:"dealSanctionValidTill"`
	DealScheme              string `xml:"dealScheme"`
	DealSectorType          string `xml:"dealSectorType"`
	DealTenure              string `xml:"dealTenure"`
	DealUtilizedAmount      string `xml:"dealUtilizedAmount"`
	LoanClassification      string `xml:"loanClassification"`
	LoanType                string `xml:"loanType"`
	MakerId                 string `xml:"makerId"`
	NetLtv                  string `xml:"netLtv"`
	NextDueDate             string `xml:"nextDueDate"`
	NoOfAsset               string `xml:"noOfAsset"`
	RecStatus               string `xml:"recStatus"`
	RedyToAuthor            string `xml:"redyToAuthor"`
	TenureInDay             string `xml:"tenureInDay"`
	UpfrontRoundingAmount   string `xml:"upfrontRoundingAmount"`
}

type CrDealCustomerRoleList struct {
	CustomerDtl          CustomerDtl `xml:"customerDtl"`
	DealCustomerId       string      `xml:"dealCustomerId"`
	DealCustomerRoleId   string      `xml:"dealCustomerRoleId"`
	DealCustomerRoleType string      `xml:"dealCustomerRoleType"`
	DealCustomerType     string      `xml:"dealCustomerType"`
	DealExistingCustomer string      `xml:"dealExistingCustomer"`
	DealId               string      `xml:"dealId"`
	GcdId                string      `xml:"gcdId"`
	GuaranteeAmount      string      `xml:"guaranteeAmount"`
	LeadId               string      `xml:"leadId"`
	MakerDate            string      `xml:"makerDate"`
	MakerId              string      `xml:"makerId"`
	Status               string      `xml:"status"`
}

type CrDealRepayschDtl struct {
	AdvFlag         string `xml:"advFlag"`
	BillFlag        string `xml:"billFlag"`
	DealId          string `xml:"dealId"`
	DealLoanId      string `xml:"dealLoanId"`
	ExcessInt       string `xml:"excessInt"`
	ExcessIntRecd   string `xml:"excessIntRecd"`
	InstlAmount     string `xml:"instlAmount"`
	InstlAmountRecd string `xml:"instlAmountRecd"`
	InstlDate       string `xml:"instlDate"`
	InstlNo         string `xml:"instlNo"`
	IntComp         string `xml:"intComp"`
	IntCompRecd     string `xml:"intCompRecd"`
	InterestRate    string `xml:"interestRate"`
	OtherCharges    string `xml:"otherCharges"`
	PrinComp        string `xml:"prinComp"`
	PrinCompRecd    string `xml:"prinCompRecd"`
	PrinOs          string `xml:"prinOs"`
	RecStatus       string `xml:"recStatus"`
	RepayschId      string `xml:"repayschId"`
	ServiceAmount   string `xml:"serviceAmount"`
	TotalOdAmount   string `xml:"totalOdAmount"`
	VatAmount       string `xml:"vatAmount"`
}

type CustomerDtl struct {
	CasteCategory           string            `xml:"casteCategory"`
	CustmerPan              string            `xml:"custmerPan"`
	CustomerAddresses       CustomerAddresses `xml:"customerAddresses"`
	CustomerBlackList       string            `xml:"customerBlackList"`
	CustomerBusinessSegment string            `xml:"customerBusinessSegment"`
	CustomerCategory        string            `xml:"customerCategory"`
	CustomerConstitution    string            `xml:"customerConstitution"`
	CustomerDob             string            `xml:"customerDob"`
	CustomerEmail           string            `xml:"customerEmail"`
	CustomerFname           string            `xml:"customerFname"`
	CustomerGroupDesc       string            `xml:"customerGroupDesc"`
	CustomerGroupId         string            `xml:"customerGroupId"`
	CustomerGroupType       string            `xml:"customerGroupType"`
	CustomerId              string            `xml:"customerId"`
	CustomerIndustory       string            `xml:"customerIndustory"`
	CustomerLname           string            `xml:"customerLname"`
	CustomerMname           string            `xml:"customerMname"`
	CustomerName            string            `xml:"customerName"`
	CustomerProfile         string            `xml:"customerProfile"`
	CustomerRegistrationNo  string            `xml:"customerRegistrationNo"`
	CustomerSubIndustory    string            `xml:"customerSubIndustory"`
	CustomerType            string            `xml:"customerType"`
	GcdCustomerId           string            `xml:"gcdCustomerId"`
	NoBvMonths              string            `xml:"noBvMonths"`
	NoBvYears               string            `xml:"noBvYears"`
	OtherRelationshipType   string            `xml:"otherRelationshipType"`
	YearOfEstblishment      string            `xml:"yearOfEstblishment"`
	FatherHusbandName       string            `xml:"fatherHusbandName"`
	EduDetail               string            `xml:"eduDetail"`
	Gender                  string            `xml:"gender"`
	MaritalStatus           string            `xml:"maritalStatus"`
}

type CustomerAddresses struct {
	AddressDetail        string `xml:"addressDetail"`
	AddressId            string `xml:"addressId"`
	AddressLine1         string `xml:"addressLine1"`
	AddressLine2         string `xml:"addressLine2"`
	AddressLine3         string `xml:"addressLine3"`
	AddressType          string `xml:"addressType"`
	AlternatePhone       string `xml:"alternatePhone"`
	Bpid                 string `xml:"bpid"`
	Bptype               string `xml:"bptype"`
	CommunicationAddress string `xml:"communicationAddress"`
	NoOfMonths           string `xml:"noOfMonths"`
	NoOfYears            string `xml:"noOfYears"`
	Pincode              string `xml:"pincode"`
	PrimaryPhone         string `xml:"primaryPhone"`
}

type UserDetailForPM struct {
	AccountStatus      string             `xml:"accountStatus"`
	DepartementDetails DepartementDetails `xml:"deparmentDetails"`
	RecStatus          string             `xml:"recStatus"`
	UserDepartment     string             `xml:"userDepartment"`
	UserId             string             `xml:"userId"`
	UserName           string             `xml:"userName"`
	UserPassword       string             `xml:"userPassword"`
}

type DepartementDetails struct {
	AuthorDate            string `xml:"authorDate"`
	AuthorId              string `xml:"authorId"`
	DepartmentDescription string `xml:"departmentDescription"`
	DepartmentId          string `xml:"departmentId"`
	MakerDate             string `xml:"makerDate"`
	MakerId               string `xml:"makerId"`
	RecStatus             string `xml:"recStatus"`
}

type BranchDetails struct {
	BranchId      string        `xml:"branchId"`
	BranchName    string        `xml:"branchName"`
	ComResonMData ComResonMData `xml:"comResonMData"`
	LastUpdate    string        `xml:"lastUpdate"`
	Status        string        `xml:"status"`
}

type ComResonMData struct {
	RecStatus       string `xml:"recStatus"`
	RegionDesc      string `xml:"regionDesc"`
	RegionDescLarge string `xml:"regionDescLarge"`
	RegionId        string `xml:"regionId"`
}

type MyRespEnvelope struct {
	XMLName xml.Name
	Body    Body
}

type Body struct {
	XMLName     xml.Name
	GetResponse ContentXML `xml:"crDealDtl"`
}

type completeResponse struct {
	XMLName xml.Name `xml:"activationPack_completeResponse"`
	Id      string   `xml:"Id,attr"`
	MyVar   string   `xml:"activationPack_completeResult"`
}
