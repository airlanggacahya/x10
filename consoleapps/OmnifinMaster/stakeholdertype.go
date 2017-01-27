package main

import (
	ct "eaciit/x10/webapps/controllers"
	tk "github.com/eaciit/toolkit"
)

// transformScheme save additional information specific for master Scheme
func transformStakeholderType(in tk.M) tk.M {
	// tk.Printfn("%v", in)
	p := make(tk.M)
	// copy all elements
	for key, val := range in {
		p[key] = val
	}

	p["name"] = ct.ToWordCase(p["description"].(string))

	return p
}

// SaveScheme transform remote data master scheme desc into master account detail
func SaveStakeholderType(data interface{}) error {
	newStake := TransformMaster("genericMasterList", data, transformStakeholderType)
	// debug
	// tk.Printfn("%v", newStake)
	newStake = removeDuplicateStringField(newStake, "name")
	// tk.Printfn("%v", newStake)
	err := SaveMasterAccountDetail("Position", newStake)

	if err != nil {
		return err
	}

	return nil
}
