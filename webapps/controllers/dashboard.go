package controllers

import (
	. "eaciit/x10/webapps/connection"
	hp "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	// "encoding/json"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/eaciit/cast"

	"errors"

	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "sort"
	"github.com/eaciit/dbox/dbc/mongo"
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
		"dashboard/alert_sidebar.html",
	}

	return DataAccess
}

func (c *DashboardController) ConversionRate(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/loading.html",
		"shared/leftfilter.html",
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
		return c.SetResultInfo(false, "success", DashboardFilterModel{})
	}

	return c.SetResultInfo(false, "success", result[0])
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

type SummaryResult struct {
	TotalAmount float64 `json:"totalAmount"`
	TotalCount  float64 `json:"totalCount"`
	Idx         int     `json:"idx"`
}

func (c *DashboardController) SummaryTrends(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := struct {
		Start  time.Time
		End    time.Time
		Length int
		Type   string
		Filter []tk.M
	}{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	ids, err := FiltersAD2DealNo(
		nil,
		payload.Filter,
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}
	// tk.Printfn("------------- FILTERSAD2DEALNO \n%v", ids)

	pipe := []tk.M{}
	pipe = append(pipe, tk.M{"$match": tk.M{
		"accountdetails.dealno": tk.M{
			"$in": ids,
		},
	}})
	pipe = append(pipe, tk.M{"$lookup": tk.M{
		"from":         "DCFinalSanction",
		"localField":   "accountdetails.dealno",
		"foreignField": "DealNo",
		"as":           "dc",
	}})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno": "$accountdetails.dealno",
		"dc": tk.M{
			"$slice": []interface{}{"$dc", -1},
		},
		"info": tk.M{
			"$slice": []interface{}{"$info.myInfo", -1},
		},
	}})
	pipe = append(pipe, tk.M{"$unwind": "$info"})
	pipe = append(pipe, tk.M{"$unwind": tk.M{
		"path": "$dc",
		"preserveNullAndEmptyArrays": true,
	}})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno": "$dealno",
		"dc":     "$dc",
		"info":   "$info",
		"amount": tk.M{"$ifNull": []interface{}{"$dc.Amount", 0}},
	}})
	// Time Scope
	period := 1
	var currDate, endDate time.Time

	switch payload.Type {
	case "10day", "fromtill":
		if payload.Type == "10day" {
			endDate = time.Date(payload.Start.Year(), payload.Start.Month(), payload.Start.Day(), 0, 0, 0, 0, time.UTC)
			currDate = endDate.AddDate(0, 0, -10)

			period = 10
		} else {
			currDate = time.Date(payload.Start.Year(), payload.Start.Month(), payload.Start.Day(), 0, 0, 0, 0, time.UTC)
			endDate = time.Date(payload.End.Year(), payload.End.Month(), payload.End.Day(), 0, 0, 0, 0, time.UTC)

			period = int(endDate.Sub(currDate).Hours()/24) + 1
		}

		// tk.Printfn("PERIOD %v %v [%d days]", endDate, currDate, period)

		if err != nil {
			return res.SetError(err)
		}
		nextDate := endDate.AddDate(0, 0, 1)
		pastDate := currDate.AddDate(0, 0, -period*(payload.Length-1))

		pipe = append(pipe, tk.M{"$match": tk.M{
			"info.updateTime": tk.M{
				"$gte": pastDate,
				"$lt":  nextDate,
			},
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{
				"status": "$info.status",
				"day":    tk.M{"$dayOfMonth": "$info.updateTime"},
				"month":  tk.M{"$month": "$info.updateTime"},
				"year":   tk.M{"$year": "$info.updateTime"},
			},
			"totalAmount": tk.M{"$sum": "$amount"},
			"totalCount":  tk.M{"$sum": 1},
		}})
		pipe = append(pipe, tk.M{"$sort": tk.M{
			"_id.year":  -1,
			"_id.month": -1,
			"_id.day":   -1,
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{"status": "$_id.status"},
			"data": tk.M{
				"$push": tk.M{
					"totalAmount": "$totalAmount",
					"totalCount":  "$totalCount",
					"idx": tk.M{
						"$concat": []interface{}{
							tk.M{"$substr": []interface{}{"$_id.year", 0, 4}},
							"-",
							tk.M{"$substr": []interface{}{"$_id.month", 0, 2}},
							"-",
							tk.M{"$substr": []interface{}{"$_id.day", 0, 2}},
						},
					},
				},
			},
		}})
	case "", "1month":
		currDate = time.Date(payload.Start.Year(), payload.Start.Month(), 1, 0, 0, 0, 0, time.UTC)
		if err != nil {
			return res.SetError(err)
		}
		nextDate := currDate.AddDate(0, 1, 0)
		pastDate := currDate.AddDate(0, 1-payload.Length, 0)

		baseMonth := int(currDate.Month()) + currDate.Year()*12

		pipe = append(pipe, tk.M{"$match": tk.M{
			"info.updateTime": tk.M{
				"$gte": pastDate,
				"$lt":  nextDate,
			},
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{
				"status": "$info.status",
				"month":  tk.M{"$month": "$info.updateTime"},
				"year":   tk.M{"$year": "$info.updateTime"},
			},
			"totalAmount": tk.M{"$sum": "$amount"},
			"totalCount":  tk.M{"$sum": 1},
		}})
		pipe = append(pipe, tk.M{"$sort": tk.M{
			"_id.year":  -1,
			"_id.month": -1,
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{"status": "$_id.status"},
			"data": tk.M{
				"$push": tk.M{
					"totalAmount": "$totalAmount",
					"totalCount":  "$totalCount",
					"idx": tk.M{
						"$abs": tk.M{
							"$add": []interface{}{
								"$_id.month",
								tk.M{"$multiply": []interface{}{"$_id.year", 12}},
								-baseMonth,
							},
						},
					},
				},
			},
		}})
	case "1year":
		currDate = time.Date(payload.Start.Year(), 4, 1, 0, 0, 0, 0, time.UTC)
		if err != nil {
			return res.SetError(err)
		}
		nextDate := currDate.AddDate(1, 0, 0)
		pastDate := currDate.AddDate(1-payload.Length, 0, 0)

		baseYear := currDate.Year()

		pipe = append(pipe, tk.M{"$match": tk.M{
			"info.updateTime": tk.M{
				"$gte": pastDate,
				"$lt":  nextDate,
			},
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{
				"status": "$info.status",
				"year": tk.M{
					"$floor": tk.M{
						"$divide": []interface{}{
							tk.M{
								"$add": []interface{}{
									tk.M{"$month": "$info.updateTime"},
									-4,
									tk.M{
										"$multiply": []interface{}{
											tk.M{"$year": "$info.updateTime"},
											12,
										},
									},
								},
							},
							12,
						},
					},
				},
			},
			"totalAmount": tk.M{"$sum": "$amount"},
			"totalCount":  tk.M{"$sum": 1},
		}})
		pipe = append(pipe, tk.M{"$sort": tk.M{
			"_id.year": -1,
		}})
		pipe = append(pipe, tk.M{"$group": tk.M{
			"_id": tk.M{"status": "$_id.status"},
			"data": tk.M{
				"$push": tk.M{
					"totalAmount": "$totalAmount",
					"totalCount":  "$totalCount",
					"idx": tk.M{
						"$abs": tk.M{
							"$add": []interface{}{
								"$_id.year",
								-baseYear,
							},
						},
					},
				},
			},
		}})
	default:
		return res.SetError(errors.New("Not Implemented"))
	}

	// debug, _ := json.MarshalIndent(pipe, "", "  ")
	// tk.Printfn("PIPE Summary\n%s", debug)

	csr, err := c.Ctx.Connection.
		NewQuery().
		Command("pipe", pipe).
		From("DealSetup").
		Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	// dbdata := []struct {
	// 	ID   string `json:"_id"`
	// 	Data []struct {
	//		Idx         int     `json:"idx"`
	// 		TotalAmount float64 `json:"totalAmount"`
	// 		TotalCount  float64 `json:"totalCount"`
	// 	} `json:"data"`
	// }{}
	dbdata := []tk.M{}
	if err := csr.Fetch(&dbdata, 0, false); err != nil {
		return res.SetError(err)
	}

	if payload.Type == "fromtill" || payload.Type == "10day" {
		// Manual grouping for fromtill and 10days
		for _, data := range dbdata {
			series := data["data"].([]interface{})
			newseries := make([]SummaryResult, payload.Length+1)
			for k := range newseries {
				newseries[k].Idx = k
			}
			for _, v := range series {
				val := v.(tk.M)
				date, err := time.Parse("2006-1-2", val.GetString("idx"))
				if err != nil {
					return res.SetError(err)
				}
				idx := int(endDate.Sub(date).Hours()) / 24 / period
				// tk.Printfn("IDX TRANSFORMATION %v %d", date, idx)

				newseries[idx].Idx = idx
				newseries[idx].TotalAmount = newseries[idx].TotalAmount + val.GetFloat64("totalAmount")
				newseries[idx].TotalCount = newseries[idx].TotalCount + val.GetFloat64("totalCount")
			}

			data["data"] = newseries
		}
	}

	res.SetData(dbdata)

	return res
}

