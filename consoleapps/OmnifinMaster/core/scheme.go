package core

import (
	hp "eaciit/x10/webapps/helper"

	tk "github.com/eaciit/toolkit"
)

type SchemeMaster struct {
	SchemeId   int     `json:"schemeId"`
	SchemeDesc string  `json:"schemeDesc"`
	ProductId  string  `json:"productId"`
	MinLoan    float64 `json:"minLoanAmount"`
	MaxLoan    float64 `json:"maxLoanAmount"`
	MinTenure  float64 `json:"minTenure"`
	MaxTenure  float64 `json:"maxTenure"`
	DefTenure  float64 `json:"defTenure"`
	MinEffRate float64 `json:"minEffRate"`
	MaxEffRate float64 `json:"maxEffRate"`
	DefEffRate float64 `json:"defEffRate"`
	Status     string  `json:"status"`
	LastUpdate string  `json:"lastUpdate"`
}

func SaveScheme(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.SchemeMasterList {
		p := tk.M{}
		p.Set("productId", val.ProductId)
		p.Set("schemeId", val.SchemeId)
		p.Set("schemeDesc", val.SchemeDesc)
		p.Set("name", hp.ToWordCase(val.SchemeDesc))
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	// remove duplicate name
	newData = removeDuplicateStringField(newData, "name")

	err := SaveMasterAccountDetail("Scheme", newData)

	return err
}
