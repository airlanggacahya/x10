package core

import (
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	"errors"

	tk "github.com/eaciit/toolkit"
)

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

	// casting to array of interface
	accData, ok := account.Get("Data").([]interface{})
	if !ok {
		return errors.New("Unable to access Data")
	}

	found := false
	for _, val := range accData {
		v := val.(tk.M)
		if v.Get("Field") != field {
			continue
		}

		// found, populate with our data
		v.Set("Items", data)
		found = true
	}

	// not found, create it own field
	if !found {
		account.Set("Data", append(accData, tk.M{"Field": field, "Items": data}))
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
