package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/crowd"
	"github.com/eaciit/dbox"
	"github.com/eaciit/toolkit"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	DEFAULT_PERIOD string = "31-03-2016"
)

// ======= Norm Master

type FM_NormFormula struct {
	NormMaster
	CalculatedValue interface{}
}

// ======= Balance Sheet

type FM_BalanceSheetFormDataValue struct {
	Date           string
	Value          interface{}
	FormattedValue interface{}
}

type FM_BalanceSheetFormData struct {
	FieldAlias     string
	FieldName      string
	FieldOrder     int
	Type           string
	ValueType      string
	SubSectionName string
	SectionName    string
	Values         []FM_BalanceSheetFormDataValue
}

type FM_FormulaBalanceSheet struct {
	AuditStatus     []AuditStatus
	ProvisionStatus []AuditStatus
	FormData        []FM_BalanceSheetFormData
}

// ======= Formula Model

type FormulaModel struct {
	CustomerId string
	DealNo     string
	RatingId   string

	RatioFormula []RatioFormula
	NormFormula  []NormMaster

	RatingMaster        []RatingMaster
	RatingData          RatingData
	CreditScoreCardItem []CreditScoreCardItem
	CibilData           CibilMap

	MasterAccountDetail []MasterAccountDetail

	AccountDetails            AccountDetailSummary
	BalanceSheet              FM_FormulaBalanceSheet
	RTR                       RTRSummary
	BankingAnalysis           BankAllSummary
	BankingAnalysisRawDetails []BankAnalysisV2
	BankingAnalysisRawSummary []Summary
	NormMaster                []FM_NormFormula
}

// ========= Util

type FieldTemporaryHolder struct {
	FieldId     string
	Type        string
	FieldData   FM_BalanceSheetFormData
	FormulaData RatioFormula
}

type ArrayFM_NormFormula []FM_NormFormula

func (s ArrayFM_NormFormula) Len() int {
	return len(s)
}
func (s ArrayFM_NormFormula) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ArrayFM_NormFormula) Less(i, j int) bool {
	return s[i].Order < s[j].Order
}

type ArrayFM_BalanceSheetFormData []FM_BalanceSheetFormData

func (s ArrayFM_BalanceSheetFormData) Len() int {
	return len(s)
}
func (s ArrayFM_BalanceSheetFormData) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ArrayFM_BalanceSheetFormData) Less(i, j int) bool {
	return s[i].FieldOrder < s[j].FieldOrder
}

type AuditStatuses []AuditStatus

func (s AuditStatuses) Len() int {
	return len(s)
}
func (s AuditStatuses) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s AuditStatuses) Less(i, j int) bool {
	left, _ := time.Parse("02-01-2006", s[i].Date)
	right, _ := time.Parse("02-01-2006", s[j].Date)

	return !left.After(right)
}

type FM_RatingMasterParameter struct {
	*ParametersData
	categories []RatingMaster
}

func (f FM_RatingMasterParameter) GetMinOrder() int {
	minOrder := 0

	if len(f.categories) > 0 {
		minOrder = f.categories[0].Order
	}

	for _, each := range f.categories {
		if each.Order < minOrder {
			minOrder = each.Order
		}
	}

	return minOrder
}

type ArrayFM_RatingMasterParameters []FM_RatingMasterParameter

func (s ArrayFM_RatingMasterParameters) Len() int {
	return len(s)
}
func (s ArrayFM_RatingMasterParameters) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ArrayFM_RatingMasterParameters) Less(i, j int) bool {
	return s[i].GetMinOrder() < s[j].GetMinOrder()
}

// Main func

func NewFormulaModel() *FormulaModel {
	fm := new(FormulaModel)
	fm.RatioFormula = make([]RatioFormula, 0)
	return fm
}

func (fm *FormulaModel) GetData(args ...string) error {
	if err := fm.GetRatioFormula(); err != nil {
		return err
	}

	if err := fm.GetNormFormula(); err != nil {
		return err
	}

	if err := fm.GetDataAccountDetails(); err != nil {
		return err
	}

	if err := fm.GetDataBalanceSheet(); err != nil {
		return err
	}

	if err := fm.GetDataRTR(); err != nil {
		return err
	}

	if err := fm.GetDataMasterAccountDetail(); err != nil {
		return err
	}

	if err := fm.GetDataBankingAnalysis(); err != nil {
		return err
	}

	if err := fm.GetRatingData(); err != nil {
		return err
	}

	if err := fm.GetDataRatingMaster(); err != nil {
		return err
	}

	if err := fm.GetCibilData(); err != nil {
		return err
	}

	return nil
}

func (fm *FormulaModel) GetLastAuditedYear() string {
	date := DEFAULT_PERIOD
	for _, each := range fm.BalanceSheet.AuditStatus {
		if each.Status == "AUDITED" {
			date = each.Date
		}
	}

	return date
}

