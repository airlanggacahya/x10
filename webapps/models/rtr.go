package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/cast"
	"github.com/eaciit/crowd"
	db "github.com/eaciit/dbox"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"math"
	"strconv"
	"strings"
	"time"
)

type MonthRtr struct {
	Title time.Time
	Value string
}

type RTRBottom struct {
	Id              bson.ObjectId `bson:"_id",json:"_id"`
	SNo             string        `bson:"SNo"`
	CustomerId      string        `bson:"CustomerId"`
	DealNo          string        `bson:"DealNo"`
	Bank            string        `bson:"Bank"`
	TypeOfLoan      string        `bson:"TypeOfLoan"`
	BSLStatus       string        `bson:"BSLStatus"`
	LoanStatus      string        `bson:"LoanStatus"`
	Amount          float64       `bson:"Amount"`
	POS             float64       `bson:"POS"`
	EMI             float64       `bson:"EMI"`
	LoanTenor       int64         `bson:"LoanTenor"`
	LoanStart       time.Time     `bson:"LoanStart"`
	LoanEnd         time.Time     `bson:"LoanEnd"`
	YearlyRepayment float64
	EMIDue          int64      `bson:"EMIDue"`
	EMIBalance      int64      `bson:"EMIBalance"`
	Months          []MonthRtr `bson:"Month"`
	IsBankAnalys    bool       `bson:"IsBankAnalys"`
	Confirmed       bool       `bson:"Confirmed,omitempty"`
	DateConfirmed   time.Time  `bson:"DateConfirmed,omitempty"`
	Bounces         int64      `bson:"Bounce,omitempty"`
}

// ======= RTR

type RTRSummary struct {
	TotalObligationPOS   float64
	TotalObligationEMI   float64
	CloseWithin3MonthPOS float64
	CloseWithin3MonthEMI float64
	PBSLPOS              float64
	PBSLEMI              float64
	BalancePOS           float64
	BalanceEMI           float64
	TCLPOS               float64 // Total Considered Liability
	TCLEMI               float64
	DPLAmountOfLimit     float64 // Detail of Proposed Loan
	DPLCustMargin        float64
	DPLTenor             float64
	DPLROI               float64
	X10ExistingPOS       float64
	X10IntObligation     float64
	YearlyRepayment      float64
	EMI                  float64
	DPDTrack             int32
	SumBounces           int64
	SumExtenalYearly     float64
}

