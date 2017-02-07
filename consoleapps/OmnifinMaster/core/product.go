package core

import (
	hp "eaciit/x10/webapps/helper"

	tk "github.com/eaciit/toolkit"
)

func transformProduct(in tk.M) tk.M {
	p := make(tk.M)
	p.Set("name", hp.ToWordCase(in.GetString("productDesc")))

	return p
}

// SaveProduct transform remote data master product desc into master account detail
func SaveProduct(data interface{}) error {
	newProduct := TransformMaster("productMasterList", data, transformProduct)
	// debug
	// tk.Printfn("%v", newProduct)
	err := SaveMasterAccountDetail("Products", newProduct)

	if err != nil {
		return err
	}

	return nil
}
