package models

import (
	"errors"
	"time"

	. "eaciit/x10/webapps/connection"
	// "fmt"
	// "github.com/eaciit/crowd"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	// "strconv"
)

type ReallocationDeal struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id" , json:"_id"`
	CustomerName  string        `bson:"CustomerName,omitempty"`
	DealNo        string        `bson:"DealNo,omitempty"`
	FromName      string        `bson:"FromName,omitempty"`
	FromId        string        `bson:"FromId,omitempty"`
	ToName        string        `bson:"ToName,omitempty"`
	ToId          string        `bson:"ToId,omitempty"`
	Role          string        `bson:"Role,omitempty"`
	Reason        string        `bson:"Reason,omitempty"`
	TimeStamp     time.Time     `bson:"TimeStamp,omitempty"`
	Logs          []LogReallocationDeal
}

type LogReallocationDeal struct {
	FromName  string    `bson:"FromName,omitempty"`
	FromId    string    `bson:"FromId,omitempty"`
	ToName    string    `bson:"ToName,omitempty"`
	ToId      string    `bson:"ToId,omitempty"`
	Role      string    `bson:"Role,omitempty"`
	Reason    string    `bson:"Reason,omitempty"`
	TimeStamp time.Time `bson:"TimeStamp,omitempty"`
}

func (m *ReallocationDeal) TableName() string {
	return "ReallocationDeal"
}

func (m *ReallocationDeal) SearchByParam(param tk.M) ([]ReallocationDeal, error) {
	searchText := param.GetString("Search")

	reallocation := []ReallocationDeal{}

	cMongo, em := GetConnection()
	if em != nil {
		return reallocation, em
	}

	defer cMongo.Close()

	filter := []*dbox.Filter{}

	filter = append(filter, dbox.Contains("CustomerName", searchText))
	filter = append(filter, dbox.Contains("DealNo", searchText))
	filter = append(filter, dbox.Contains("FromName", searchText))
	filter = append(filter, dbox.Contains("ToName", searchText))
	filter = append(filter, dbox.Contains("Role", searchText))

	query := []*dbox.Filter{}

	query = append(query, dbox.Or(filter...))

	queryBuilder := cMongo.NewQuery().
		From(new(ReallocationDeal).TableName())

	if searchText != "" {
		queryBuilder.Where(query...)
	}

	csr, err := queryBuilder.Cursor(nil)

	if err != nil {
		return reallocation, err
	} else if csr != nil {
		defer csr.Close()
	}

	csr.Fetch(&reallocation, 0, true)

	return reallocation, err
}

var ErrorWrongType = errors.New("Wrong DealSetup Role Type")

