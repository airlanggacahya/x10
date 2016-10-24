package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Profile struct {
	CompanyName  string
	DealNo       string
	CustomerId   int
	DunsNumber   string
	Pan          string
	Address      string
	CityTown     string
	Telephone    string
	StateUnion   string
	PinCode      string
	Country      string
	FileOpenDate string
}

type ReportSummary struct {
	Grantors                     string
	Facilities                   string
	CreditFacilities             string
	FacilitiesGuaranteed         string
	LatestCreditFacilityOpenDate string
	FirstCreditFacilityOpenDate  string
}

type DetailReportSummary struct {
	CreditFacilities                string
	NoOfStandard                    string
	CurrentBalanceStandard          string
	NoOfOtherThanStandard           string
	CurrentBalanceOtherThanStandard string
	NoOfLawSuits                    string
	NoOfWilfulDefaults              string
}

type CreditTypeSummary struct {
	NoCreditFacilitiesBorrower string
	CreditType                 string
	CurrencyCode               string
	Standard                   string
	Substandard                string
	Doubtful                   string
	Loss                       string
	SpecialMention             string
	TotalCurrentBalance        string
}

type EnquirySummary struct {
	Enquiries3Month      string
	Enquiries6Month      string
	Enquiries9Month      string
	Enquiries12Month     string
	Enquiries24Month     string
	EnquiriesThan24Month string
	TotalEnquiries       string
	MostRecentDate       string
}

type CibilReportModel struct {
	orm.ModelBase       `bson:"-",json:"-"`
	Id                  bson.ObjectId         `bson:"_id" , json:"_id"`
	FilePath            string                `bson:"FilePath"`
	FileName            string                `bson:"FileName"`
	ReportType          string                `bson:"ReportType"`
	Profile             Profile               `bson:"Profile"`
	ReportSummary       ReportSummary         `bson:"ReportSummary"`
	DetailReportSummary []DetailReportSummary `bson:"DetailReportSummary"`
	CreditTypeSummary   []CreditTypeSummary   `bson:"CreditTypeSummary"`
	EnquirySummary      EnquirySummary        `bson:"EnquirySummary"`
	Status              int                   `bson:"Status,omitempty"`
	Rating              string                `bson:"Rating,omitempty"`
	AcceptRejectTime    time.Time             `bson:"AcceptRejectTime,omitempty"`
	AllConfirmTime      time.Time             `bson:"AllConfirmTime,omitempty"`
	IsFreeze            bool                  `bson:"isFreeze,omitempty"`
	IsConfirm           int                   `bson:"isConfirm,omitempty"`
}

type CibilMap struct {
	SelectRating string
	MinScore     float64
}

func NewCibilReportModel() *CibilReportModel {
	m := new(CibilReportModel)
	return m
}
func (e *CibilReportModel) RecordID() interface{} {
	return e.Id
}

func (m *CibilReportModel) TableName() string {
	return "CibilReport"
}

type CibilDraftModel struct {
	orm.ModelBase       `bson:"-",json:"-"`
	Id                  bson.ObjectId         `bson:"_id" , json:"_id"`
	FilePath            string                `bson:"FilePath"`
	FileName            string                `bson:"FileName"`
	ReportType          string                `bson:"ReportType"`
	Profile             Profile               `bson:"Profile"`
	ReportSummary       ReportSummary         `bson:"ReportSummary"`
	DetailReportSummary []DetailReportSummary `bson:"DetailReportSummary"`
	CreditTypeSummary   []CreditTypeSummary   `bson:"CreditTypeSummary"`
	EnquirySummary      EnquirySummary        `bson:"EnquirySummary"`
	Status              int                   `bson:"Status,omitempty"`
	AcceptRejectTime    time.Time             `bson:"AcceptRejectTime,omitempty"`
	AllConfirmTime      time.Time             `bson:"AllConfirmTime,omitempty"`
}

func NewCibilDraftModel() *CibilDraftModel {
	m := new(CibilDraftModel)
	return m
}
func (e *CibilDraftModel) RecordID() interface{} {
	return e.Id
}

func (m *CibilDraftModel) TableName() string {
	return "CibilDraft"
}
