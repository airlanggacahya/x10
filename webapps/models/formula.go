package models

import (
	. "eaciit/x10/webapps/connection"
	"eaciit/x10/webapps/helper"
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"regexp"
	"strconv"
	"strings"
)

const (
	RegexFormulaString = `(-\d+(?:\.\d+)?|[-+\/&*()]|[a-zA-Z0-9.]+)`

	NormTypeGreaterThan = "greater than"
	NormTypeLowerThan   = "lower than"
	NormTypeEqual       = "equal"
	NormTypeBetween     = "between"

	RatioFormulaValueTypeNumber     = ""
	RatioFormulaValueTypePercentage = "percentage"
)

type RatioFormula struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string `bson:"_id",json:"_id"`
	Title         string
	ValueType     string

	// for the balance sheet
	PutAfter   string
	Section    string
	SubSection string

	// for private purpose
	Formula       string
	FormulaParsed string    `bson:"-",json:"-"`
	Variables     toolkit.M `bson:"-",json:"-"`
}

func NewRatioFormula() *RatioFormula {
	m := new(RatioFormula)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *RatioFormula) RecordID() interface{} {
	return e.Id
}

func (m *RatioFormula) TableName() string {
	return "RatioFormula"
}

func (m *RatioFormula) IsOperator(c string) bool {
	return (c == ")" || c == "(" || c == "+" || c == "-" || c == "*" || c == "/")
}
func (m *RatioFormula) ParseFormula(fm *FormulaModel) error {
	m.FormulaParsed = ""

	filteredOtherFormulas := func() []RatioFormula {
		res := []RatioFormula{}
		for _, each := range fm.RatioFormula {
			if each.Id == m.Id {
				continue
			}
			res = append(res, each)
		}
		return res
	}()

	doParse := func(formulasString string) (string, error) {
		regexFormulaParser, err := regexp.Compile(RegexFormulaString)
		if err != nil {
			return "", err
		}

		res := []string{}
		parts := regexFormulaParser.FindAllString(formulasString, -1)

		for _, each := range parts {
			section := "balancesheet"
			current := each
			period := ""

			nameSpaceParts := strings.Split(current, ".")
			if len(nameSpaceParts) == 2 {
				section = nameSpaceParts[0]
				current = nameSpaceParts[1]
			} else if len(nameSpaceParts) == 3 {
				section = nameSpaceParts[0]
				current = nameSpaceParts[1]
				period = nameSpaceParts[2]
			}

			for _, eachOther := range filteredOtherFormulas {
				if eachOther.Id == current {
					innerFormula := eachOther.Formula
					if strings.TrimSpace(innerFormula) == "" {
						innerFormula = "0"
					}
					current = toolkit.Sprintf("(%s)", innerFormula)
					break
				}
			}

			if strings.Contains(each, ".") {
				regex, err := regexp.Compile(RegexFormulaString)
				if err != nil {
					return "", err
				}

				matched := regex.FindAllString(current, -1)
				for i, eachPart := range matched {
					if m.IsOperator(eachPart) {
						continue
					}

					if len(nameSpaceParts) == 2 {
						matched[i] = strings.Join([]string{section, eachPart}, ".")
					} else if len(nameSpaceParts) == 3 {
						matched[i] = strings.Join([]string{section, eachPart, period}, ".")
					}
				}
				current = strings.Join(matched, "")
			}

			res = append(res, current)
		}

		return strings.Join(res, ""), nil
	}

	formulaString, err := func() (string, error) {
		fs := m.Formula
		for i := 0; i < 10; i++ {
			var err error
			if fs, err = doParse(fs); err != nil {
				return "", err
			}
		}
		return fs, nil
	}()

	if err != nil {
		return err
	}
	m.FormulaParsed = formulaString
	// toolkit.Println("-------", m.Formula)
	// toolkit.Println("-------", m.FormulaParsed)

	return nil
}

func (m *RatioFormula) GetFormulaValue(fm *FormulaModel, formulaID, period string) interface{} {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	query := []*dbox.Filter{dbox.Eq("_id", formulaID)}
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

	ratioFormulas := []*RatioFormula{}
	err = csr.Fetch(&ratioFormulas, 0, false)
	if err != nil {
		return err
	}

	if len(ratioFormulas) == 0 {
		return "0"
	}

	ratioFormulas[0].ParseFormula(fm)
	ratioFormulas[0].PrepareVariables(period, fm)
	res, _ := ratioFormulas[0].Calculate()

	return res
}

