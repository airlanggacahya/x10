package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	// "fmt"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "gopkg.in/mgo.v2/bson"
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

func (c *MasterSuplierController) SaveMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := []tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	c.SaveMasterAccountDetails(payload)

	// mp := NewMasterSuplier()
	// results := []MasterSuplier{}
	// for _, o := range payload {
	// 	query := tk.M{"where": dbox.Eq("_id", bson.ObjectIdHex(o["Id"].(string)))}

	// 	csr, err := c.Ctx.Find(new(MasterSuplier), query)
	// 	defer csr.Close()
	// 	if err != nil {
	// 		return c.SetResultInfo(true, err.Error(), nil)
	// 	}

	// 	err = csr.Fetch(&results, 0, false)
	// 	if err != nil {
	// 		return c.SetResultInfo(true, err.Error(), nil)
	// 	}

	// 	fmt.Println("-------->>>>>", results[0].Id)
	// 	mp.Id = bson.ObjectIdHex(o["Id"].(string))
	// 	mp.AddressLine1 = results[0].AddressLine1
	// 	mp.BankAccount = results[0].BankAccount
	// 	mp.BankBranch_id = results[0].BankBranch_id
	// 	mp.BankId = results[0].BankId
	// 	mp.BpType = results[0].BpType
	// 	mp.Country = results[0].Country
	// 	mp.Name = results[0].Name
	// 	mp.DealerDesc_1 = results[0].DealerDesc_1
	// 	mp.DealerId = results[0].DealerId
	// 	mp.District = results[0].District
	// 	mp.EmpanelledStatus = results[0].EmpanelledStatus
	// 	mp.LastUpdate = results[0].LastUpdate
	// 	mp.Pincode = results[0].RecStatus
	// 	mp.RecStatus = results[0].RecStatus
	// 	mp.State = results[0].State
	// 	mp.UseInAD = o["UseInAD"].(bool)
	// 	mp.FromOmnifin = results[0].FromOmnifin

	// 	save := c.Ctx.Save(mp)
	// 	if save != nil {
	// 		c.SetResultInfo(false, save.Error(), nil)
	// 	}

	// }

	return c.SetResultInfo(false, "success", nil)

}

func (c *MasterSuplierController) SaveMasterAccountDetails(masterSuplier []tk.M) (error, string, bool) {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err, "error open connection", false
	}

	leadDistributors := c.GetAccountDetailLeadDistributors()
	_ = leadDistributors

	masterAccountDetails := []tk.M{}
	masterSupplierTemp := []tk.M{}
	_ = masterSupplierTemp

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

	if founds == false {
		qinsert := conn.NewQuery().
			From("MasterAccountDetail").
			SetConfig("multiexec", true).
			Save()

		masterAccount := tk.M{}
		masterAccountItems := []tk.M{}

		masterAccount.Set("Field", "LeadDistributors")
		for _, v := range masterSuplier {
			if v["UseInAD"] == true {
				masterAccountItems = append(masterAccountItems, tk.M{"name": v["Name"]})
			}
		}

		masterAccount.Set("Items", masterAccountItems)

		// founds = false
		// // c.WriteLog(masterAccountDetails)
		// for i, v := range masterAccountDetails {
		// 	if v["Data"] != nil {
		// 		temp := v["Data"].([]interface{})
		// 		for i1, v1 := range temp {
		// 			if v1.(tk.M)["Field"] == "LeadDistributors" {
		// 				masterAccountDetails[i]["Data"].([]interface{})[i1] = masterAccount
		// 				founds = true
		// 				break
		// 			}
		// 		}
		// 	}

		// 	if founds == false {
		// 		masterAccountDetails[i]["Data"] = append(masterAccountDetails[i]["Data"].([]interface{}), masterAccount)
		// 		break
		// 	}
		// }

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

		return em, "save success", true

	} else {
		return nil, "save not success", false
	}

	return nil, "save not success", false
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