func (fm *FormulaModel) GetCibilData() error {
	fm.CibilData = CibilMap{}
	customerIdInt, _ := strconv.ParseInt(fm.CustomerId, 10, 32)

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	csr, err := conn.NewQuery().
		Where(dbox.And(
		dbox.Eq("Profile.customerid", customerIdInt),
		dbox.Eq("Profile.dealno", fm.DealNo),
	)).
		From("CibilReport").
		Cursor(nil)
	defer csr.Close()
	if err != nil {
		return err
	}

	cibilReport := []CibilReportModel{}
	err = csr.Fetch(&cibilReport, 0, false)
	if err != nil {
		return err
	}

	if len(cibilReport) > 0 {
		fm.CibilData.SelectRating = cibilReport[0].Rating
	}

	csr, err = conn.NewQuery().
		Where(dbox.And(
		dbox.Eq("ConsumerInfo.CustomerId", customerIdInt),
		dbox.Eq("ConsumerInfo.DealNo", fm.DealNo)),
	).
		From("CibilReportPromotorFinal").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}

	resprom := []toolkit.M{}
	err = csr.Fetch(&resprom, 0, false)
	if err != nil {
		return err
	}

	if len(resprom) > 0 {
		fm.CibilData.MinScore = crowd.From(&resprom).Min(func(x interface{}) interface{} {
			return x.(toolkit.M).GetFloat64("CibilScore")
		}).Exec().Result.Min.(float64)
	}

	return nil
}

func (fm *FormulaModel) GetDataMasterAccountDetail() error {
	res, err := GetMasterAccountDetail()
	if err != nil {
		return err
	}

	fm.MasterAccountDetail = res
	return nil
}

func (fm *FormulaModel) GetDataRatingMaster() error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	csr, err := conn.NewQuery().
		From(new(RatingMaster).TableName()).
		Order("order").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return err
	}

	ratingMastahhhhhh := []RatingMaster{}
	err = csr.Fetch(&ratingMastahhhhhh, 0, false)
	if err != nil {
		return err
	}

	ratingFilterd := []RatingMaster{}
	for _, eachRM := range ratingMastahhhhhh {
		isFound := false

	checkFound:
		for _, eachCat := range fm.RatingData.CategoriesData {
			if eachRM.Id == eachCat.Id {
				isFound = true
				break checkFound
			}
		}

		if isFound {
			ratingFilterd = append(ratingFilterd, eachRM)
		}
	}

	fm.RatingMaster = ratingFilterd

	return nil
}

func (fm *FormulaModel) GetRatingData() error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	query := conn.NewQuery().
		From(new(RatingData).TableName())

	if fm.RatingId != "" {
		query = query.Where(dbox.Eq("_id", fm.RatingId))
	}

	csr, err := query.
		// Order("order").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return err
	}

	res := []RatingData{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return err
	}

	if len(res) > 0 {
		fm.RatingData = res[0]
	} else {
		fm.RatingData = RatingData{}
		fm.RatingData.CategoriesData = []*CategoriesData{}
		fm.RatingData.ParametersData = []*ParametersData{}
		fm.RatingData.ParametersGroupData = []*ParametersGroupData{}
	}

	return nil
}

func (fm *FormulaModel) GetNormFormula() error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	csr, err := conn.NewQuery().
		From(new(NormMaster).TableName()).
		Order("order").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return err
	}

	fm.NormFormula = []NormMaster{}
	err = csr.Fetch(&fm.NormFormula, 0, false)
	if err != nil {
		return err
	}

	return nil
}

func (fm *FormulaModel) GetRatioFormula() error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	// query := []*dbox.Filter{dbox.Eq("formodule", "ratio report")}
	query := []*dbox.Filter{dbox.Ne("_id", "")}
	csr, err := conn.NewQuery().
		From(new(RatioFormula).TableName()).
		Where(query...).
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return err
	}

	ratioFormulas := []RatioFormula{}
	err = csr.Fetch(&ratioFormulas, 0, false)
	if err != nil {
		return err
	}

	fm.RatioFormula = ratioFormulas
	return nil
}

func (fm *FormulaModel) GetDataAccountDetails() error {
	summary, _, err := new(AccountDetail).GetDataForFormulaBuilder(fm.CustomerId, fm.DealNo)
	if err != nil {
		return err
	}

	fm.AccountDetails = summary

	return nil
}

