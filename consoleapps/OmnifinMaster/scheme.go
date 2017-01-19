package main

import (
	"fmt"

	tk "github.com/eaciit/toolkit"
)

func transformScheme(in tk.M) tk.M {
	p := make(tk.M)
	p.Set("productId", in.GetString("productId"))
	p.Set("schemeId", in.GetString("schemeId"))
	p.Set("schemeDesc", in.GetString("schemeDesc"))
	p.Set("name", fmt.Sprintf("%s - %s", in.GetString("productId"), in.GetString("schemeDesc")))

	return p
}

func SaveScheme(data interface{}) error {
	newScheme := TransformMaster("schemeMasterList", data, transformScheme)
	// debug
	// tk.Printfn("%v", newProduct)
	err := SaveMasterAccountDetail("Scheme", newScheme)

	if err != nil {
		return err
	}

	return nil
}
