package core

import (
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	"errors"

	tk "github.com/eaciit/toolkit"
)

// TransformMaster convert from data remote into specific Items
// transfunc is responsible for transformating data format between source and desctination
// It work like array map
func TransformMaster(parentField string, data interface{}, transfunc func(tk.M) tk.M) []tk.M {
	var ret []tk.M
	source := data.(map[string]interface{})[parentField]

	// tk.Printfn("%v", reflect.TypeOf(source))
	/*
		The thing is, sometimes we found the type is []interface{},
		which really is []map[string]interface
		It's kinda confusing.

		So let's check the type and cast them.
	*/
	switch products := source.(type) {
	default:
		return ret
	case []interface{}:
		for _, product := range products {
			// tk.Printfn("%v", reflect.TypeOf(product))
			p := product.(map[string]interface{})
			ret = append(ret, transfunc(p))
		}
	case []map[string]interface{}:
		for _, product := range products {
			// tk.Printfn("%v", reflect.TypeOf(product))
			ret = append(ret, transfunc(product))
		}
	}

	return ret
}

// SaveMasterAccountDetail update Items data in MasterAccountDetail
// field denote Field Name that wants to be updated
func SaveMasterAccountDetail(field string, data interface{}) error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	q, err := conn.
		NewQuery().
		Select().
		From("MasterAccountDetail").
		Cursor(nil)

	if err != nil {
		return err
	}

	// fetch one MasterAccountDetail data
	var account tk.M
	err = q.Fetch(&account, 1, true)
	if err != nil {
		return err
	}

	accData := account.Get("Data")
	if accData == nil {
		return errors.New("MasterAccountDetail.Data is nil")
	}

	// casting to array of interface
	for _, val := range accData.([]interface{}) {
		v := val.(tk.M)
		if v.Get("Field") != field {
			continue
		}

		// found, populate with our data
		v.Set("Items", data)
	}

	qinsert := conn.NewQuery().From("MasterAccountDetail").SetConfig("multiexec", true).Save()
	defer qinsert.Close()

	newdata := map[string]interface{}{"data": account}
	err = qinsert.Exec(newdata)
	if err != nil {
		return err
	}

	return nil
}

func removeDuplicateStringField(data []tk.M, field string) []tk.M {
	ret := []tk.M{}
	sets := make(map[string]bool)

	for _, val := range data {
		var key = val.GetString(field)
		if _, found := sets[key]; found {
			continue
		}

		sets[key] = true
		ret = append(ret, val)
	}

	return ret
}