func (m *RatioFormula) GetValue(fm *FormulaModel, namepace, alias, period string) interface{} {
	switch strings.ToLower(namepace) {
	case "balancesheet":
		for _, eachForm := range fm.BalanceSheet.FormData {
			if eachForm.FieldAlias == alias {
				for _, eachValue := range eachForm.Values {
					if eachValue.Date == period {
						return eachValue.Value
					}
				}
			}
		}
	case "cibil":
		switch alias {
		case "SelectRating":
			return fm.CibilData.SelectRating
		case "MinScore":
			return fm.CibilData.MinScore
		}
	case "rtr":
		switch alias {
		case "TotalObligationPOS":
			return fm.RTR.TotalObligationPOS
		case "TotalObligationEMI":
			return fm.RTR.TotalObligationEMI
		case "CloseWithin3MonthPOS":
			return fm.RTR.CloseWithin3MonthPOS
		case "CloseWithin3MonthEMI":
			return fm.RTR.CloseWithin3MonthEMI
		case "PBSLPOS":
			return fm.RTR.PBSLPOS
		case "PBSLEMI":
			return fm.RTR.PBSLEMI
		case "BalancePOS":
			return fm.RTR.BalancePOS
		case "BalanceEMI":
			return fm.RTR.BalanceEMI
		case "TCLPOS":
			return fm.RTR.TCLPOS
		case "TCLEMI":
			return fm.RTR.TCLEMI
		case "DPLAmountOfLimit":
			return fm.RTR.DPLAmountOfLimit
		case "DPLCustMargin":
			return fm.RTR.DPLCustMargin
		case "DPLTenor":
			return fm.RTR.DPLTenor
		case "DPLROI":
			return fm.RTR.DPLROI
		case "X10IntObligation":
			return fm.RTR.X10IntObligation
		case "X10ExistingPOS":
			return fm.RTR.X10ExistingPOS
		case "SumExtenalYearly":
			return fm.RTR.SumExtenalYearly
		case "YearlyRepayment":
			return fm.RTR.YearlyRepayment
		case "SumBounces":
			return fm.RTR.SumBounces
		case "DPDTrack":
			return fm.RTR.DPDTrack
		}
	case "bank":
		switch alias {
		case "BSMonthlyCredits":
			return fm.BankingAnalysis.BSMonthlyCredits
		case "BSMonthlyDebits":
			return fm.BankingAnalysis.BSMonthlyDebits
		case "BSNoOfCredits":
			return fm.BankingAnalysis.BSNoOfCredits
		case "BSNoOfDebits":
			return fm.BankingAnalysis.BSNoOfDebits
		case "BSOWChequeReturns":
			return fm.BankingAnalysis.BSOWChequeReturns
		case "BSIWChequeReturns":
			return fm.BankingAnalysis.BSIWChequeReturns
		case "BSImpMargin":
			return fm.BankingAnalysis.BSImpMargin
		case "BSOWReturnPercent":
			return fm.BankingAnalysis.BSOWReturnPercent
		case "BSIWReturnPercent":
			return fm.BankingAnalysis.BSIWReturnPercent
		case "BSDRCRRatio":
			return fm.BankingAnalysis.BSDRCRRatio
		case "ODSactionLimit":
			return fm.BankingAnalysis.ODSactionLimit
		case "ODUtilizationPercent":
			return fm.BankingAnalysis.ODUtilizationPercent
		case "ODAvgUtilization":
			return fm.BankingAnalysis.ODAvgUtilization
		case "ODInterestPaid":
			return fm.BankingAnalysis.ODInterestPaid
		case "AMLAvgCredits":
			return fm.BankingAnalysis.AMLAvgCredits
		case "AMLAvgDebits":
			return fm.BankingAnalysis.AMLAvgDebits
		case "ABB":
			return fm.BankingAnalysis.ABB
		case "BankingToTurnoverRatio":
			return fm.BankingAnalysis.BankingToTurnoverRatio
		case "InwardBounces":
			return fm.BankingAnalysis.InwardBounces
		case "ODCCUtilizationABBvsProposedEMI":
			return fm.BankingAnalysis.ODCCUtilizationABBvsProposedEMI
		}
	case "accountdetails":
		switch alias {
		case "ACSProduct":
			return fm.AccountDetails.ACSProduct
		case "ACSScheme":
			return fm.AccountDetails.ACSScheme
		case "ACSPDRemarks":
			return fm.AccountDetails.ACSPDRemarks
		case "BDDiversificationCustomers":
			return fm.AccountDetails.BDDiversificationCustomers
		case "BDDependenceOnSuppliers":
			return fm.AccountDetails.BDDependenceOnSuppliers
		case "BDBusinessVintage":
			return fm.AccountDetails.BDBusinessVintage
		case "BDOrdersinHand":
			return fm.AccountDetails.BDOrdersinHand
		case "BDProjectsCompleted":
			return fm.AccountDetails.BDProjectsCompleted
		case "BDCustomerSegmentClasification":
			return fm.AccountDetails.BDCustomerSegmentClasification
		case "BDBorrowerConstitution":
			return fm.AccountDetails.BDBorrowerConstitution
		case "BDMarketReference":
			return fm.AccountDetails.BDMarketReference
		case "BDExternalRating":
			return fm.AccountDetails.BDExternalRating
		case "BDManagement":
			return fm.AccountDetails.BDManagement

		case "LDProposedLoanAmount":
			return fm.AccountDetails.LDProposedLoanAmount
		case "LDRequestedLimitAmount":
			return fm.AccountDetails.LDRequestedLimitAmount
		case "LDLimitTenor":
			return fm.AccountDetails.LDLimitTenor
		case "LDProposedRateInterest":
			return fm.AccountDetails.LDProposedRateInterest
		case "LDProposedPFee":
			return fm.AccountDetails.LDProposedPFee
		case "LDInterestOutgo":
			return fm.AccountDetails.LDInterestOutgo

		case "LDPOValueforBacktoBack":
			return fm.AccountDetails.LDPOValueforBacktoBack
		case "LDExpectedPayment":
			return fm.AccountDetails.LDExpectedPayment

		case "LDIfYesEistingLimitAmount":
			return fm.AccountDetails.LDIfYesEistingLimitAmount
		case "LDExistingRoi":
			return fm.AccountDetails.LDExistingRoi
		case "LDExistingPf":
			return fm.AccountDetails.LDExistingPf
		case "LDVintageWithX10":
			return fm.AccountDetails.LDVintageWithX10

		case "LDTypeSecurity":
			return fm.AccountDetails.LDTypeSecurity
		case "LDDetailsSecurity":
			return fm.AccountDetails.LDDetailsSecurity

		case "LDIfBackedByPO":
			return fm.AccountDetails.LDIfBackedByPO
		case "LDIFExistingCustomer":
			return fm.AccountDetails.LDIFExistingCustomer

		case "CBMStockSellIn":
			return fm.AccountDetails.CBMStockSellIn
		case "CBMB2BGovtIn":
			return fm.AccountDetails.CBMB2BGovtIn
		case "CBMB2BCorporateIn":
			return fm.AccountDetails.CBMB2BCorporateIn

		case "DMIrisComputersLimitedIn":
			return fm.AccountDetails.DMIrisComputersLimitedIn
		case "DMSavexIn":
			return fm.AccountDetails.DMSavexIn
		case "DMRashiIn":
			return fm.AccountDetails.DMRashiIn
		case "DMSupertronIn":
			return fm.AccountDetails.DMSupertronIn
		case "DMCompuageIn":
			return fm.AccountDetails.DMCompuageIn
		case "DMAvnetIn":
			return fm.AccountDetails.DMAvnetIn

		case "PDAvgExperienceInSameLineOfBusiness":
			return fm.AccountDetails.PDAvgExperienceInSameLineOfBusiness
		case "PDMaxExperienceInSameLineOfBusiness":
			return fm.AccountDetails.PDMaxExperienceInSameLineOfBusiness
		case "PDMinExperienceInSameLineOfBusiness":
			return fm.AccountDetails.PDMinExperienceInSameLineOfBusiness
		case "PDAvgCibilScore":
			return fm.AccountDetails.PDAvgCibilScore
		case "PDMaxCibilScore":
			return fm.AccountDetails.PDMaxCibilScore
		case "PDMinCibilScore":
			return fm.AccountDetails.PDMinCibilScore
		case "PDAvgRealEstatePosition":
			return fm.AccountDetails.PDAvgRealEstatePosition
		case "PDMaxRealEstatePosition":
			return fm.AccountDetails.PDMaxRealEstatePosition
		case "PDMinRealEstatePosition":
			return fm.AccountDetails.PDMinRealEstatePosition
		case "PDRealEstateSumValue":
			return fm.AccountDetails.PDRealEstateSumValue
		case "PDOfficeOwnershipStatus":
			return fm.AccountDetails.PDOfficeOwnershipStatus
		case "PDResiOwnershipStatus":
			return fm.AccountDetails.PDResiOwnershipStatus
		case "PDMinIndexEducationalQualificationOfMainPromoter":
			return fm.AccountDetails.PDMinIndexEducationalQualificationOfMainPromoter

		case "VDMaxOfAverageDelayDays":
			return fm.AccountDetails.VDMaxOfAverageDelayDays
		case "VDMaxDelayDays":
			return fm.AccountDetails.VDMaxDelayDays
		case "VDMaxPaymentDays":
			return fm.AccountDetails.VDMaxPaymentDays
		case "VDAverageDelayDays":
			return fm.AccountDetails.VDAverageDelayDays
		case "VDAvgStandardDeviation":
			return fm.AccountDetails.VDAvgStandardDeviation
		case "VDAveragePaymentDays":
			return fm.AccountDetails.VDAveragePaymentDays
		case "VDAvgTransactionWeightedPaymentDelayDays":
			return fm.AccountDetails.VDAvgTransactionWeightedPaymentDelayDays
		case "VDAvgDelayDaysStandardDeviation":
			return fm.AccountDetails.VDAvgDelayDaysStandardDeviation
		case "VDAvgTransactionWeightedPaymentDays":
			return fm.AccountDetails.VDAvgTransactionWeightedPaymentDays
		case "VDAvgDaysStandardDeviation":
			return fm.AccountDetails.VDAvgDaysStandardDeviation
		case "VDAvgAmountOfBusinessDone":
			return fm.AccountDetails.VDAvgAmountOfBusinessDone

		case "PDCustomerMargin":
			return fm.AccountDetails.PDCustomerMargin
		}
	}

	return "0"
}

