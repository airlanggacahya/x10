package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type MasterSuplierController struct {
	*BaseController
}

func (c *MasterSuplierController) Default(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/loading.html"}

	return DataAccess
}

func (c *MasterSuplierController) GetMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	csr, err := c.Ctx.Find(new(MasterSuplier), nil)
	defer csr.Close()
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	results := make([]MasterSuplier, 0)
	err = csr.Fetch(&results, 0, false)

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", results)

}

func (c *MasterSuplierController) DeleteMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := tk.M{}

	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []MasterSuplier{}
	query := tk.M{"where": db.Eq("_id", bson.ObjectIdHex(payload["Id"].(string)))}
	csr, err := c.Ctx.Find(new(MasterSuplier), query)
	defer csr.Close()
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	if len(res) > 0 {
		founds := c.CheckADLeadStruct(res[0])

		if founds == false {
			err = c.Ctx.Delete(&res[0])
			if err != nil {
				c.SetResultInfo(true, err.Error(), nil)
			}

			return c.SetResultInfo(false, "delete success", nil)
		} else {
			return c.SetResultInfo(false, "delete cancel", nil)
		}
	}

	return c.SetResultInfo(false, "delete cancel", nil)

}

func (c *MasterSuplierController) SaveMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := []tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	err, _, status := c.SaveMasterAccountDetails(payload)

	c.WriteLog(status)

	if status == true {
		mp := NewMasterSuplier()
		// results := []MasterSuplier{}
		for _, o := range payload {
			if o["Id"] != "" {
				mp.Id = bson.ObjectIdHex(o["Id"].(string))
			} else {
				mp.Id = bson.NewObjectId()
			}

			mp.AddressLine1 = o["AddressLine1"].(string)
			mp.BankAccount = o["BankAccount"].(string)
			mp.BankBranch_id = o["BankBranch_id"].(string)
			mp.BankId = o["BankId"].(string)
			mp.BpType = o["BpType"].(string)
			mp.Country = o["Country"].(string)
			mp.Name = o["Name"].(string)
			mp.DealerDesc_1 = o["DealerDesc_1"].(string)
			mp.DealerId = o["DealerId"].(string)
			mp.District = o["District"].(string)
			mp.EmpanelledStatus = o["EmpanelledStatus"].(string)
			mp.LastUpdate = o["LastUpdate"].(string)
			mp.Pincode = o["RecStatus"].(string)
			mp.RecStatus = o["RecStatus"].(string)
			mp.State = o["State"].(string)
			mp.UseInAD = o["UseInAD"].(bool)
			mp.FromOmnifin = o["FromOmnifin"].(bool)

			save := c.Ctx.Save(mp)
			if save != nil {
				c.SetResultInfo(false, save.Error(), nil)
			}
		}

		return c.SetResultInfo(false, "success", nil)
	} else {
		return c.SetResultInfo(true, "cancel save", nil)
	}
}

func (c *MasterSuplierController) SaveMasterAccountDetails(masterSuplier []tk.M) (error, string, bool) {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err, "error open connection", false
	}

	masterAccountDetails := []tk.M{}

	csr, err := conn.NewQuery().
		From("MasterAccountDetail").
		Cursor(nil)

	if err != nil {
		panic(err)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&masterAccountDetails, 0, false)
	if err != nil {
		return err, "error get data", false
	}

	masterSuplierTemp, founds := c.CheckADLeadTkM(masterSuplier)

	if founds == false {

		if len(masterSuplierTemp) > 0 {
			qinsert := conn.NewQuery().
				From("MasterAccountDetail").
				SetConfig("multiexec", true).
				Save()

			masterAccount := tk.M{}
			masterAccountItems := []tk.M{}

			masterAccount.Set("Field", "LeadDistributors")
			for _, v := range masterSuplierTemp {
				if v["UseInAD"] == true {
					masterAccountItems = append(masterAccountItems, tk.M{"name": v["Name"]})
				}
			}

			masterAccount.Set("Items", masterAccountItems)

			dt := masterAccountDetails[0]
			data := dt.Get("Data").([]interface{})

			for i, val := range data {
				v := val.(tk.M)
				if v.GetString("Field") == "LeadDistributors" {
					v.Set("Items", masterAccountItems)
					data[i] = v
					masterAccountDetails[0].Set("Data", data)
					break
				}
			}

			insdata := map[string]interface{}{"data": masterAccountDetails[0]}
			em := qinsert.Exec(insdata)
			if em != nil {
				c.WriteLog(em)
				return em, "save not success", false
			}

			return err, "save success", true
		}

		return err, "save success", true
	} else {
		return nil, "save not success", false
	}
}

func (c *MasterSuplierController) CheckADLeadTkM(masterSuplier []tk.M) ([]tk.M, bool) {

	masterSupplierTemp := []tk.M{}

	leadDistributors := c.GetAccountDetailLeadDistributors()

	founds := false
	for _, v := range leadDistributors {
		temp := v["_id"].(tk.M)
		for _, v1 := range masterSuplier {
			if temp["accountsetupdetails_leaddistributor"] == v1["Name"] && v1["UseInAD"] == false && temp["accountsetupdetails_leaddistributor"] != "" {
				founds = true
				break
			} else if v1["UseInAD"] == true {
				masterSupplierTemp = append(masterSupplierTemp, v1)
			}
		}

		if founds == true {
			break
		}
	}

	return masterSupplierTemp, founds
}

func (c *MasterSuplierController) CheckADLeadStruct(masterSuplierStruct MasterSuplier) bool {

	leadDistributors := c.GetAccountDetailLeadDistributors()

	founds := false
	for _, v := range leadDistributors {
		temp := v["_id"].(tk.M)

		if temp["accountsetupdetails_leaddistributor"] == masterSuplierStruct.Name && masterSuplierStruct.UseInAD == false && temp["accountsetupdetails_leaddistributor"] != "" {
			founds = true
			break
		}
	}

	return founds
}

func (c *MasterSuplierController) GetAccountDetailLeadDistributors() []tk.M {

	leadDistributors := []tk.M{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return leadDistributors
	}

	csr, err := conn.NewQuery().From("AccountDetails").Group("accountsetupdetails.leaddistributor").Cursor(nil)

	if err != nil {
		panic(err)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&leadDistributors, 0, false)
	if err != nil {
		return leadDistributors
	}

	return leadDistributors
}