func (fm *FormulaModel) GetDataBalanceSheet() error {
	// id := toolkit.Sprintf("%s|%s", fm.CustomerId, fm.DealNo)

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	csr, err := conn.NewQuery().
		From(new(BalanceSheetInput).TableName()).
		Order("Order").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return err
	}

	balanceSheetFields := []BalanceSheetInput{}
	err = csr.Fetch(&balanceSheetFields, 0, false)
	if err != nil {
		return err
	}

	// csr, err = conn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("customerid", id), dbox.Eq("confirmed", true))).
	// 	From(new(RatioInputData).TableName()).
	// 	Cursor(nil)
	// if csr != nil {
	// 	defer csr.Close()
	// }
	// if err != nil {
	// 	return err
	// }

	balanceSheetDataAll := []RatioInputData{}
	balanceSheetData := RatioInputData{}
	// err = csr.Fetch(&balanceSheetDataAll, 0, false)
	// if err != nil {
	// 	return err
	// }

	err = new(DataConfirmController).GetDataConfirmed(fm.CustomerId, fm.DealNo, new(RatioInputData).TableName(), &balanceSheetDataAll)
	if err != nil {
		return err
	}

	if len(balanceSheetDataAll) > 0 {
		balanceSheetData = balanceSheetDataAll[0]
	}

	fm.BalanceSheet = FM_FormulaBalanceSheet{}
	fm.BalanceSheet.AuditStatus = make([]AuditStatus, 0)
	fm.BalanceSheet.FormData = make([]FM_BalanceSheetFormData, 0)

	for _, eachAudit := range balanceSheetData.AuditStatus {
		fm.BalanceSheet.AuditStatus = append(fm.BalanceSheet.AuditStatus, *eachAudit)
	}
	for _, eachAudit := range balanceSheetData.ProvisionStatus {
		fm.BalanceSheet.AuditStatus = append(fm.BalanceSheet.AuditStatus, *eachAudit)
	}

	as := AuditStatuses(fm.BalanceSheet.AuditStatus)
	sort.Sort(as)
	fm.BalanceSheet.AuditStatus = as

	for _, eachField := range balanceSheetFields {
		row := FM_BalanceSheetFormData{}
		row.FieldAlias = eachField.Alias
		row.FieldName = eachField.Field
		row.FieldOrder = eachField.Order
		row.SubSectionName = eachField.SubSection
		row.SectionName = eachField.Section
		row.Values = make([]FM_BalanceSheetFormDataValue, 0)

		for _, eachDate := range fm.BalanceSheet.AuditStatus {
			cell := FM_BalanceSheetFormDataValue{}
			cell.Date = eachDate.Date
			cell.Value = 0
			cell.FormattedValue = toolkit.Sprintf("%.2f", float64(0))

		loopCell:
			for _, eachData := range balanceSheetData.FormData {
				eachDataFieldId := (func() string {
					parts := strings.Split(eachData.FieldId, "-")
					return parts[len(parts)-1]
				}())
				if eachData.Date == eachDate.Date && eachDataFieldId == eachField.Id {
					cell.Value = eachData.Value
					cell.FormattedValue = toolkit.Sprintf("%.2f", eachData.Value)
					break loopCell
				}
			}

			row.Values = append(row.Values, cell)
		}

		fm.BalanceSheet.FormData = append(fm.BalanceSheet.FormData, row)
	}

	return nil
}

func (fm *FormulaModel) GetDataRTR() error {
	_, summary, err := new(RTRBottom).
		GetDataConfirmed(fm.CustomerId, fm.DealNo)
	if err != nil {
		return err
	}

	fm.RTR = *summary

	return nil
}

func (fm *FormulaModel) GetDataBankingAnalysis() error {
	customerIdInt, _ := strconv.ParseInt(fm.CustomerId, 10, 32)
	details, summary, err := new(BankAnalysis).GetDataV2Confirmed(int(customerIdInt), fm.DealNo)
	if err != nil {
		return err
	}

	allsum, err := new(BankAnalysis).GenerateAllSummaryConfirmed(fm.CustomerId, fm.DealNo)
	if err != nil {
		return err
	}

	fm.BankingAnalysisRawDetails = details
	fm.BankingAnalysisRawSummary = summary
	fm.BankingAnalysis = *allsum

	return nil
}

