package models

import (
	"time"

	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

type ActivityLogModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id"  json:"_id" `
	Username      string
	IpAddress     string
	Activity      string
	PageUrl       string
	PageName      string
	AccessTime    time.Time
	AccessDate    int
}

func NewActivityLogModel() *ActivityLogModel {
	m := new(ActivityLogModel)
	m.Id = bson.NewObjectId()
	return m
}

func (e *ActivityLogModel) RecordID() interface{} {
	return e.Id
}

func (m *ActivityLogModel) TableName() string {
	return "ActivityLogs"
}
