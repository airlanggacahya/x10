package models

import (
	"github.com/eaciit/orm"
)

type InternalRatingCategory struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string `bson:"_id",json:"_id"`
	Name          string
}

func (n *InternalRatingCategory) RecordID() interface{} {
	return n.Id
}

func (n *InternalRatingCategory) TableName() string {
	return "InternalRatingCategory"
}