func (r *RTRBottom) GetData(custid, dealno string) ([]RTRBottom, *RTRSummary, error) {
	arr := []RTRBottom{}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return nil, nil, em
	}

	query := []*db.Filter{}
	query = append(query, db.And(
		db.Eq("CustomerId", custid),
		db.Eq("DealNo", dealno)))
	csr, err := cMongo.NewQuery().
		From("RepaymentRecords").
		Where(query...).
		Cursor(nil)
	if err != nil {
		return nil, nil, err
	}
	defer csr.Close()
	if csr != nil {
		err = csr.Fetch(&arr, 0, false)

		if err != nil {
			return nil, nil, err
		}
	} else if err != nil {
		return nil, nil, err
	}

	customerId, _ := strconv.Atoi(strings.TrimSpace(custid))

	if len(arr) == 0 && custid != "" {

		arr = []RTRBottom{}

		bankAnalys := []BankAnalysisV2{}

		query = append(query[0:0], db.And(db.Eq("CustomerId", customerId), db.Eq("DealNo", dealno)))
		csr, err := cMongo.NewQuery().
			From("BankAnalysisV2").
			Where(query...).
			Cursor(nil)

		if err != nil {
			return nil, nil, err
		}

		err = csr.Fetch(&bankAnalys, 0, false)
		if err != nil {
			return nil, nil, err
		}

		if len(bankAnalys) > 0 {
			qinsert := cMongo.NewQuery().
				From("RepaymentRecords").
				SetConfig("multiexec", true).
				Save()

			for _, bank := range bankAnalys {
				for _, val := range bank.DataBank {
					ar := RTRBottom{}
					ar.SNo = ""
					ar.CustomerId = custid
					ar.DealNo = dealno
					ar.Bank = val.BankAccount.BankName
					ar.TypeOfLoan = val.BankAccount.FundBased.AccountType
					ar.BSLStatus = ""
					ar.LoanStatus = ""
					ar.Amount = val.BankAccount.FundBased.SancLimit
					ar.POS = val.BankAccount.FundBased.SancLimit
					ar.EMI = val.BankAccount.FundBased.InterestPerMonth * 100000
					//ar.EMIBalance = 0.0
					ar.LoanTenor = 0
					ar.LoanStart = cast.String2Date("0000-00-00", "yyyy-MM-dd")
					ar.LoanEnd = cast.String2Date("0000-00-00", "yyyy-MM-dd")
					//ar.EMIDue = 0.0
					ar.Id = bson.NewObjectId()
					ar.IsBankAnalys = true

					month := MonthRtr{val.BankDetails[0].Month, ""}
					ar.Months = append(ar.Months, month)

					month = MonthRtr{val.BankDetails[1].Month, ""}
					ar.Months = append(ar.Months, month)

					month = MonthRtr{val.BankDetails[2].Month, ""}
					ar.Months = append(ar.Months, month)

					month = MonthRtr{val.BankDetails[3].Month, ""}
					ar.Months = append(ar.Months, month)

					month = MonthRtr{val.BankDetails[4].Month, ""}
					ar.Months = append(ar.Months, month)

					month = MonthRtr{val.BankDetails[5].Month, ""}
					ar.Months = append(ar.Months, month)

					arr = append(arr, ar)

					insdata := map[string]interface{}{"data": ar}
					em = qinsert.Exec(insdata)
					if em != nil {
						return nil, nil, em
					}
				}
			}
		}
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, nil, err
	}

	query = append(query[0:0], db.And(db.Eq("customerid", custid), db.Eq("dealno", dealno)))
	csr, err = conn.NewQuery().From(new(AccountDetail).TableName()).Where(query...).Cursor(nil)
	if err != nil {
		return nil, nil, err
	}
	accoutDetails := AccountDetail{}
	err = csr.Fetch(&accoutDetails, 1, true)
	if err != nil {
		tk.Println("fetch error on account details part", err.Error())
		// return nil, nil, err
	}

	query = append(query[0:0], db.And(db.Eq("applicantdetail.CustomerID", customerId), db.Eq("applicantdetail.DealNo", dealno)))
	csr, err = conn.NewQuery().From(new(CustomerProfiles).TableName()).Where(query...).Cursor(nil)
	if err != nil {
		return nil, nil, err
	}
	customerProfiles := CustomerProfiles{}
	err = csr.Fetch(&customerProfiles, 1, true)
	if err != nil {
		tk.Println("fetch error on customer profile", err.Error())
		// return nil, nil, err
	}

	smry := new(RTRSummary)

	if len(arr) > 0 {
		for k, v := range arr {
			var minDate time.Time

			if accoutDetails.AccountSetupDetails.LoginDate.IsZero() {
				if !v.LoanEnd.IsZero() {
					minDate = v.LoanEnd
				}
			} else if v.LoanEnd.IsZero() {
				minDate = accoutDetails.AccountSetupDetails.LoginDate
			} else {
				if accoutDetails.AccountSetupDetails.LoginDate.Before(v.LoanEnd) {
					minDate = accoutDetails.AccountSetupDetails.LoginDate
				} else {
					minDate = v.LoanEnd
				}
			}

			if !minDate.IsZero() && !v.LoanStart.IsZero() {
				year, month, _, _, _, _ := diff(minDate, v.LoanStart)

				allmonth := month
				allmonth += year * 12

				arr[k].EMIDue = int64(allmonth)

				// if minDate.Year() == v.LoanStart.Year() {
				// 	arr[k].EMIDue = int64(minDate.Month()) - int64(v.LoanStart.Month())
				// } else {
				// 	sub := int64(minDate.Sub(v.LoanStart).Hours())
				// 	arr[k].EMIDue = int64(sub / (24 * 30))
				// }
			}

			arr[k].EMIBalance = arr[k].LoanTenor - arr[k].EMIDue

			result := 0.0
			if strings.TrimSpace(strings.ToLower(v.LoanStatus)) == "live" {
				if strings.TrimSpace(strings.ToLower(v.TypeOfLoan)) == "od/cc" || strings.TrimSpace(strings.ToLower(v.TypeOfLoan)) == "bill discounting" || strings.TrimSpace(strings.ToLower(v.TypeOfLoan)) == "letter of credit" || arr[k].EMIBalance >= 12 {
					result = v.EMI * 12
				} else if arr[k].EMIBalance < 12 {
					result = v.EMI * float64(arr[k].EMIBalance)
				}

				arr[k].YearlyRepayment = result / 100000
			} else {
				arr[k].YearlyRepayment = result
			}

			if strings.TrimSpace(strings.ToLower(v.LoanStatus)) == "live" {
				if v.Amount > 0 && arr[k].EMIBalance > 0 && v.LoanTenor > 0 {
					err, rate := r.FindRate(v.Amount, v.EMI, v.LoanTenor)
					if err != nil {
						return nil, nil, err
					}
					tk.Println(rate, "=====rate")
					POS := tk.Div(v.EMI*(1-math.Pow((1+rate), -float64(arr[k].EMIBalance))), rate)
					arr[k].POS = POS / 100000
				} else {
					arr[k].POS = 0
				}
			} else {
				arr[k].POS = 0
			}

		}

		summary := r.CalculateSummary(arr)

		divider := 100000.0
		x10IntObligation := (accoutDetails.LoanDetails.InterestOutgo * divider)
		yearlyRepaymentCalc := (x10IntObligation / divider) + summary.GetFloat64("SumExtenalYearly")
		TCLPOS := (summary.GetFloat64("POSInLacs") - summary.GetFloat64("EMIBalance3Month")) + accoutDetails.LoanDetails.RequestedLimitAmount
		TCLEMI := (summary.GetFloat64("EMIInLacs") - summary.GetFloat64("EMI3Month")) + (x10IntObligation / divider)

		x10ExistingPOS := 0.0 // UNKNOWN FORMULA
		dPLCustMargin := 0.0  // UNKNOWN FORMULA

		smry.TotalObligationPOS = summary.GetFloat64("POSInLacs")
		smry.TotalObligationEMI = summary.GetFloat64("EMIInLacs")
		smry.CloseWithin3MonthPOS = summary.GetFloat64("EMIBalance3Month")
		smry.CloseWithin3MonthEMI = summary.GetFloat64("EMI3Month")
		smry.PBSLPOS = summary.GetFloat64("PosPBSL")
		smry.PBSLEMI = summary.GetFloat64("EmiPBSL")
		smry.BalancePOS = summary.GetFloat64("PosBalance")
		smry.BalanceEMI = summary.GetFloat64("EmiBalance")
		smry.DPLAmountOfLimit = accoutDetails.LoanDetails.RequestedLimitAmount
		smry.DPLCustMargin = dPLCustMargin
		smry.DPLTenor = accoutDetails.LoanDetails.LimitTenor
		smry.DPLROI = accoutDetails.LoanDetails.ProposedRateInterest
		smry.X10ExistingPOS = x10ExistingPOS
		smry.X10IntObligation = x10IntObligation
		smry.YearlyRepayment = yearlyRepaymentCalc
		smry.TCLPOS = TCLPOS
		smry.TCLEMI = TCLEMI
		smry.SumBounces = int64(summary.GetFloat64("SumBounces"))
		smry.SumExtenalYearly = summary.GetFloat64("SumExtenalYearly")

		smry.EMI = crowd.From(&arr).Sum(func(x interface{}) interface{} {
			return x.(RTRBottom).EMI
		}).Exec().Result.Sum

		smry.DPDTrack = (func() int32 {
			bank, err := new(BankAnalysis).GenerateAllSummary(tk.Sprintf("%v", customerId), dealno)
			if err != nil {
				bank = new(BankAllSummary)
			}

			if bank.SactionLimit == 0 {
				return (-1)
			}

			return crowd.From(&arr).Max(func(x interface{}) interface{} {
				months := x.(RTRBottom).Months
				value := crowd.From(&months).Max(func(y interface{}) interface{} {
					s := strings.Replace(y.(MonthRtr).Value, "DPD", "", -1)
					s = strings.Replace(s, "+", "", -1)
					n, _ := strconv.ParseInt(s, 10, 32)

					return n
				}).Exec().Result.Max.(int64)

				return int32(value)
			}).Exec().Result.Max.(int32)
		})()
	}

	// var dpdTrack = _.max(rtr.map(function (d) {

	// 	var mav = _.max(d.Months.map(function(dx){
	// 		var vals = parseInt(dx.Value.replace(/DPD/g, '').replace(/\+/g, ''), 10);
	// 	    return isNaN(vals)? 0 : vals
	// 	}) , function(x){
	// 		return x
	// 	});

	// 	return mav
	// }))

	return arr, smry, nil
}