func (m *RatioFormula) PrepareVariables(basePeriod string, fm *FormulaModel) error {
	m.Variables = toolkit.M{}

	if basePeriod == "" {
		basePeriod = DEFAULT_PERIOD
	}

	regex, err := regexp.Compile(RegexFormulaString)
	if err != nil {
		return err
	}
	variables := toolkit.M{}
	matched := regex.FindAllString(m.FormulaParsed, -1)

	for _, each := range matched {
		if m.IsOperator(each) {
			continue
		}

		if _, err := strconv.ParseFloat(each, 64); err == nil {
			continue
		}

		variables[each] = 0

		(func() {
			comps := strings.Split(each, ".")
			currentSource := "balancesheet"
			currentFieldAlias := ""

			if len(comps) == 1 {
				currentFieldAlias = comps[0]
			} else {
				currentSource = comps[0]
				currentFieldAlias = comps[1]
			}

			currentPeriod := basePeriod
			if len(comps) > 2 {
				numericable := strings.Replace(comps[2], "N", "", -1)
				numericable = strings.Replace(comps[2], "P", "-", -1)

				addition, _ := strconv.ParseFloat(numericable, 64)
				periodParts := strings.Split(currentPeriod, "-")
				year := toolkit.ToFloat64(periodParts[2], 64, toolkit.RoundingAuto)
				currentPeriod = toolkit.Sprintf("%s-%s-%d", periodParts[0], periodParts[1], int(year+addition))
			}

			variables[each] = m.GetValue(fm, currentSource, currentFieldAlias, currentPeriod)
		})()
	}

	m.Variables = variables

	return nil
}