func (fm *FormulaModel) GetFieldsInOrder() []FieldTemporaryHolder {
	fieldIdsCached := toolkit.M{}
	fieldIds := []FieldTemporaryHolder{}

	arr := ArrayFM_BalanceSheetFormData(fm.BalanceSheet.FormData)
	sort.Sort(arr)

	for _, eachData := range arr {
		fieldIds = append(fieldIds, FieldTemporaryHolder{
			FieldId:   eachData.FieldAlias,
			Type:      "field",
			FieldData: eachData,
		})
	}

	prevLen := -1
	for len(fieldIdsCached) != len(fm.RatioFormula) {
	next:
		for i, eachData := range fieldIds {
			for _, eachFormula := range fm.RatioFormula {
				if fieldIdsCached.Has(eachFormula.Id) {
					continue
				}

				if eachFormula.PutAfter == eachData.FieldId {
					fieldIdsCached.Set(eachFormula.Id, true)

					fieldIds = (func() []FieldTemporaryHolder {
						arrNew := []FieldTemporaryHolder{}
						for _, each := range fieldIds[:i+1] {
							arrNew = append(arrNew, each)
						}
						arrNew = append(arrNew, FieldTemporaryHolder{
							FieldId:     eachFormula.Id,
							Type:        "formula",
							FormulaData: eachFormula,
						})
						for _, each := range fieldIds[i+1:] {
							arrNew = append(arrNew, each)
						}
						return arrNew
					})()

					break next
				}
			}
		}

		if prevLen == len(fieldIdsCached) {
			break
		}
		prevLen = len(fieldIdsCached)
	}

	return fieldIds
}

func (fm *FormulaModel) CalculateNorm(ir string) ([]FM_NormFormula, error) {
	res := []FM_NormFormula{}

	for _, each := range fm.NormFormula {
		nameSpace := ""
		form := new(RatioFormula)
		form.Id = each.Id

		switch each.From {
		case "Account Details":
			nameSpace = "accountdetails." + each.FieldId
		case "Banking Analysis":
			nameSpace = "bank." + each.FieldId
		case "RTR":
			nameSpace = "rtr." + each.FieldId
		case "CIBIL":
			nameSpace = "cibil." + each.FieldId
		default:
			nameSpace = each.FieldId
		}

		form.Formula = nameSpace

	findFormula:
		for _, eachFormula := range fm.RatioFormula {

			if eachFormula.Id == each.FieldId {
				form.Formula = eachFormula.Formula
				form.ValueType = eachFormula.ValueType
				form.Section = eachFormula.Section
				break findFormula
			}
		}

		eachNorm := FM_NormFormula{}
		eachNorm.NormMaster = each

		if eachNorm.NormMaster.InternalRating == "all" || eachNorm.NormMaster.InternalRating == ir {
			eachNorm.CalculatedValue = 0.0

			if err := form.ParseFormula(fm); err != nil {
				return nil, err
			}

			valueByDateStatus, err := (func() ([]toolkit.M, error) {
				result := []toolkit.M{}

				for i := range fm.BalanceSheet.AuditStatus {
					eachStatus := fm.BalanceSheet.AuditStatus[len(fm.BalanceSheet.AuditStatus)-1-i]
					if err := form.PrepareVariables(eachStatus.Date, fm); err != nil {
						return nil, err
					}

					if output, err := form.Calculate(); err != nil {
						return nil, err
					} else {
						result = append(result, toolkit.M{
							"Date":   eachStatus.Date,
							"Value":  output,
							"Status": eachStatus.Status,
						})
					}
				}

				return result, nil
			})()
			if err != nil {
				return nil, err
			}

			eachPeriod := ""

			switch each.TimePeriod {
			case NormMasterTimePeriodEstimatedPreferred:
				for _, eachValueByDate := range valueByDateStatus {
					eachStatus := eachValueByDate.GetString("Status")
					eachValue := eachValueByDate.GetFloat64("Value")

					if eachStatus == "ESTIMATED" || eachStatus == "PROVISION" || eachStatus == "AUDITED" {
						if eachValue > 0 {
							eachPeriod = eachValueByDate.GetString("Date")
							break
						}
					}
				}
			case NormMasterTimePeriodProvisionalPreferred:
				for _, eachValueByDate := range valueByDateStatus {
					eachStatus := eachValueByDate.GetString("Status")
					eachValue := eachValueByDate.GetFloat64("Value")

					if eachStatus == "PROVISION" || eachStatus == "AUDITED" {
						if eachValue > 0 {
							eachPeriod = eachValueByDate.GetString("Date")
							break
						}
					}
				}
			case NormMasterTimePeriodLastAudited:
				for _, eachValueByDate := range valueByDateStatus {
					eachStatus := eachValueByDate.GetString("Status")
					eachValue := eachValueByDate.GetFloat64("Value")

					if eachStatus == "AUDITED" {
						if eachValue > 0 {
							eachPeriod = eachValueByDate.GetString("Date")
							break
						}
					}
				}
			case NormMasterTimePeriodNotApplicable:
			default:
				eachPeriod = "31-03-2116"
			}

			if err := form.PrepareVariables(eachPeriod, fm); err != nil {
				return nil, err
			}

			if res, err := form.Calculate(); err != nil {
				return nil, err
			} else {
				temp := struct {
					Value     float64
					ValueType string
				}{}
				temp.Value, _ = strconv.ParseFloat(res, 64)
				temp.ValueType = form.ValueType
				eachNorm.CalculatedValue = temp
			}

			res = append(res, eachNorm)
		}
	}

	nm := ArrayFM_NormFormula(res)
	sort.Sort(nm)

	return nm, nil
}

