package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/dbox"
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
		c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", results)

}

func (c *MasterSuplierController) SaveMasterAccountDetails(masterSuplier []tk.M) (error, string, bool) {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return err, "error open connection", false
	}

	leadDistributors := c.GetAccountDetailLeadDistributors()

	masterAccountDetails := []tk.M{}

	filter := []*dbox.Filter{}
	filter = append(filter, dbox.Eq("Field", "LeadDistributors"))

	csr, err := conn.NewQuery().
		From("MasterAccountDetail").
		Where(filter...).
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

		if len(masterAccountDetails) > 0 {
			masterAccount.Set("_id", masterAccountDetails[0]["_id"])
		} else {
			masterAccount.Set("_id", bson.NewObjectId())
		}

		masterAccount.Set("Field", "LeadDistributors")

		for _, v := range masterSuplier {
			if v["UseInAD"] == true {
				masterAccountItems = append(masterAccountItems, tk.M{"name": v["Name"]})
			}
		}

		masterAccount.Set("Items", masterAccountItems)

		insdata := map[string]interface{}{"data": masterAccount}
		em := qinsert.Exec(insdata)
		if em != nil {
			return em, "save not success", false
		}

		return em, "save success", true

	} else {
		return nil, "save not success", false
	}
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
