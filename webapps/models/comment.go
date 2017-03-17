package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type CommentModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId ` bson:"_id" , json:"_id" `
	CustomerId    string
	DealNo        string
	CustomerName  string
	UserId        string
	UserName      string
	FullName      string
	Comment       string
	Active        int
	DateInput     time.Time
	LastEdit      time.Time
}

func NewCommentModel() *CommentModel {
	m := new(CommentModel)
	m.Id = bson.NewObjectId()
	return m
}

func (e *CommentModel) RecordID() interface{} {
	return e.Id
}

func (m *CommentModel) TableName() string {
	return "Comment"
}
