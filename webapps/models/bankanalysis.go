package models

import (
	. "eaciit/x10/webapps/connection"
	"math"
	"strconv"
	"strings"
	"time"

	cast "github.com/eaciit/cast"
	"github.com/eaciit/crowd"
	"github.com/eaciit/dbox"
	"github.com/eaciit/toolkit"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type BankAllSummary struct {
	BSMonthlyCredits                         float64 // Banking Snapshot
	BSMonthlyDebits                          float64
	BSNoOfCredits                            float64
	BSNoOfDebits                             float64
	BSOWChequeReturns                        float64
	BSIWChequeReturns                        float64
	BSImpMargin                              float64
	BSIMarginPercent                         float64
	BSOWReturnPercent                        float64
	BSIWReturnPercent                        float64
	BSDRCRRatio                              float64
	ODSactionLimit                           float64 // OD Details
	ODUtilizationPercent                     float64
	ODAvgUtilization                         float64
	ODInterestPaid                           float64
	AMLAvgCredits                            float64
	AMLAvgDebits                             float64
	ABB                                      float64
	BankingToTurnoverRatio                   float64
	InwardBounces                            float64
	SactionLimit                             float64
	ODCCUtilizationABBvsProposedEMI          float64
	ODCCUtilizationABBvsProposedEMIIsCurrent bool
}

type BankAccount struct {
	BankName         string    `bson:"BankName"`
	AccountType      string    `bson:"AccountType"`
	AccountNo        string    `bson:"AccountNo"`
	AccountHolder    string    `bson:"AccountHolder"`
	SancLimit        float64   `bson:"SancLimit"`
	ROI              float64   `bson:"ROI"`
	InterestPerMonth float64   `bson:"InterestPerMonth"`
	BankStatementTo  time.Time `bson:"BankStatementTo"`
}

type FundBased struct {
	AccountType      string    `bson:"AccountType"`
	AccountNo        string    `bson:"AccountNo"`
	AccountHolder    string    `bson:"AccountHolder"`
	SancLimit        float64   `bson:"SancLimit"`
	ROI              float64   `bson:"ROI"`
	InterestPerMonth float64   `bson:"InterestPerMonth"`
	SanctionDate     time.Time `bson:"SanctionDate"`
	SecurityOfFB     string    `bson:"SecurityOfFB"`
}

type NonFundBased struct {
	NatureOfFacility      string    `bson:"NatureOfFacility"`
	OtherNatureOfFacility string    `bson:"OtherNatureOfFacility"`
	SancLimit             float64   `bson:"SancLimit"`
	SanctionDate          time.Time `bson:"SanctionDate"`
	SecurityOfNFB         []string  `bson:"SecurityONFB"`
}

type CurrentBased struct {
	AccountType   string `bson:"AccountType"`
	AccountNo     string `bson:"AccountNo"`
	AccountHolder string `bson:"AccountHolder"`
}

type BankAccountV2 struct {
	BankName     string       `bson:"BankName"`
	FacilityType []string     `bson:"FacilityType"`
	BankSttTill  time.Time    `bson:"BankStatementTill"`
	FundBased    FundBased    `bson:"FundBased"`
	NonFundBased NonFundBased `bson:"NonFundBased"`
	CurrentBased CurrentBased `bson:"CurrentBased"`
}

type BankDetails struct {
	Month              time.Time `bson:"Month"`
	CreditNonCash      float64   `bson:"CreditNonCash"`
	CreditCash         float64   `bson:"CreditCash"`
	CreditTotal        float64   `bson:"CreditTotal"`
	DebitNonCash       float64   `bson:"DebitNonCash"`
	DebitCash          float64   `bson:"DebitCash"`
	DebitTotal         float64   `bson:"DebitTotal"`
	AvgBalon           float64   `bson:"AvgBalon"`
	OdCcUtilization    float64   `bson:"OdCcUtilization"`
	OdCcLimit          float64   `bson:"OdCcLimit"`
	ActualInterestPaid float64   `bson:"ActualInterestPaid"`
	NoOfDebit          float64   `bson:"NoOfDebit"`
	NoOfCredit         float64   `bson:"NoOfCredit"`
	OwCheque           float64   `bson:"OwCheque"`
	IwCheque           float64   `bson:"IwCheque"`
}

type CurrentBankDetails struct {
	Month         time.Time `bson:"Month"`
	CreditNonCash float64   `bson:"CreditNonCash"`
	CreditCash    float64   `bson:"CreditCash"`
	CreditTotal   float64   `bson:"CreditTotal"`
	DebitNonCash  float64   `bson:"DebitNonCash"`
	DebitCash     float64   `bson:"DebitCash"`
	DebitTotal    float64   `bson:"DebitTotal"`
	AvgBalon      float64   `bson:"AvgBalon"`
	NoOfDebit     float64   `bson:"NoOfDebit"`
	NoOfCredit    float64   `bson:"NoOfCredit"`
	OwCheque      float64   `bson:"OwCheque"`
	IwCheque      float64   `bson:"IwCheque"`
}

type BankAnalysis struct {
	Id            bson.ObjectId `bson:"_id" , json:"_id" `
	CustomerId    int           `bson:"CustomerId"`
	DealNo        string        `bson:"DealNo"`
	IsConfirmed   bool          `bson:"IsConfirmed"`
	DateConfirmed time.Time     `bson:"DateConfirmed,omitempty"`
	DataBank      []DataBank    `bson:"DataBank"`
	IsFreeze      bool          `bson:"IsFreeze"`
	DateFreeze    time.Time     `bson:"DateFreeze"`
	Status        int           `bson: "Status"`
}

type BankAnalysisV2 struct {
	Id            bson.ObjectId `bson:"_id" , json:"_id" `
	CustomerId    int           `bson:"CustomerId"`
	DealNo        string        `bson:"DealNo"`
	IsConfirmed   bool          `bson:"IsConfirmed"`
	DateConfirmed time.Time     `bson:"DateConfirmed,omitempty"`
	DataBank      []DataBankV2  `bson:"DataBank"`
	IsFreeze      bool          `bson:"IsFreeze"`
	DateFreeze    time.Time     `bson:"DateFreeze"`
	Status        int           `bson: "Status"`
}

type DataBank struct {
	CustomerId  string        `bson:"CustomerId"`
	BankAccount BankAccount   `bson:"BankAccount"`
	BankDetails []BankDetails `bson:"BankDetails"`
}

type DataBankPayLoad struct {
	Id    string
	Param DataBankParam
}

type DataBankPayLoadV2 struct {
	Id    string
	Param DataBankParamV2
}

type DataBankParam struct {
	CustomerId  string
	DealNo      string
	BankAccount BankAccount
	BankDetails []BankDetails
}

type DataBankParamV2 struct {
	CustomerId         string
	DealNo             string
	BankAccount        BankAccountV2
	BankDetails        []BankDetails
	CurrentBankDetails []CurrentBankDetails
}

type DataBankV2 struct {
	CustomerId         string               `bson:"CustomerId"`
	BankAccount        BankAccountV2        `bson:"BankAccount"`
	BankDetails        []BankDetails        `bson:"BankDetails"`
	CurrentBankDetails []CurrentBankDetails `bson:"CurrentBankDetails"`
}

func (b *BankAnalysis) GetData(CustomerId int, DealNo string) ([]BankAnalysis, []Summary, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, nil, err
	}

	res := []BankAnalysis{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", CustomerId))
	wh = append(wh, dbox.Eq("DealNo", DealNo))

	query, err := conn.NewQuery().
		Select().
		From("BankAnalysis").
		Where(wh...).
		Cursor(nil)
	if err != nil {
		return nil, nil, err
	}
	err = query.Fetch(&res, 0, false)
	if err != nil {
		return nil, nil, err
	}
	defer query.Close()

	ressum := b.GenerateBankSummary(res)
	return res, ressum, nil
}

func (b *BankAnalysis) GetDataV2(CustomerId int, DealNo string) ([]BankAnalysisV2, []Summary, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, nil, err
	}

	res := []BankAnalysisV2{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", CustomerId))
	wh = append(wh, dbox.Eq("DealNo", DealNo))

	query, err := conn.NewQuery().
		Select().
		From("BankAnalysisV2").
		Where(wh...).
		Cursor(nil)
	if err != nil {
		return nil, nil, err
	}
	err = query.Fetch(&res, 0, false)
	if err != nil {
		return nil, nil, err
	}
	defer query.Close()

	ressum := b.GenerateBankSummaryV2(res)
	return res, ressum, nil
}

func (b *BankAnalysis) GetDataV2Confirmed(CustomerId int, DealNo string) ([]BankAnalysisV2, []Summary, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, nil, err
	}

	res := []BankAnalysisV2{}

	// wh := []*dbox.Filter{}
	// wh = append(wh, dbox.Eq("CustomerId", CustomerId))
	// wh = append(wh, dbox.Eq("DealNo", DealNo))

	// query, err := conn.NewQuery().
	// 	Select().
	// 	From("BankAnalysisV2").
	// 	Where(wh...).
	// 	Cursor(nil)
	// if err != nil {
	// 	return nil, nil, err
	// }
	// err = query.Fetch(&res, 0, false)
	// if err != nil {
	// 	return nil, nil, err
	// }
	// defer query.Close()

	err = new(DataConfirmController).GetDataConfirmed(cast.ToString(CustomerId), DealNo, "BankAnalysisV2", &res)
	if err != nil {
		return nil, nil, err
	}

	ressum := b.GenerateBankSummaryV2(res)
	return res, ressum, nil
}