func (c *DashboardController) TimeTrackerGridDetails(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	regionName := payload.GetString("regionname")
	timeStatus := payload.GetString("timestatus")
	stageName := payload.GetString("stagename")

	// tk.Println("PAYLOAD", payload)

	branchIds := []string{}

	if regionName != "" {
		branchIds, err = GetBranchId(regionName)
		if err != nil {
			return res.SetError(err)
		}
	}

	pipe := []tk.M{}

	//set Role Access
	whRoles, err := GenerateRoleConditionTkM(k)
	if err != nil {
		return res.SetError(err)
	}

	Fwh := tk.M{}.Set("$and", whRoles)
	pipe = append(pipe, tk.M{}.Set("$match", Fwh))

	projfirst := tk.M{}
	projfirst.Set("laststatus", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.status", -1}})
	projfirst.Set("lastDate", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.updateTime", -1}})
	projfirst.Set("branch", "$accountdetails.accountsetupdetails.citynameid")
	projfirst.Set("caname", "$accountdetails.accountsetupdetails.creditanalyst")
	projfirst.Set("rmname", "$accountdetails.accountsetupdetails.rmname")
	projfirst.Set("dealno", "$accountdetails.dealno")
	projfirst.Set("custname", "$customerprofile.applicantdetail.CustomerName")

	proj := tk.M{}
	proj.Set("date", tk.M{"$dateToString": tk.M{"format": "%Y-%m-%d", "date": "$lastDate"}})
	proj.Set("status", "$laststatus")
	proj.Set("branch", 1)
	proj.Set("caname", 1)
	proj.Set("rmname", 1)
	proj.Set("dealno", 1)
	proj.Set("custname", 1)

	pipe = append(pipe, tk.M{"$project": projfirst})

	if len(branchIds) > 0 {
		pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("branch", tk.M{"$in": branchIds})))
	}

	if stageName != "" {
		pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("laststatus", tk.M{}.Set("$eq", stageName))))
	} else {
		pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("laststatus", tk.M{}.Set("$in", []interface{}{Inque, UnderProcess, OnHold, SendToDecision}))))
	}

	pipe = append(pipe, tk.M{"$project": proj})

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

	// tk.Println("Result ---------", results)
	// tk.Println("Query ---------", pipe)

	period := tk.M{}
	period.Set(Inque, []int{-5, -4, 0})
	period.Set(UnderProcess, []int{-10, -4, 0})
	period.Set(SendToDecision, []int{-10, -4, 0})
	period.Set(OnHold, []int{-10, -4, 0})
	status := []string{"d*Over due", "c*Getting due", "b*In time", "a*New"}
	today := time.Now()

	finalRes := []tk.M{}
	k.SetSession("regionItems", nil)
	for _, val := range results {
		// id := val.Get("_id").(tk.M)
		mystatus := val.GetString("status")
		periodMe := period.Get(mystatus).([]int)

		if regionName != "" {
			mystatus, err = GetRegionName(mystatus, k)
			if err != nil {
				return res.SetError(err)
			}
		}

		for idx, peri := range periodMe {
			// id := val.Get("_id").(tk.M)
			mydate := cast.String2Date(val.GetString("date"), "yyyy-MM-dd")
			// mystatus := val.GetString("status")

			currPeriod := today.AddDate(0, 0, peri)

			if mydate.Before(currPeriod) {
				// tk.Println(mydate, currPeriod, timeStatus, status[idx])
				if status[idx] == timeStatus {
					finalRes = append(finalRes, val)
				}

				break
			}
		}
	}

	res.SetData(finalRes)

	return res
}

func GetBranchId(id string) ([]string, error) {
	res := []string{}
	items := []tk.M{}

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

	for _, val := range items {
		if val.Get("region").(tk.M).GetString("name") == id {
			res = append(res, cast.ToString(val.GetInt("branchid")))
		}
	}

	return res, nil
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
	// tk.Println("-------------", id, res, items)
	return res, nil
}

func (c *DashboardController) SaveFilter(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := DashboardFilterModel{}
	k.GetPayload(&payload)

	// Force id to prevent cross user editing
	payload.Id = k.Session("username").(string)

	if err := c.Ctx.Save(&payload); err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", nil)
}

type TimePeriod struct {
	Start       time.Time
	End         time.Time
	TimeType    string
	PeriodCount int

	Period       int
	FilterAfter  time.Time
	FilterBefore time.Time

	GetPeriodID func(time.Time) int
}

func CalcTimePeriod(input TimePeriod) TimePeriod {
	var endDate, currDate time.Time
	switch input.TimeType {
	case "10day", "fromtill":
		if input.TimeType == "10day" {
			endDate = time.Date(input.Start.Year(), input.Start.Month(), input.Start.Day(), 0, 0, 0, 0, time.UTC)
			currDate = endDate.AddDate(0, 0, -10)

			input.Period = 10
		} else {
			currDate = time.Date(input.Start.Year(), input.Start.Month(), input.Start.Day(), 0, 0, 0, 0, time.UTC)
			endDate = time.Date(input.End.Year(), input.End.Month(), input.End.Day(), 0, 0, 0, 0, time.UTC)

			input.Period = int(endDate.Sub(currDate).Hours()/24) + 1
		}

		input.FilterBefore = endDate.AddDate(0, 0, 1)
		input.FilterAfter = currDate.AddDate(0, 0, -input.Period*(input.PeriodCount-1))

		input.GetPeriodID = func(val time.Time) int {
			return int(endDate.Sub(val).Hours()) / 24 / input.Period
		}
	case "", "1month":
		currDate = time.Date(input.Start.Year(), input.Start.Month(), 1, 0, 0, 0, 0, time.UTC)

		input.FilterBefore = currDate.AddDate(0, 1, 0)
		input.FilterAfter = currDate.AddDate(0, 1-input.PeriodCount, 0)

		input.GetPeriodID = func(val time.Time) int {
			count := int(val.Month()) + val.Year()*12
			return input.Start.Year()*12 + int(input.Start.Month()) - count
		}
	case "1year":
		currDate = time.Date(input.Start.Year(), 4, 1, 0, 0, 0, 0, time.UTC)

		input.FilterBefore = currDate.AddDate(1, 0, 0)
		input.FilterAfter = currDate.AddDate(1-input.PeriodCount, 0, 0)

		input.GetPeriodID = func(val time.Time) int {
			count := (int(val.Month()) - 4 + (val.Year() * 12)) / 12
			return input.Start.Year() - count
		}
	}

	return input
}

func (c *DashboardController) TimeTracker(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}

	// arrInt := []interface{}{}

	// for _, val := range arrInt {
	// 	arrInt = append(arrInt, val)
	// }

	groupBy := payload.GetString("groupby")
	regionName := payload.GetString("regionname")
	timeStatus := payload.GetString("timestatus")
	branchIds := []string{}

	timeType := payload.GetString("type")
	timeStr := strings.Split(payload.GetString("start"), "T")[0]
	timeStrTwo := strings.Split(payload.GetString("end"), "T")[0]

	if timeType == "" {
		timeStr = cast.Date2String(time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.UTC), "yyyy-MM-dd")
		timeStrTwo = cast.Date2String(time.Date(time.Now().Year(), 1, 1, 0, 0, 0, 0, time.UTC), "yyyy-MM-dd")
	}

	timeStart := cast.String2Date(timeStr, "yyyy-MM-dd")
	timeEnd := cast.String2Date(timeStrTwo, "yyyy-MM-dd")

	if regionName != "" {
		branchIds, err = GetBranchId(regionName)
		if err != nil {
			return res.SetError(err)
		}
	}
	pipe := []tk.M{}

	//set Role Access
	whRoles, err := GenerateRoleConditionTkM(k)
	if err != nil {
		return res.SetError(err)
	}

	Fwh := tk.M{}.Set("$or", whRoles)
	FwhY := []tk.M{
		Fwh,
		tk.M{"customerprofile.applicantdetail.DealNo": tk.M{
			"$in": ids,
		},
		},
	}

	FwhX := tk.M{
		"$and": FwhY,
	}

	FwhZ := []tk.M{}
	startDateWh := tk.M{}
	endDateWh := tk.M{}

	switch timeType {
	case "10day", "fromtill":
		if timeType == "10day" {
			startDate := time.Date(timeStart.Year(), timeStart.Month(), timeStart.Day(), 0, 0, 0, 0, time.UTC)
			endDate := startDate.AddDate(0, 0, -10)

			startDateWh = tk.M{"lastDate": tk.M{"$lte": startDate}}
			endDateWh = tk.M{"lastDate": tk.M{"$gte": endDate}}
		} else {
			startDate := time.Date(timeStart.Year(), timeStart.Month(), timeStart.Day(), 0, 0, 0, 0, time.UTC)
			endDate := time.Date(timeEnd.Year(), timeEnd.Month(), timeEnd.Day(), 0, 0, 0, 0, time.UTC)

			startDateWh = tk.M{"lastDate": tk.M{"$gte": startDate}}
			endDateWh = tk.M{"lastDate": tk.M{"$lte": endDate}}
		}
	case "", "1month":
		startDate := time.Date(timeStart.Year(), timeStart.Month(), 1, 0, 0, 0, 0, time.UTC)
		endDate := time.Date(timeStart.Year(), timeStart.AddDate(0, 1, 0).Month(), 1, 0, 0, 0, 0, time.UTC)

		startDateWh = tk.M{"lastDate": tk.M{"$gte": startDate}}
		endDateWh = tk.M{"lastDate": tk.M{"$lt": endDate}}
	case "1year":
		startDate := time.Date(timeStart.Year(), 4, 1, 0, 0, 0, 0, time.UTC)
		endDate := startDate.AddDate(1, 0, 0)

		startDateWh = tk.M{"lastDate": tk.M{"$gte": startDate}}
		endDateWh = tk.M{"lastDate": tk.M{"$lt": endDate}}
	}

	FwhZ = append(FwhZ, startDateWh)
	FwhZ = append(FwhZ, endDateWh)

	// tk.Println("-------DATES", FwhZ)

	pipe = append(pipe, tk.M{}.Set("$match", FwhX))

	projfirst := tk.M{}
	projfirst.Set("laststatus", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.status", -1}})
	projfirst.Set("lastDate", tk.M{"$arrayElemAt": []interface{}{"$info.myInfo.updateTime", -1}})
	projfirst.Set("branch", "$accountdetails.accountsetupdetails.citynameid")

	proj := tk.M{}
	proj.Set("date", tk.M{"$dateToString": tk.M{"format": "%Y-%m-%d", "date": "$lastDate"}})
	proj.Set("branchstatus", tk.M{"$concat": []interface{}{"$branch", "^", "$laststatus"}})
	proj.Set("status", "$laststatus")
	proj.Set("branch", 1)

	pipe = append(pipe, tk.M{"$project": projfirst})

	pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("laststatus", tk.M{}.Set("$in", []interface{}{Inque, UnderProcess, OnHold, SendToDecision}))))

	pipe = append(pipe, tk.M{}.Set("$match", tk.M{
		"$and": FwhZ,
	}))

	if len(branchIds) > 0 {
		pipe = append(pipe, tk.M{}.Set("$match", tk.M{}.Set("branch", tk.M{"$in": branchIds})))
	}

	pipe = append(pipe, tk.M{"$project": proj})

	groupfield := "$status"
	if groupBy == "region" {
		groupfield = "$branchstatus"
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

	// tk.Println(pipe)

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	// tk.Println("Result ---------+", results)

	period := tk.M{}
	period.Set(Inque, []int{-5, -4, 0})
	period.Set(UnderProcess, []int{-10, -4, 0})
	period.Set(SendToDecision, []int{-10, -4, 0})
	period.Set(OnHold, []int{-10, -4, 0})
	status := []string{"d*Over due", "c*Getting due", "b*In time", "a*New"}
	today := time.Now()
	// today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	finalRes := tk.M{}
	k.SetSession("regionItems", nil)
	for _, val := range results {
		id := val.Get("_id").(tk.M)
		mystatus := id.GetString("status")
		periodMe := []int{}

		if groupBy == "region" {
			mystatus = strings.Split(id.GetString("status"), "^")[0]
			periodMe = period.Get(strings.Split(id.GetString("status"), "^")[1]).([]int)
		} else {
			periodMe = period.Get(mystatus).([]int)
		}

		if groupBy == "region" {
			mystatus, err = GetRegionName(mystatus, k)
			if err != nil {
				return res.SetError(err)
			}
		}

		for idx, peri := range periodMe {
			mydate := cast.String2Date(id.GetString("date"), "yyyy-MM-dd")

			currPeriod := today.AddDate(0, 0, peri)

			if mydate.Before(currPeriod) {
				key := status[idx] + "|" + mystatus + "|" + cast.ToString(idx)
				if finalRes.Get(key) == nil {
					finalRes.Set(key, 0)
				}

				finalRes.Set(key, finalRes.Get(key).(int)+val.GetInt("count"))
				break
			}
		}
	}

	results = []tk.M{}
	for key, val := range finalRes {
		keyArr := strings.Split(key, "|")

		if timeStatus != "" {
			if timeStatus == keyArr[0] {
				results = append(results, tk.M{"timestatus": keyArr[0], "status": keyArr[1], "count": val, "order": cast.ToInt(keyArr[2], cast.RoundingAuto)})
			}
			continue
		}

		results = append(results, tk.M{"timestatus": keyArr[0], "status": keyArr[1], "count": val, "order": cast.ToInt(keyArr[2], cast.RoundingAuto)})
	}

	res.SetData(results)

	return res
}

