package models

import (
	"time"

	// . "eaciit/x10/webapps/connection"
	"fmt"
	"github.com/eaciit/crowd"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"strconv"
)

func NewAccountDetail() *AccountDetail {
	m := new(AccountDetail)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *AccountDetail) RecordID() interface{} {
	return e.Id
}

func (m *AccountDetail) TableName() string {
	return "AccountDetails"
}

type AccountDetailSummary struct {
	ACSProduct   string
	ACSScheme    string
	ACSPDRemarks string

	BDCustomerSegmentClasification string
	BDDiversificationCustomers     float64
	BDDependenceOnSuppliers        float64
	BDBusinessVintage              float64
	BDOrdersinHand                 float64
	BDProjectsCompleted            float64
	BDBorrowerConstitution         string
	BDMarketReference              string
	BDExternalRating               string
	BDManagement                   string

	LDProposedLoanAmount   float64
	LDRequestedLimitAmount float64
	LDLimitTenor           float64
	LDProposedRateInterest float64
	LDProposedPFee         float64
	LDInterestOutgo        float64

	LDPOValueforBacktoBack float64
	LDExpectedPayment      float64

	LDIfYesEistingLimitAmount float64
	LDExistingRoi             float64
	LDExistingPf              float64
	LDVintageWithX10          float64

	LDTypeSecurity    string
	LDDetailsSecurity string

	LDIfBackedByPO       string
	LDIFExistingCustomer string

	CBMStockSellIn    float64
	CBMB2BGovtIn      float64
	CBMB2BCorporateIn float64

	DMIrisComputersLimitedIn float64
	DMSavexIn                float64
	DMRashiIn                float64
	DMSupertronIn            float64
	DMCompuageIn             float64
	DMAvnetIn                float64

	PDMinIndexEducationalQualificationOfMainPromoter string
	PDAvgExperienceInSameLineOfBusiness              float64
	PDMaxExperienceInSameLineOfBusiness              float64
	PDMinExperienceInSameLineOfBusiness              float64
	PDAvgCibilScore                                  float64
	PDMaxCibilScore                                  float64
	PDMinCibilScore                                  float64
	PDAvgRealEstatePosition                          float64
	PDMaxRealEstatePosition                          float64
	PDMinRealEstatePosition                          float64
	PDResiOwnershipStatus                            string
	PDOfficeOwnershipStatus                          string
	PDRealEstateSumValue                             float64

	VDMaxDelayDays                           float64
	VDMaxPaymentDays                         float64
	VDAverageDelayDays                       float64
	VDMaxOfAverageDelayDays                  float64
	VDAvgStandardDeviation                   float64
	VDAveragePaymentDays                     float64
	VDAvgTransactionWeightedPaymentDelayDays float64
	VDAvgDelayDaysStandardDeviation          float64
	VDAvgTransactionWeightedPaymentDays      float64
	VDAvgDaysStandardDeviation               float64
	VDAvgAmountOfBusinessDone                float64

	PDCustomerMargin float64
}

type AccountDetail struct {
	orm.ModelBase       `bson:"-",json:"-"`
	Id                  string `bson:"_id" , json:"_id"`
	CustomerId          string
	DealNo              string
	AccountSetupDetails AccountSetupDetails
	BorrowerDetails     BorrowerDetails
	PromotorDetails     []PromotorDetails
	VendorDetails       []VendorDetails
	LoanDetails         LoanDetails
	CustomerBussinesMix CustomerBussinesMix
	DistributorMix      DistributorMix
	Status              int
	Freeze              bool      `bson:"Freeze,omitempty"`
	DateConfirmed       time.Time `bson:"DateConfirmed,omitempty"`
	DateFreeze          time.Time `bson:"DateFreeze,omitempty"`
	DateSave            string    `bson:"DateSave,omitempty"`
}

