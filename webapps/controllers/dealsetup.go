package controllers

import (
	. "eaciit/x10/webapps/connection"
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "gopkg.in/mgo.v2/bson"
	"time"
)

type DealSetUpController struct {
	*BaseController
}

func (c *DealSetUpController) Default(k *knot.WebContext) interface{} {
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
		DataAccess.Fullname = o["Fullname"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html", "dealsetup/top.html", "dealsetup/bottom.html"}

	return DataAccess
}

func (c *DealSetUpController) Accept(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		res.SetError(err)
		return res
	}

	filters := []*dbox.Filter{}

	cid := payload.GetString("custid")
	dealno := payload.GetString("dealno")

	if dealno != "" && cid != "" {
		filters = append(filters, dbox.Eq("dealNo", dealno))
		filters = append(filters, dbox.Eq("dealCustomerId", cid))
	} else {
		res.SetError(errors.New("Parameter Invalid"))
		return res
	}

	csr, e := cn.NewQuery().
		Where(dbox.And(filters...)).
		From("OmnifinXML").
		Cursor(nil)
	defer csr.Close()

	if e != nil {
		res.SetError(e)
		return res
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	contentbody := tk.M{}

	if len(results) > 0 {
		contentbody = results[len(results)-1]
	} else {
		res.SetError(errors.New("No Data Found"))
		return res
	}

	crList := []tk.M{}
	crL := contentbody.Get("crDealCustomerRoleList").([]interface{})

	for _, varL := range crL {
		crList = append(crList, varL.(tk.M))
	}

	_, _, err = GenerateCustomerProfile(contentbody, crList, cid, dealno)
	if err != nil {
		res.SetError(err)
		return res
	}

	_, _, err = GenerateAccountDetail(contentbody, crList, cid, dealno)
	if err != nil {
		res.SetError(err)
	}

	err = GenerateInternalRTR(contentbody, cid, dealno)
	if err != nil {
		res.SetError(err)
	}

	comp := FindCompany(crList, contentbody.GetString("dealCustomerId"))

	customerDtl := comp.Get("customerDtl").(tk.M)
	err = SaveMaster(cid, dealno, customerDtl.GetString("customerName"))
	if err != nil {
		res.SetError(err)
	}

	err = updateDealSetup(cid, dealno, "all", "Under Process")
	if err != nil {
		res.SetError(err)
	}

	return res
}

func updateDealSetup(cid string, dealno string, formname string, formstatus string) error {

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		return err
	}

	csr, e := cn.NewQuery().
		Where(dbox.Eq("customerprofile._id", cid+"|"+dealno)).
		From("DealSetup").
		Cursor(nil)
	defer csr.Close()

	if e != nil {
		return err
	}

	result := tk.M{}
	err = csr.Fetch(&result, 1, false)
	if err != nil {
		return err
	}

	infos := result.Get("info").(tk.M)

	switch formname {
	case "ds":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("myInfo", myInfos)
	case "ca":
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("caInfo", caInfos)
	case "cibil":
		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("cibilInfo", cibilInfos)
	case "bsi":
		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("bsiInfo", bsiInfos)
	case "sbd":
		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("sbdInfo", sbdInfos)
	case "ad":
		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("adInfo", adInfos)
	case "ba":
		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("baInfo", baInfos)
	case "ertr":
		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("ertrInfo", ertrInfos)
	case "irtr":
		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("irtrInfo", irtrInfos)
	case "dd":
		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("ddInfo", ddInfos)
	case "all":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("myInfo", myInfos)
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("caInfo", caInfos)

		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("cibilInfo", cibilInfos)

		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("bsiInfo", bsiInfos)

		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("sbdInfo", sbdInfos)

		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("adInfo", adInfos)

		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("baInfo", baInfos)

		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("ertrInfo", ertrInfos)

		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("irtrInfo", irtrInfos)

		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus))
		infos.Set("ddInfo", ddInfos)
	}

	result.Set("info", infos)

	qinsert := cn.NewQuery().
		From("DealSetup").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": result}
	err = qinsert.Exec(csc)
	if err != nil {
		return err
	}

	return nil
}