func (b *BankAnalysis) GenerateAllSummary(CustomerId string, DealNo string) (*BankAllSummary, error) {
	custid, _ := strconv.ParseInt(CustomerId, 10, 64)
	res, ressum, err := new(BankAnalysis).GetDataV2(int(custid), DealNo)
	if err != nil {
		return nil, err
	}

	BSMonthlyCredits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).TotalCredit
	}).Exec().Result.Sum

	BSMonthlyDebits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).TotalDebit
	}).Exec().Result.Sum

	BSNoOfCredits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).NoOfCredit
	}).Exec().Result.Sum

	BSNoOfDebits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).NoOfDebit
	}).Exec().Result.Sum

	BSOWChequeReturns := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).OwCheque
	}).Exec().Result.Sum

	BSIWChequeReturns := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).IwCheque
	}).Exec().Result.Sum

	BSImpMargin := (func() float64 {
		fm := new(FormulaModel)
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataAccountDetails()
		fm.GetDataBalanceSheet()
		fm.GetRatioFormula()

		customerMargin := fm.AccountDetails.PDCustomerMargin

		period := fm.GetLastAuditedYear()
		rawEbitdaMargin := new(RatioFormula).GetFormulaValue(fm, "EBITDAMARGIN", period)
		ebitdaMargin, _ := strconv.ParseFloat(toolkit.Sprintf("%v", rawEbitdaMargin), 64)

		multiplier := customerMargin / 100
		if ebitdaMargin < customerMargin {
			multiplier = ebitdaMargin
		}

		if fm.AccountDetails.CMISNULL {
			multiplier = ebitdaMargin
		}

		totalCreditMultiplied := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).TotalCredit * multiplier
		}).Exec().Result.Sum

		return totalCreditMultiplied
	})()

	BSIMarginPercent := (func() float64 {
		fm := new(FormulaModel)
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataAccountDetails()
		fm.GetDataBalanceSheet()
		fm.GetRatioFormula()

		customerMargin := fm.AccountDetails.PDCustomerMargin

		period := fm.GetLastAuditedYear()
		rawEbitdaMargin := new(RatioFormula).GetFormulaValue(fm, "EBITDAMARGIN", period)
		ebitdaMargin, _ := strconv.ParseFloat(toolkit.Sprintf("%v", rawEbitdaMargin), 64)
		multiplier := customerMargin / 100
		if ebitdaMargin < customerMargin {
			multiplier = ebitdaMargin
		}

		if fm.AccountDetails.CMISNULL {
			multiplier = ebitdaMargin
		}

		return multiplier
	})()

	TotalOw := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).OwCheque
	}).Exec().Result.Sum

	TotalIw := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).IwCheque
	}).Exec().Result.Sum

	BSOWReturnPercent := toolkit.Div(TotalOw, BSNoOfCredits)

	BSIWReturnPercent := toolkit.Div(TotalIw, BSNoOfDebits)

	BSDRCRRatio := toolkit.Div(BSMonthlyDebits, BSMonthlyCredits)

	ODSactionLimit := crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount

		if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
			return account.FundBased.SancLimit
		}

		return 0
	}).Exec().Result.Sum
	ODUtilizationPercent := crowd.From(&ressum).Avg(func(x interface{}) interface{} {
		return x.(Summary).Utilization
	}).Exec().Result.Avg
	ODAvgUtilization := (func() float64 {
		values := []float64{}

		for _, each := range res {
			account := each.DataBank[0].BankAccount
			details := each.DataBank[0].BankDetails

			if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
				res := crowd.From(&details).Max(func(x interface{}) interface{} {
					avgBalon := x.(BankDetails).AvgBalon
					limit := x.(BankDetails).OdCcLimit
					return toolkit.Div(avgBalon, limit)
				}).Exec().Result.Max

				values = append(values, res.(float64))
			}
		}

		result := crowd.From(&values).Avg(func(x interface{}) interface{} {
			return x.(float64)
		}).Exec().Result.Avg

		if math.IsNaN(result) {
			return 0
		} else {
			return result
		}
	})()

	ODInterestPaid := crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount
		details := x.(BankAnalysisV2).DataBank[0].BankDetails

		if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
			interestPerMonth := account.FundBased.InterestPerMonth
			actualInterestPaidValue := crowd.From(&details).Avg(func(x interface{}) interface{} {
				return x.(BankDetails).ActualInterestPaid
			}).Exec().Result.Avg
			values := []float64{interestPerMonth, actualInterestPaidValue}

			return crowd.From(&values).Max(func(x interface{}) interface{} {
				return x.(float64)
			}).Exec().Result.Max
		}

		return 0
	}).Exec().Result.Sum

	aml := (func() []toolkit.M {
		holder := map[string]toolkit.M{}

		for _, eachAnalysis := range res {
			for _, eachDetail := range eachAnalysis.DataBank[0].BankDetails {
				month := eachDetail.Month.Format("Jan-2006")
				if _, ok := holder[month]; !ok {
					eachHolder := toolkit.M{}
					eachHolder["Month"] = month
					eachHolder["CreditCash"] = eachDetail.CreditCash
					eachHolder["DebitCash"] = eachDetail.DebitCash
					holder[month] = eachHolder
				} else {
					holder[month]["CreditCash"] = holder[month]["CreditCash"].(float64) + eachDetail.CreditCash
					holder[month]["DebitCash"] = holder[month]["DebitCash"].(float64) + eachDetail.DebitCash
				}
			}
		}

		for key, each := range holder {
			ressumTotalCredit := 0.0
			ressumTotalDebit := 0.0

		loopGetTargetRessum:
			for _, eachRessum := range ressum {
				if eachRessum.Month.Format("Jan-2016") == key {
					ressumTotalCredit = eachRessum.TotalCredit
					ressumTotalDebit = eachRessum.TotalDebit
					break loopGetTargetRessum
				}
			}

			each["CreditCashCalc"] = toolkit.Div(each["CreditCash"].(float64), ressumTotalCredit*100.0)
			each["DebitCashCalc"] = toolkit.Div(each["DebitCash"].(float64), ressumTotalDebit*100.0)
		}

		holderArr := []toolkit.M{}
		for _, val := range holder {
			holderArr = append(holderArr, val)
		}
		return holderArr
	})()

	AMLAvgCredits := crowd.From(&aml).Avg(func(x interface{}) interface{} {
		return x.(toolkit.M).GetFloat64("CreditCashCalc")
	}).Exec().Result.Avg
	AMLAvgDebits := crowd.From(&aml).Avg(func(x interface{}) interface{} {
		return x.(toolkit.M).GetFloat64("DebitCashCalc")
	}).Exec().Result.Avg

	ABB := (func() float64 {
		valueParentLeft := float64(0)
		valueParentRight := float64(0)

		for _, each := range res {
			account := each.DataBank[0].BankAccount
			details := each.DataBank[0].BankDetails

			if !strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") {
				valueLeft := crowd.From(&details).Sum(func(x interface{}) interface{} {
					return x.(BankDetails).AvgBalon
				}).Exec().Result.Sum
				valueRight := crowd.From(&details).Sum(func(x interface{}) interface{} {
					if x.(BankDetails).AvgBalon > 0 {
						return 1
					}

					return 0
				}).Exec().Result.Sum

				calculated := toolkit.Div(valueLeft, valueRight)

				valueParentLeft = valueParentLeft + calculated
				if calculated > 0 {
					valueParentRight++
				}
			}
		}

		return toolkit.Div(valueParentLeft, valueParentRight)
	})()

	bank := new(BankAllSummary)
	bank.BSMonthlyCredits = BSMonthlyCredits
	bank.BSMonthlyDebits = BSMonthlyDebits
	bank.BSNoOfCredits = BSNoOfCredits
	bank.BSNoOfDebits = BSNoOfDebits
	bank.BSOWChequeReturns = BSOWChequeReturns
	bank.BSIWChequeReturns = BSIWChequeReturns
	bank.BSImpMargin = BSImpMargin
	bank.BSOWReturnPercent = BSOWReturnPercent
	bank.BSIWReturnPercent = BSIWReturnPercent
	bank.BSDRCRRatio = BSDRCRRatio
	bank.ODSactionLimit = ODSactionLimit
	bank.ODUtilizationPercent = ODUtilizationPercent
	bank.ODAvgUtilization = ODAvgUtilization
	bank.ODInterestPaid = ODInterestPaid
	bank.AMLAvgCredits = AMLAvgCredits
	bank.AMLAvgDebits = AMLAvgDebits
	bank.ABB = ABB
	bank.BSIMarginPercent = BSIMarginPercent

	tk.Println(bank)
	/*bank.BankingToTurnoverRatio = (func() float64 {
		totalCredit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).TotalCredit
		}).Exec().Result.Sum
		sumCreditByTotalCredit := toolkit.Div(totalCredit*12, float64(len(ressum)))

		fm := NewFormulaModel()
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataBalanceSheet()

		sales := (func() float64 {
			res := new(RatioFormula).
				GetValue(fm, "balancesheet", "SALES", fm.GetLastAuditedYear())
			value, _ := strconv.ParseFloat(toolkit.Sprintf("%v", res), 64)

			return value
		})()

		otherIncome := (func() float64 {
			res := new(RatioFormula).
				GetValue(fm, "balancesheet", "OIBI", fm.GetLastAuditedYear())
			value, _ := strconv.ParseFloat(toolkit.Sprintf("%v", res), 64)

			return value
		})()

		return toolkit.Div(sumCreditByTotalCredit, sales+otherIncome) //* 100
	})()

	bank.InwardBounces = (func() float64 {
		totalOwCheque := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).OwCheque
		}).Exec().Result.Sum

		totalNoOfDebit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).NoOfDebit
		}).Exec().Result.Sum

		totalNoOfCredit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).NoOfCredit
		}).Exec().Result.Sum

		res := toolkit.Div(totalOwCheque, totalNoOfDebit)
		if res != 0 {
			res = toolkit.Div(totalOwCheque, totalNoOfCredit)
		}

		return res
	})()

	bank.SactionLimit = crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount
		return account.FundBased.SancLimit
	}).Exec().Result.Sum

	bank.ODCCUtilizationABBvsProposedEMIIsCurrent = (func() bool {
		totalCurrent := 0
		for _, each := range res {
			if each.DataBank[0].BankAccount.FundBased.AccountType == "Current" && containsArr(each.DataBank[0].BankAccount.FacilityType, "Current") {
				totalCurrent++
			}
		}

		return (totalCurrent == len(res))
	})()

	bank.ODCCUtilizationABBvsProposedEMI = (func() float64 {

		if bank.ODCCUtilizationABBvsProposedEMIIsCurrent {
			fm := new(FormulaModel)
			fm.CustomerId = CustomerId
			fm.DealNo = DealNo
			fm.GetDataAccountDetails()

			abb := crowd.From(&res).Avg(func(y interface{}) interface{} {
				details := y.(BankAnalysisV2).DataBank[0].BankDetails

				return crowd.From(&details).Avg(func(x interface{}) interface{} {
					return x.(BankDetails).AvgBalon
				}).Exec().Result.Avg
			}).Exec().Result.Avg

			multiplier := (float64(1) + toolkit.Div(fm.AccountDetails.LDProposedRateInterest, float64(100)))
			left := fm.AccountDetails.LDRequestedLimitAmount * multiplier
			emi := toolkit.Div(left, fm.AccountDetails.LDLimitTenor)
			abbOfEmi := toolkit.Div(abb, emi)

			return abbOfEmi
		} else {
			odValue := crowd.From(&res).Avg(func(y interface{}) interface{} {
				details := y.(BankAnalysisV2).DataBank[0].BankDetails

				return crowd.From(&details).Max(func(x interface{}) interface{} {
					return toolkit.Div(x.(BankDetails).AvgBalon, x.(BankDetails).OdCcLimit)
				}).Exec().Result.Max
			}).Exec().Result.Avg

			return odValue * 100
		}
	})()*/

	return bank, nil
}

