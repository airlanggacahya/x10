package controllers

import (
	. "eaciit/x10/webapps/connection"
	"eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"strings"
	"time"

	"github.com/eaciit/cast"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type LoginController struct {
	*BaseController
}

func (c *LoginController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	k.Config.LayoutTemplate = ""
	k.Config.IncludeFiles = []string{"shared/loading.html"}
	return ""
}

func (c *LoginController) Do(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputJson
	formData := struct {
		UserName   string
		Password   string
		RememberMe bool
	}{}
	message := ""
	isValid := false
	err := k.GetPayload(&formData)
	if err != nil {
		c.WriteLog(err)
		message = "Backend Error " + err.Error()
	}
	q := tk.M{}.Set("where", db.Eq("userid", formData.UserName))
	cur, err := c.Ctx.Find(new(NewUser), q)
	if err != nil {
		return tk.M{}.Set("Valid", false).Set("Message", err.Error())
	}
	res := make([]NewUser, 0)
	resroles := make([]SysRolesModel, 0)
	resurl := []tk.M{}
	//	defer c.Ctx.Close()
	defer cur.Close()
	err = cur.Fetch(&res, 0, false)
	if err != nil {
		return tk.M{}.Set("Valid", false).Set("Message", err.Error())
	}
	if len(res) > 0 {
		resUser := res[0]
		if helper.GetMD5Hash(formData.Password) == resUser.Catpassword {
			if resUser.Catstatus == "Enable" {
				wh := []*db.Filter{}

				for _, valx := range resUser.Catrole {
					wh = append(wh, db.Eq("name", valx))
				}

				//resroles := make([]SysRolesModel, 0)
				crsR, errR := c.Ctx.Find(new(SysRolesModel), tk.M{}.Set("where", db.Or(wh...)))
				if errR != nil {
					return c.SetResultInfo(true, errR.Error(), nil)
				}
				errR = crsR.Fetch(&resroles, 0, false)
				if errR != nil {
					return c.SetResultInfo(true, errR.Error(), nil)
				}
				defer crsR.Close()

				//Get Customer
				k.SetSession("CustomerProfileData", nil)
				for _, valx := range resroles {
					if valx.Status {
						c.GetListUsersByRole(k, valx, resUser.Userid)
					}
				}

				k.SetSession("userid", resUser.Id)
				k.SetSession("username", resUser.Userid)
				k.SetSession("fullname", resUser.Username)
				k.SetSession("usermodel", resUser)
				k.SetSession("roles", resroles)
				k.SetSession("rolesid", resroles[0].Id.Hex())
				k.SetSession("stime", time.Now())

				isCustomRole := false

				for _, valx := range resroles {
					if strings.ToUpper(valx.Roletype) == "CUSTOM" {
						isCustomRole = true
						break
					}
				}
				k.SetSession("isCustomRole", isCustomRole)

				isValid = true

				cursor, e := c.Ctx.Connection.NewQuery().Select().From("TopMenu").Where(db.Eq("Title", resroles[0].Landing)).Cursor(nil)
				if e != nil {
					return c.SetResultInfo(true, e.Error(), nil)
				}

				e = cursor.Fetch(&resurl, 0, false)
				defer cursor.Close()

			} else {
				//c.InsertActivityLog("Login", "Login DISABLED", k)
				message = "Your account is disabled, please contact administrator to enable it."
			}
		} else {
			//c.InsertActivityLog("Login", "Login FAILED", k)
			message = "Invalid Username or password!"
		}
	} else {

		//c.InsertActivityLog("Login", "Login FAILED", k)
		return "Invalid Username or password!"
	}
	//c.InsertActivityLog("Login", "Login", k)
	return tk.M{}.Set("Valid", isValid).Set("Message", message).Set("Roles", resurl)
}

func (b *LoginController) SessionCheckTimeOut(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	lastActive := k.Session("stime").(time.Time)
	duration := time.Since(lastActive)
	tk.Println("last active: ", lastActive.Format("2006-01-02 15:03:04.99"), ";Now: ", time.Now().Format("2006-01-02 15:03:04.99"), ";Duration: ", duration.Minutes())
	if duration.Minutes() > 14 {
		ret.IsError = true
		ret.Data = "/login/default"
	}
	return ret
}

func (b *LoginController) HeartBeat(k *knot.WebContext) interface{} {
	b.IsAuthenticate(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	k.SetSession("stime", time.Now())
	return ret
}

func (d *LoginController) GetListUsersByRole(k *knot.WebContext, Role SysRolesModel, userid string) error {
	Type := Role.Roletype
	Dealvalue := Role.Dealvalue

	var dbFilter []*db.Filter

	Dv, err := d.GetDealValue(Dealvalue)
	if err != nil {
		tk.Println(err.Error())
		return err
	}

	if len(Dv) > 0 {
		curDv := Dv[0]
		opr := curDv.GetString("operator")
		var1 := curDv.GetFloat64("var1")
		var2 := curDv.GetFloat64("var2")

		switch opr {
		case "lt":
			dbFilter = append(dbFilter, db.Lt("loandetails.proposedloanamount", var1))
		case "lte":
			dbFilter = append(dbFilter, db.Lte("loandetails.proposedloanamount", var1))
		case "gt":
			dbFilter = append(dbFilter, db.Gt("loandetails.proposedloanamount", var1))
		case "gte":
			dbFilter = append(dbFilter, db.Gte("loandetails.proposedloanamount", var1))
		case "between":
			dbFilter = append(dbFilter, db.And(db.Gte("loandetails.proposedloanamount", var1), db.Lte("loandetails.proposedloanamount", var2)))
		}
	}
	tk.Printf("--------- DV %v ----------- \n", Dv)
	tk.Printf("--------- ROLETYPE %v ----------- \n", Type)
	tk.Printf("--------- USERID %v ----------- \n", userid)
	switch strings.ToUpper(Type) {
	case "CA":
		dbFilter = append(dbFilter, db.Eq("accountsetupdetails.CreditAnalystId", userid))
	case "RM":
		dbFilter = append(dbFilter, db.Eq("accountsetupdetails.RmNameId", userid))
	case "CUSTOM":
		all := []interface{}{}

		for _, valx := range Role.Branch {
			all = append(all, cast.ToString(valx))
		}

		if len(all) > 0 {
			dbFilter = append(dbFilter, db.In("accountsetupdetails.citynameid", all...))
		} else {
			dbFilter = append(dbFilter, db.Ne("_id", ""))
		}
	default:
		dbFilter = append(dbFilter, db.Ne("_id", ""))

	}

	ret := []tk.M{}

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		tk.Println(err.Error())
		return err
	}

	cur, err := cn.
		NewQuery().
		Select("_id").
		Where(db.And(dbFilter...)).
		From("AccountDetails").
		Cursor(nil)

	if err != nil {
		tk.Println(err.Error())
		return err
	}

	cur.Fetch(&ret, 0, true)
	tk.Printf("-------- AD %v -------- \n", ret)

	customerids := []interface{}{}
	for _, val := range ret {
		customerids = append(customerids, val.GetString("_id"))
	}

	tk.Printf("---- IDS %v ----\n", customerids)

	var caFilter []*db.Filter
	if len(ret) > 0 {
		caFilter = append(caFilter, db.In("_id", customerids...))
	}

	if k.Session("CustomerProfileData") != nil {
		currSess := k.Session("CustomerProfileData").([]tk.M)
		customeridx := []interface{}{}
		for _, valx := range currSess {
			customeridx = append(customeridx, valx.GetString("_id"))
		}
		caFilter = append(caFilter, db.Nin("_id", customeridx...))
	}

	cur, err = cn.
		NewQuery().
		Select("_id", "applicantdetail.DealNo", "applicantdetail.CustomerID", "applicantdetail.CustomerName").
		Where(db.And(caFilter...)).
		From("CustomerProfile").
		Cursor(nil)

	if err != nil {
		tk.Println(err.Error())
		return err
	}

	cur.Fetch(&ret, 0, true)

	for idx, valx := range ret {
		appdet := valx.Get("applicantdetail").(tk.M)
		ret[idx] = valx.Set("FullName", cast.ToString(appdet.GetInt("CustomerID"))+" - "+appdet.GetString("CustomerName"))
	}

	if k.Session("CustomerProfileData") == nil {
		k.SetSession("CustomerProfileData", ret)
	} else {
		currSess := k.Session("CustomerProfileData").([]tk.M)
		currSess = append(currSess, ret...)
		k.SetSession("CustomerProfileData", currSess)
	}

	tk.Printf("------------ CP -- %v -- CP ---------------\n", k.Session("CustomerProfileData"))

	return nil
}

func (d *LoginController) GetDealValue(id string) ([]tk.M, error) {
	ret := []tk.M{}

	if id == "" {
		return ret, nil
	}

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		tk.Println(err.Error())
		return ret, err
	}
	tk.Printf("---- ID ----", id)
	cur, err := cn.
		NewQuery().
		Where(db.Eq("_id", bson.ObjectIdHex(id))).
		From("DealValueMaster").
		Cursor(nil)

	if err != nil {
		tk.Println(err.Error())
		return ret, err
	}

	cur.Fetch(&ret, 0, true)

	return ret, nil
}
