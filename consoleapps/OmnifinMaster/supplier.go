package main

import (
	"github.com/eaciit/dbox"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"

	h "eaciit/x10/consoleapps/OmnifinMaster/helpers"
)

// transformSupplier copy all field from remote source,
// with additional field, "fromOmnifin"
func transformSupplier(in tk.M) tk.M {
	// tk.Printfn("%v", in)
	p := make(tk.M)
	// copy all elements
	for key, val := range in {
		p[key] = val
	}

	p["name"] = in.GetString("dealer_desc")
	p["fromOmnifin"] = true

	return p
}

// SaveSupplier save data into MasterSupplier
// If data already exists, just switch fromOmnifin to true
// If data doesn't exists, save all field into MasterSupplier
func SaveSupplier(data interface{}) error {
	newSupplier := TransformMaster("manufactureSupplier", data, transformSupplier)
	// debug
	// tk.Printfn("%v", newSupplier)

	conn, err := h.GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	qinsert := conn.NewQuery().From("MasterSupplier").SetConfig("multiexec", true).Save()
	defer qinsert.Close()

	for _, supplier := range newSupplier {
		// tk.Printfn("%v", supplier)
		q, err := conn.
			NewQuery().
			Select().
			From("MasterSupplier").
			Where(dbox.Eq("name", supplier["name"])).
			Cursor(nil)
		if err != nil {
			return err
		}

		res := []tk.M{}
		q.Fetch(&res, 0, true)

		// data doesn't exists, save new data
		if len(res) == 0 {
			// tk.Printfn("Save %s", supplier["name"])
			// create new _id
			supplier.Set("_id", bson.NewObjectId())
			newdata := map[string]interface{}{"data": supplier}
			err = qinsert.Exec(newdata)
			if err != nil {
				return err
			}

			continue
		}

		// data exists, change fromOmnifin to true if not set
		for _, r := range res {
			if r.Get("fromOmnifin", false).(bool) {
				// tk.Printfn("Skip fromOmnifin %s", r["name"])
				continue
			}

			// tk.Printfn("Setup fromOmnifin %s", r["name"])
			r["fromOmnifin"] = true
			newdata := map[string]interface{}{"data": r}
			err = qinsert.Exec(newdata)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
