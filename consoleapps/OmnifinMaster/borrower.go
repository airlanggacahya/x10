package main

import tk "github.com/eaciit/toolkit"

// transformScheme save additional information specific for master Scheme
func transformBorrowerConstitutionList(in tk.M) tk.M {
	p := make(tk.M)
	// because there is duplication in schemeDesc, we need to save additional data to distinct it
	p.Set("code", in.GetString("code"))
	p.Set("genericKey", in.GetString("genericKey"))
	p.Set("name", in.GetString("description"))

	return p
}

// SaveScheme transform remote data master scheme desc into master account detail
func SaveBorrowerConstitutionList(data interface{}) error {
	newScheme := TransformMaster("genericMasterList", data, transformBorrowerConstitutionList)
	// debug
	// tk.Printfn("%v", newScheme)
	err := SaveMasterAccountDetail("BorrowerConstitutionList", newScheme)

	if err != nil {
		return err
	}

	return nil
}
