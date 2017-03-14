package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/cast"
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
	defer cMongo.Close()
	if err != nil {
		return res.SetError(err)
	}

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

func (c *DashboardController) GetNotification(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	days := payload.GetInt("days")
	re, err := fetchNotification(days, "myInfo")

	res.SetData(re)

	return res
}

func fetchNotification(days int, formtype string) ([]string, error) {
	res := []string{}

	until := time.Now().AddDate(0, 0, days*-1)
	now := time.Now()

	wh := dbox.And(dbox.Gte("info."+formtype+".updateTime", until), dbox.Lte("info."+formtype+".updateTime", now))

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
		times := curr.Get("updateTime").(time.Time)

		cp := val.Get("customerprofile").(tk.M)
		dealno := strings.Split(cp.GetString("_id"), "|")[1]

		res = append(res, "Deal "+dealno+" has been "+stat+" at "+cast.Date2String(times, "yyyy-MM-dd HH:mm:ss"))
	}

	return res, nil
}

// func (c *DashboardController) SummaryAndTrends(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson
// 	res := new(tk.Result)

// 	payload := tk.M{}
// 	err := k.GetPayload(&payload)
// 	if err != nil {
// 		return res.SetError(err)
// 	}

// 	month := payload.GetString("month") // "Feb-2017"
// 	currDate := cast.String2Date("01-", "dd-MMM-yyyy")
// 	lastDate := currDate.AddDate(0, -8, 0)

// 	wh := []tk.M{}
// 	currWhere := tk.M{}.Set("info.myInfo.updateTime", tk.M{}.Set("$lte", currDate))
// 	lastWhere := tk.M{}.Set("info.myInfo.updateTime", tk.M{}.Set("$gt", lastDate))

// 	res.SetData(re)

// 	return res
// }
