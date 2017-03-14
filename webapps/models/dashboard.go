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

func (e *DashboardFilterModel) RecordID() interface{} {
	return e.Id
}

func (m *DashboardFilterModel) TableName() string {
	return "DashboardFilter"
}

type DashboardNoteModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string ` bson:"_id" , json:"_id" ` //mas Bud ini sampean isi UserID
	Comments      []struct {
		Text    string
		Checked bool
	}
}

func (m *DashboardNoteModel) TableName() string {
	return "DashboardNotes"
}

func (e *DashboardNoteModel) RecordID() interface{} {
	return e.Id
}