func (r *RTRBottom) CalculateSummary(datas []RTRBottom) tk.M {

	result := tk.M{}

	tempLoanStatus := crowd.From(&datas).Where(func(x interface{}) interface{} {
		return strings.TrimSpace(strings.ToLower(x.(RTRBottom).LoanStatus)) == "live"
	}).Exec().Result.Data().([]RTRBottom)

	tempEMIBalance := crowd.From(&datas).Where(func(x interface{}) interface{} {
		return x.(RTRBottom).EMIBalance <= 3 && x.(RTRBottom).EMIBalance != 0
	}).Exec().Result.Data().([]RTRBottom)

	tempPosPBSL := crowd.From(&datas).Where(func(x interface{}) interface{} {
		return (x.(RTRBottom).BSLStatus + x.(RTRBottom).LoanStatus) == "PBSLLive"
	}).Exec().Result.Data().([]RTRBottom)

	tempBalance := crowd.From(&datas).Where(func(x interface{}) interface{} {
		return x.(RTRBottom).LoanStatus == "Balance Transfer"
	}).Exec().Result.Data().([]RTRBottom)

	// tempBounces := crowd.From(&datas).Where(func(x interface{}) interface{} {
	// 	return x.(RTRBottom).Bounces == "Bounces"
	// }).Exec().Result.Data().([]RTRBottom)

	sumLoanStatus := crowd.From(&tempLoanStatus).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).POS
	}).Exec().Result.Sum

	sumRepayment := crowd.From(&tempLoanStatus).Sum(func(x interface{}) interface{} {
		result := 0.0
		if strings.TrimSpace(strings.ToLower(x.(RTRBottom).LoanStatus)) == "live" {
			if strings.TrimSpace(strings.ToLower(x.(RTRBottom).TypeOfLoan)) == "od/cc" || strings.TrimSpace(strings.ToLower(x.(RTRBottom).TypeOfLoan)) == "bill discounting" || strings.TrimSpace(strings.ToLower(x.(RTRBottom).TypeOfLoan)) == "leter of credit" {
				result = x.(RTRBottom).EMI * 12
			} else if x.(RTRBottom).EMIBalance < 12 {
				result = x.(RTRBottom).EMI * float64(x.(RTRBottom).EMIBalance)
			}
		}
		return result
	}).Exec().Result.Sum

	sumEMI := crowd.From(&tempLoanStatus).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).EMI
	}).Exec().Result.Sum / 100000

	sumEMIBalance3Month := crowd.From(&tempEMIBalance).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).POS
	}).Exec().Result.Sum

	sumEMI3Month := crowd.From(&tempEMIBalance).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).EMI
	}).Exec().Result.Sum / 100000

	sumPosPBSL := crowd.From(&tempPosPBSL).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).POS
	}).Exec().Result.Sum

	sumEmiPBSL := crowd.From(&tempPosPBSL).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).EMI
	}).Exec().Result.Sum / 100000

	sumPosBalance := crowd.From(&tempBalance).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).POS
	}).Exec().Result.Sum

	sumEmiBalance := crowd.From(&tempBalance).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).EMI
	}).Exec().Result.Sum / 100000

	sumBounces := crowd.From(&datas).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).Bounces
	}).Exec().Result.Sum

	sumExtenalYearly := crowd.From(&datas).Sum(func(x interface{}) interface{} {
		return x.(RTRBottom).YearlyRepayment
	}).Exec().Result.Sum

	result.Set("POSInLacs", sumLoanStatus)
	result.Set("EMIInLacs", sumEMI)
	result.Set("EMIBalance3Month", sumEMIBalance3Month)
	result.Set("EMI3Month", sumEMI3Month)
	result.Set("PosPBSL", sumPosPBSL)
	result.Set("EmiPBSL", sumEmiPBSL)
	result.Set("PosBalance", sumPosBalance)
	result.Set("EmiBalance", sumEmiBalance)
	result.Set("YearlyRepayment", sumRepayment)
	result.Set("SumBounces", sumBounces)
	result.Set("SumExtenalYearly", sumExtenalYearly)

	return result
}