func (fm *FormulaModel) CalculateBalanceSheet() (*FM_FormulaBalanceSheet, error) {
	o := new(FM_FormulaBalanceSheet)
	o.AuditStatus = fm.BalanceSheet.AuditStatus
	o.FormData = []FM_BalanceSheetFormData{}

	appendOtherFormula := func(fid []FieldTemporaryHolder, rf []RatioFormula) []FieldTemporaryHolder {
		sortedRatioFormula := []RatioFormula{}
		prevLen := len(rf)
		for len(rf) > 0 {
		loopFormula:
			for i, eachFormula := range rf {
				if len(sortedRatioFormula) == 0 {
					if eachFormula.PutAfter == "" {
						sortedRatioFormula = append(sortedRatioFormula, eachFormula)
						rf = append(rf[:i], rf[i+1:]...)
						break loopFormula
					}
				} else {
					if eachFormula.PutAfter == sortedRatioFormula[len(sortedRatioFormula)-1].Id {
						sortedRatioFormula = append(sortedRatioFormula, eachFormula)
						rf = append(rf[:i], rf[i+1:]...)
						break loopFormula
					}
				}
			}

			if prevLen == len(rf) {
			loopFormula2:
				for i, eachFormula := range rf {
					sortedRatioFormula = append(sortedRatioFormula, eachFormula)
					rf = append(rf[:i], rf[i+1:]...)
					break loopFormula2
				}
			}
		}

		for _, eachFormula := range sortedRatioFormula {
			fid = append(fid, FieldTemporaryHolder{
				FieldId:     eachFormula.Id,
				Type:        "formula",
				FormulaData: eachFormula,
			})
		}

		return fid
	}
	_ = appendOtherFormula

	constructValues := func(eachData FM_BalanceSheetFormData, eachFormula RatioFormula) ([]FM_BalanceSheetFormDataValue, error) {
		values := []FM_BalanceSheetFormDataValue{}

		if err := eachFormula.ParseFormula(fm); err != nil {
			return nil, err
		}

		for _, eachValue := range eachData.Values {
			var selectedBasePeriod = eachValue.Date

			value := FM_BalanceSheetFormDataValue{}
			value.Date = eachValue.Date
			value.Value = 0
			value.FormattedValue = 0

			if eachFormula.Formula != "" {
				// if eachFormula.Section == "RATIO" && eachFormula.SubSection == "KEY RATIOS" {
				// 	valueByDateStatus, err := (func() ([]toolkit.M, error) {
				// 		result := []toolkit.M{}

				// 		for i := range fm.BalanceSheet.AuditStatus {
				// 			eachStatus := fm.BalanceSheet.AuditStatus[len(fm.BalanceSheet.AuditStatus)-1-i]
				// 			if err := eachFormula.PrepareVariables(eachStatus.Date, fm); err != nil {
				// 				return nil, err
				// 			}

				// 			if output, err := eachFormula.Calculate(); err != nil {
				// 				return nil, err
				// 			} else {
				// 				result = append(result, toolkit.M{
				// 					"Date":   eachStatus.Date,
				// 					"Value":  output,
				// 					"Status": eachStatus.Status,
				// 				})
				// 			}
				// 		}

				// 		return result, nil
				// 	})()
				// 	if err != nil {
				// 		return nil, err
				// 	}

				// 	for _, eachValueByDate := range valueByDateStatus {
				// 		eachStatus := eachValueByDate.GetString("Status")
				// 		eachValue := eachValueByDate.GetFloat64("Value")

				// 		if eachStatus == "ESTIMATED" || eachStatus == "PROVISION" || eachStatus == "AUDITED" {
				// 			if eachValue > 0 {
				// 				selectedBasePeriod = eachValueByDate.GetString("Date")
				// 				break
				// 			}
				// 		}
				// 	}
				// }

				// =================

				if err := eachFormula.PrepareVariables(selectedBasePeriod, fm); err != nil {
					return nil, err
				}

				if eachRes, err := eachFormula.Calculate(); err != nil {
					return nil, err
				} else {
					value.Value = eachRes
					value.FormattedValue = eachRes

					switch eachFormula.ValueType {
					case RatioFormulaValueTypeNumber:
						f, err := strconv.ParseFloat(eachRes, 64)
						if err == nil {
							value.Value = f
							value.FormattedValue = toolkit.Sprintf("%.2f", f)
						}
					case RatioFormulaValueTypePercentage:
						f, err := strconv.ParseFloat(eachRes, 64)
						if err == nil {
							value.Value = f
							value.FormattedValue = toolkit.Sprintf("%.2f %%", f*100)
						}
					}
				}
			}

			values = append(values, value)
		}

		return values, nil
	}

	calculateEachRow := func() ([]FM_BalanceSheetFormData, error) {
		allData := []FM_BalanceSheetFormData{}
		previousField := FM_BalanceSheetFormData{}
		counter := 1

		for _, each := range fm.GetFieldsInOrder() {
			newData := FM_BalanceSheetFormData{}
			newData.FieldAlias = each.FieldId
			newData.FieldOrder = counter
			counter++

			if each.Type == "field" {
				newData.Type = "Field"
				newData.FieldName = each.FieldData.FieldName
				newData.SubSectionName = each.FieldData.SubSectionName
				newData.SectionName = each.FieldData.SectionName
				newData.Values = each.FieldData.Values

				previousField = each.FieldData
			} else {
				newData.Type = "Formula"
				newData.FieldName = each.FormulaData.Title
				newData.SubSectionName = each.FormulaData.SubSection
				newData.SectionName = each.FormulaData.Section
				newData.ValueType = each.FormulaData.ValueType

				values, err := constructValues(previousField, each.FormulaData)
				if err != nil {
					return nil, err
				}

				newData.Values = values
			}

			allData = append(allData, newData)
		}

		return allData, nil
	}

	if res, err := calculateEachRow(); err != nil {
		return nil, err
	} else {
		o.FormData = res
	}

	return o, nil
}

