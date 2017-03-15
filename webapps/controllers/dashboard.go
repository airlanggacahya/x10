package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/cast"

	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"strings"
	"time"
)

type DashboardController struct {
	*BaseController
}

func (c *DashboardController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/loading.html",
		"shared/leftfilter.html",

		"dashboard/alert_summary.html",
		"dashboard/time_tracker.html",
	}

	return DataAccess
}

func (c *DashboardController) GetCurrentDate(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	dateNow := time.Now().Format("2006-01-02")
	timeNow := time.Now().Format("15:04:05")
	ret.Data = tk.M{}.Set("CurrentDate", dateNow).Set("CurrentTime", timeNow)
	return ret
}

func (c *DashboardController) GetBranch(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	conn, err := GetConnection()
	defer conn.Close()
	res := new(tk.Result)
	if err != nil {

		res.SetError(err)
		return err
	}

	query, err := conn.NewQuery().From("MasterAccountDetail").Cursor(nil)
	if err != nil {

		res.SetError(err)
		return err
	}
	results := []tk.M{}
	err = query.Fetch(&results, 0, false)
	defer query.Close()

	if err != nil {

		res.SetError(err)
		return err
	}

	if (len(results)) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	data := results[0]
	result := []tk.M{}

	for _, val := range data["Data"].([]interface{}) {
		newdt, _ := tk.ToM(val)
		fl := newdt.GetString("Field")

		if fl == "Branch" {
			result = append(result, newdt)
		}

	}

	return &result
}

func (c *DashboardController) GetNotes(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	conn, err := GetConnection()
	if err != nil {
		res.SetError(err)
		return err
	}
	defer conn.Close()

	query, err := conn.NewQuery().Where(dbox.Eq("_id", k.Session("username").(string))).From(new(DashboardNoteModel).TableName()).Cursor(nil)
	if err != nil {

		res.SetError(err)
		return err
	}

	results := DashboardNoteModel{}
	err = query.Fetch(&results, 1, false)
	if err != nil {
		res.SetError(err)
		return err
	}
	defer query.Close()

	res.SetData(results)

	return res
}

func (c *DashboardController) SaveNotes(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := new(DashboardNoteModel)
	err := k.GetPayload(payload)
	if err != nil {
		return res.SetError(err)
	}

	cMongo, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}

	defer cMongo.Close()

	q := cMongo.NewQuery().SetConfig("multiexec", true).From(payload.TableName()).Save()

	defer q.Close()

	payload.Id = k.Session("username").(string)

	err = q.Exec(tk.M{"data": payload})
	if err != nil {
		return res.SetError(err)
	}

	res.SetData(payload)

	return res
}

func (c *DashboardController) GetFilter(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return res.SetError(err)
	}

	query, err := conn.NewQuery().From("DashboardFilter").Where(dbox.Eq("_id", k.Session("username").(string))).Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}

	result := []DashboardFilterModel{}
	err = query.Fetch(&result, 0, false)
	defer query.Close()

	if err != nil {
		return res.SetError(err)
	}

	if len(result) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	return c.SetResultInfo(false, "success", &result)
}

func (c *DashboardController) GetNotification(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	days := payload.GetInt("days")
	re, err := fetchNotification(days, "myInfo", k)
	if err != nil {
		return res.SetError(err)
	}
	rexnote, err := fetchNotesNotification(k)
	if err != nil {
		return res.SetError(err)
	}

	for _, val := range rexnote {
		re = append(re, val)
	}

	res.SetData(re)

	return res
}

func fetchNotesNotification(k *knot.WebContext) ([]string, error) {
	res := []string{}
	conn, err := GetConnection()
	if err != nil {
		return res, err
	}
	defer conn.Close()

	wh := dbox.Eq("_id", k.Session("username").(string))

	query, err := conn.NewQuery().Where(wh).From(new(DashboardNoteModel).TableName()).Cursor(nil)
	if err != nil {
		return res, err
	}

	results := DashboardNoteModel{}
	err = query.Fetch(&results, 1, false)
	if err != nil {
		return res, err
	}
	defer query.Close()

	yester := time.Now().AddDate(0, 0, -1)

	for _, val := range results.Comments {
		if !val.Checked && val.CreatedDate.Before(yester) {
			res = append(res, "To Do List Alert - "+val.Text+" created at "+cast.Date2String(val.CreatedDate, "yyyy-MM-dd HH:mm:ss"))
		}
	}

	return res, nil
}

func fetchNotification(days int, formtype string, k *knot.WebContext) ([]string, error) {
	res := []string{}

	until := time.Now().AddDate(0, 0, days*-1)
	now := time.Now()

	wh := dbox.And(dbox.Gte("info."+formtype+".updateTime", until), dbox.Lte("info."+formtype+".updateTime", now))

	if k.Session("CustomerProfileData") != nil {
		arrSes := k.Session("CustomerProfileData").([]tk.M)
		arrin := []interface{}{}
		for _, val := range arrSes {
			arrin = append(arrin, val.Get("_id"))
		}
		wh = dbox.And(wh, dbox.In("customerprofile._id", arrin...))
	}

	if k.Session("username") != nil {
		wh = dbox.And(wh, dbox.Ne("info.myInfo.updateBy", k.Session("username").(string)))
	}

	conn, err := GetConnection()
	if err != nil {
		return res, err
	}
	defer conn.Close()

	query, err := conn.NewQuery().Where(wh).From("DealSetup").Cursor(nil)
	if err != nil {
		return res, err
	}

	results := []tk.M{}
	err = query.Fetch(&results, 0, false)
	if err != nil {
		return res, err
	}
	defer query.Close()

	for _, val := range results {
		inf := val.Get("info").(tk.M)
		this := CheckArray(inf.Get(formtype))
		curr := this[len(this)-1]
		stat := curr.GetString("status")
		by := curr.GetString("updateBy")
		times := curr.Get("updateTime").(time.Time)

		if by == "" {
			by = "System"
		}

		cp := val.Get("customerprofile").(tk.M)
		dealno := strings.Split(cp.GetString("_id"), "|")[1]

		res = append(res, "Deal "+dealno+" has been "+stat+" at "+cast.Date2String(times, "yyyy-MM-dd HH:mm:ss")+" by "+by)
	}

	return res, nil
}

