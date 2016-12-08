package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/cast"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"strings"
	"time"
)

type RtrController struct {
	*BaseController
}

func (c *RtrController) Default(k *knot.WebContext) interface{} {
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
		DataAccess.Rolename = o["Rolename"].(string)
		DataAccess.Fullname = o["Fullname"].(string)
	}

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "rtr/topgrid.html", "rtr/bottomgrid.html", "shared/loading.html"}

	return DataAccess
}

func (c *RtrController) GetDataBottomGrid(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		tk.Println(err.Error())
	}

	arr, summary, months, thereisupdate, err := new(RTRBottom).GetData(t.GetString("customerid"), t.GetString("dealno"))
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	result := []tk.M{{"data": arr}, {"summary": summary}, {"months": months}, {"thereisupdate": thereisupdate}}

	return CreateResult(true, result, "")
}

func (c *RtrController) Update(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := []tk.M{}
	err := k.GetPayload(&t)
	tk.Printfn("----------->", t)
	if err != nil {
		tk.Println(err.Error())
	}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return CreateResult(false, nil, em.Error())
	}

	list := []RTRBottom{}
	query := []*db.Filter{}
	query = append(query, db.And(db.Eq("CustomerId", t[0].GetString("CustomerId")), db.Eq("DealNo", t[0].GetString("DealNo"))))
	csr, err := cMongo.NewQuery().
		From("RepaymentRecords").
		Where(query...).
		Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	defer csr.Close()
	if csr != nil {
		err = csr.Fetch(&list, 0, false)

		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	} else if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	qinsert := cMongo.NewQuery().
		From("RepaymentRecords").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	arr := []RTRBottom{}
	for idx, val := range t {
		ar := RTRBottom{}

		if len(list) == 0 {
			list = append(list, RTRBottom{})
			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month0")})
			ar.Months = append(ar.Months, list[0].Months[0])

			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month1")})
			ar.Months = append(ar.Months, list[0].Months[1])

			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month2")})
			ar.Months = append(ar.Months, list[0].Months[2])

			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month3")})
			ar.Months = append(ar.Months, list[0].Months[3])

			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month4")})
			ar.Months = append(ar.Months, list[0].Months[4])

			list[0].Months = append(list[0].Months, MonthRtr{time.Now(), val.GetString("Month5")})
			ar.Months = append(ar.Months, list[0].Months[5])
		} else {
			list[0].Months[0].Value = val.GetString("Month0")
			ar.Months = append(ar.Months, list[0].Months[0])

			list[0].Months[1].Value = val.GetString("Month1")
			ar.Months = append(ar.Months, list[0].Months[1])

			list[0].Months[2].Value = val.GetString("Month2")
			ar.Months = append(ar.Months, list[0].Months[2])

			list[0].Months[3].Value = val.GetString("Month3")
			ar.Months = append(ar.Months, list[0].Months[3])

			list[0].Months[4].Value = val.GetString("Month4")
			ar.Months = append(ar.Months, list[0].Months[4])

			list[0].Months[5].Value = val.GetString("Month5")
			ar.Months = append(ar.Months, list[0].Months[5])
		}

		ar.SNo = val.GetString("SNo")
		ar.CustomerId = val.GetString("CustomerId")
		ar.DealNo = val.GetString("DealNo")
		ar.Bank = val.GetString("Bank")
		ar.TypeOfLoan = val.GetString("TypeOfLoan")
		ar.BSLStatus = val.GetString("BSLStatus")
		ar.LoanStatus = val.GetString("LoanStatus")
		ar.Amount = val.GetFloat64("Amount")
		ar.POS = val.GetFloat64("POS")
		ar.EMI = val.GetFloat64("EMI")
		ar.EMI = val.GetFloat64("EMI")
		ar.Bounces = int64(val.GetFloat64("Bounces"))
		ar.DpdMaxTrack = val.GetInt("DpdMaxTrack")
		//ar.EMIBalance = val.GetFloat64("EMIBalance")
		ar.LoanTenor = int64(val.GetFloat64("LoanTenor"))
		ar.LoanStart = cast.String2Date(strings.Split(val.GetString("LoanStart"), "T")[0], "yyyy-MM-dd")
		ar.LoanEnd = cast.String2Date(strings.Split(val.GetString("LoanEnd"), "T")[0], "yyyy-MM-dd")
		//ar.EMIDue = val.GetFloat64("EMIDue")

		if val.GetString("Id") == "" {
			ar.Id = bson.NewObjectId()
		} else {
			ar.Id = bson.ObjectIdHex(val.GetString("Id"))
		}

		// ar.DateConfirmed = time.Now()

		if val.Get("IsBankAnalys") != nil {
			ar.IsBankAnalys = val.Get("IsBankAnalys").(bool)
		}

		if val.GetString("BankAnalysId") != "" {
			ar.BankAnalysId = bson.ObjectIdHex(val.GetString("BankAnalysId"))
		} else {
			ar.BankAnalysId = ""
		}

		if val.Get("Confirmed") != nil {
			ar.Confirmed = val.Get("Confirmed").(bool)
		}

		ar.Status = val.GetInt("Status")
		if strings.Contains(val.GetString("DateFreeze"), ".") {
			ar.DateFreeze = cast.String2Date(strings.Split(strings.Replace(val.GetString("DateFreeze"), "T", " ", -1), ".")[0], "yyyy-MM-dd HH:mm:ss")
		} else {
			ar.DateFreeze = list[0].DateFreeze
		}
		if strings.Contains(val.GetString("DateSave"), ".") {
			ar.DateSave = cast.String2Date(strings.Split(strings.Replace(val.GetString("DateSave"), "T", " ", -1), ".")[0], "yyyy-MM-dd HH:mm:ss")
		} else {
			ar.DateSave = list[0].DateSave
		}
		if strings.Contains(val.GetString("DateConfirmed"), ".") {
			ar.DateConfirmed = cast.String2Date(strings.Split(strings.Replace(val.GetString("DateConfirmed"), "T", " ", -1), ".")[0], "yyyy-MM-dd HH:mm:ss")
		} else {
			ar.DateConfirmed = list[0].DateConfirmed
		}

		arr = append(arr, ar)

		insdata := map[string]interface{}{"data": ar}
		em = qinsert.Exec(insdata)

		c.WriteLog(em)
		if em != nil {
			return CreateResult(false, nil, em.Error())
		}
		if ar.Status == 1 {
			del := false
			if idx == 0 {
				del = true
			}

			if err := new(DataConfirmController).SaveDataConfirmed(ar.CustomerId, ar.DealNo, "RepaymentRecords", &ar, del); err != nil {
				return err
			}
		}
	}

	return CreateResult(true, arr, "")
}

