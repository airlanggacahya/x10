package models

import (
	"github.com/eaciit/orm"
)

type DashboardFilterModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string ` bson:"_id" , json:"_id" ` //mas Bud ini sampean isi UserID
	Filters       []struct {
		FilterName string
		ShowMe     bool
		Value      string
	}
}

func NewDashboardFilterModel() *DashboardFilterModel {
	m := new(DashboardFilterModel)
	m.Id = ""
	return m
}

func (e *DashboardFilterModel) RecordID() interface{} {
	return e.Id
}

func (m *DashboardFilterModel) TableName() string {
	return "DashboardFilter"
}