func GenerateRoleConditionTkM(k *knot.WebContext) ([]tk.M, error) {
	dbFilter := []tk.M{}

	if k.Session("roles") == nil {
		return dbFilter, nil
	}

	roles := k.Session("roles").([]SysRolesModel)
	userid := k.Session("userid").(string)
	for _, Role := range roles {
		var dbFilterTemp []tk.M
		if !Role.Status {
			continue
		}

		Type := Role.Roletype
		Dealvalue := Role.Dealvalue

		Dv, err := new(LoginController).GetDealValue(Dealvalue)

		if err != nil {
			return dbFilter, err
		}

		if len(Dv) > 0 {
			curDv := Dv[0]
			opr := curDv.GetString("operator")
			var1 := curDv.GetFloat64("var1")
			var2 := curDv.GetFloat64("var2")

			switch opr {
			case "lt":
				dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$lt": var1}})
			case "lte":
				dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$lte": var1}})
			case "gt":
				dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$gt": var1}})
			case "gte":
				dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$gte": var1}})
			case "between":
				dbFilterTemp = append(dbFilterTemp, tk.M{"$and": []tk.M{tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$gte": var1}}, tk.M{"accountdetails.loandetails.proposedloanamount": tk.M{"$lte": var2}}}})
			}
		}
		// tk.Printf("--------- DV %v ----------- \n", Dv)
		// tk.Printf("--------- ROLETYPE %v ----------- \n", Type)
		// tk.Printf("--------- USERID %v ----------- \n", userid)
		switch strings.ToUpper(Type) {
		case "CA":
			dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.accountsetupdetails.CreditAnalystId": tk.M{"$eq": userid}})
		case "RM":
			dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.accountsetupdetails.RmNameId": tk.M{"$eq": userid}})

		case "CUSTOM":
			all := []interface{}{}

			for _, valx := range Role.Branch {
				all = append(all, cast.ToString(valx))
			}
			if len(all) != 0 {
				dbFilterTemp = append(dbFilterTemp, tk.M{"accountdetails.accountsetupdetails.citynameid": tk.M{"$in": all}})
			} else {
				dbFilterTemp = append(dbFilterTemp, tk.M{"_id": tk.M{"$ne": ""}})
			}
		default:
			dbFilterTemp = append(dbFilterTemp, tk.M{"_id": tk.M{"$ne": ""}})
		}
		dbFilter = append(dbFilter, tk.M{"$and": dbFilterTemp})
	}

	return dbFilter, nil
}

func (c *DashboardController) MovingTAT(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}
	defer cn.Close()

	whs, err := GenerateRoleCondition(k)
	if err != nil {
		return res.SetError(err)
	}

	whsx := []*dbox.Filter{}

	if len(whs) > 0 {
		whsx = append(whsx, dbox.Or(whs...))
	}

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}
	filterids := []interface{}{}
	for _, id := range ids {
		filterids = append(filterids, id)
	}

	whsx = append(whsx, dbox.In("customerprofile.applicantdetail.DealNo", filterids...))

	whsMatch, err := dbox.NewFilterBuilder(new(mongo.FilterBuilder)).BuildFilter(dbox.And(whsx...))
	if err != nil {
		return res.SetError(err)
	}

	pipe := []tk.M{}
	pipe = append(pipe, tk.M{
		"$match": whsMatch,
	})
	// Self join
	pipe = append(pipe, tk.M{
		"$lookup": tk.M{
			"from":         "DealSetup",
			"localField":   "_id",
			"foreignField": "_id",
			"as":           "ref",
		},
	})
	// unwind self join to convert array into element
	pipe = append(pipe, tk.M{
		"$unwind": "$ref",
	})
	// unwind my info to split into individual row
	pipe = append(pipe, tk.M{
		"$unwind": tk.M{
			"path":              "$info.myInfo",
			"includeArrayIndex": "infoidx",
		},
	})
	// projecting, to pull out last status
	pipe = append(pipe, tk.M{
		"$project": tk.M{
			"status":  "$info.myInfo",
			"infoidx": "$infoIdx",
			"prevstatus": tk.M{
				"$arrayElemAt": []interface{}{
					"$ref.info.myInfo",
					tk.M{
						"$add": []interface{}{
							"$infoidx",
							-1,
						},
					},
				},
			},
			"customerprofile": "$customerprofile",
			"accountdetails":  "$accountdetails",
		},
	})

	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		return res.SetError(err)
	}
	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		return res.SetError(err)
	}

	tp := TimePeriod{
		Start:       periodStart,
		End:         periodEnd,
		TimeType:    payload.GetString("type"),
		PeriodCount: 1,
	}
	tp = CalcTimePeriod(tp)

	// Filter by timeperiod
	pipe = append(pipe, tk.M{
		"$match": tk.M{
			"$and": []interface{}{
				tk.M{
					"status.updateTime": tk.M{
						"$lt": tp.FilterBefore,
					},
				},
				tk.M{
					"status.updateTime": tk.M{
						"$gte": tp.FilterAfter,
					},
				},
			},
		},
	})

	// debug, _ := json.MarshalIndent(pipe, "", "  ")
	// tk.Printfn("%s", string(debug))

	query := cn.NewQuery().
		Command("pipe", pipe).
		From("DealSetup")

	csr, err := query.Cursor(nil)

	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	textRange := []string{"15 + Days", "11 - 15 Days", "6 - 10 Days", "0 - 5 Days"}

	statusMap := map[string]string{
		UnderProcess:   "Accepted",
		SendToDecision: "Processed",
		Approve:        "Approved",
		Reject:         "Rejected",
	}
	mapRes := tk.M{}
	for _, val := range results {
		curStatus := val.Get("status").(tk.M)

		// Skip out not needed
		status, found := statusMap[curStatus.GetString("status")]
		if !found {
			continue
		}

		prevStatus := val.Get("prevstatus").(tk.M)

		curDate := curStatus.Get("updateTime").(time.Time)
		prevDate := prevStatus.Get("updateTime").(time.Time)

		day := int(math.Ceil(math.Abs(curDate.Sub(prevDate).Hours() / 24)))
		idxRange := 3
		if day > 15 {
			idxRange = 0
		} else if day >= 11 {
			idxRange = 1
		} else if day >= 6 {
			idxRange = 2
		}

		key := status + "|" + textRange[idxRange]

		if mapRes.Get(key) == nil {
			mapRes.Set(key, 0)
		}

		mapRes.Set(key, mapRes.GetInt(key)+1)
	}

	finalRes := []tk.M{}
	for key, val := range mapRes {
		arr := strings.Split(key, "|")
		re := tk.M{}
		re.Set("status", arr[0])
		re.Set("dayrange", arr[1])
		re.Set("count", val)
		finalRes = append(finalRes, re)
	}

	res.SetData(finalRes)

	return res
}

