package main

func SaveScheme(data interface{}) error {
	newScheme := TransformMaster("schemeMasterList", "schemeDesc", data)
	// debug
	// tk.Printfn("%v", newProduct)
	err := SaveMasterAccountDetail("Scheme", newScheme)

	if err != nil {
		return err
	}

	return nil
}