func (c *DashboardController) TimeTracker(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	wh := []tk.M{}

	groupBy := payload.GetString("groupby")

	//set Role Access
	if k.Session("CustomerProfileData") != nil {
		arrSes := k.Session("CustomerProfileData").([]tk.M)
		arrin := []interface{}{}
		for _, val := range arrSes {
			arrin = append(arrin, val.Get("_id"))
		}
		currwh := tk.M{}.Set("customerprofile._id", tk.M{}.Set("$in", arrin))
		wh = append(wh, currwh)
	}

	Fwh := tk.M{}.Set("$and", wh)
	pipe := []tk.M{}
	pipe = append(pipe, tk.M{}.Set("$match", Fwh))

	projfirst := tk.M{}
	projfirst.Set("laststatus", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.status", -1}})
	projfirst.Set("lastDate", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.updateTime", -1}})
	projfirst.Set("branch", "$accountdetails.accountsetupdetails.citynameid")

	proj := tk.M{}
	proj.Set("date", tk.M{"$dateToString": tk.M{"format": "%Y-%m-%d", "date": "$lastDate"}})
	proj.Set("status", "$laststatus")
	proj.Set("branch", 1)

	pipe = append(pipe, tk.M{"$project": projfirst})

	pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("laststatus", tk.M{}.Set("$in", []interface{}{Cancel, UnderProcess, OnHold, SendToDecision}))))

	pipe = append(pipe, tk.M{"$project": proj})

	groupfield := "$status"
	if groupBy == "region" {
		groupfield = "$branch"
	}

	group := tk.M{}
	group.Set("_id", tk.M{"date": "$date", "status": groupfield})
	group.Set("count", tk.M{"$sum": 1})

	pipe = append(pipe, tk.M{"$group": group})

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}

	defer cn.Close()

	csr, err := cn.NewQuery().
		Command("pipe", pipe).
		From("DealSetup").
		Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	tk.Println("Result ---------", results)

	period := []int{-3, -2, -1, 0}
	status := []string{"d*Over due", "c*Getting due", "b*In time", "a*New"}
	today := time.Now()
	// today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	finalRes := tk.M{}
	k.SetSession("regionItems", nil)
	for _, val := range results {
		for idx, peri := range period {
			id := val.Get("_id").(tk.M)
			mydate := cast.String2Date(id.GetString("date"), "yyyy-MM-dd")
			mystatus := id.GetString("status")

			if groupBy == "region" {
				mystatus, err = GetRegionName(mystatus, k)
				if err != nil {
					return res.SetError(err)
				}
			}

			currPeriod := today.AddDate(0, 0, peri)

			if mydate.Before(currPeriod) {
				key := status[idx] + "|" + mystatus + "|" + cast.ToString(idx)
				if finalRes.Get(key) == nil {
					finalRes.Set(key, 0)
				}

				finalRes.Set(key, finalRes.Get(key).(int)+1)
				break
			}
		}
	}

	results = []tk.M{}
	for key, val := range finalRes {
		keyArr := strings.Split(key, "|")
		results = append(results, tk.M{"timestatus": keyArr[0], "status": keyArr[1], "count": val, "order": cast.ToInt(keyArr[2], cast.RoundingAuto)})
	}

	res.SetData(results)

	return res
}

func GetRegionName(id string, k *knot.WebContext) (string, error) {
	res := ""
	idint := cast.ToInt(id, cast.RoundingAuto)
	items := []tk.M{}

	if k.Session("regionItems") == nil {
		conn, err := GetConnection()
		defer conn.Close()
		if err != nil {
			return res, err
		}

		q, err := conn.
			NewQuery().
			Select().
			From("MasterAccountDetail").
			Cursor(nil)

		if err != nil {
			return res, err
		}

		// fetch one MasterAccountDetail data
		var account tk.M
		err = q.Fetch(&account, 1, true)
		if err != nil {
			return res, err
		}

		// casting to array of interface
		accData, ok := account.Get("Data").([]interface{})
		if !ok {
			return res, errors.New("Unable to access Data")
		}

		for _, val := range accData {
			v := val.(tk.M)
			if v.Get("Field") != "Branch" {
				continue
			}

			// found, populate with our data
			items = CheckArray(v.Get("Items"))
			break
		}
		k.SetSession("regionItems", items)

	} else {
		items = k.Session("regionItems").([]tk.M)
	}

	for _, val := range items {
		if val.GetInt("branchid") == idint {
			res = val.Get("region").(tk.M).GetString("name")
			break
		}
	}
	tk.Println("-------------", res)
	return res, nil
}

func (c *DashboardController) SaveFilter(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := DashboardFilterModel{}
	k.GetPayload(&payload)

	if payload.Id == "" {
		payload.Id = k.Session("username").(string)
	}

	if err := c.Ctx.Save(&payload); err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", nil)

}