func (c *DashboardController) SnapshotTAT(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		return res.SetError(err)
	}
	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		return res.SetError(err)
	}

	tp := TimePeriod{
		Start:    periodStart,
		End:      periodEnd,
		TimeType: payload.GetString("type"),
	}

	groupBy := payload.GetString("groupby")
	if groupBy == "" {
		groupBy = "period"
	}

	switch groupBy {
	case "period":
		tp.PeriodCount = 7
	default:
		tp.PeriodCount = 1
	}
	tp = CalcTimePeriod(tp)

	trendFilt := payload.GetString("trend")
	if trendFilt == "" {
		trendFilt = "conversion"
	}

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}
	defer cn.Close()

	whs, err := GenerateRoleCondition(k)
	if err != nil {
		return res.SetError(err)
	}

	whsx := []*dbox.Filter{}

	if len(whs) > 0 {
		whsx = append(whsx, dbox.Or(whs...))
	}

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}

	filterids := []interface{}{}
	for _, id := range ids {
		filterids = append(filterids, id)
	}

	whsx = append(whsx,
		dbox.And(
			dbox.Lt("info.myInfo.updateTime", tp.FilterBefore),
			dbox.Gte("info.myInfo.updateTime", tp.FilterAfter),
			dbox.In("customerprofile.applicantdetail.DealNo", filterids...),
		),
	)

	query := cn.NewQuery().
		From("DealSetup").
		Select("info", "accountdetails.accountsetupdetails.citynameid").
		Where(dbox.And(whsx...))

	// fbuilder := dbox.NewFilterBuilder(new(mongo.FilterBuilder))
	// filterdebug, _ := fbuilder.BuildFilter(dbox.And(whsx...))
	// debug, _ := json.Marshal(filterdebug)
	// tk.Printfn("%s", string(debug))

	csr, err := query.Cursor(nil)

	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	// debug, _ := json.Marshal(results)
	// tk.Printfn("Result %s", string(debug))

	lib := tk.M{
		"decision":   []string{Approve, Reject},
		"action":     []string{Approve, Reject, Cancel, SendBackOmnifin},
		"processing": []string{SendToDecision},
		"acceptance": []string{UnderProcess},
		"conversion": []string{},
	}

	mapRes := make(map[string][]int)

	trend := lib.Get(trendFilt).([]string)

	for _, val := range results {
		info := val.Get("info").(tk.M)
		myInfo := CheckArray(info.Get("myInfo"))
		if len(myInfo) > 1 {
			laststatus := myInfo[len(myInfo)-1].GetString("status")
			poslast := IndexOfString(laststatus, trend)

			if trendFilt != "conversion" && poslast > -1 {
				for idx := range myInfo {
					if idx+1 == len(myInfo) {
						continue
					}

					status := myInfo[idx+1].GetString("status")

					pos := IndexOfString(status, trend)
					// tk.Println(trendFilt)
					// tk.Println(pos, "--------POSITION")
					// tk.Println(trend, "--------TREND")
					// tk.Println(status, "--------STATUS")
					if pos == -1 {
						continue
					}

					// firstDate := inf.Get("updateTime").(time.Time)
					secondDate := myInfo[idx+1].Get("updateTime").(time.Time)

					days := int(math.Ceil(math.Abs(calcDiffInfoDate(idx, myInfo).Hours() / 24)))

					key := ""
					if groupBy == "period" {
						key = strconv.Itoa(tp.GetPeriodID(secondDate))
						// tk.Printfn("%v SNAPSHOTTAT CONVERSION", key)
					} else {
						key, err = GetRegionName(hp.TkWalk(val, "accountdetails.accountsetupdetails.citynameid").(string), k)
						if err != nil {
							return res.SetError(err)
						}
					}

					listData, found := mapRes[key]

					if !found {
						mapRes[key] = []int{days}
					} else {
						mapRes[key] = append(listData, days)
					}
				}
			} else if trendFilt == "conversion" && (laststatus == Approve || laststatus == Reject) {
				lasttime := myInfo[len(myInfo)-1].Get("updateTime").(time.Time)

				timex := myInfo[0].Get("updateTime").(time.Time)

				days := int(math.Ceil(math.Abs(timex.Sub(lasttime).Hours() / 24)))

				key := ""
				if groupBy == "period" {
					key = strconv.Itoa(tp.GetPeriodID(lasttime))
					// tk.Printfn("%v SNAPSHOTTAT", key)
				} else {
					key, err = GetRegionName(hp.TkWalk(val, "accountdetails.accountsetupdetails.citynameid").(string), k)
					if err != nil {
						return res.SetError(err)
					}
				}
				listData, found := mapRes[key]

				if !found {
					mapRes[key] = []int{days}
				} else {
					mapRes[key] = append(listData, days)
				}
			}
		}
	}

	if groupBy == "period" {
		finalRes := make([]tk.M, tp.PeriodCount)
		months := tk.M{}
		for key, val := range mapRes {
			keyInt, _ := strconv.Atoi(key)
			if keyInt > tp.PeriodCount {
				continue
			}
			re := tk.M{}
			re.Set("avgdays", hp.SumInt(val)/len(val))
			re.Set("median", hp.MaxInt(val)-hp.MinInt(val))
			re.Set("dealcount", len(val))
			re.Set("idx", key)
			months.Set(key, "")

			finalRes[keyInt] = re
		}

		for val := 0; val < tp.PeriodCount; val++ {
			valStr := strconv.Itoa(val)

			if months.Get(valStr) == nil {
				re := tk.M{}
				re.Set("avgdays", 0)
				re.Set("median", 0)
				re.Set("dealcount", 0)
				re.Set("idx", valStr)
				re.Set("empty", true)
				finalRes[val] = re
			}
		}

		res.SetData(finalRes)
	} else {
		finalRes := make([]tk.M, 0)
		for key, val := range mapRes {
			re := tk.M{}
			re.Set("avgdays", hp.SumInt(val)/len(val))
			re.Set("median", hp.MaxInt(val)-hp.MinInt(val))
			re.Set("dealcount", len(val))
			re.Set("idx", key)

			finalRes = append(finalRes, re)
		}

		res.SetData(finalRes)
	}

	return res
}

func (c *DashboardController) HistoryTAT(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}
	defer cn.Close()

	whs, err := GenerateRoleCondition(k)
	if err != nil {
		return res.SetError(err)
	}

	whsx := []*dbox.Filter{}

	if len(whs) > 0 {
		whsx = append(whsx, dbox.Or(whs...))
	}

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}
	filterids := []interface{}{}
	for _, id := range ids {
		filterids = append(filterids, id)
	}

	whsx = append(whsx, dbox.In("customerprofile.applicantdetail.DealNo", filterids...))

	whsMatch, err := dbox.NewFilterBuilder(new(mongo.FilterBuilder)).BuildFilter(dbox.And(whsx...))
	if err != nil {
		return res.SetError(err)
	}

	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		return res.SetError(err)
	}
	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		return res.SetError(err)
	}

	tp := TimePeriod{
		Start:       periodStart,
		End:         periodEnd,
		TimeType:    payload.GetString("type"),
		PeriodCount: 1,
	}
	tp = CalcTimePeriod(tp)

	pipe := []tk.M{}
	pipe = append(pipe, tk.M{
		"$match": whsMatch,
	})
	// projecting, filter
	pipe = append(pipe, tk.M{
		"$project": tk.M{
			"status": tk.M{
				"$filter": tk.M{
					"input": "$info.myInfo",
					"as":    "myInfo",
					"cond": tk.M{
						"$and": []interface{}{
							tk.M{"$lt": []interface{}{"$$myInfo.updateTime", tp.FilterBefore}},
						},
					},
				},
			},
			"customerprofile": "$customerprofile",
			"accountdetails":  "$accountdetails",
		},
	})
	// projecting, pull out last status
	pipe = append(pipe, tk.M{
		"$project": tk.M{
			"status": tk.M{
				"$arrayElemAt": []interface{}{"$status", -1},
			},
			"customerprofile": "$customerprofile",
			"accountdetails":  "$accountdetails",
		},
	})

	// debug, _ := json.MarshalIndent(pipe, "", "  ")
	// tk.Printfn("%s", string(debug))

	query := cn.NewQuery().
		Command("pipe", pipe).
		From("DealSetup")

	csr, err := query.Cursor(nil)

	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	textRange := []string{"15 + Days", "11 - 15 Days", "6 - 10 Days", "0 - 5 Days"}

	statusMap := map[string]string{
		Inque:          "In Queue",
		UnderProcess:   "Under Process",
		SendToDecision: "Awaiting Decision",
		OnHold:         "On Hold",
	}
	mapRes := tk.M{}

	endDate := time.Now()
	if endDate.After(tp.End) {
		endDate = tp.End
	}
	for _, val := range results {
		if val.Get("status") == nil {
			continue
		}

		curStatus := val.Get("status").(tk.M)

		// Skip out not needed
		status, found := statusMap[curStatus.GetString("status")]
		if !found {
			continue
		}

		statusDate := curStatus.Get("updateTime").(time.Time)

		day := int(math.Ceil(math.Abs(endDate.Sub(statusDate).Hours() / 24)))
		idxRange := 3
		if day > 15 {
			idxRange = 0
		} else if day >= 11 {
			idxRange = 1
		} else if day >= 6 {
			idxRange = 2
		}

		key := status + "|" + textRange[idxRange]

		if mapRes.Get(key) == nil {
			mapRes.Set(key, 0)
		}

		mapRes.Set(key, mapRes.GetInt(key)+1)
	}

	finalRes := []tk.M{}
	for key, val := range mapRes {
		arr := strings.Split(key, "|")
		re := tk.M{}
		re.Set("status", arr[0])
		re.Set("dayrange", arr[1])
		re.Set("count", val)
		finalRes = append(finalRes, re)
	}

	res.SetData(finalRes)

	return res
}