func (c *RtrController) Destroy(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return CreateResult(false, nil, em.Error())
	}

	e := cMongo.NewQuery().
		Where(db.Eq("_id", bson.ObjectIdHex(t["_id"].(string)))).
		Delete().
		From("RepaymentRecords").
		Exec(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	}
	return CreateResult(true, nil, "")
}

func (c *RtrController) Create(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := []tk.M{}
	err := k.GetPayload(&t)

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return CreateResult(false, nil, em.Error())
	}

	qinsert := cMongo.NewQuery().
		From("RepaymentRecords").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	query := []*db.Filter{}

	list := []RTRBottom{}
	query = append(query, db.And(db.Eq("CustomerId", t[0].GetString("CustomerId")), db.Eq("DealNo", t[0].GetString("DealNo"))))
	csr, err := cMongo.NewQuery().
		From("RepaymentRecords").
		Where(query...).
		Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	defer csr.Close()
	if csr != nil {
		err = csr.Fetch(&list, 0, false)

		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	} else if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	arr := []RTRBottom{}
	for _, val := range t {
		ar := RTRBottom{}

		list[0].Months[0].Value = val.GetString("Month0")
		ar.Months = append(ar.Months, list[0].Months[0])

		list[0].Months[1].Value = val.GetString("Month1")
		ar.Months = append(ar.Months, list[0].Months[1])

		list[0].Months[2].Value = val.GetString("Month2")
		ar.Months = append(ar.Months, list[0].Months[2])

		list[0].Months[3].Value = val.GetString("Month3")
		ar.Months = append(ar.Months, list[0].Months[3])

		list[0].Months[4].Value = val.GetString("Month4")
		ar.Months = append(ar.Months, list[0].Months[4])

		list[0].Months[5].Value = val.GetString("Month5")
		ar.Months = append(ar.Months, list[0].Months[5])

		ar.SNo = val.GetString("SNo")
		ar.CustomerId = val.GetString("CustomerId")
		ar.DealNo = val.GetString("DealNo")
		ar.Bank = val.GetString("Bank")
		ar.TypeOfLoan = val.GetString("TypeOfLoan")
		ar.BSLStatus = val.GetString("BSLStatus")
		ar.LoanStatus = val.GetString("LoanStatus")
		ar.Amount = val.GetFloat64("Amount")
		ar.POS = val.GetFloat64("POS")
		ar.EMI = val.GetFloat64("EMI")
		//ar.EMIBalance = val.GetFloat64("EMIBalance")
		ar.LoanTenor = int64(val.Get("LoanTenor").(float64))
		ar.LoanStart = cast.String2Date(strings.Split(val.GetString("LoanStart"), "T")[0], "yyyy-MM-dd")
		ar.LoanEnd = cast.String2Date(strings.Split(val.GetString("LoanEnd"), "T")[0], "yyyy-MM-dd")
		//	ar.EMIDue = val.GetFloat64("EMIDue")
		ar.IsBankAnalys = false
		ar.Id = bson.NewObjectId()
		ar.Bounces = int64(val.GetInt("Bounces"))
		arr = append(arr, ar)

		insdata := map[string]interface{}{"data": ar}
		em = qinsert.Exec(insdata)
		if em != nil {
			return CreateResult(false, nil, em.Error())
		}
	}

	return CreateResult(true, arr, "")
}