func (fm *FormulaModel) CalculateScoreCard() (*CreditScoreCardResult, error) {
	clean := func(s string) string {
		return strings.TrimSpace(s)
	}

	res := []*CreditScoreCardItem{}
	counter := 0

	parametersData := ArrayFM_RatingMasterParameters(func() []FM_RatingMasterParameter {
		resInner := []FM_RatingMasterParameter{}

		for _, eachParam := range fm.RatingData.ParametersData {
			o := FM_RatingMasterParameter{}
			o.ParametersData = eachParam
			o.categories = []RatingMaster{}

			for _, eachRMInside := range fm.RatingMaster {
				if clean(eachRMInside.Parameters) == clean(eachParam.Parameters) && clean(eachRMInside.ParametersGroup) == clean(eachParam.ParametersGroup) {
					o.categories = append(o.categories, eachRMInside)
				}
			}

			resInner = append(resInner, o)
		}

		return resInner
	}())
	sort.Sort(parametersData)

	type FM_RatingMasterParameter struct {
		*ParametersData
		categories []RatingMaster
	}

	for _, eachParamGroup := range fm.RatingData.ParametersGroupData {
		o := new(CreditScoreCardItem)
		o.Id = toolkit.Sprintf("z%d", counter)
		o.IsHeader = true
		o.Name = eachParamGroup.ParametersGroup
		o.Order = counter
		o.categories = []RatingMaster{}
		counter++
		res = append(res, o)

		for _, eachParam := range parametersData {
			if clean(eachParamGroup.ParametersGroup) == clean(eachParam.ParametersGroup) {
				p := new(CreditScoreCardItem)
				p.Id = toolkit.Sprintf("z%d", counter)
				p.IsHeader = false
				p.Name = eachParam.Parameters
				p.categories = []RatingMaster{}
				counter++
				res = append(res, p)

				if len(eachParam.categories) > 0 {
					p.from = eachParam.categories[0].From
					p.fieldId = eachParam.categories[0].FieldId
					p.period = eachParam.categories[0].TimePeriod
					p.categories = eachParam.categories
				}
			}
		}
	}

	resFinal := []*CreditScoreCardItem{}

	for _, each := range res {
		if each.IsHeader {
			resFinal = append(resFinal, each)
			continue
		}

		currentAlias := each.fieldId
		namespace := ""

		switch each.from {
		case "Account Details":
			namespace = "accountdetails"
			currentAlias = namespace + "." + each.fieldId
		case "Banking Analysis":
			namespace = "bank"
			currentAlias = namespace + "." + each.fieldId
		case "RTR":
			namespace = "rtr"
			currentAlias = namespace + "." + each.fieldId
		case "CIBIL":
			namespace = "cibil"
			currentAlias = namespace + "." + each.fieldId
		default:
			namespace = "balancesheet"
			currentAlias = namespace + "." + each.fieldId
		}

		form := new(RatioFormula)
		form.Id = each.Id
		form.Formula = currentAlias

		output := ""
		if each.fieldId == "0" {
			output = "0"
		} else {
			if err := form.ParseFormula(fm); err != nil {
				return nil, err
			}

			period := time.Now().Format("02-01-2006")

			if namespace == "balancesheet" {

				valueByDateStatus, err := (func() ([]toolkit.M, error) {
					result := []toolkit.M{}

					for i := range fm.BalanceSheet.AuditStatus {
						eachStatus := fm.BalanceSheet.AuditStatus[len(fm.BalanceSheet.AuditStatus)-1-i]
						if err := form.PrepareVariables(eachStatus.Date, fm); err != nil {
							return nil, err
						}
						toolkit.Println(eachStatus, "vvvv")
						if output, err := form.Calculate(); err != nil {
							return nil, err
						} else {
							result = append(result, toolkit.M{
								"Date":   eachStatus.Date,
								"Value":  output,
								"Status": eachStatus.Status,
							})
						}
					}

					return result, nil
				})()
				if err != nil {
					return nil, err
				}

				switch each.period {
				case NormMasterTimePeriodEstimatedPreferred:
					for _, eachValueByDate := range valueByDateStatus {
						eachStatus := eachValueByDate.GetString("Status")
						eachValue := eachValueByDate.GetFloat64("Value")

						if eachStatus == "ESTIMATED" || eachStatus == "PROVISION" || eachStatus == "AUDITED" {
							if eachValue > 0 {
								period = eachValueByDate.GetString("Date")
								break
							}
						}
					}
				case NormMasterTimePeriodProvisionalPreferred:
					for _, eachValueByDate := range valueByDateStatus {
						eachStatus := eachValueByDate.GetString("Status")
						eachValue := eachValueByDate.GetFloat64("Value")

						if eachStatus == "PROVISION" || eachStatus == "AUDITED" {
							if eachValue > 0 {
								period = eachValueByDate.GetString("Date")
								break
							}
						}
					}
				case NormMasterTimePeriodLastAudited:
					for _, eachValueByDate := range valueByDateStatus {
						eachStatus := eachValueByDate.GetString("Status")
						eachValue := eachValueByDate.GetFloat64("Value")

						if eachStatus == "AUDITED" {
							if eachValue > 0 {
								period = eachValueByDate.GetString("Date")
								break
							}
						}
					}
				case NormMasterTimePeriodNotApplicable:
				default:
					period = time.Now().Format("02-01-2006")
				}

			}

			if err := form.PrepareVariables(period, fm); err != nil {
				return nil, err
			}

			// ====== set category
			var err error

			if output, err = form.Calculate(); err != nil {
				output = toolkit.Sprintf("%v", form.GetValue(fm, namespace, each.fieldId, period))
				if output == "" || output == "0" {
					return nil, err
				}
			}
			resfl, err := strconv.ParseFloat(toolkit.Sprintf("%v", output), 64)
			if err == nil {
				each.Value = resfl
			}
		}

	loop1:
		for _, raw := range each.categories {
			eachCategory := raw

			if raw.From == "Account Details" {
				for _, each := range fm.MasterAccountDetail {
					if each.Key.FormulaField == raw.FieldId {
						for _, item := range each.Items {
							if item.Name == raw.Categories {
								eachCategory.Operator = item.Operator
								eachCategory.Value1 = item.Value1
								eachCategory.Value2 = item.Value2
							}
						}
					}
				}
			}

			outputFloat, _ := strconv.ParseFloat(toolkit.Sprintf("%v", output), 64)
			switch eachCategory.Operator {
			case "equal":
				if eachCategory.IsValue1String() {
					if output == eachCategory.GetValue1AsString() {
						each.Category = eachCategory.Categories
						each.DataType = "String"
						break loop1
					} else if outputFloat == eachCategory.IsValue1Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"
						break loop1
					}
				} else {
					if outputFloat == eachCategory.GetValue1AsFloat() {
						each.Category = eachCategory.Categories
						each.DataType = "Float"
						break loop1
					}
				}
			case "between":
				if eachCategory.IsValue1String() {
					if outputFloat >= eachCategory.IsValue1Percentage() && outputFloat <= eachCategory.IsValue2Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"

						break loop1
					}
				} else if outputFloat >= eachCategory.GetValue1AsFloat() && outputFloat <= eachCategory.GetValue2AsFloat() {
					each.Category = eachCategory.Categories
					each.DataType = "Float"
					break loop1
				}
			case "min":
				if eachCategory.IsValue1String() {
					if outputFloat > eachCategory.IsValue1Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"
						break loop1
					}
				} else if outputFloat > eachCategory.GetValue1AsFloat() {
					each.DataType = "Float"
					each.Category = eachCategory.Categories
					break loop1
				}
			case "lower than or equal":
				if eachCategory.IsValue1String() {
					if outputFloat <= eachCategory.IsValue1Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"
						break loop1
					}
				} else if outputFloat <= eachCategory.GetValue1AsFloat() {
					each.DataType = "Float"
					each.Category = eachCategory.Categories
					break loop1
				}
			case "greater than or equal":
				if eachCategory.IsValue1String() {
					if outputFloat >= eachCategory.IsValue1Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"
						break loop1
					}
				} else if outputFloat >= eachCategory.GetValue1AsFloat() {
					each.DataType = "Float"
					each.Category = eachCategory.Categories
					break loop1
				}
			case "max":
				if eachCategory.IsValue1String() {
					if outputFloat < eachCategory.IsValue1Percentage() {
						each.Category = eachCategory.Categories
						each.DataType = "Percent"
						break loop1
					}
				} else if outputFloat < eachCategory.GetValue1AsFloat() {
					each.DataType = "Float"
					each.Category = eachCategory.Categories
					break loop1
				}
			}

			//Set DataType
			if eachCategory.ValueType == "percentage" {
				each.DataType = "Percent"
			}

		}
		// ======

		// ====== set value
		each.Score = float64(0)

	loop2:
		for _, eachCategory := range each.categories {
			if eachCategory.Categories == each.Category {

				for _, eachCategoryData := range fm.RatingData.CategoriesData {
					if eachCategoryData.Id == eachCategory.Id {
						each.Score = eachCategoryData.Score
						break loop2
					}
				}
			}
		}
		// ======

		// ====== set weight
		each.Weight = float64(0)
		for _, eachParameter := range fm.RatingData.ParametersData {
			if eachParameter.Parameters == each.Name {
				each.Weight = eachParameter.WeightageWithinGroup
				break
			}
		}
		// ======

		// ====== exclusive case
		if each.Name == "Customer Segment" {
			for _, eachCategory := range each.categories {
				if strings.TrimSpace(eachCategory.Categories) == strings.TrimSpace(output) {
					each.Category = toolkit.Sprintf("%v", eachCategory.Value1)
				}
			}

		loop3:
			for _, eachRM := range fm.RatingMaster {
				if strings.TrimSpace(eachRM.Categories) == strings.TrimSpace(output) {

					for _, eachCategoryData := range fm.RatingData.CategoriesData {
						if eachCategoryData.Id == eachRM.Id {
							each.Score = eachCategoryData.Score
							break loop3
						}
					}
				}
			}

			rowCustomerSegmentClassification := new(CreditScoreCardItem)
			rowCustomerSegmentClassification.Id = "z1f"
			rowCustomerSegmentClassification.Name = "Customer Segment Clasification"
			rowCustomerSegmentClassification.Category = toolkit.Sprintf("%v", output)
			rowCustomerSegmentClassification.Score = 0
			rowCustomerSegmentClassification.Weight = 0
			rowCustomerSegmentClassification.WeightScore = 0
			resFinal = append(resFinal, rowCustomerSegmentClassification)
		}
		// ======

		// ====== set weight percentage
		each.WeightScore = each.Score.(float64) * each.Weight.(float64) / 100
		// ======

		toolkit.Println("========", each.Name)
		toolkit.Println("Category", each.Category)
		toolkit.Println("Weight", each.Weight)
		toolkit.Println("Score", each.Score)

		resFinal = append(resFinal, each)
	}

	prevHeader := new(CreditScoreCardItem)
	values := []float64{}
	for _, each := range resFinal {
		if each.IsHeader {
			prevHeader = each
			values = []float64{}

		loop4:
			for _, eachRD := range fm.RatingData.ParametersData {
				if eachRD.ParametersGroup == prevHeader.Name {
					prevHeader.Weight = eachRD.WeightageWithinGroup
					break loop4
				}
			}

			continue
		}

		raw := strings.Split(toolkit.Sprintf("%v", each.WeightScore), " ")[0]
		weightScore, _ := strconv.ParseFloat(raw, 64)
		values = append(values, weightScore)

		total := float64(0)
		for _, eachValue := range values {
			total = total + eachValue
		}
		prevHeader.Score = total

		headerScore := float64(0)
		headerWeight := float64(0)

		if v, ok := prevHeader.Score.(float64); ok {
			headerScore = v
		}
		if v, ok := prevHeader.Weight.(float64); ok {
			headerWeight = v
		}

		prevHeader.WeightScore = headerScore * headerWeight / 100
	}

	rd := new(CreditScoreCardResult)
	rd.Items = resFinal

	rd.TotalWeightScore = float64(0)
	for _, each := range resFinal {
		if each.IsHeader {
			if weightScore, ok := each.WeightScore.(float64); ok {
				rd.TotalWeightScore = rd.TotalWeightScore + weightScore
			}
		}
	}

	if rd.TotalWeightScore <= 4.5 {
		rd.Rating = "XFL-5"
	} else if rd.TotalWeightScore < 6 {
		rd.Rating = "XFL-4"
	} else if rd.TotalWeightScore < 7 {
		rd.Rating = "XFL-3"
	} else if rd.TotalWeightScore <= 8.5 {
		rd.Rating = "XFL-2"
	} else {
		rd.Rating = "XFL-1"
	}

	return rd, nil
}