type AccountSetupDetails struct {
	CityName        string
	LoginDate       time.Time
	DealNo          string
	RmName          string
	BrHead          string
	CreditAnalyst   string
	LeadDistributor string
	Product         string
	Scheme          string
	PdInfo          PdInfoDetails
	Status          int
}

type PdInfoDetails struct {
	PdDoneBy       string
	PdDate         time.Time
	PdPlace        string
	PersonMet      string
	CustomerMargin float64
	PdRemarks      string
	PdComments     string
}

type BorrowerDetails struct {
	CustomerSegmentClasification string
	DiversificationCustomers     float64
	DependenceOnSuppliers        float64
	BusinessVintage              float64
	ExternalRating               string
	Management                   string
	MarketReference              string
	BorrowerConstitution         string
	TopCustomerNames             []string `bson:"TopCustomerNames,omitempty"`
	ProductNameandDetails        []string `bson:"ProductNameandDetails,omitempty"`
	RefrenceCheck                []RefrenceCheckDetails
	ExpansionPlans               string
	SecondLineinBusiness         string  `bson:"SecondLineinBusiness,omitempty"`
	OrdersinHand                 float64 `bson:"OrdersinHand,omitempty"`
	ProjectsCompleted            float64 `bson:"ProjectsCompleted,omitempty"`
	CommentsonFinancials         string
	DateBusinessStarted          time.Time
	Status                       int
	FirstAgreementDate           time.Time
}

type RefrenceCheckDetails struct {
	Source     string
	SourceName string
	CheckBy    string
	IsPositive string
	FeedBack   string
}

type PromotorDetails struct {
	PromoterName                           string
	ExperienceInSameLineOfBusiness         float64
	EducationalQualificationOfMainPromoter string
	ResiOwnershipStatus                    string
	OfficeOwnershipStatus                  string
	RealEstatePosition                     []float64
	CibilScore                             float64
	Status                                 int
}

type VendorDetails struct {
	DistributorName                        string
	MaxDelayDays                           int
	MaxPaymentDays                         int
	AverageDelayDays                       int
	StandardDeviation                      int
	AveragePaymentDays                     int
	AvgTransactionWeightedPaymentDelayDays int
	DelayDaysStandardDeviation             int
	AvgTransactionWeightedPaymentDays      int
	DaysStandardDeviation                  int
	AmountOfBusinessDone                   int
	Status                                 int
}

type LoanDetails struct {
	RequestedLimitAmount    float64
	ProposedLoanAmount      float64
	LimitTenor              float64
	ProposedRateInterest    float64
	ProposedPFee            float64
	IfExistingCustomer      bool
	IfYesEistingLimitAmount float64
	ExistingRoi             float64
	ExistingPf              float64
	FirstAgreementDate      time.Time
	RecenetAgreementDate    time.Time
	VintageWithX10          float64
	CommercialCibilReport   bool
	InterestOutgo           float64
	IfBackedByPO            bool
	POValueforBacktoBack    float64
	ExpectedPayment         float64
	TypeSecurity            string
	DetailsSecurity         string
	Status                  int
}

type CustomerBussinesMix struct {
	StockSellIn    float64
	B2BGovtIn      float64
	B2BCorporateIn float64
	Status         int
}

type DistributorMix struct {
	IrisComputersLimitedIn float64
	SavexIn                float64
	RashiIn                float64
	SupertronIn            float64
	CompuageIn             float64
	AvnetIn                float64
	Data                   []DataDistributor `bson:"Data,omitempty"`
	Status                 int
}

type DataDistributor struct {
	Label  string  `bson:"Label,omitempty"`
	Result float64 `bson:"Result,omitempty"`
}