func (m *RatioFormula) Calculate() (string, error) {
	regex, err := regexp.Compile(RegexFormulaString)
	if err != nil {
		return "0", err
	}
	matched := regex.FindAllString(m.FormulaParsed, -1)

	isFloat := false
	for eachVar := range m.Variables {
		if strings.Contains(m.Variables.GetString(eachVar), ".") {
			isFloat = true
			break
		}
	}

	for i, eachOp := range matched {
		for eachVar, eachVal := range m.Variables {
			if eachOp == eachVar {
				matched[i] = toolkit.Sprintf("%v", eachVal)
				if isFloat {
					if !strings.Contains(matched[i], ".") {
						if floatValue, err := strconv.ParseFloat(matched[i], 64); err == nil {
							matched[i] = toolkit.Sprintf("%f", floatValue)
						}
					}
				}
				break
			}
		}
	}

	if strings.TrimSpace(m.Formula) == "" {
		return "", nil
	}

	statement := strings.Join(matched, "")
	if strings.TrimSpace(statement) == "" {
		return "0", nil
	}

	// toolkit.Println("---------------------------------------------------")
	// toolkit.Printfn("--------> %#s", m.Id)
	// toolkit.Printfn("          %#v", m.Formula)
	// toolkit.Printfn("          %#v", m.Variables)
	// toolkit.Printfn("          %#s", m.FormulaParsed)
	// toolkit.Printfn("          %#s", statement)

	executedValue := 0.0
	executedString := ""
	if m.Section == "" {
		executedString = statement
	} else {
		executedValue, err = helper.EvalArithmetic(statement)
		if err != nil {
			return "0", errors.New(toolkit.Sprintf("Invalid formula on \"%s %s\". Formula: \"%s\"", m.Id, m.Title, m.Formula))
		}
		executedString = strings.TrimSpace(toolkit.Sprintf("%v", executedValue))

	}

	// toolkit.Printfn("          %#v", executedValue)

	if executedString == "+Inf" || executedString == "-Inf" || executedString == "NaN" {
		return "0", nil
	}

	return executedString, nil
}
