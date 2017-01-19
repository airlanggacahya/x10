package main

import (
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	"errors"

	tk "github.com/eaciit/toolkit"
)

func TransformMaster(parentField string, data interface{}, transfunc func(tk.M) tk.M) []tk.M {
	var ret []tk.M
	products := data.(map[string]interface{})[parentField].([]map[string]interface{})
	for _, product := range products {
		ret = append(ret, transfunc(product))
	}

	return ret
}

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