func (c *DashboardController) ConversionTatScatter(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	data := []interface{}{
		[]int{20, 23},
		[]int{40, 27},
	}

	res.Data = data

	return res
}

func (c *DashboardController) TurnaroundTime(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/loading.html",
		"shared/leftfilter.html",

		"dashboard/compare_contrast.html",
	}

	return DataAccess
}

func IndexOfString(val string, arr []string) int {
	for idx, v := range arr {
		if v == val {
			return idx
		}
	}

	return -1
}

func calcDiffInfoDate(idx int, myInfo []tk.M) time.Duration {
	firstDate := myInfo[idx].Get("updateTime").(time.Time)
	secondDate := myInfo[idx+1].Get("updateTime").(time.Time)

	firstStatus := myInfo[idx].GetString("status")
	if firstStatus == OnHold {
		firstDate = myInfo[idx-1].Get("updateTime").(time.Time)
	}

	return secondDate.Sub(firstDate)
}

func calcDiffInfoDateHistory(myInfo []tk.M) (int, int, int, int, int, int) {
	inf := myInfo[len(myInfo)-1]
	idx := len(myInfo) - 1

	firstDate := inf.Get("updateTime").(time.Time)
	secondDate := time.Now()

	firstStatus := inf.GetString("status")
	if firstStatus == OnHold {
		firstDate = myInfo[idx-1].Get("updateTime").(time.Time)
	}
	return Diff(firstDate, secondDate)
}

func (c *DashboardController) GridDetailsTAT(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}
	defer cn.Close()

	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		periodStart = time.Now()
		// return res.SetError(err)
	}
	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		periodEnd = time.Now()
		// return res.SetError(err)
	}

	tp := TimePeriod{
		Start:       periodStart,
		End:         periodEnd,
		TimeType:    payload.GetString("type"),
		PeriodCount: 1,
	}
	tp = CalcTimePeriod(tp)

	trendFilt := payload.GetString("trend")
	// periodFilt := payload.GetString("period")
	// regionName := payload.GetString("region")
	// groupByDate := time.Now()
	// whsx := []*dbox.Filter{}
	// branchIds := []string{}

	// tk.Println("PERIOD -------- ", tp)
	if trendFilt == "" {
		trendFilt = "conversion"
	}

	// if periodFilt == "" {
	// 	periodFilt = cast.Date2String(time.Now(), "MMM-yyyy")
	// }

	// if periodFilt != "" {
	// 	groupByDate = cast.String2Date("01-"+periodFilt+" 00:00:00", "dd-MMM-yyyy HH:mm:ss").AddDate(0, 1, 0)
	// 	// tk.Println(groupByDate)
	// 	// tk.Println(groupByDate.AddDate(0, -1, 0))
	// 	whsx = append(whsx, dbox.And(dbox.Lt("info.myInfo.updateTime", groupByDate), dbox.Gte("info.myInfo.updateTime", groupByDate.AddDate(0, -1, 0))))
	// } else {
	// 	if regionName != "" {
	// 		branchIds, err = GetBranchId(regionName)
	// 		if err != nil {
	// 			return res.SetError(err)
	// 		}
	// 		arrInt := []interface{}{}
	// 		for _, vvl := range branchIds {
	// 			arrInt = append(arrInt, vvl)
	// 		}
	// 		whsx = append(whsx, dbox.In("accountdetails.accountsetupdetails.citynameid", arrInt))
	// 	}
	// }

	whs, err := GenerateRoleConditionTkM(k)
	if err != nil {
		return res.SetError(err)
	}

	// if len(whs) > 0 {
	// 	whsx = append(whsx, dbox.Or(whs...))
	// }

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}

	// filterids := []interface{}{}
	// for _, id := range ids {
	// 	filterids = append(filterids, id)
	// }

	// whsx = append(whsx, dbox.In("customerprofile.applicantdetail.DealNo", filterids...))

	// tk.Println("FILTER ----------- ", filterids)

	// if trendFilt == "conversion" {
	// 	whsx = append(whsx, dbox.In("info.myInfo.status", []interface{}{Approve, Reject}))
	// }

	pipe := []tk.M{}
	pipe = append(pipe, tk.M{"$match": tk.M{
		"accountdetails.dealno": tk.M{
			"$in": ids,
		},
		"$or": whs,
	}})
	pipe = append(pipe, tk.M{"$lookup": tk.M{
		"from":         "DCFinalSanction",
		"localField":   "accountdetails.dealno",
		"foreignField": "DealNo",
		"as":           "dc",
	}})

	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno":   "$accountdetails.dealno",
		"rmname":   "$accountdetails.accountsetupdetails.rmname",
		"caname":   "$accountdetails.accountsetupdetails.creditanalyst",
		"custname": "$customerprofile.applicantdetail.CustomerName",

		"dc": tk.M{
			"$slice": []interface{}{"$dc", -1},
		},
		"info": "$info.myInfo",
	}})

	matchme := []tk.M{tk.M{
		"info.status": tk.M{
			"$in": []string{Approve, Reject},
		},
	},
	}

	if tp.TimeType != "" {
		matchme = append(matchme, tk.M{"$and": []tk.M{
			tk.M{"info.updateTime": tk.M{"$lt": tp.FilterBefore}},
			tk.M{"info.updateTime": tk.M{"$gte": tp.FilterAfter}},
		}})
	}

	pipe = append(pipe, tk.M{"$match": tk.M{"$and": matchme}})

	// debug, _ := json.MarshalIndent(pipe, "", "  ")
	// tk.Printfn("PIPE Summary\n%s", debug)

	csr, err := c.Ctx.Connection.
		NewQuery().
		Command("pipe", pipe).
		From("DealSetup").
		Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()

	// query := cn.NewQuery().
	// 	From("DealSetup").
	// 	Select("info", "customerprofile.applicantdetail.AmountLoan", "accountdetails.accountsetupdetails.citynameid", "accountdetails.accountsetupdetails.rmname", "accountdetails.accountsetupdetails.creditanalyst", "accountdetails.accountsetupdetails.dealno", "customerprofile.applicantdetail.CustomerName").
	// 	Where(dbox.And(whsx...))

	// csr, err := query.Cursor(nil)

	// if err != nil {
	// 	return res.SetError(err)
	// }
	// defer csr.Close()

	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	// tk.Println("Result ----------", results)

	lib := tk.M{"decision": []string{Approve, Reject}, "action": []string{Approve, Reject, Cancel, SendBackOmnifin}, "processing": []string{SendToDecision}, "acceptance": []string{UnderProcess}, "conversion": []string{}}
	statusAlias := tk.M{SendToDecision: []string{"Processing"}, UnderProcess: []string{"Acceptance"}, Approve: []string{"Action", "Decision"}, Reject: []string{"Action", "Decision"}, Cancel: []string{"Action"}, SendBackAnalysis: []string{"Action"}}

	finalRes := []tk.M{}

	trend := lib.Get(trendFilt).([]string)

	for _, val := range results {
		val.Set("Acceptance", 0)
		val.Set("Action", 0)
		val.Set("Decision", 0)
		val.Set("Processing", 0)
		val.Set("Conversion", 0)
		val.Set("amount", 0)

		// info := val.Get("info").(tk.M)
		myInfo := CheckArray(val.Get("info"))
		dc := CheckArray(val.Get("dc"))

		if len(dc) > 0 {
			val.Set("amount", dc[0].GetFloat64("Amount"))
		}

		if len(myInfo) > 1 {
			laststatus := myInfo[len(myInfo)-1].GetString("status")
			lasttime := myInfo[len(myInfo)-1].Get("updateTime").(time.Time)
			poslast := IndexOfString(laststatus, trend)

			if poslast > -1 || (trendFilt == "conversion" && (laststatus == Approve || laststatus == Reject)) {
				for idx, _ := range myInfo {
					if idx+1 == len(myInfo) {
						continue
					}

					status := myInfo[idx+1].GetString("status")

					days := int(math.Ceil(math.Abs(calcDiffInfoDate(idx, myInfo).Hours() / 24)))

					alias := []string{}

					if statusAlias.Get(status) == nil {
						continue
					} else {
						alias = statusAlias.Get(status).([]string)
					}

					for _, vlia := range alias {
						val.Set(vlia, days)
					}

				}

				if trendFilt != "conversion" && checkMyDate(tp, lasttime) {
					finalRes = append(finalRes, val)

				}
			}
			if trendFilt == "conversion" && (laststatus == Approve || laststatus == Reject) && checkMyDate(tp, lasttime) {
				// lasttime := myInfo[len(myInfo)-1].Get("updateTime").(time.Time)

				timex := myInfo[0].Get("updateTime").(time.Time)

				// tk.Println(trendFilt)
				// tk.Println(pos, "--------POSITION")
				// tk.Println(trend, "--------TREND")
				// tk.Println(status, "--------STATUS")

				days := 0
				year, month, day, hour, min, sec := Diff(timex, lasttime)

				if hour > 0 || min > 0 || sec > 0 {
					days += 1
				}
				days += day
				days += month * 31
				days += year * 12 * 31

				val.Set("Conversion", days)
				finalRes = append(finalRes, val)

			}
		}
	}

	res.SetData(finalRes)

	return res
}

