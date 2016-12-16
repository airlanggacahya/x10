package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"regexp"
	"strconv"
	"strings"
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
	IsMatch             bool                  `bson:"IsMatch"`
	UnconfirmID         string                `bson:"UnconfirmID"`
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

func (m *CibilReportModel) GetReportDataByUnconfirmID(unconfirmid string) ([]CibilReportModel, error) {
	data := []CibilReportModel{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return data, err
	}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("UnconfirmID", unconfirmid))
	wh = append(wh, dbox.Eq("IsMatch", false))

	query, err := conn.NewQuery().
		Select().
		From(m.TableName()).
		Where(wh...).
		Cursor(nil)
	if query == nil {
		return data, err
	}

	defer query.Close()

	if err != nil {
		return data, err
	}

	err = query.Fetch(&data, 0, false)
	if err != nil {
		return data, err
	}

	return data, err
}

func (m *CibilReportModel) GetAllData() ([]CibilReportModel, error) {

	data := []CibilReportModel{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return data, err
	}

	csr, err := conn.NewQuery().
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if err != nil {
		panic(err)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&data, 0, false)
	if err != nil {
		return data, err
	}

	return data, err
}

func (m *CibilReportModel) GetData(cust int, dealno string) (CibilReportModel, error) {

	data := CibilReportModel{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return data, err
	}

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cust))
	query = append(query, dbox.Eq("Profile.dealno", dealno))
	csr, err := conn.NewQuery().
		Where(query...).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if err != nil {
		panic(err)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&data, 1, false)
	if err != nil {
		return data, err
	}

	return data, err
}

func (m *CibilReportModel) GetAllDataByParam(param tk.M) (tk.Result, int) {
	conn, _ := GetConnection()
	defer conn.Close()

	res := tk.Result{}
	data := []CibilReportModel{}

	query := []*dbox.Filter{}
	query = append(query, dbox.Ne("_id", ""))

	key := param.GetString("searchkey")

	if key != "" {
		keys := []*dbox.Filter{}
		keys = append(keys, dbox.Contains("FileName", key))
		keys = append(keys, dbox.Contains("Profile.companyname", key))
		keys = append(keys, dbox.Contains("Profile.dealno", key))

		reg, err := regexp.Compile(`\[|\]`)
		if err != nil {
			res.SetError(err)
		}

		additionals := strings.Split(reg.ReplaceAllString(param.GetString("additional"), ""), ",")
		for _, additional := range additionals {
			a, e := strconv.Atoi(additional)
			if a != -1 && e == nil {
				keys = append(keys, dbox.Eq("Profile.customerid", a))
			}
		}

		query = append(query, dbox.Or(keys...))
	}

	csr, err := conn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Skip(param.GetInt("skip")).
		Take(param.GetInt("take")).
		Cursor(nil)
	defer csr.Close()

	if err != nil {
		res.SetError(err)
	}

	err = csr.Fetch(&data, 0, false)
	if err != nil {
		res.SetError(err)
	}

	res.SetData(data)

	total, _ := m.GetTotalRow(query)

	return res, total
}

func (m *CibilReportModel) Update(data CibilReportModel) error {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	qinsert := conn.NewQuery().
		From("CibilReport").
		SetConfig("multiexec", true).
		Save()

	defer qinsert.Close()

	insdata := map[string]interface{}{"data": data}
	err = qinsert.Exec(insdata)
	if err != nil {
		return err
	}

	return err
}

func (m *CibilReportModel) GetTotalRow(query []*dbox.Filter) (int, error) {
	conn, _ := GetConnection()
	defer conn.Close()

	cursor, e := conn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)
	defer cursor.Close()

	if e != nil {
		return 0, e
	}

	return cursor.Count(), e
}
