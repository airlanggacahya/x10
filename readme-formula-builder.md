# Formula Builder 🤘

## Abstract

Formula Builder (FB) is used to generate result based on formula defined by user dynamically. FB is used on several modules like **Detailed financial report** (DFR), **Loan Approval Report & Form** (LAPR), and **Credit Score Card** (CSC). There are several points that important to know, we will explain it here.

---

There are 3 actor (files) collaborating to do the formula execution:

 1. `model/FormulaBuilder.go`; is used to gather all data required for the formula
 2. `model/Formula.go`; one formula is one row, the preparation & execution happen here
 3. `helper/Eval.go`; formula is basically just string of expression, what we do to execute the formula is by evaluating the string, then grab the result which is happening here

---

Before we jump into the execution part, we need to gather all the data required first, this process happen in `FormulaBuilder` object. This is list of data that need to be pulled:

 1. Balance Sheet
 2. Bank Analysis
 3. RTR
 4. Account Details
 5. CIBIL
 6. also the list of the formula

This `FormulaBuilder` contains 3 important function to do the execution:

 1. `.CalculateNorm()`; used to calculate formula on LAPR module
 2. `.CalculateBalanceSheet()`; used to calculate formula on DFR
 3. `.CalculateScoreCard()`; used to calculate formula on the CSC

---

The way formula builder executed in those 3 modules is same, but there are also some different. Here are the list of things which are same in term of the execution:

 1. We need to gather all the data required in `FormulaBuilder`
 2. Execute the calculate function from `FormulaBuilder` (the `.Calculate***()` function)
 3. Inside the `.Calculate***()` function, the list of formula will be looped, each row is one formula. It executed one by one

## `CalculateBalanceSheet()`

### Intialization

Used in **Detailed financial report**, request will be sent from UI to `controllers/ratio.go` → `GetReportData`, contains payloads: `CustomerId` and `DealNo`.

New `FormulaModel` object created, we just need to call the  `.CalculateBalanceSheet()`.

```go
fm := new(FormulaModel)
fm.CustomerId = "customer id from payload"
fm.DealNo = "deal number from payload"
fm.GetData()
result := fm.CalculateBalanceSheet()
```

The `.GetData()` method used to pull out all data required to do the calculation.

The calculation will happen inside `.CalculateBalanceSheet()`, returned result.

---

### Inside `.CalculateBalanceSheet()`

The formula master of Balance Sheet is saved into collection **RatioFormula**. All rows will be pulled out and sorted (each row got field called `putAfter` which is used to identify the order). Rows contain both data from balance sheets & ratio formula. Method `.GetFieldsInOrder()` will do this part.  After that, we loop the rows, then execute the formula. FYI, because the rows can be formula or just field from balance sheet; only the formula will be executed.

```go
results = []result{}
rows := fm.GetFieldsInOrder()

for each in rows {
	if each.type is "formula" {
		each.ParseFormula(fm)
		each.PrepareVariables("selected period", fm)
		result := each.Calculate()
		results.add(result)
	} else {
		results.add(result)
	}
}

return results
```

---

### Inside `.ParseFormula()`, `.PrepareVariables()`, `.Calculate()`


Like what I said earlier, the evaluation of the formula is happening on the `Formula` not `FormulaBuilder`. And there are 3 methods need to be called.

 1. method `.ParseFormula()`;  used to parse the formula expression. We need to do this because sometimes, the formula contains operand which is also sub formula. We need to breakdown the expression into the lowest level expression. Example: 

    - `SALES + COGS` will become
    - `SALES + (PURCHASE - SOLD + OTHER_FIELD)`

 2. method `.PrepareVariables()`; All operands will be mapped to object, then get the value of it, one-by-one. Example: 

    - `SALES => 12`
    - `PURCHASE => 23`
    - `SOLD => 10`
    - `OTHER_FIELD => 5`

 3. method `.Calculate()`; We will try to inject the variables' values to the expression. Example:

    - `SALES + (PURCHASE - SOLD + OTHER_FIELD)`, become
    - `12 + (23 - 10 + 5)`

After that we'll evaluate the formula by using `.EvalArithmetic` from `helper\eval.go`.

## `.CalculateNorm()`

### Initialization

Used **Loan Approval Report & Form**, request will come from UI to `controllers/normmaster.go` → `GetNormData` with 3 payloads: `CustomerId`, `DealNo`, and `internalRatingId`.

```go
fm := new(FormulaModel)
fm.CustomerId = "customer id from payload"
fm.DealNo = "deal number from payload"
fm.GetData()

internalRatingId := "internal rating id from payload"
result := fm.CalculateNorm(internalRatingId)
```

---

### Inside `.CalculateNorm()`

All formulaes used in this method is saved onto collection `NormMaster`, then we will do calculation when the internal rating is `all` or equal to the `internalRatingId`.

```go
results = []result{}
auditStatus := arrays of period
rows := get from collection NormMaster

for each in rows {
	if each.internalRating is "all" or equal internalRatingId {
		each.ParseFormula(fm)

		resultByPeriods := []resultByPeriod{}
		for period in auditStatus {
			each.PrepareVariables(period, fm)
			resultByPeriod := each.Calculate()
			resultByPeriods.push(resultByPeriod)
		}
	}

	// read next
}

return results
```

Inside each rows, there is another loop happen, the `auditStatuses`. So multiple calculation will happen in one rows based on each period.

---

After all values gathered, some filtering will happen. There is another payload sent from UI, it's the `TimePeriod`. This parameter is used to detect what period should be used in the calculation.

Values by period inside each rows will be ordered in descending. Then looped. Then this checking will happen in each loop.

 1. **Estimated Preferred**

   * If status is **ESTIMATED** and value is not 0, will use current loop period. If not
   * If status is **PROVISION** and value is not 0, will use current loop period. If not
   * If status is **AUDITED** and value is not 0, will use current loop period

 2. **Provision Preferred**

   * If status is **PROVISION** and value is not 0, will use current loop period. If not
   * If status is **AUDITED** and value is not 0, will use current loop period

 3. **Last Audited**

   * If status is **AUDITED** and value is not 0, will use current loop period
 
Then use the selected period to calculate the final value.


```go
for each in rows {
	// ... continue from previous code

	selectedPeriod := "default period"
	
	for eachByPeriod in resultByPeriods {
		// time period condition here
		// `selectedPeriod` will be filled
	}

	each.PrepareVariables(selectedPeriod)
	result := each.Calculate()
	results.push(result)
}
```

## `.CalculateScoreCard()`

### Initialization

Used **Credit Score Card**, request will come from UI to `controllers/creditscorecard.go` → `GetCreditScoreCardData` with 3 payloads: `CustomerId`, `DealNo`, and `RatingId`.

```go
fm := new(FormulaModel)
fm.CustomerId = "customer id from payload"
fm.DealNo = "deal number from payload"
fm.RatingId = "rating id from payload"
fm.GetData()
result := fm.CalculateScoreCard()
```

---

### Inside `.CalculateScoreCard()`

a