func checkMyDate(tp TimePeriod, date time.Time) bool {

	tk.Println("CHECK DATE", tp, date)

	if tp.TimeType == "" {
		return true
	}

	if tp.FilterBefore.After(date) && tp.FilterAfter.Before(date) {
		return true
	}

	return false
}

func (c *DashboardController) DealProfilMetrics(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/loading.html",
		"shared/leftfilter.html",
	}

	return DataAccess
}

func (c *DashboardController) MetricsTrend(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return res.SetError(err)
	}

	cn, err := GetConnection()
	if err != nil {
		return res.SetError(err)
	}
	defer cn.Close()

	/*whs, err := GenerateRoleCondition(k)
	if err != nil {
		return res.SetError(err)
	}*/

	/*if len(whs) > 0 {
		whsx = append(whsx, dbox.Or(whs...))
	}*/

	// whsx = append(whsx, dbox.In("customerprofile.applicantdetail.DealNo", filterids...))
	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		return res.SetError(err)
	}
	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		return res.SetError(err)
	}

	tp := TimePeriod{
		Start:       periodStart,
		End:         periodEnd,
		TimeType:    payload.GetString("type"),
		PeriodCount: 7,
	}
	tp = CalcTimePeriod(tp)

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)
	if err != nil {
		return res.SetError(err)
	}
	filterids := []interface{}{}
	for _, id := range ids {
		filterids = append(filterids, id)
	}

	whsx := []*dbox.Filter{}
	whsx = append(whsx,
		dbox.And(
			dbox.Lt("info.myInfo.updateTime", tp.FilterBefore),
			dbox.Gte("info.myInfo.updateTime", tp.FilterAfter),
			dbox.In("customerprofile.applicantdetail.DealNo", filterids...),
		),
	)

	whsMatch, err := dbox.NewFilterBuilder(new(mongo.FilterBuilder)).BuildFilter(dbox.And(whsx...))
	if err != nil {
		return res.SetError(err)
	}

	pipe := []tk.M{}
	pipe = append(pipe, tk.M{
		"$match": whsMatch,
	})

	///metric trend
	err, pipeResult := c.trendChart(payload, tp, pipe)
	if !tk.IsNilOrEmpty(err) {
		return res.SetError(err)
	}
	query := cn.NewQuery().
		Command("pipe", pipeResult).
		From("DealSetup")
	csr, err := query.Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()
	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return res.SetError(err)
	}

	///grouping manual coy!
	///metric trend
	resultData, resultDataWidget := c.metricTrendPeriodGrouping(results, tp)

	///grouping trend by region
	err, regionGrouping := c.metricTrendRegionGrouping(results, tp, k)
	if !tk.IsNilOrEmpty(err) {
		return res.SetError(err)
	}

	///metric trend xfl
	err, pipeResult = c.trendxfl(payload, tp, pipe)
	if !tk.IsNilOrEmpty(err) {
		return res.SetError(err)
	}
	query = cn.NewQuery().
		Command("pipe", pipeResult).
		From("DealSetup")
	csr, err = query.Cursor(nil)
	if err != nil {
		return res.SetError(err)
	}
	defer csr.Close()
	resultsXfl := make([]tk.M, 0)
	err = csr.Fetch(&resultsXfl, 0, false)
	if err != nil {
		return res.SetError(err)
	}
	///xfl
	xflResult := c.xflTrendGrouping(resultsXfl, tp)

	///grouping deal distribution
	resultDistribution := c.dealDistribution(resultsXfl)

	o := tk.M{}
	o.Set("trendPeriod", resultData)
	o.Set("topwidget", resultDataWidget)
	o.Set("xfl", xflResult)
	o.Set("distribution", resultDistribution)
	o.Set("trendRegion", regionGrouping)
	res.SetData(o)

	return res
}

func (c *DashboardController) trendxfl(payload tk.M, tp TimePeriod, pipe []tk.M) (error, []tk.M) {
	pipe = append(pipe, tk.M{"$lookup": tk.M{
		"from":         "DCFinalSanction",
		"localField":   "customerprofile.applicantdetail.DealNo",
		"foreignField": "DealNo",
		"as":           "dc",
	}})
	pipe = append(pipe, tk.M{"$unwind": tk.M{
		"path": "$dc",
		"preserveNullAndEmptyArrays": true,
	}})
	pipe = append(pipe, tk.M{"$lookup": tk.M{
		"from":         "CreditScorecard",
		"localField":   "customerprofile.applicantdetail.DealNo",
		"foreignField": "DealNo",
		"as":           "cs",
	}})
	pipe = append(pipe, tk.M{"$unwind": tk.M{
		"path": "$cs",
		"preserveNullAndEmptyArrays": true,
	}})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno": "$customerprofile.applicantdetail.DealNo",
		"dc":     "$dc",
		"cs":     "$cs",
		"info": tk.M{
			"$slice": []interface{}{"$info.myInfo", -1},
		},
	}})
	pipe = append(pipe, tk.M{"$unwind": "$info"})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno":      "$dealno",
		"info":        "$info",
		"finalRating": tk.M{"$ifNull": []interface{}{"$cs.FinalRating", ""}},
		"amount":      tk.M{"$ifNull": []interface{}{"$dc.Amount", 0}},
		"ROI":         tk.M{"$ifNull": []interface{}{"$dc.ROI", 0}},
	}})
	// tk.Println(tk.JsonString(pipe))

	return nil, pipe
}

func (c *DashboardController) xflTrendGrouping(results tk.Ms, tp TimePeriod) tk.Ms {
	xflGrouping := map[string]tk.M{}
	count := 0
	var amount, interestsum float64
	for _, v := range results {
		timePeriod := v.Get("info").(tk.M).Get("updateTime").(time.Time)
		hasil := tp.GetPeriodID(timePeriod)
		// status := v.Get("info").(tk.M).GetString("status")
		interest := tk.Div(v.GetFloat64("ROI"), 100) * v.GetFloat64("amount")

		if hasil == 0 && !tk.IsNilOrEmpty(v.GetString("finalRating")) {
			if _, exist := xflGrouping[v.GetString("finalRating")]; !exist {
				count = 1
				amount = v.GetFloat64("amount")
				interestsum = interest
				o := tk.M{}
				o.Set("idx", hasil).Set("amount", amount).Set("interest", interestsum).Set("period", timePeriod).Set("xfl", v.GetString("finalRating")).Set("count", count)
				xflGrouping[v.GetString("finalRating")] = o
			} else {
				count += 1
				amount += v.GetFloat64("amount")
				interestsum += interest
				xflGrouping[v.GetString("finalRating")].Set("idx", hasil).Set("amount", amount).Set("interest", interestsum).Set("period", timePeriod).Set("xfl", v.GetString("finalRating")).Set("count", count)
			}
		}
	}

	totalCount := 0
	var totalamount, totalinterest float64
	for _, val := range xflGrouping {
		totalCount += val.GetInt("count")
		totalamount += val.GetFloat64("amount")
		totalinterest += val.GetFloat64("interest")
	}

	result := tk.Ms{}
	for _, val := range xflGrouping {
		o := tk.M{}
		o.Set("idx", val.GetInt("idx")).
			Set("amount", tk.Div(val.GetFloat64("amount"), 10000000)).Set("amountwidth", tk.Div(val.GetFloat64("amount"), totalamount)*100).
			Set("interest", tk.Div(val.GetFloat64("interest"), 10000000)).Set("interestwidth", tk.Div(val.GetFloat64("interest"), totalinterest)*100).
			Set("period", val.Get("period")).
			Set("xfl", val.GetString("xfl")).
			Set("count", val.GetInt("count")).Set("countwidth", tk.Div(tk.ToFloat64(val.GetInt("count"), 2, tk.RoundingAuto), tk.ToFloat64(totalCount, 2, tk.RoundingAuto))*100)
		result = append(result, o)
		// tk.Println(val.GetString("xfl"), val.GetInt("count"), totalCount, tk.Div(tk.ToFloat64(val.GetInt("count"), 2, tk.RoundingAuto), tk.ToFloat64(totalCount, 2, tk.RoundingAuto)))
	}

	return result
}

func (c *DashboardController) trendChart(payload tk.M, tp TimePeriod, pipe []tk.M) (error, []tk.M) {
	pipe = append(pipe, tk.M{"$lookup": tk.M{
		"from":         "DCFinalSanction",
		"localField":   "customerprofile.applicantdetail.DealNo",
		"foreignField": "DealNo",
		"as":           "dc",
	}})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno":     "$customerprofile.applicantdetail.DealNo",
		"citynameid": "$accountdetails.accountsetupdetails.citynameid",
		"dc": tk.M{
			"$slice": []interface{}{"$dc", -1},
		},
		"info": tk.M{
			"$slice": []interface{}{"$info.myInfo", -1},
		},
	}})
	pipe = append(pipe, tk.M{"$unwind": "$info"})
	pipe = append(pipe, tk.M{"$unwind": tk.M{
		"path": "$dc",
		"preserveNullAndEmptyArrays": true,
	}})
	pipe = append(pipe, tk.M{"$project": tk.M{
		"dealno":     "$dealno",
		"citynameid": "$citynameid",
		"info":       "$info",
		"amount":     tk.M{"$ifNull": []interface{}{"$dc.Amount", 0}},
		"ROI":        tk.M{"$ifNull": []interface{}{"$dc.ROI", 0}},
	}})
	// tk.Println(tk.JsonString(pipe))

	return nil, pipe
}

