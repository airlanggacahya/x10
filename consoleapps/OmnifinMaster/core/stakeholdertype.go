package core

import (
	hp "eaciit/x10/webapps/helper"

	tk "github.com/eaciit/toolkit"
)

func transformStakeholderType(in tk.M) tk.M {
	// tk.Printfn("%v", in)
	p := make(tk.M)
	// copy all elements
	for key, val := range in {
		p[key] = val
	}

	p["name"] = hp.ToWordCase(p["description"].(string))

	return p
}

// SaveStakeholderType transform stakeholder position
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