func (b *BankAnalysis) GenerateAllSummaryConfirmed(CustomerId string, DealNo string) (*BankAllSummary, error) {
	custid, _ := strconv.ParseInt(CustomerId, 10, 64)
	res, ressum, err := new(BankAnalysis).GetDataV2Confirmed(int(custid), DealNo)
	if err != nil {
		return nil, err
	}

	BSMonthlyCredits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).TotalCredit
	}).Exec().Result.Sum
	BSMonthlyDebits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).TotalDebit
	}).Exec().Result.Sum
	BSNoOfCredits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).NoOfCredit
	}).Exec().Result.Sum
	BSNoOfDebits := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).NoOfDebit
	}).Exec().Result.Sum
	BSOWChequeReturns := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).OwCheque
	}).Exec().Result.Sum
	BSIWChequeReturns := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).IwCheque
	}).Exec().Result.Sum

	BSImpMargin := (func() float64 {
		fm := new(FormulaModel)
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataAccountDetails()
		fm.GetDataBalanceSheet()
		fm.GetRatioFormula()

		customerMargin := fm.AccountDetails.PDCustomerMargin / 100

		period := fm.GetLastAuditedYear()
		rawEbitdaMargin := new(RatioFormula).GetFormulaValue(fm, "EBITDAMARGIN", period)
		ebitdaMargin, _ := strconv.ParseFloat(toolkit.Sprintf("%v", rawEbitdaMargin), 64)

		multiplier := customerMargin
		if ebitdaMargin < customerMargin {
			multiplier = ebitdaMargin
		}

		if fm.AccountDetails.CMISNULL {
			multiplier = ebitdaMargin
		}

		totalCreditMultiplied := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).TotalCredit * multiplier
		}).Exec().Result.Sum

		return totalCreditMultiplied
	})()

	BSIMarginPercent := (func() float64 {
		fm := new(FormulaModel)
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataAccountDetails()
		fm.GetDataBalanceSheet()
		fm.GetRatioFormula()

		customerMargin := fm.AccountDetails.PDCustomerMargin / 100

		period := fm.GetLastAuditedYear()
		rawEbitdaMargin := new(RatioFormula).GetFormulaValue(fm, "EBITDAMARGIN", period)
		ebitdaMargin, _ := strconv.ParseFloat(toolkit.Sprintf("%v", rawEbitdaMargin), 64)
		multiplier := customerMargin
		if ebitdaMargin < customerMargin {
			multiplier = ebitdaMargin
		}

		if fm.AccountDetails.CMISNULL {
			multiplier = ebitdaMargin
		}

		return multiplier
	})()

	// BSOWReturnPercent := crowd.From(&ressum).Avg(func(x interface{}) interface{} {
	// 	return x.(Summary).OwReturnPercentage
	// }).Exec().Result.Avg
	// BSIWReturnPercent := crowd.From(&ressum).Avg(func(x interface{}) interface{} {
	// 	return x.(Summary).LwReturnPercentage
	// }).Exec().Result.Avg
	// BSDRCRRatio := crowd.From(&ressum).Avg(func(x interface{}) interface{} {
	// 	return x.(Summary).DrCrReturnPercentage
	// }).Exec().Result.Avg
	TotalOw := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).OwCheque
	}).Exec().Result.Sum

	TotalIw := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
		return x.(Summary).IwCheque
	}).Exec().Result.Sum

	BSOWReturnPercent := toolkit.Div(TotalOw, BSNoOfCredits)
	// tk.Println(TotalOw, BSNoOfCredits, "----------I")

	BSIWReturnPercent := toolkit.Div(TotalIw, BSNoOfDebits)
	// tk.Println(TotalIw, BSNoOfDebits, "----------II")

	BSDRCRRatio := toolkit.Div(BSMonthlyDebits, BSMonthlyCredits)
	// tk.Println(BSMonthlyDebits, BSMonthlyCredits, "----------III")

	ODSactionLimit := crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount

		if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
			return account.FundBased.SancLimit
		}

		return 0
	}).Exec().Result.Sum
	ODUtilizationPercent := crowd.From(&ressum).Avg(func(x interface{}) interface{} {
		return x.(Summary).Utilization
	}).Exec().Result.Avg
	ODAvgUtilization := (func() float64 {
		values := []float64{}

		for _, each := range res {
			account := each.DataBank[0].BankAccount
			details := each.DataBank[0].BankDetails

			if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
				res := crowd.From(&details).Max(func(x interface{}) interface{} {
					avgBalon := x.(BankDetails).AvgBalon
					limit := x.(BankDetails).OdCcLimit
					return toolkit.Div(avgBalon, limit)
				}).Exec().Result.Max

				values = append(values, res.(float64))
			}
		}

		return crowd.From(&values).Avg(func(x interface{}) interface{} {
			return x.(float64)
		}).Exec().Result.Avg
	})()

	ODInterestPaid := crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount
		details := x.(BankAnalysisV2).DataBank[0].BankDetails

		if strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") && containsArr(account.FacilityType, "Fund Based") {
			interestPerMonth := account.FundBased.InterestPerMonth
			actualInterestPaidValue := crowd.From(&details).Avg(func(x interface{}) interface{} {
				return x.(BankDetails).ActualInterestPaid
			}).Exec().Result.Avg
			values := []float64{interestPerMonth, actualInterestPaidValue}

			return crowd.From(&values).Max(func(x interface{}) interface{} {
				return x.(float64)
			}).Exec().Result.Max
		}

		return 0
	}).Exec().Result.Sum

	aml := (func() []toolkit.M {
		holder := map[string]toolkit.M{}

		for _, eachAnalysis := range res {
			for _, eachDetail := range eachAnalysis.DataBank[0].BankDetails {
				month := eachDetail.Month.Format("Jan-2006")
				if _, ok := holder[month]; !ok {
					eachHolder := toolkit.M{}
					eachHolder["Month"] = month
					eachHolder["CreditCash"] = eachDetail.CreditCash
					eachHolder["DebitCash"] = eachDetail.DebitCash
					holder[month] = eachHolder
				} else {
					holder[month]["CreditCash"] = holder[month]["CreditCash"].(float64) + eachDetail.CreditCash
					holder[month]["DebitCash"] = holder[month]["DebitCash"].(float64) + eachDetail.DebitCash
				}
			}
		}

		for key, each := range holder {
			ressumTotalCredit := 0.0
			ressumTotalDebit := 0.0

		loopGetTargetRessum:
			for _, eachRessum := range ressum {
				if eachRessum.Month.Format("Jan-2016") == key {
					ressumTotalCredit = eachRessum.TotalCredit
					ressumTotalDebit = eachRessum.TotalDebit
					break loopGetTargetRessum
				}
			}

			each["CreditCashCalc"] = toolkit.Div(each["CreditCash"].(float64), ressumTotalCredit*100.0)
			each["DebitCashCalc"] = toolkit.Div(each["DebitCash"].(float64), ressumTotalDebit*100.0)
		}

		holderArr := []toolkit.M{}
		for _, val := range holder {
			holderArr = append(holderArr, val)
		}
		return holderArr
	})()

	AMLAvgCredits := crowd.From(&aml).Avg(func(x interface{}) interface{} {
		return x.(toolkit.M).GetFloat64("CreditCashCalc")
	}).Exec().Result.Avg
	AMLAvgDebits := crowd.From(&aml).Avg(func(x interface{}) interface{} {
		return x.(toolkit.M).GetFloat64("DebitCashCalc")
	}).Exec().Result.Avg

	ABB := (func() float64 {
		valueParentLeft := float64(0)
		valueParentRight := float64(0)

		for _, each := range res {
			// account := each.DataBank[0].BankAccount
			details := each.DataBank[0].CurrentBankDetails

			// if !strings.Contains(strings.ToLower(account.FundBased.AccountType), "od") {
			valueLeft := crowd.From(&details).Sum(func(x interface{}) interface{} {
				return x.(CurrentBankDetails).AvgBalon
			}).Exec().Result.Sum
			valueRight := crowd.From(&details).Sum(func(x interface{}) interface{} {
				if x.(CurrentBankDetails).AvgBalon > 0 {
					return 1
				}

				return 0
			}).Exec().Result.Sum

			calculated := toolkit.Div(valueLeft, valueRight)

			valueParentLeft = valueParentLeft + calculated
			if calculated > 0 {
				valueParentRight++
			}
			// }
		}

		return toolkit.Div(valueParentLeft, valueParentRight)
	})()

	bank := new(BankAllSummary)
	bank.BSMonthlyCredits = CheckNan(BSMonthlyCredits)
	bank.BSMonthlyDebits = CheckNan(BSMonthlyDebits)
	bank.BSNoOfCredits = CheckNan(BSNoOfCredits)
	bank.BSNoOfDebits = CheckNan(BSNoOfDebits)
	bank.BSOWChequeReturns = CheckNan(BSOWChequeReturns)
	bank.BSIWChequeReturns = CheckNan(BSIWChequeReturns)
	bank.BSImpMargin = CheckNan(BSImpMargin)
	bank.BSOWReturnPercent = CheckNan(BSOWReturnPercent)
	bank.BSIWReturnPercent = CheckNan(BSIWReturnPercent)
	bank.BSDRCRRatio = CheckNan(BSDRCRRatio)
	bank.ODSactionLimit = CheckNan(ODSactionLimit)
	bank.ODUtilizationPercent = CheckNan(ODUtilizationPercent)
	bank.ODAvgUtilization = CheckNan(ODAvgUtilization)
	bank.ODInterestPaid = CheckNan(ODInterestPaid)
	bank.AMLAvgCredits = CheckNan(AMLAvgCredits)
	bank.AMLAvgDebits = CheckNan(AMLAvgDebits)
	bank.ABB = CheckNan(ABB)
	bank.BSIMarginPercent = BSIMarginPercent

	bank.BankingToTurnoverRatio = CheckNan((func() float64 {
		totalCredit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).TotalCredit
		}).Exec().Result.Sum
		sumCreditByTotalCredit := toolkit.Div(totalCredit*12, float64(len(ressum)))

		fm := NewFormulaModel()
		fm.CustomerId = CustomerId
		fm.DealNo = DealNo
		fm.GetDataBalanceSheet()

		sales := (func() float64 {
			res := new(RatioFormula).
				GetValue(fm, "balancesheet", "SALES", fm.GetLastAuditedYear())
			value, _ := strconv.ParseFloat(toolkit.Sprintf("%v", res), 64)

			return value
		})()

		otherIncome := (func() float64 {
			res := new(RatioFormula).
				GetValue(fm, "balancesheet", "OIBI", fm.GetLastAuditedYear())
			value, _ := strconv.ParseFloat(toolkit.Sprintf("%v", res), 64)

			return value
		})()

		return toolkit.Div(sumCreditByTotalCredit, sales+otherIncome) //* 100
	})())

	bank.InwardBounces = CheckNan((func() float64 {
		totalOwCheque := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).OwCheque
		}).Exec().Result.Sum

		totalNoOfDebit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).NoOfDebit
		}).Exec().Result.Sum

		totalNoOfCredit := crowd.From(&ressum).Sum(func(x interface{}) interface{} {
			return x.(Summary).NoOfCredit
		}).Exec().Result.Sum

		res := toolkit.Div(totalOwCheque, totalNoOfDebit)
		if res != 0 {
			res = toolkit.Div(totalOwCheque, totalNoOfCredit)
		}

		return res
	})())

	bank.SactionLimit = CheckNan(crowd.From(&res).Sum(func(x interface{}) interface{} {
		account := x.(BankAnalysisV2).DataBank[0].BankAccount
		return account.FundBased.SancLimit
	}).Exec().Result.Sum)

	bank.ODCCUtilizationABBvsProposedEMIIsCurrent = (func() bool {
		totalCurrent := 0
		for _, each := range res {
			if each.DataBank[0].BankAccount.FundBased.AccountType == "Current" && containsArr(each.DataBank[0].BankAccount.FacilityType, "Current") {
				totalCurrent++
			}
		}

		return (totalCurrent == len(res))
	})()

	bank.ODCCUtilizationABBvsProposedEMI = CheckNan((func() float64 {

		if bank.ODCCUtilizationABBvsProposedEMIIsCurrent {
			fm := new(FormulaModel)
			fm.CustomerId = CustomerId
			fm.DealNo = DealNo
			fm.GetDataAccountDetails()

			abb := crowd.From(&res).Avg(func(y interface{}) interface{} {
				details := y.(BankAnalysisV2).DataBank[0].BankDetails

				return crowd.From(&details).Avg(func(x interface{}) interface{} {
					return x.(BankDetails).AvgBalon
				}).Exec().Result.Avg
			}).Exec().Result.Avg

			multiplier := (float64(1) + toolkit.Div(fm.AccountDetails.LDProposedRateInterest, float64(100)))
			left := fm.AccountDetails.LDRequestedLimitAmount * multiplier
			emi := toolkit.Div(left, fm.AccountDetails.LDLimitTenor)
			abbOfEmi := toolkit.Div(abb, emi)

			return abbOfEmi
		} else {
			odValue := crowd.From(&res).Avg(func(y interface{}) interface{} {
				details := y.(BankAnalysisV2).DataBank[0].BankDetails

				return crowd.From(&details).Max(func(x interface{}) interface{} {
					return toolkit.Div(x.(BankDetails).AvgBalon, x.(BankDetails).OdCcLimit)
				}).Exec().Result.Max
			}).Exec().Result.Avg

			return odValue * 100
		}
	})())

	return bank, nil
}