func updateDealSetup(id string, types string, name string, nameid string) error {
	con, err := GetConnection()
	if err != nil {
		return err
	}
	defer con.Close()

	cur, err := con.NewQuery().
		From("DealSetup").
		Where(dbox.Eq("accountdetails._id", id)).
		Cursor(nil)
	if err != nil {
		return err
	}

	ins := con.NewQuery().
		From("DealSetup").
		SetConfig("multiexec", true).
		Save()

	dealst := []tk.M{}
	err = cur.Fetch(&dealst, 0, true)
	if err != nil {
		return err
	}

	for _, deal := range dealst {
		ad := deal.Get("accountdetails").(tk.M)
		ads := ad.Get("accountsetupdetails").(tk.M)
		switch types {
		case "RM":
			ads.Set("rmname", name)
			ads.Set("RmNameId", nameid)
		case "CA":
			ads.Set("creditanalyst", name)
			ads.Set("CreditAnalystId", nameid)
		default:
			return ErrorWrongType
		}

		insdata := map[string]interface{}{"data": deal}
		err = ins.Exec(insdata)
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *ReallocationDeal) UpdateReallocationRole(param []tk.M) error {
	cMongo, em := GetConnection()
	if em != nil {
		return em
	}

	defer cMongo.Close()

	qinsert := cMongo.NewQuery().
		From("AccountDetails").
		SetConfig("multiexec", true).
		Save()

	qinsertAllow := cMongo.NewQuery().
		From(m.TableName()).
		SetConfig("multiexec", true).
		Save()

	for _, v := range param {
		tk.Printfn("%v \n", v)
		filter := []*dbox.Filter{}

		filter = append(filter, dbox.Eq("_id", v.GetString("Id")))

		AD, err := new(AccountDetail).Where(filter)
		if err != nil {
			return err
		}

		if len(AD) > 0 {
			if v.GetString("Role") == "CA" {
				v.Set("FromText", AD[0].AccountSetupDetails.CreditAnalyst)
				v.Set("FromId", AD[0].AccountSetupDetails.CreditAnalystId)
				AD[0].AccountSetupDetails.CreditAnalyst = v.GetString("ToText")
				AD[0].AccountSetupDetails.CreditAnalystId = v.GetString("ToId")
			} else {
				v.Set("FromText", AD[0].AccountSetupDetails.RmName)
				v.Set("FromId", AD[0].AccountSetupDetails.RmNameId)
				AD[0].AccountSetupDetails.RmName = v.GetString("ToText")
				AD[0].AccountSetupDetails.RmNameId = v.GetString("ToId")
			}

			insdata := map[string]interface{}{"data": AD[0]}
			em = qinsert.Exec(insdata)
			if em != nil {
				return em
			}
		}

		updateDealSetup(v.GetString("Id"), v.GetString("Role"), v.GetString("ToText"), v.GetString("ToId"))

		allocate := new(ReallocationDeal)
		logDeal := LogReallocationDeal{}

		if v.GetString("ReallocateId") != "" {
			filter := []*dbox.Filter{}

			id := bson.ObjectIdHex(v.GetString("ReallocateId"))
			filter = append(filter, dbox.Eq("_id", id))

			csr, err := cMongo.NewQuery().
				From(m.TableName()).
				Where(filter...).
				Cursor(nil)

			if err != nil {
				panic(err)
			} else if csr != nil {
				defer csr.Close()
			}

			csr.Fetch(&allocate, 1, true)
		} else {
			allocate.Id = bson.NewObjectId()
		}

		allocate.CustomerName = v.GetString("CustomerName")
		allocate.DealNo = v.GetString("DealNo")
		allocate.FromName = v.GetString("FromText")
		allocate.FromId = v.GetString("FromId")
		allocate.ToName = v.GetString("ToText")
		allocate.ToId = v.GetString("ToId")
		allocate.Role = v.GetString("Role")
		allocate.Reason = v.GetString("Reason")
		allocate.TimeStamp = time.Now()

		logDeal.FromName = allocate.FromName
		logDeal.FromId = allocate.FromId
		logDeal.ToName = allocate.ToName
		logDeal.ToId = allocate.ToId
		logDeal.Role = allocate.Role
		logDeal.Reason = allocate.Reason
		logDeal.TimeStamp = allocate.TimeStamp

		if v.GetString("LogSave") == "true" {
			allocate.Logs = append(allocate.Logs, logDeal)
		}

		insdata := map[string]interface{}{"data": allocate}
		em = qinsertAllow.Exec(insdata)
		if em != nil {
			return em
		}
	}

	return nil
}

func (m *ReallocationDeal) Where(filter []*dbox.Filter) ([]ReallocationDeal, error) {
	res := []ReallocationDeal{}

	conn, err := GetConnection()
	defer conn.Close()

	if err != nil {
		return res, err
	}

	query := conn.NewQuery().
		From(new(ReallocationDeal).TableName())

	if len(filter) > 0 {
		query = query.Where(filter...)
	}

	csr, err := query.Cursor(nil)

	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return res, err
	}

	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return res, err
	}

	return res, err
}
