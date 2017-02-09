package core

import (
	hp "eaciit/x10/webapps/helper"

	tk "github.com/eaciit/toolkit"
)

type ProductMaster struct {
	ProductId   string `json:"productId"`
	ProductDesc string `json:"productDesc"`
	Status      string `json:"status"`
	Category    string `json:"productCategory"`
	LastUpdate  string `json:"lastUpdate"`
}

func SaveProduct(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.ProductMasterList {
		p := tk.M{}
		p.Set("name", hp.ToWordCase(val.ProductDesc))
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := SaveMasterAccountDetail("Products", newData)

	return err
}
