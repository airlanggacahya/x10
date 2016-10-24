package controllers

import (
	"eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"time"
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
	q := tk.M{}.Set("where", db.Eq("username", formData.UserName))
	cur, err := c.Ctx.Find(new(SysUserModel), q)
	if err != nil {
		return tk.M{}.Set("Valid", false).Set("Message", err.Error())
	}
	res := make([]SysUserModel, 0)
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
		if helper.GetMD5Hash(formData.Password) == resUser.Password {
			if resUser.Enable == true {

				//resroles := make([]SysRolesModel, 0)
				crsR, errR := c.Ctx.Find(new(SysRolesModel), tk.M{}.Set("where", db.Eq("name", resUser.Roles)))
				if errR != nil {
					return c.SetResultInfo(true, errR.Error(), nil)
				}
				errR = crsR.Fetch(&resroles, 0, false)
				if errR != nil {
					return c.SetResultInfo(true, errR.Error(), nil)
				}
				defer crsR.Close()

				k.SetSession("userid", resUser.Id.Hex())
				k.SetSession("username", resUser.Username)
				k.SetSession("fullname", resUser.Fullname)
				k.SetSession("usermodel", resUser)
				k.SetSession("roles", resroles)
				k.SetSession("rolesid", resroles[0].Id.Hex())
				k.SetSession("stime", time.Now())
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
