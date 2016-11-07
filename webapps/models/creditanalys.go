package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type CreditAnalysRisk struct {
	Risks     string
	Mitigants string
}

type FinalComment struct {
	Amount               float64
	RecommendedCondition string
	Recommendations      string
}

type CreditAnalysModel struct {
	orm.ModelBase     `bson:"-",json:"-"`
	Id                bson.ObjectId      `bson:"_id" , json:"_id"`
	CustomerId        int                `bson:"CustomerId,omitempty"`
	DealNo            string             `bson:"DealNo,omitempty"`
	CreditAnalysRisks []CreditAnalysRisk `bson:"CreditAnalysRisks,omitempty"`
	FinalComment      FinalComment       `bson:"FinalComment,omitempty"`
}

func NewCreditAnalysModel() *CreditAnalysModel {
	m := new(CreditAnalysModel)
	return m
}

func (e *CreditAnalysModel) RecordID() interface{} {
	return e.Id
}

func (m *CreditAnalysModel) TableName() string {
	return "CreditAnalys"
}

func (m *CreditAnalysModel) Get(customerId int, dealNo string) (CreditAnalysModel, error) {

	datas := CreditAnalysModel{}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return datas, em
	}

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("CustomerId", customerId))
	query = append(query, dbox.Eq("DealNo", dealNo))

	csr, err := cMongo.NewQuery().
		Where(query...).
		From(m.TableName()).
		Cursor(nil)

	if err != nil {
		return datas, err
	}

	defer csr.Close()

	if csr != nil {
		err = csr.Fetch(&datas, 1, true)

		if err != nil {
			return datas, err
		}
	} else if err != nil {
		return datas, err
	}

	return datas, nil
}

func (m *CreditAnalysModel) Save(datas CreditAnalysModel) (CreditAnalysModel, error) {

	if datas.Id == "" {
		datas.Id = bson.NewObjectId()
	}

	cMongo, em := GetConnection()
	defer cMongo.Close()
	if em != nil {
		return datas, em
	}

	q := cMongo.NewQuery().SetConfig("multiexec", true).From(m.TableName()).Save()

	defer q.Close()

	err := q.Exec(tk.M{"data": datas})

	return datas, err
}
