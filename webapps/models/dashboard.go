package models

import (
	"time"

	"encoding/json"

	"github.com/eaciit/orm"
)

type StrArray []string

func (list *StrArray) UnmarshalJSON(data []byte) error {
	var s string
	err := json.Unmarshal(data, &s)
	if err == nil {
		*list = []string{s}
		return nil
	}

	var ar []string
	err = json.Unmarshal(data, &ar)
	if err == nil {
		*list = ar
		return nil
	}

	return err
}

func (list *StrArray) MarshalJSON() ([]byte, error) {
	return json.Marshal(*list)
}

type DashboardFilterModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string ` bson:"_id" , json:"_id" `
	Filters       []struct {
		FilterName string
		ShowMe     bool
		Value      StrArray
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
	Id            string ` bson:"_id" , json:"_id" `
	Comments      []struct {
		Text        string
		Checked     bool
		CreatedDate time.Time
	}
}

func (m *DashboardNoteModel) TableName() string {
	return "DashboardNotes"
}

func (e *DashboardNoteModel) RecordID() interface{} {
	return e.Id
}