func (b *BankAnalysis) GenerateBankSummary(res []BankAnalysis) []Summary {
	credits := []Credit{}
	debits := []Debit{}
	noofdebits := []NoOfDebit{}
	noofcredits := []NoOfCredit{}
	ows := []TotalOw{}
	iws := []TotalIw{}
	month := Month{}
	Utilization := tk.M{}
	Utilization.Set("0", 0.0)
	Utilization.Set("1", 0.0)
	Utilization.Set("2", 0.0)
	Utilization.Set("3", 0.0)
	Utilization.Set("4", 0.0)
	Utilization.Set("5", 0.0)
	Utilization.Set("0length", 0.0)
	Utilization.Set("1length", 0.0)
	Utilization.Set("2length", 0.0)
	Utilization.Set("3length", 0.0)
	Utilization.Set("4length", 0.0)
	Utilization.Set("5length", 0.0)

	for _, val := range res {
		det := val.DataBank[0].BankDetails
		credit := Credit{}
		debit := Debit{}
		noofdebit := NoOfDebit{}
		noofcredit := NoOfCredit{}
		ow := TotalOw{}
		iw := TotalIw{}

		for i := range det {
			ix := cast.ToString(i)
			valx := toolkit.Div(det[i].AvgBalon, det[i].OdCcLimit)
			if (math.IsInf(valx, 0) || math.IsInf(valx, 0) || math.IsInf(valx, 0)) || math.IsNaN(valx) {
				valx = 0
			}
			Utilization.Set(ix, Utilization.GetFloat64(ix)+valx)
			if valx > 0.0 {
				Utilization.Set(ix+"length", Utilization.GetFloat64(ix+"length")+1)
			}
			if i == 0 {
				credit.TotalMonth1 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth1 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth1 = det[i].NoOfDebit
				noofcredit.TotalMonth1 = det[i].NoOfCredit
				ow.TotalMonth1 = det[i].OwCheque
				iw.TotalMonth1 = det[i].IwCheque
				month.Month1 = det[i].Month
			}
			if i == 1 {
				credit.TotalMonth2 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth2 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth2 = det[i].NoOfDebit
				noofcredit.TotalMonth2 = det[i].NoOfCredit
				ow.TotalMonth2 = det[i].OwCheque
				iw.TotalMonth2 = det[i].IwCheque
				month.Month2 = det[i].Month
			}
			if i == 2 {
				credit.TotalMonth3 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth3 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth3 = det[i].NoOfDebit
				noofcredit.TotalMonth3 = det[i].NoOfCredit
				ow.TotalMonth3 = det[i].OwCheque
				iw.TotalMonth3 = det[i].IwCheque
				month.Month3 = det[i].Month
			}
			if i == 3 {
				credit.TotalMonth4 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth4 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth4 = det[i].NoOfDebit
				noofcredit.TotalMonth4 = det[i].NoOfCredit
				ow.TotalMonth4 = det[i].OwCheque
				iw.TotalMonth4 = det[i].IwCheque
				month.Month4 = det[i].Month
			}
			if i == 4 {
				credit.TotalMonth5 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth5 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth5 = det[i].NoOfDebit
				noofcredit.TotalMonth5 = det[i].NoOfCredit
				ow.TotalMonth5 = det[i].OwCheque
				iw.TotalMonth5 = det[i].IwCheque
				month.Month5 = det[i].Month
			}
			if i == 5 {
				credit.TotalMonth6 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth6 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth6 = det[i].NoOfDebit
				noofcredit.TotalMonth6 = det[i].NoOfCredit
				ow.TotalMonth6 = det[i].OwCheque
				iw.TotalMonth6 = det[i].IwCheque
				month.Month6 = det[i].Month
			}
		}
		credits = append(credits, credit)
		debits = append(debits, debit)
		noofdebits = append(noofdebits, noofdebit)
		noofcredits = append(noofcredits, noofcredit)
		ows = append(ows, ow)
		iws = append(iws, iw)
	}

	ressum := []Summary{}

	totalcred1 := 0.0
	totalcred2 := 0.0
	totalcred3 := 0.0
	totalcred4 := 0.0
	totalcred5 := 0.0
	totalcred6 := 0.0
	totaldeb1 := 0.0
	totaldeb2 := 0.0
	totaldeb3 := 0.0
	totaldeb4 := 0.0
	totaldeb5 := 0.0
	totaldeb6 := 0.0
	totalnoofdeb1 := 0.0
	totalnoofdeb2 := 0.0
	totalnoofdeb3 := 0.0
	totalnoofdeb4 := 0.0
	totalnoofdeb5 := 0.0
	totalnoofdeb6 := 0.0
	totalnoofcred1 := 0.0
	totalnoofcred2 := 0.0
	totalnoofcred3 := 0.0
	totalnoofcred4 := 0.0
	totalnoofcred5 := 0.0
	totalnoofcred6 := 0.0
	totalows1 := 0.0
	totalows2 := 0.0
	totalows3 := 0.0
	totalows4 := 0.0
	totalows5 := 0.0
	totalows6 := 0.0
	totaliws1 := 0.0
	totaliws2 := 0.0
	totaliws3 := 0.0
	totaliws4 := 0.0
	totaliws5 := 0.0
	totaliws6 := 0.0

	for i := 0; i < len(credits); i++ {
		totalcred1 = totalcred1 + credits[i].TotalMonth1
		totalcred2 = totalcred2 + credits[i].TotalMonth2
		totalcred3 = totalcred3 + credits[i].TotalMonth3
		totalcred4 = totalcred4 + credits[i].TotalMonth4
		totalcred5 = totalcred5 + credits[i].TotalMonth5
		totalcred6 = totalcred6 + credits[i].TotalMonth6
	}
	for i := 0; i < len(debits); i++ {
		totaldeb1 = totaldeb1 + debits[i].TotalMonth1
		totaldeb2 = totaldeb2 + debits[i].TotalMonth2
		totaldeb3 = totaldeb3 + debits[i].TotalMonth3
		totaldeb4 = totaldeb4 + debits[i].TotalMonth4
		totaldeb5 = totaldeb5 + debits[i].TotalMonth5
		totaldeb6 = totaldeb6 + debits[i].TotalMonth6
	}
	for i := 0; i < len(noofdebits); i++ {
		totalnoofdeb1 = totalnoofdeb1 + noofdebits[i].TotalMonth1
		totalnoofdeb2 = totalnoofdeb2 + noofdebits[i].TotalMonth2
		totalnoofdeb3 = totalnoofdeb3 + noofdebits[i].TotalMonth3
		totalnoofdeb4 = totalnoofdeb4 + noofdebits[i].TotalMonth4
		totalnoofdeb5 = totalnoofdeb5 + noofdebits[i].TotalMonth5
		totalnoofdeb6 = totalnoofdeb6 + noofdebits[i].TotalMonth6
	}
	for i := 0; i < len(noofcredits); i++ {
		totalnoofcred1 = totalnoofcred1 + noofcredits[i].TotalMonth1
		totalnoofcred2 = totalnoofcred2 + noofcredits[i].TotalMonth2
		totalnoofcred3 = totalnoofcred3 + noofcredits[i].TotalMonth3
		totalnoofcred4 = totalnoofcred4 + noofcredits[i].TotalMonth4
		totalnoofcred5 = totalnoofcred5 + noofcredits[i].TotalMonth5
		totalnoofcred6 = totalnoofcred6 + noofcredits[i].TotalMonth6
	}
	for i := 0; i < len(ows); i++ {
		totalows1 = totalows1 + ows[i].TotalMonth1
		totalows2 = totalows2 + ows[i].TotalMonth2
		totalows3 = totalows3 + ows[i].TotalMonth3
		totalows4 = totalows4 + ows[i].TotalMonth4
		totalows5 = totalows5 + ows[i].TotalMonth5
		totalows6 = totalows6 + ows[i].TotalMonth6
	}
	for i := 0; i < len(iws); i++ {
		totaliws1 = totaliws1 + iws[i].TotalMonth1
		totaliws2 = totaliws2 + iws[i].TotalMonth2
		totaliws3 = totaliws3 + iws[i].TotalMonth3
		totaliws4 = totaliws4 + iws[i].TotalMonth4
		totaliws5 = totaliws5 + iws[i].TotalMonth5
		totaliws6 = totaliws6 + iws[i].TotalMonth6
	}
	if len(res) > 0 {
		for i := 0; i < 6; i++ {
			summary := Summary{}
			ix := cast.ToString(i)
			length := Utilization.GetFloat64(ix + "length")
			if length == 0 {
				length = 1
			}
			avg := toolkit.Div(Utilization.GetFloat64(ix), length)
			if (math.IsInf(avg, 0) || math.IsInf(avg, 0) || math.IsInf(avg, 0)) || math.IsNaN(avg) {
				avg = 0
			}
			summary.Utilization = avg
			if i == 0 {
				summary.Month = month.Month1
				summary.TotalCredit = totalcred1
				summary.TotalDebit = totaldeb1
				summary.NoOfCredit = totalnoofcred1
				summary.NoOfDebit = totalnoofdeb1
				summary.OwCheque = totalows1
				summary.IwCheque = totaliws1
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred1 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows1, totalnoofcred1)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb1 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws1, totalnoofdeb1)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred1 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb1, totalcred1)
				}
				ressum = append(ressum, summary)
			}
			if i == 1 {
				summary.Month = month.Month2
				summary.TotalCredit = totalcred2
				summary.TotalDebit = totaldeb2
				summary.NoOfCredit = totalnoofcred2
				summary.NoOfDebit = totalnoofdeb2
				summary.OwCheque = totalows2
				summary.IwCheque = totaliws2
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred2 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows2, totalnoofcred2)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb2 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws2, totalnoofdeb2)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred2 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb2, totalcred2)
				}
				ressum = append(ressum, summary)
			}
			if i == 2 {
				summary.Month = month.Month3
				summary.TotalCredit = totalcred3
				summary.TotalDebit = totaldeb3
				summary.NoOfCredit = totalnoofcred3
				summary.NoOfDebit = totalnoofdeb3
				summary.OwCheque = totalows3
				summary.IwCheque = totaliws3
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred3 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows3, totalnoofcred3)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb3 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws3, totalnoofdeb3)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred3 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb3, totalcred3)
				}
				ressum = append(ressum, summary)
			}
			if i == 3 {
				summary.Month = month.Month4
				summary.TotalCredit = totalcred4
				summary.TotalDebit = totaldeb4
				summary.NoOfCredit = totalnoofcred4
				summary.NoOfDebit = totalnoofdeb4
				summary.OwCheque = totalows4
				summary.IwCheque = totaliws4
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred4 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows4, totalnoofcred4)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb4 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws4, totalnoofdeb4)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred4 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb4, totalcred4)
				}
				ressum = append(ressum, summary)
			}
			if i == 4 {
				summary.Month = month.Month5
				summary.TotalCredit = totalcred5
				summary.TotalDebit = totaldeb5
				summary.NoOfCredit = totalnoofcred5
				summary.NoOfDebit = totalnoofdeb5
				summary.OwCheque = totalows5
				summary.IwCheque = totaliws5
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred5 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows5, totalnoofcred5)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb5 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws5, totalnoofdeb5)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred5 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb5, totalcred5)
				}
				ressum = append(ressum, summary)
			}
			if i == 5 {
				summary.Month = month.Month6
				summary.TotalCredit = totalcred6
				summary.TotalDebit = totaldeb6
				summary.NoOfCredit = totalnoofcred6
				summary.NoOfDebit = totalnoofdeb6
				summary.OwCheque = totalows6
				summary.IwCheque = totaliws6
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred6 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows6, totalnoofcred6)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb6 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws6, totalnoofdeb6)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred6 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb6, totalcred6)
				}
				ressum = append(ressum, summary)
			}
		}
	}

	return ressum
}