func (a *AccountDetail) GetDataForFormulaBuilder(customerId, dealNo string) (AccountDetailSummary, AccountDetail, error) {
	// conn, err := GetConnection()
	// defer conn.Close()
	// if err != nil {
	// 	return AccountDetailSummary{}, AccountDetail{}, err
	// }

	// wh := []*dbox.Filter{dbox.Eq("customerid", customerId), dbox.Eq("dealno", dealNo)}

	// query, err := conn.NewQuery().
	// 	Select().
	// 	From(new(AccountDetail).TableName()).
	// 	Where(wh...).
	// 	Cursor(nil)
	// if err != nil {
	// 	return AccountDetailSummary{}, AccountDetail{}, err
	// }

	res := []AccountDetail{}
	// err = query.Fetch(&res, 0, false)
	// if err != nil {
	// 	return AccountDetailSummary{}, AccountDetail{}, err
	// }
	// defer query.Close()

	err := new(DataConfirmController).GetDataConfirmed(customerId, dealNo, new(AccountDetail).TableName(), &res)
	if err != nil {
		return AccountDetailSummary{}, AccountDetail{}, err
	}

	if len(res) == 0 {
		return AccountDetailSummary{}, AccountDetail{}, nil
	}

	asFloat := func(x interface{}) float64 {
		s := fmt.Sprintf("%v", x)
		f, _ := strconv.ParseFloat(s, 64)
		return f
	}

	acc := res[0]
	final := AccountDetailSummary{}
	final.ACSProduct = acc.AccountSetupDetails.Product
	final.ACSScheme = acc.AccountSetupDetails.Scheme
	final.ACSPDRemarks = acc.AccountSetupDetails.PdInfo.PdRemarks

	final.BDCustomerSegmentClasification = acc.BorrowerDetails.CustomerSegmentClasification
	final.BDDiversificationCustomers = acc.BorrowerDetails.DiversificationCustomers
	final.BDDependenceOnSuppliers = acc.BorrowerDetails.DependenceOnSuppliers
	final.BDBusinessVintage = acc.BorrowerDetails.BusinessVintage
	final.BDOrdersinHand = acc.BorrowerDetails.OrdersinHand
	final.BDProjectsCompleted = acc.BorrowerDetails.ProjectsCompleted
	final.BDBorrowerConstitution = acc.BorrowerDetails.BorrowerConstitution
	final.BDMarketReference = acc.BorrowerDetails.MarketReference
	final.BDExternalRating = acc.BorrowerDetails.ExternalRating
	final.BDManagement = acc.BorrowerDetails.Management

	final.LDProposedLoanAmount = acc.LoanDetails.ProposedLoanAmount
	final.LDRequestedLimitAmount = acc.LoanDetails.RequestedLimitAmount
	final.LDLimitTenor = acc.LoanDetails.LimitTenor
	final.LDProposedRateInterest = acc.LoanDetails.ProposedRateInterest
	final.LDProposedPFee = acc.LoanDetails.ProposedPFee
	final.LDInterestOutgo = acc.LoanDetails.InterestOutgo

	final.LDPOValueforBacktoBack = acc.LoanDetails.POValueforBacktoBack
	final.LDExpectedPayment = acc.LoanDetails.ExpectedPayment

	final.LDIfYesEistingLimitAmount = acc.LoanDetails.IfYesEistingLimitAmount
	final.LDExistingRoi = acc.LoanDetails.ExistingRoi
	final.LDExistingPf = acc.LoanDetails.ExistingPf
	final.LDVintageWithX10 = acc.LoanDetails.VintageWithX10

	final.LDTypeSecurity = acc.LoanDetails.TypeSecurity
	final.LDDetailsSecurity = acc.LoanDetails.DetailsSecurity

	if acc.LoanDetails.IfBackedByPO {
		final.LDIfBackedByPO = "YES"
	} else {
		final.LDIfBackedByPO = "NO"
	}

	if acc.LoanDetails.IfExistingCustomer {
		final.LDIFExistingCustomer = "YES"
	} else {
		final.LDIFExistingCustomer = "NO"
	}

	final.CBMStockSellIn = acc.CustomerBussinesMix.StockSellIn
	final.CBMB2BGovtIn = acc.CustomerBussinesMix.B2BGovtIn
	final.CBMB2BCorporateIn = acc.CustomerBussinesMix.B2BCorporateIn

	final.DMIrisComputersLimitedIn = acc.DistributorMix.IrisComputersLimitedIn
	final.DMSavexIn = acc.DistributorMix.SavexIn
	final.DMRashiIn = acc.DistributorMix.RashiIn
	final.DMSupertronIn = acc.DistributorMix.SupertronIn
	final.DMCompuageIn = acc.DistributorMix.CompuageIn
	final.DMAvnetIn = acc.DistributorMix.AvnetIn

	final.PDCustomerMargin = acc.AccountSetupDetails.PdInfo.CustomerMargin

	realEstateSumValue := float64(0)
	if len(acc.PromotorDetails) > 0 {
		tempdata := make(map[string]float64, 0)

		for _, val := range acc.PromotorDetails {
			tempdata[val.PromoterName] = 0.0
			for _, vx := range val.RealEstatePosition {
				tempdata[val.PromoterName] += vx
			}
		}

		for _, val := range tempdata {
			if realEstateSumValue < val {
				realEstateSumValue = val
			}
		}
		// realEstateSumValue = asFloat(crowd.From(&acc.PromotorDetails).Max(func(x interface{}) interface{} {
		// 	return x.(PromotorDetails).RealEstatePosition
		// }).Exec().Result.Max)
	}

	_, rtrdata, err := new(RTRBottom).GetDataForAccountDetails(customerId, dealNo)
	TCLPOS := 0.0
	if err == nil {
		TCLPOS = rtrdata.TCLPOS
	}

	// loanValue := acc.LoanDetails.RequestedLimitAmount
	final.PDRealEstateSumValue = toolkit.Div(realEstateSumValue, TCLPOS)
	if len(acc.PromotorDetails) == 1 {
		final.PDResiOwnershipStatus = acc.PromotorDetails[0].ResiOwnershipStatus
	} else {
		for _, each := range acc.PromotorDetails {
			if each.ResiOwnershipStatus == "Owned" {
				final.PDResiOwnershipStatus = each.ResiOwnershipStatus
				break
			}
		}
	}

	if len(acc.PromotorDetails) == 1 {
		final.PDOfficeOwnershipStatus = acc.PromotorDetails[0].OfficeOwnershipStatus
	} else {
		for _, each := range acc.PromotorDetails {
			if each.OfficeOwnershipStatus == "Owned" {
				final.PDOfficeOwnershipStatus = each.OfficeOwnershipStatus
				break
			}
		}
		if final.PDOfficeOwnershipStatus == "" && len(acc.PromotorDetails) > 0 {
			final.PDOfficeOwnershipStatus = acc.PromotorDetails[0].OfficeOwnershipStatus
		}
	}

	if len(acc.PromotorDetails) > 0 {
		final.PDMinIndexEducationalQualificationOfMainPromoter = acc.PromotorDetails[0].EducationalQualificationOfMainPromoter
	}

	if len(acc.PromotorDetails) > 0 {
		final.PDAvgExperienceInSameLineOfBusiness = crowd.From(&acc.PromotorDetails).Avg(func(x interface{}) interface{} {
			return x.(PromotorDetails).ExperienceInSameLineOfBusiness
		}).Exec().Result.Avg
		final.PDMaxExperienceInSameLineOfBusiness = asFloat(crowd.From(&acc.PromotorDetails).Max(func(x interface{}) interface{} {
			return x.(PromotorDetails).ExperienceInSameLineOfBusiness
		}).Exec().Result.Max)
		final.PDMinExperienceInSameLineOfBusiness = asFloat(crowd.From(&acc.PromotorDetails).Min(func(x interface{}) interface{} {
			return x.(PromotorDetails).ExperienceInSameLineOfBusiness
		}).Exec().Result.Min)
		final.PDAvgCibilScore = crowd.From(&acc.PromotorDetails).Avg(func(x interface{}) interface{} {
			return x.(PromotorDetails).CibilScore
		}).Exec().Result.Avg
		final.PDMaxCibilScore = asFloat(crowd.From(&acc.PromotorDetails).Max(func(x interface{}) interface{} {
			return x.(PromotorDetails).CibilScore
		}).Exec().Result.Max)
		final.PDMinCibilScore = asFloat(crowd.From(&acc.PromotorDetails).Min(func(x interface{}) interface{} {
			return x.(PromotorDetails).CibilScore
		}).Exec().Result.Min)
		final.PDAvgRealEstatePosition = crowd.From(&acc.PromotorDetails).Avg(func(x interface{}) interface{} {
			if len(x.(PromotorDetails).RealEstatePosition) == 0 {
				return 0
			}

			return crowd.From(x.(PromotorDetails).RealEstatePosition).Sum(func(y interface{}) interface{} {
				return y.(float64)
			}).Exec().Result.Sum
		}).Exec().Result.Avg
		final.PDMaxRealEstatePosition = asFloat(crowd.From(&acc.PromotorDetails).Max(func(x interface{}) interface{} {
			if len(x.(PromotorDetails).RealEstatePosition) == 0 {
				return 0
			}

			return crowd.From(x.(PromotorDetails).RealEstatePosition).Sum(func(y interface{}) interface{} {
				return y.(float64)
			}).Exec().Result.Sum
		}).Exec().Result.Max)
		final.PDMinRealEstatePosition = asFloat(crowd.From(&acc.PromotorDetails).Min(func(x interface{}) interface{} {
			if len(x.(PromotorDetails).RealEstatePosition) == 0 {
				return 0
			}

			return crowd.From(x.(PromotorDetails).RealEstatePosition).Sum(func(y interface{}) interface{} {
				return y.(float64)
			}).Exec().Result.Sum
		}).Exec().Result.Min)
	}

	if len(acc.VendorDetails) > 0 {
		final.VDMaxDelayDays = asFloat(crowd.From(&acc.VendorDetails).Max(func(x interface{}) interface{} {
			return x.(VendorDetails).MaxDelayDays
		}).Exec().Result.Max)
		final.VDMaxPaymentDays = asFloat(crowd.From(&acc.VendorDetails).Max(func(x interface{}) interface{} {
			return x.(VendorDetails).MaxPaymentDays
		}).Exec().Result.Max)
		final.VDAverageDelayDays = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).AverageDelayDays
		}).Exec().Result.Avg
		final.VDMaxOfAverageDelayDays = crowd.From(&acc.VendorDetails).Max(func(x interface{}) interface{} {
			return float64(x.(VendorDetails).AverageDelayDays)
		}).Exec().Result.Max.(float64)
		final.VDAvgStandardDeviation = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).StandardDeviation
		}).Exec().Result.Avg
		final.VDAveragePaymentDays = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).AveragePaymentDays
		}).Exec().Result.Avg
		final.VDAvgTransactionWeightedPaymentDelayDays = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).AvgTransactionWeightedPaymentDays
		}).Exec().Result.Avg
		final.VDAvgDelayDaysStandardDeviation = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).DelayDaysStandardDeviation
		}).Exec().Result.Avg
		final.VDAvgTransactionWeightedPaymentDays = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).AvgTransactionWeightedPaymentDays
		}).Exec().Result.Avg
		final.VDAvgDaysStandardDeviation = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).DaysStandardDeviation
		}).Exec().Result.Avg
		final.VDAvgAmountOfBusinessDone = crowd.From(&acc.VendorDetails).Avg(func(x interface{}) interface{} {
			return x.(VendorDetails).AmountOfBusinessDone
		}).Exec().Result.Avg
	}

	return final, acc, nil
}
