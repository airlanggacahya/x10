package models

import (
	. "eaciit/x10/webapps/connection"

	"github.com/eaciit/toolkit"
)

type MasterAccountKey struct {
	Field        string
	FormulaField string
}

type MasterAccountItem struct {
	Name     string
	Operator string
	Value1   interface{}
	Value2   interface{}
}

type MasterAccountDetail struct {
	Key   MasterAccountKey
	Items []MasterAccountItem
}

func GetMasterAccountDetail() ([]MasterAccountDetail, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	csr, err := conn.NewQuery().
		From("MasterAccountDetail").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return nil, err
	}

	raw := []toolkit.M{}
	err = csr.Fetch(&raw, 0, false)
	if err != nil {
		return nil, err
	}

	res := []MasterAccountDetail{}
	if len(raw) == 0 {
		return res, nil
	}

	for _, each := range raw[0]["Data"].([]interface{}) {
		rawValue, _ := toolkit.ToM(each)

		key := MasterAccountKey{}
		key.Field = rawValue.GetString("Field")
		key.FormulaField = rawValue.GetString("FormulaField")

		if key.Field == "_id" {
			continue
		}

		rows := []MasterAccountItem{}

		for _, eachItem := range rawValue["Items"].([]interface{}) {
			itemRaw, _ := toolkit.ToM(eachItem)

			item := MasterAccountItem{}
			item.Name = itemRaw.GetString("name")
			item.Operator = itemRaw.GetString("operator")
			item.Value1 = itemRaw.GetString("value1")
			item.Value2 = itemRaw.GetString("value2")

			rows = append(rows, item)
		}

		item := MasterAccountDetail{}
		item.Key = key
		item.Items = rows

		res = append(res, item)
	}

	return res, nil
}

// GetMasterAccountDetailv2 is a complete data return
func GetMasterAccountDetailv2() (toolkit.M, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	csr, err := conn.NewQuery().
		From("MasterAccountDetail").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return nil, err
	}

	raw := []toolkit.M{}
	err = csr.Fetch(&raw, 0, false)
	if err != nil {
		return nil, err
	}

	res := toolkit.M{}

	for _, each := range raw[0]["Data"].([]interface{}) {
		rawValue, _ := toolkit.ToM(each)

		field := rawValue.GetString("Field")

		rows := []toolkit.M{}

		for _, eachItem := range rawValue["Items"].([]interface{}) {
			item, _ := toolkit.ToM(eachItem)
			rows = append(rows, item)
		}

		res[field] = rows
	}

	return res, nil
}