func (b *BankAnalysis) GenerateBankSummaryV2(res []BankAnalysisV2) []Summary {
	credits := []Credit{}
	debits := []Debit{}
	noofdebits := []NoOfDebit{}
	noofcredits := []NoOfCredit{}
	ows := []TotalOw{}
	iws := []TotalIw{}
	month := Month{}
	Utilization := tk.M{}
	Utilization.Set("0", 0.0)
	Utilization.Set("1", 0.0)
	Utilization.Set("2", 0.0)
	Utilization.Set("3", 0.0)
	Utilization.Set("4", 0.0)
	Utilization.Set("5", 0.0)
	Utilization.Set("0length", 0.0)
	Utilization.Set("1length", 0.0)
	Utilization.Set("2length", 0.0)
	Utilization.Set("3length", 0.0)
	Utilization.Set("4length", 0.0)
	Utilization.Set("5length", 0.0)

	for _, val := range res {
		det := val.DataBank[0].BankDetails
		cur := val.DataBank[0].CurrentBankDetails
		credit := Credit{}
		debit := Debit{}
		noofdebit := NoOfDebit{}
		noofcredit := NoOfCredit{}
		ow := TotalOw{}
		iw := TotalIw{}

		for i := range det {
			ix := cast.ToString(i)
			valx := toolkit.Div(det[i].AvgBalon, det[i].OdCcLimit)
			if (math.IsInf(valx, 0) || math.IsInf(valx, 0) || math.IsInf(valx, 0)) || math.IsNaN(valx) {
				valx = 0
			}
			Utilization.Set(ix, Utilization.GetFloat64(ix)+valx)
			if valx > 0.0 {
				Utilization.Set(ix+"length", Utilization.GetFloat64(ix+"length")+1)
			}
			if i == 0 {
				credit.TotalMonth1 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth1 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth1 = det[i].NoOfDebit
				noofcredit.TotalMonth1 = det[i].NoOfCredit
				ow.TotalMonth1 = det[i].OwCheque
				iw.TotalMonth1 = det[i].IwCheque
				month.Month1 = det[i].Month

				credit.TotalMonth1 = credit.TotalMonth1 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth1 = debit.TotalMonth1 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth1 = noofdebit.TotalMonth1 + cur[i].NoOfDebit
				noofcredit.TotalMonth1 = noofcredit.TotalMonth1 + cur[i].NoOfCredit
				ow.TotalMonth1 = ow.TotalMonth1 + cur[i].OwCheque
				iw.TotalMonth1 = iw.TotalMonth1 + cur[i].IwCheque
			}
			if i == 1 {
				credit.TotalMonth2 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth2 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth2 = det[i].NoOfDebit
				noofcredit.TotalMonth2 = det[i].NoOfCredit
				ow.TotalMonth2 = det[i].OwCheque
				iw.TotalMonth2 = det[i].IwCheque
				month.Month2 = det[i].Month

				credit.TotalMonth2 = credit.TotalMonth2 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth2 = debit.TotalMonth2 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth2 = noofdebit.TotalMonth2 + cur[i].NoOfDebit
				noofcredit.TotalMonth2 = noofcredit.TotalMonth2 + cur[i].NoOfCredit
				ow.TotalMonth2 = ow.TotalMonth2 + cur[i].OwCheque
				iw.TotalMonth2 = iw.TotalMonth2 + cur[i].IwCheque
			}
			if i == 2 {
				credit.TotalMonth3 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth3 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth3 = det[i].NoOfDebit
				noofcredit.TotalMonth3 = det[i].NoOfCredit
				ow.TotalMonth3 = det[i].OwCheque
				iw.TotalMonth3 = det[i].IwCheque
				month.Month3 = det[i].Month

				credit.TotalMonth3 = credit.TotalMonth3 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth3 = debit.TotalMonth3 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth3 = noofdebit.TotalMonth3 + cur[i].NoOfDebit
				noofcredit.TotalMonth3 = noofcredit.TotalMonth3 + cur[i].NoOfCredit
				ow.TotalMonth3 = ow.TotalMonth3 + cur[i].OwCheque
				iw.TotalMonth3 = iw.TotalMonth3 + cur[i].IwCheque
			}
			if i == 3 {
				credit.TotalMonth4 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth4 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth4 = det[i].NoOfDebit
				noofcredit.TotalMonth4 = det[i].NoOfCredit
				ow.TotalMonth4 = det[i].OwCheque
				iw.TotalMonth4 = det[i].IwCheque
				month.Month4 = det[i].Month

				credit.TotalMonth4 = credit.TotalMonth4 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth4 = debit.TotalMonth4 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth4 = noofdebit.TotalMonth4 + cur[i].NoOfDebit
				noofcredit.TotalMonth4 = noofcredit.TotalMonth4 + cur[i].NoOfCredit
				ow.TotalMonth4 = ow.TotalMonth4 + cur[i].OwCheque
				iw.TotalMonth4 = iw.TotalMonth4 + cur[i].IwCheque
			}
			if i == 4 {
				credit.TotalMonth5 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth5 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth5 = det[i].NoOfDebit
				noofcredit.TotalMonth5 = det[i].NoOfCredit
				ow.TotalMonth5 = det[i].OwCheque
				iw.TotalMonth5 = det[i].IwCheque
				month.Month5 = det[i].Month

				credit.TotalMonth5 = credit.TotalMonth5 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth5 = debit.TotalMonth5 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth5 = noofdebit.TotalMonth5 + cur[i].NoOfDebit
				noofcredit.TotalMonth5 = noofcredit.TotalMonth5 + cur[i].NoOfCredit
				ow.TotalMonth5 = ow.TotalMonth5 + cur[i].OwCheque
				iw.TotalMonth5 = iw.TotalMonth5 + cur[i].IwCheque
			}
			if i == 5 {
				credit.TotalMonth6 = det[i].CreditNonCash + det[i].CreditCash
				debit.TotalMonth6 = det[i].DebitNonCash + det[i].DebitCash
				noofdebit.TotalMonth6 = det[i].NoOfDebit
				noofcredit.TotalMonth6 = det[i].NoOfCredit
				ow.TotalMonth6 = det[i].OwCheque
				iw.TotalMonth6 = det[i].IwCheque
				month.Month6 = det[i].Month

				credit.TotalMonth6 = credit.TotalMonth6 + cur[i].CreditNonCash + cur[i].CreditCash
				debit.TotalMonth6 = debit.TotalMonth6 + cur[i].DebitNonCash + cur[i].DebitCash
				noofdebit.TotalMonth6 = noofdebit.TotalMonth6 + cur[i].NoOfDebit
				noofcredit.TotalMonth6 = noofcredit.TotalMonth6 + cur[i].NoOfCredit
				ow.TotalMonth6 = ow.TotalMonth6 + cur[i].OwCheque
				iw.TotalMonth6 = iw.TotalMonth6 + cur[i].IwCheque
			}
		}

		credits = append(credits, credit)
		debits = append(debits, debit)
		noofdebits = append(noofdebits, noofdebit)
		noofcredits = append(noofcredits, noofcredit)
		ows = append(ows, ow)
		iws = append(iws, iw)
	}

	ressum := []Summary{}

	totalcred1 := 0.0
	totalcred2 := 0.0
	totalcred3 := 0.0
	totalcred4 := 0.0
	totalcred5 := 0.0
	totalcred6 := 0.0
	totaldeb1 := 0.0
	totaldeb2 := 0.0
	totaldeb3 := 0.0
	totaldeb4 := 0.0
	totaldeb5 := 0.0
	totaldeb6 := 0.0
	totalnoofdeb1 := 0.0
	totalnoofdeb2 := 0.0
	totalnoofdeb3 := 0.0
	totalnoofdeb4 := 0.0
	totalnoofdeb5 := 0.0
	totalnoofdeb6 := 0.0
	totalnoofcred1 := 0.0
	totalnoofcred2 := 0.0
	totalnoofcred3 := 0.0
	totalnoofcred4 := 0.0
	totalnoofcred5 := 0.0
	totalnoofcred6 := 0.0
	totalows1 := 0.0
	totalows2 := 0.0
	totalows3 := 0.0
	totalows4 := 0.0
	totalows5 := 0.0
	totalows6 := 0.0
	totaliws1 := 0.0
	totaliws2 := 0.0
	totaliws3 := 0.0
	totaliws4 := 0.0
	totaliws5 := 0.0
	totaliws6 := 0.0

	for i := 0; i < len(credits); i++ {
		totalcred1 = totalcred1 + credits[i].TotalMonth1
		totalcred2 = totalcred2 + credits[i].TotalMonth2
		totalcred3 = totalcred3 + credits[i].TotalMonth3
		totalcred4 = totalcred4 + credits[i].TotalMonth4
		totalcred5 = totalcred5 + credits[i].TotalMonth5
		totalcred6 = totalcred6 + credits[i].TotalMonth6
	}
	for i := 0; i < len(debits); i++ {
		totaldeb1 = totaldeb1 + debits[i].TotalMonth1
		totaldeb2 = totaldeb2 + debits[i].TotalMonth2
		totaldeb3 = totaldeb3 + debits[i].TotalMonth3
		totaldeb4 = totaldeb4 + debits[i].TotalMonth4
		totaldeb5 = totaldeb5 + debits[i].TotalMonth5
		totaldeb6 = totaldeb6 + debits[i].TotalMonth6
	}
	for i := 0; i < len(noofdebits); i++ {
		totalnoofdeb1 = totalnoofdeb1 + noofdebits[i].TotalMonth1
		totalnoofdeb2 = totalnoofdeb2 + noofdebits[i].TotalMonth2
		totalnoofdeb3 = totalnoofdeb3 + noofdebits[i].TotalMonth3
		totalnoofdeb4 = totalnoofdeb4 + noofdebits[i].TotalMonth4
		totalnoofdeb5 = totalnoofdeb5 + noofdebits[i].TotalMonth5
		totalnoofdeb6 = totalnoofdeb6 + noofdebits[i].TotalMonth6
	}
	for i := 0; i < len(noofcredits); i++ {
		totalnoofcred1 = totalnoofcred1 + noofcredits[i].TotalMonth1
		totalnoofcred2 = totalnoofcred2 + noofcredits[i].TotalMonth2
		totalnoofcred3 = totalnoofcred3 + noofcredits[i].TotalMonth3
		totalnoofcred4 = totalnoofcred4 + noofcredits[i].TotalMonth4
		totalnoofcred5 = totalnoofcred5 + noofcredits[i].TotalMonth5
		totalnoofcred6 = totalnoofcred6 + noofcredits[i].TotalMonth6
	}
	for i := 0; i < len(ows); i++ {
		totalows1 = totalows1 + ows[i].TotalMonth1
		totalows2 = totalows2 + ows[i].TotalMonth2
		totalows3 = totalows3 + ows[i].TotalMonth3
		totalows4 = totalows4 + ows[i].TotalMonth4
		totalows5 = totalows5 + ows[i].TotalMonth5
		totalows6 = totalows6 + ows[i].TotalMonth6
	}
	for i := 0; i < len(iws); i++ {
		totaliws1 = totaliws1 + iws[i].TotalMonth1
		totaliws2 = totaliws2 + iws[i].TotalMonth2
		totaliws3 = totaliws3 + iws[i].TotalMonth3
		totaliws4 = totaliws4 + iws[i].TotalMonth4
		totaliws5 = totaliws5 + iws[i].TotalMonth5
		totaliws6 = totaliws6 + iws[i].TotalMonth6
	}
	if len(res) > 0 {
		for i := 0; i < 6; i++ {
			summary := Summary{}
			ix := cast.ToString(i)
			length := Utilization.GetFloat64(ix + "length")
			if length == 0 {
				length = 1
			}
			avg := toolkit.Div(Utilization.GetFloat64(ix), length)
			if (math.IsInf(avg, 0) || math.IsInf(avg, 0) || math.IsInf(avg, 0)) || math.IsNaN(avg) {
				avg = 0
			}
			summary.Utilization = avg
			if i == 0 {
				summary.Month = month.Month1
				summary.TotalCredit = totalcred1
				summary.TotalDebit = totaldeb1
				summary.NoOfCredit = totalnoofcred1
				summary.NoOfDebit = totalnoofdeb1
				summary.OwCheque = totalows1
				summary.IwCheque = totaliws1
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred1 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows1, totalnoofcred1)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb1 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws1, totalnoofdeb1)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred1 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb1, totalcred1)
				}
				ressum = append(ressum, summary)
			}
			if i == 1 {
				summary.Month = month.Month2
				summary.TotalCredit = totalcred2
				summary.TotalDebit = totaldeb2
				summary.NoOfCredit = totalnoofcred2
				summary.NoOfDebit = totalnoofdeb2
				summary.OwCheque = totalows2
				summary.IwCheque = totaliws2
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred2 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows2, totalnoofcred2)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb2 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws2, totalnoofdeb2)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred2 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb2, totalcred2)
				}
				ressum = append(ressum, summary)
			}
			if i == 2 {
				summary.Month = month.Month3
				summary.TotalCredit = totalcred3
				summary.TotalDebit = totaldeb3
				summary.NoOfCredit = totalnoofcred3
				summary.NoOfDebit = totalnoofdeb3
				summary.OwCheque = totalows3
				summary.IwCheque = totaliws3
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred3 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows3, totalnoofcred3)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb3 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws3, totalnoofdeb3)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred3 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb3, totalcred3)
				}
				ressum = append(ressum, summary)
			}
			if i == 3 {
				summary.Month = month.Month4
				summary.TotalCredit = totalcred4
				summary.TotalDebit = totaldeb4
				summary.NoOfCredit = totalnoofcred4
				summary.NoOfDebit = totalnoofdeb4
				summary.OwCheque = totalows4
				summary.IwCheque = totaliws4
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred4 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows4, totalnoofcred4)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb4 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws4, totalnoofdeb4)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred4 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb4, totalcred4)
				}
				ressum = append(ressum, summary)
			}
			if i == 4 {
				summary.Month = month.Month5
				summary.TotalCredit = totalcred5
				summary.TotalDebit = totaldeb5
				summary.NoOfCredit = totalnoofcred5
				summary.NoOfDebit = totalnoofdeb5
				summary.OwCheque = totalows5
				summary.IwCheque = totaliws5
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred5 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows5, totalnoofcred5)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb5 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws5, totalnoofdeb5)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred5 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb5, totalcred5)
				}
				ressum = append(ressum, summary)
			}
			if i == 5 {
				summary.Month = month.Month6
				summary.TotalCredit = totalcred6
				summary.TotalDebit = totaldeb6
				summary.NoOfCredit = totalnoofcred6
				summary.NoOfDebit = totalnoofdeb6
				summary.OwCheque = totalows6
				summary.IwCheque = totaliws6
				summary.ImpMargin = 0
				summary.OwReturnPercentage = 0
				if totalnoofcred6 > 0 {
					summary.OwReturnPercentage = toolkit.Div(totalows6, totalnoofcred6)
				}
				summary.LwReturnPercentage = 0
				if totalnoofdeb6 > 0 {
					summary.LwReturnPercentage = toolkit.Div(totaliws6, totalnoofdeb6)
				}
				summary.DrCrReturnPercentage = 0
				if totalcred6 > 0 {
					summary.DrCrReturnPercentage = toolkit.Div(totaldeb6, totalcred6)
				}
				ressum = append(ressum, summary)
			}
		}
	}

	return ressum
}

func (b *BankAnalysisV2) DeleteById(id string) error {
	conn, err := GetConnection()
	defer conn.Close()

	if err != nil {
		return err
	}

	err = conn.NewQuery().
		Where(dbox.Eq("_id", bson.ObjectIdHex(id))).
		Delete().
		From("BankAnalysisV2").
		Exec(nil)

	if err != nil {
		return err
	}

	return err
}

func containsArr(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
