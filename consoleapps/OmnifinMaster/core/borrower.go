package core

import tk "github.com/eaciit/toolkit"

func SaveBorrowerConstitutionList(data []GenericMaster) error {
	newData := []tk.M{}
	for _, val := range data {
		p := tk.M{}
		p.Set("code", val.Code)
		p.Set("genericKey", val.GenericKey)
		p.Set("name", val.Description)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := SaveMasterAccountDetail("BorrowerConstitutionList", newData)

	return err
}
