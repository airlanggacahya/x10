package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

type UpdContractModel struct {
	orm.ModelBase     					`bson:"-",json:"-"`
	Id                	bson.ObjectId 	`bson:"_id" , json:"_id" `     	
	Filetype 			string          
	Contract_map 		string          
	Upd_contract_map 	string         
	Upd_divisor    		float64     	
	Date_updated     	string     	
	Update_user     	string     	
	
}

func NewUpdContractModel() *UpdContractModel {
	m := new(UpdContractModel)
	m.Id = bson.NewObjectId()
	return m
}

func (e *UpdContractModel) RecordID() interface{} {
	return e.Id
}

func (m *UpdContractModel) TableName() string {
	return "UpdContract"
}
