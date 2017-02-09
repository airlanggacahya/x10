package core

import (
	hp "eaciit/x10/webapps/helper"

	"github.com/eaciit/dbox"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"

	h "eaciit/x10/consoleapps/OmnifinMaster/helpers"
)

type SupplierMaster struct {
	DealerId         float64     `json:"dealer_id"`
	DealerDesc       string      `json:"dealer_desc"`
	DealerDescL      string      `json:"dealer_desc_l"`
	BpType           EmptyString `json:"bp_type"`
	RecStatus        EmptyString `json:"rec_status"`
	BankId           int         `json:"bank_id"`
	BankBranchId     int         `json:"bank_branch_id"`
	BankAccount      EmptyString `json:"bank_account"`
	BranchMicrCode   EmptyString `json:"branch_micr_code"`
	BranchIfcsCode   EmptyString `json:"branch_ifcs_code"`
	AddressLine1     EmptyString `json:"address_line1"`
	AddressLine2     EmptyString `json:"address_line2"`
	Country          float64     `json:"country"`
	State            float64     `json:"state"`
	District         float64     `json:"district"`
	Pincode          EmptyString `json:"pincode"`
	ContractPerson   EmptyString `json:"contract_person"`
	MobileNo         EmptyString `json:"mobile_no"`
	LandlineNo       EmptyString `json:"landline_no"`
	Email            EmptyString `json:"email"`
	RegistrationNo   EmptyString `json:"registration_no"`
	EmpanelledStatus EmptyString `json:"empanelled_status"`
	Pan              EmptyString `json:"pan"`
	LastUpdate       EmptyString `json:"lastUpdate"`
	AddressLine3     EmptyString `json:"address_LINE3"`
}

func saveSupplier(newData []tk.M) error {
	conn, err := h.GetConnection()
	defer conn.Close()
	if err != nil {
		return err
	}

	qinsert := conn.NewQuery().From("MasterSupplier").SetConfig("multiexec", true).Save()
	defer qinsert.Close()

	for _, supplier := range newData {
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

func SaveSupplier(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.SupplierMasterList {
		p := tk.M{}
		p["name"] = hp.ToWordCase(val.DealerDesc)
		p["useInAD"] = false
		p["fromOmnifin"] = true

		p["addressLine1"] = val.AddressLine1
		p["bankAccount"] = val.BankAccount
		p["bankBranch_id"] = val.BankBranchId
		p["bankId"] = val.BankId
		p["bpType"] = val.BpType
		p["country"] = val.Country
		p["dealerDesc_l"] = val.DealerDescL
		p["dealerId"] = val.DealerId
		p["district"] = val.District
		p["empanelledStatus"] = val.EmpanelledStatus
		p["lastUpdate"] = val.LastUpdate
		p["pincode"] = val.Pincode
		p["recStatus"] = val.RecStatus
		p["state"] = val.State
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	return saveSupplier(newData)
}