func (c *DashboardController) metricTrendPeriodGrouping(results tk.Ms, tp TimePeriod) (tk.Ms, tk.M) {
	trendGroupByMonth := map[int]tk.Ms{}
	data := tk.Ms{}
	for _, v := range results {
		timePeriod := v.Get("info").(tk.M).Get("updateTime").(time.Time)
		hasil := tp.GetPeriodID(timePeriod)
		status := v.Get("info").(tk.M).GetString("status")
		interest := tk.Div(v.GetFloat64("ROI"), 100) * v.GetFloat64("amount")

		if _, exist := trendGroupByMonth[hasil]; !exist {
			if len(data) > 0 {
				data = tk.Ms{}
			}
			o := tk.M{}
			o.Set("idx", hasil).Set("status", status).Set("amount", v.GetFloat64("amount")).Set("interest", interest).Set("period", timePeriod)
			data = append(data, o)
			trendGroupByMonth[hasil] = data
		} else {
			o := tk.M{}
			o.Set("idx", hasil).Set("status", status).Set("amount", v.GetFloat64("amount")).Set("interest", interest).Set("period", timePeriod)
			trendGroupByMonth[hasil] = append(trendGroupByMonth[hasil], o)
		}
	}
	// tk.Println(tk.JsonString(results))
	resultData := tk.Ms{}
	resultDataWidget := tk.M{}
	countMonthBefore := 0.0
	for key, v := range trendGroupByMonth {
		amount := 0.0
		interest := 0.0

		o := tk.M{}
		o.Set("count", len(trendGroupByMonth[key]))
		for _, subV := range v {
			amount += subV.GetFloat64("amount")
			interest += subV.GetFloat64("interest")

			o.Set("idx", subV.GetInt("idx"))
			o.Set("amount", tk.Div(amount, 10000000))
			o.Set("interest", tk.Div(interest, 10000000))
			o.Set("period", subV.Get("period"))
		}
		resultData = append(resultData, o)

		if o.GetInt("idx") == 1 {
			countMonthBefore = tk.ToFloat64(len(trendGroupByMonth[key]), 2, tk.RoundingAuto)
		}
		if o.GetInt("idx") == 0 {
			count := tk.ToFloat64(len(trendGroupByMonth[key]), 2, tk.RoundingAuto)
			resultDataWidget.Set("count", len(trendGroupByMonth[key]))
			resultDataWidget.Set("avgCount", tk.Div(count-countMonthBefore, countMonthBefore))
			resultDataWidget.Set("avgAmount", tk.Div(o.GetFloat64("amount")-countMonthBefore, countMonthBefore))
			resultDataWidget.Set("avgInterest", tk.Div(o.GetFloat64("interest")-countMonthBefore, countMonthBefore))
			resultDataWidget.Set("idx", o.GetInt("idx"))
			resultDataWidget.Set("amount", o.GetFloat64("amount"))
			resultDataWidget.Set("interest", o.GetFloat64("interest"))
			resultDataWidget.Set("period", o.Get("period"))
			// resultDataWidget = append(resultDataWidget, o)
		}
	}
	return resultData, resultDataWidget
}

func (c *DashboardController) metricTrendRegionGrouping(results tk.Ms, tp TimePeriod, k *knot.WebContext) (error, tk.Ms) {
	grouping := map[string]tk.Ms{}
	maps := tk.Ms{}
	for _, v := range results {
		timePeriod := v.Get("info").(tk.M).Get("updateTime").(time.Time)
		hasil := tp.GetPeriodID(timePeriod)
		status := v.Get("info").(tk.M).GetString("status")
		interest := tk.Div(v.GetFloat64("ROI"), 100) * v.GetFloat64("amount")
		key, err := GetRegionName(v.GetString("citynameid"), k)
		if err != nil {
			return err, nil
		}

		if hasil == 0 {
			if _, exist := grouping[key]; !exist {
				if len(maps) > 0 {
					maps = tk.Ms{}
				}
				o := tk.M{}
				o.Set("idx", hasil).Set("status", status).Set("amount", tk.Div(v.GetFloat64("amount"), 10000000)).Set("interest", tk.Div(interest, 10000000)).Set("period", timePeriod).Set("region", key)
				maps = append(maps, o)
				grouping[key] = maps
			} else {
				o := tk.M{}
				o.Set("idx", hasil).Set("status", status).Set("amount", tk.Div(v.GetFloat64("amount"), 10000000)).Set("interest", tk.Div(interest, 10000000)).Set("period", timePeriod).Set("region", key)
				grouping[key] = append(grouping[key], o)
			}
		}
	}

	resultsData := tk.Ms{}
	for key, v := range grouping {
		var amountsum, interestsum float64
		o := tk.M{}
		for _, vals := range v {
			amountsum += vals.GetFloat64("amount")
			interestsum += vals.GetFloat64("interest")
			o.Set("idx", vals.GetInt("idx")).Set("status", vals.GetString("status")).Set("amount", amountsum).Set("interest", interestsum).Set("period", vals.Get("period")).Set("region", vals.GetString("region"))
		}
		o.Set("count", len(grouping[key]))
		resultsData = append(resultsData, o)
	}

	return nil, resultsData
}

func (c *DashboardController) dealDistribution(data []tk.M) tk.Ms {
	dealGrouping := map[string]tk.Ms{}
	dealAppend := tk.Ms{}
	xflGrouping := map[string]tk.M{}
	count := 0
	var amount, roi, interestamount float64
	for _, v := range data {
		timePeriod := v.Get("info").(tk.M).Get("updateTime").(time.Time)
		percent := c.roiRange(v.GetFloat64("ROI"))
		interest := tk.Div(v.GetFloat64("ROI"), 100) * v.GetFloat64("amount")
		if !tk.IsNilOrEmpty(v.GetString("finalRating")) {
			if _, exist := xflGrouping[v.GetString("finalRating")+"|"+percent]; !exist {
				count = 1
				amount = v.GetFloat64("amount")
				interestamount = interest
				roi = v.GetFloat64("ROI")
				o := tk.M{}
				o.Set("amount", amount).Set("roi", roi).Set("period", timePeriod).Set("xfl", v.GetString("finalRating")).Set("count", count).Set("percent", percent).Set("interest", interest)
				xflGrouping[v.GetString("finalRating")+"|"+percent] = o
			} else {
				count += 1
				amount += v.GetFloat64("amount")
				roi += v.GetFloat64("ROI")
				interestamount += interest
				xflGrouping[v.GetString("finalRating")+"|"+percent].Set("amount", amount).Set("roi", roi).Set("period", timePeriod).Set("xfl", v.GetString("finalRating")).Set("count", count).Set("percent", percent).Set("interest", interest)
			}

			if _, exist := dealGrouping[v.GetString("finalRating")]; !exist {
				o := tk.M{}
				if len(dealAppend) > 0 {
					dealAppend = tk.Ms{}
				}
				o.Set("dealno", v.GetString("dealno")).Set("dealamount", tk.Div(v.GetFloat64("amount"), 10000000)).Set("interestrate", tk.Div(v.GetFloat64("ROI"), 100)).Set("period", timePeriod)
				dealAppend = append(dealAppend, o)
				dealGrouping[v.GetString("finalRating")] = dealAppend
			} else {
				o := tk.M{}
				o.Set("dealno", v.GetString("dealno")).Set("dealamount", tk.Div(v.GetFloat64("amount"), 10000000)).Set("interestrate", tk.Div(v.GetFloat64("ROI"), 100)).Set("period", timePeriod)
				dealGrouping[v.GetString("finalRating")] = append(dealGrouping[v.GetString("finalRating")], o)
			}
		}
	}

	result := tk.Ms{}
	for _, val := range xflGrouping {
		o := tk.M{}
		o.Set("amount", tk.Div(val.GetFloat64("amount"), 10000000)).
			Set("roi", val.GetFloat64("roi")).Set("period", val.Get("period")).
			Set("xfl", val.GetString("xfl")).Set("count", val.GetInt("count")).Set("percent", val.GetString("percent")).
			Set("interest", tk.Div(val.GetFloat64("interest"), 10000000)).
			Set("details", dealGrouping[val.GetString("xfl")])
		result = append(result, o)
	}
	return result
}

func (c *DashboardController) roiRange(roi float64) string {
	roipercentage := ""
	switch {
	case roi > 5.875 && roi <= 6.125:
		roipercentage = "6"
	case roi > 6.125 && roi <= 6.375:
		roipercentage = "6.25"
	case roi > 6.375 && roi <= 6.625:
		roipercentage = "6.5"
	case roi > 6.625 && roi <= 6.875:
		roipercentage = "6.75"
	case roi > 6.875 && roi <= 7.125:
		roipercentage = "7"
	case roi > 7.125 && roi <= 7.375:
		roipercentage = "7.25"
	case roi > 7.375 && roi <= 7.625:
		roipercentage = "7.5"
	case roi > 7.625 && roi <= 7.875:
		roipercentage = "7.75"
	case roi > 7.875 && roi <= 8.125:
		roipercentage = "8"
	case roi > 8.125 && roi <= 8.375:
		roipercentage = "8.25"
	case roi > 8.375 && roi <= 8.625:
		roipercentage = "8.50"
	case roi > 8.625 && roi <= 8.875:
		roipercentage = "8.75"
	case roi > 8.875 && roi <= 9.125:
		roipercentage = "9"
	case roi > 9.125 && roi <= 9.375:
		roipercentage = "9.25"
	case roi > 9.375 && roi <= 9.625:
		roipercentage = "9.50"
	case roi > 9.625 && roi <= 9.875:
		roipercentage = "9.75"
	case roi > 9.875 && roi <= 10.125:
		roipercentage = "10"
	case roi > 10.125 && roi <= 10.375:
		roipercentage = "10.25"
	case roi > 10.375 && roi <= 10.625:
		roipercentage = "10.50"
	case roi > 10.625 && roi <= 10.875:
		roipercentage = "10.75"
	case roi > 10.875 && roi <= 11.125:
		roipercentage = "11"
	case roi > 11.125 && roi <= 11.375:
		roipercentage = "11.25"
	case roi > 11.375 && roi <= 11.625:
		roipercentage = "11.50"
	case roi > 11.625 && roi <= 11.875:
		roipercentage = "11.75"
	case roi > 11.875:
		roipercentage = ">12"
	}
	return roipercentage
}

