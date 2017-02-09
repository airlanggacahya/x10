package core

import (
	hp "eaciit/x10/webapps/helper"

	tk "github.com/eaciit/toolkit"
)

func SavePosition(data []GenericMaster) error {
	newData := []tk.M{}
	for _, val := range data {
		p := tk.M{}
		p.Set("name", hp.ToWordCase(val.Description))
		p.Set("description", val.Description)
		p.Set("code", val.Code)
		p.Set("genericKey", val.GenericKey)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	newData = removeDuplicateStringField(newData, "name")

	err := SaveMasterAccountDetail("Position", newData)

	return err
}
