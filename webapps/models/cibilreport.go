package models

import (
	. "eaciit/x10/webapps/connection"
	// "fmt"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
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
	CreatedDate         time.Time             `bson:"CreatedDate,omitempty"`
	ReportDate          time.Time             `bson:"ReportDate,omitempty"`
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

type CibilTempModel struct {
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
	Status              int                   `bson:"Status"`
	Rating              string                `bson:"Rating"`
	AcceptRejectTime    time.Time             `bson:"AcceptRejectTime"`
	AllConfirmTime      time.Time             `bson:"AllConfirmTime"`
	IsFreeze            bool                  `bson:"isFreeze"`
	IsConfirm           int                   `bson:"isConfirm"`
	IsCibilDraft        bool                  `bson:"iscibildraft"`
}

func NewCibilTempModel() *CibilTempModel {
	n := new(CibilTempModel)
	return n
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

func (m *CibilReportModel) GetDataReport(cust int, dealno string) (CibilReportModel, error) {

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

func (m *CibilDraftModel) GetDataDraft(cust int, dealno string) (CibilDraftModel, error) {

	data := CibilDraftModel{}

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
		From("CibilDraft").
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

func (m *CibilReportModel) GetAllDataByParam(param tk.M, k *knot.WebContext) (tk.Result, int) {
	conn, _ := GetConnection()
	defer conn.Close()

	res := tk.Result{}
	dataReport := []CibilReportModel{}
	dataDraft := []CibilDraftModel{}
	// temp := []CibilTempModel{}

	query := []*dbox.Filter{}
	querydraft := []*dbox.Filter{}
	query = append(query, dbox.Ne("_id", ""))
	query = append(query, dbox.Eq("UnconfirmID", ""))
	querydraft = append(querydraft, dbox.Eq("Status", 1))
	querydraft = append(querydraft, dbox.Eq("UnconfirmID", ""))

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
		querydraft = append(querydraft, dbox.Or(keys...))

	}

	//RESTICT ACCESS
	if k.Session("CustomerProfileData") != nil {
		queryx := []*dbox.Filter{}

		dts := k.Session("CustomerProfileData").([]tk.M)
		for _, valx := range dts {
			id := valx.GetString("_id")
			custid := cast.ToInt(strings.Split(id, "|")[0], cast.RoundingAuto)
			dealno := strings.Split(id, "|")[1]
			queryx = append(queryx, dbox.And(dbox.Eq("Profile.customerid", custid), dbox.Eq("Profile.dealno", dealno)))
		}

		isCustomRole := k.Session("isCustomRole").(bool)
		if isCustomRole {
			queryx = append(queryx, dbox.Eq("IsMatch", false))
		}

		query = append(query, dbox.Or(queryx...))
	}

	csr, err := conn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Skip(param.GetInt("skip")).
		Take(param.GetInt("take")).
		Cursor(nil)
	defer csr.Close()

	total, _ := m.GetTotalRow(query)
	totaldraft, _ := m.GetTotalRowDraft(querydraft)

	skipdraft := 0
	takedraft := 0

	diff := total - param.GetInt("skip")
	total += totaldraft

	if diff >= 0 && diff < 10 {
		takedraft = 10 - diff
	} else if diff < 0 {
		skipdraft = diff * -1
		takedraft = 10
	}

	tk.Println("skip--", skipdraft)
	tk.Println("take--", takedraft)
	tk.Println("diff--", diff)
	if takedraft > 0 {
		csr1, err1 := conn.NewQuery().
			From("CibilDraft").
			Where(dbox.And(query...)).
			Skip(skipdraft).
			Take(takedraft).
			Cursor(nil)
		defer csr1.Close()
		err1 = csr1.Fetch(&dataDraft, 0, false)
		if err1 != nil {
			res.SetError(err1)
		}
	}

	if err != nil {
		res.SetError(err)
	}

	err = csr.Fetch(&dataReport, 0, false)
	if err != nil {
		res.SetError(err)
	}

	arr := []*CibilTempModel{}

	for _, a := range dataReport {
		w := NewCibilTempModel()
		w.Id = a.Id
		w.FilePath = a.FilePath
		w.FileName = a.FileName
		w.ReportType = a.ReportType
		w.IsMatch = a.IsMatch
		w.UnconfirmID = a.UnconfirmID
		w.Profile = a.Profile
		w.ReportSummary = a.ReportSummary
		w.DetailReportSummary = a.DetailReportSummary
		w.CreditTypeSummary = a.CreditTypeSummary
		w.EnquirySummary = a.EnquirySummary
		w.Status = a.Status
		w.Rating = a.Rating
		w.AcceptRejectTime = a.AcceptRejectTime
		w.AllConfirmTime = a.AllConfirmTime
		w.IsFreeze = a.IsFreeze
		w.IsConfirm = a.IsConfirm
		w.IsCibilDraft = false

		arr = append(arr, w)

	}

	for _, o := range dataDraft {
		l := NewCibilTempModel()
		l.Id = o.Id
		l.FilePath = o.FilePath
		l.FileName = o.Profile.CompanyName + "_Manual Data Entry"
		l.ReportType = o.ReportType
		// l.IsMatch = o.IsMatch
		// l.UnconfirmID = o.UnconfirmID
		l.Profile = o.Profile
		l.ReportSummary = o.ReportSummary
		l.DetailReportSummary = o.DetailReportSummary
		l.CreditTypeSummary = o.CreditTypeSummary
		l.EnquirySummary = o.EnquirySummary
		l.Status = o.Status
		// l.Rating = o.Rating
		l.AcceptRejectTime = o.AcceptRejectTime
		l.AllConfirmTime = o.AllConfirmTime
		// l.IsFreeze = o.IsFreeze
		// l.IsConfirm = o.IsConfirm
		l.IsCibilDraft = true

		arr = append(arr, l)

	}

	res.SetData(arr)

	// re ,_ := m.GetTotalRow(query)

	return res, total
}

func (m *CibilReportModel) UpdateReport(data CibilReportModel) error {

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

func (m *CibilReportModel) UpdateDraft(data CibilReportModel) error {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	qinsert := conn.NewQuery().
		From("CibilDraft").
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

func (m *CibilReportModel) GetTotalRowDraft(query []*dbox.Filter) (int, error) {
	conn, _ := GetConnection()
	defer conn.Close()

	cursor, e := conn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)
	defer cursor.Close()

	if e != nil {
		return 0, e
	}

	return cursor.Count(), e
}