func (c *DashboardController) ConversionOption(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := tk.M{}

	payload := tk.M{}

	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	cn, err := GetConnection()
	if err != nil {
		tk.Println("connection failed")
	}

	defer cn.Close()

	periodStart, err := time.Parse(time.RFC3339, payload.GetString("start"))
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	periodEnd, err := time.Parse(time.RFC3339, payload.GetString("end"))
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	tp := TimePeriod{
		Start:       periodStart,
		End:         periodEnd,
		TimeType:    payload.GetString("type"),
		PeriodCount: 1,
	}
	tp = CalcTimePeriod(tp)

	ids, err := FiltersAD2DealNo(
		nil,
		CheckArray(payload.Get("filter")),
		nil,
	)

	filterids := []interface{}{}
	for _, id := range ids {
		filterids = append(filterids, id)
	}

	whsx := []*dbox.Filter{}
	whsx = append(whsx,
		dbox.And(
			dbox.Lt("info.myInfo.updateTime", tp.FilterBefore),
			dbox.Gte("info.myInfo.updateTime", tp.FilterAfter),
			dbox.In("customerprofile.applicantdetail.DealNo", filterids...),
		),
	)

	whsMatch, err := dbox.NewFilterBuilder(new(mongo.FilterBuilder)).BuildFilter(dbox.And(whsx...))
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	pipe := []tk.M{}
	tk.Println("---------------------2811")
	pipe = append(pipe, tk.M{
		"$match": whsMatch,
	})
	pipe = append(pipe, tk.M{
		"$project": tk.M{
			"info": tk.M{
				"$filter": tk.M{
					"input": "$info.myInfo",
					"as":    "myInfo",
					"cond": tk.M{
						"$and": []interface{}{
							tk.M{"$lt": []interface{}{"$$myInfo.updateTime", tp.FilterBefore}},
							tk.M{"$gte": []interface{}{"$$myInfo.updateTime", tp.FilterAfter}},
						},
					},
				},
			},
			"comp": tk.M{
				"$filter": tk.M{
					"input": "$info.myInfo",
					"as":    "myInfo",
					"cond": tk.M{
						"$and": []interface{}{
							tk.M{"$lte": []interface{}{"$$myInfo.updateTime", tp.FilterAfter}},
						},
					},
				},
			},
		},
	})

	// err, pipeResult := c.trendChart(payload, tp, pipe)
	// if !tk.IsNilOrEmpty(err) {
	// 	return res.SetError(err)
	// }

	query := cn.NewQuery().
		Command("pipe", pipe).
		From("DealSetup")

	csr, err := query.Cursor(nil)
	if err != nil {
		return c.SetResultInfo(true, "error", nil)
	}
	defer csr.Close()
	results := make([]tk.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return c.SetResultInfo(true, "error", nil)
	}
	if len(results) != 0 {
		tk.Println("---------------------2851")

		undrDeals := 0
		apprDeals := 0
		inQueue := 0
		inAnlysis := 0
		onAnlysis := 0
		pendingDeals2 := 0
		sentdc := 0
		actDeals := 0
		undrDeals1 := 0
		apprDeals1 := 0
		inQueue1 := 0
		inAnlysis1 := 0
		onAnlysis1 := 0
		pendingDeals21 := 0
		sentdc1 := 0

		actDeals1 := 0
		undrRate := 0.0
		apprRate := 0.0
		analRate := 0.0
		actRate := 0.0
		undrRate1 := 0.0
		apprRate1 := 0.0
		analRate1 := 0.0
		actRate1 := 0.0
		pendingDeals1 := 0
		pendingDeals11 := 0
		tk.Println("---------------------2880", results)

		for _, otr := range results {
			v := otr.Get("info")
			l := v.([]interface{})
			if len(l) != 0 {
				for i, st := range l {

					stts := hp.TkWalk(st.(tk.M), "status")
					tk.Println("---------------------2871", stts)
					if stts == "Approved" || stts == "Rejected" {
						undrDeals = undrDeals + 1
					}

					if stts == "Approved" {
						apprDeals = apprDeals + 1
					}

					if stts == "In queue" {
						inQueue = inQueue + 1
					}

					if stts == "Under Analysis" || stts == "Sent Back for Analysis" {
						inAnlysis = inAnlysis + 1
					}

					if stts == "Sent Back for Analysis" {
						bs := l[i-1]
						stl := hp.TkWalk(bs.(tk.M), "status")

						if stl == "On Hold" || stl == "Awaiting Decision" {
							onAnlysis = onAnlysis + 1
						}

					}

					if stts == "On Hold" || stts == "Awaiting Decision" {
						f := len(l) > i+1
						if !f {
							pendingDeals2 = pendingDeals2 + 1
						} else {
							cs := l[i+1]
							ostl := hp.TkWalk(cs.(tk.M), "status")
							if cs != nil {
								if ostl == "Approved" || ostl == "Rejected" || ostl == "Cancelled" {
									pendingDeals2 = pendingDeals2 + 1
								}
							}

						}

					}

					if stts == "Sent to Decision Committee" {
						sentdc = sentdc + 1
					}

					if stts == "Approved" || stts == "Rejected" || stts == "Cancelled" {
						actDeals = actDeals + 1
					}
				}
				pendingDeals1 = inAnlysis + onAnlysis
				undrRate = float64(undrDeals)/float64(inQueue) + float64(pendingDeals1) + float64(pendingDeals2)
				apprRate = float64(apprDeals)/float64(inQueue) + float64(pendingDeals1) + float64(pendingDeals2)
				actRate = float64(actDeals)/float64(inQueue) + float64(pendingDeals1) + float64(pendingDeals2)
				analRate = float64(sentdc)/float64(inQueue) + float64(pendingDeals1)
				res.Set("undrRate", undrRate)
				res.Set("apprRate", apprRate)
				res.Set("analRate", analRate)
				res.Set("actRate", actRate)
			}

			x := otr.Get("comp")
			m := x.([]interface{})
			tk.Println("--------------------- len", len(m))
			if len(m) != 0 {
				for i, st1 := range m {

					stts1 := hp.TkWalk(st1.(tk.M), "status")
					tk.Println("---------------------2871", stts1)
					if stts1 == "Approved" || stts1 == "Rejected" {
						undrDeals1 = undrDeals1 + 1
					}

					if stts1 == "Approved" {
						apprDeals1 = apprDeals1 + 1
					}

					if stts1 == "In queue" {
						inQueue1 = inQueue1 + 1
					}

					if stts1 == "Under Analysis" || stts1 == "Sent to Decision Committee" {
						inAnlysis1 = inAnlysis1 + 1
					}

					if stts1 == "Sent Back for Analysis" {
						bs1 := l[i-1]
						stl1 := hp.TkWalk(bs1.(tk.M), "status")

						if stl1 == "On Hold" || stl1 == "Awaiting Decision" {
							onAnlysis1 = onAnlysis1 + 1
						}

					}

					if stts1 == "On Hold" || stts1 == "Awaiting Decision" {
						f1 := len(m) > i+1
						if !f1 {
							pendingDeals21 = pendingDeals21 + 1
						} else {
							cs1 := l[i+1]
							ostl1 := hp.TkWalk(cs1.(tk.M), "status")
							if cs1 != nil {
								if ostl1 == "Approved" || ostl1 == "Rejected" || ostl1 == "Cancelled" {
									pendingDeals21 = pendingDeals21 + 1
								}
							}

						}

					}

					if stts1 == "Sent to Decision Committee" {
						sentdc1 = sentdc1 + 1
					}

					if stts1 == "Approved" || stts1 == "Rejected" || stts1 == "Cancelled" {
						actDeals1 = actDeals1 + 1
					}
				}
				pendingDeals11 = inAnlysis1 + onAnlysis1
				undrRate1 = float64(undrDeals1)/float64(inQueue1) + float64(pendingDeals11) + float64(pendingDeals21)
				apprRate1 = float64(apprDeals1)/float64(inQueue1) + float64(pendingDeals11) + float64(pendingDeals21)
				actRate1 = float64(actDeals1)/float64(inQueue1) + float64(pendingDeals11) + float64(pendingDeals21)
				analRate1 = float64(sentdc1)/float64(inQueue1) + float64(pendingDeals11)

			}

		}

		tk.Println("---------------------2999", results)

		// res.Set("ondata", results)
		if undrRate1 != 0 || apprRate1 != 0 || analRate1 != 0 || actRate1 != 0 {
			res.Set("compundrRate", undrRate1-undrRate)
			res.Set("compapprRate", apprRate1-apprRate)
			res.Set("companalRate", analRate1-analRate)
			res.Set("compactRate", actRate1-actRate)
		} else {
			res.Set("compundrRate", 0)
			res.Set("compapprRate", 0)
			res.Set("companalRate", 0)
			res.Set("compactRate", 0)
		}

		return res
	} else {
		tk.Printfn("data not found")
	}

	return c.SetResultInfo(true, "data not found", nil)

}
