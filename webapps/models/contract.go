package models

import (
	"github.com/eaciit/orm"
	// "gopkg.in/mgo.v2/bson"
	// "time"
)

type ContractModel struct {
	orm.ModelBase        `bson:"-",json:"-"`
	Id                   int `bson:"_id" , json:"_id" `
	ContractGroupId      int
	ContractGroupName    string
	ContractSubGroupId   int
	ContractSubGroupName string
	Contract_code        string
	Contract_map         string
	Clearer_Code         string `bson:"Clearer_Code", json:"Clearer_Code"`
	Fullname             string
	Multiplier           float64
	Divisor              float64
	No_of_digits         int
	Fractional           string
	Fractional_val       int
	Currency             int
	Exchange             string
	Def_market_fee       float64
	Market_fee_crncy     int
	Def_clr_commission   float64
	Clr_comm_crncy       int
	Def_nfa_fee          float64
	Nfa_fee_crncy        int
	Def_misc_fee         float64
	Misc_fee_crncy       int
	Date_created         string
	Date_updated         string
	Update_user          string
	Settlemethod         string
	CurrencyDesc         string
	Contracttype         string
}

func NewContractModel() *ContractModel {
	m := new(ContractModel)
	return m
}

func (e *ContractModel) RecordID() interface{} {
	return e.Id
}

func (m *ContractModel) TableName() string {
	return "Contracts"
}