func (r *RTRBottom) FindRate(amt float64, pmt float64, nper int64) (error, float64) {
	tk.Println(amt, "amount", pmt, "payment", nper, "nper")
	rate := math.Pow((pmt*float64(nper))/(amt*100000), 1/float64(nper)) - 1
	tk.Println(rate, "awal rate")
	iterate := 0.0001
	idx := 0
	list := []tk.M{}
	lastdiff := tk.M{}

	for {
		idx += 1
		for i := 0; i < 250; i++ {
			rate += iterate
			var diff = (amt * 100000) - (pmt * (1 - math.Pow((1+rate), -(float64(nper)+1))) / rate)
			list = append(list, tk.M{"rate": rate, "diff": math.Abs(diff)})
		}

		minval := tk.M{}

		for i, v := range list {
			if i == 0 {
				minval = v
			} else {
				if v.GetFloat64("diff") < minval.GetFloat64("diff") {
					minval = v
				}
			}
		}

		tk.Println(lastdiff, "lastdiff")
		tk.Println(minval, "minval")

		if idx > 1 {
			if lastdiff.GetFloat64("diff") == minval.GetFloat64("diff") {
				break
			} else {
				lastdiff = minval
			}
		} else {
			lastdiff = minval
		}
	}

	return nil, lastdiff.GetFloat64("rate")
}

func diff(a, b time.Time) (year, month, day, hour, min, sec int) {
	if a.Location() != b.Location() {
		b = b.In(a.Location())
	}
	if a.After(b) {
		a, b = b, a
	}
	y1, M1, d1 := a.Date()
	y2, M2, d2 := b.Date()

	h1, m1, s1 := a.Clock()
	h2, m2, s2 := b.Clock()

	year = int(y2 - y1)
	month = int(M2 - M1)
	day = int(d2 - d1)
	hour = int(h2 - h1)
	min = int(m2 - m1)
	sec = int(s2 - s1)

	// Normalize negative values
	if sec < 0 {
		sec += 60
		min--
	}
	if min < 0 {
		min += 60
		hour--
	}
	if hour < 0 {
		hour += 24
		day--
	}
	if day < 0 {
		// days in month:
		t := time.Date(y1, M1, 32, 0, 0, 0, 0, time.UTC)
		day += 32 - t.Day()
		month--
	}
	if month < 0 {
		month += 12
		year--
	}

	return
}
