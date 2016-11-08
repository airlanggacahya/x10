package models

import (
	"gopkg.in/mgo.v2/bson"
)

type StandardMaster struct {
	Id                           bson.ObjectId `bson:"_id" , json:"_id" `
	Products                     string        `bson:"Products"`
	Scheme                       string        `bson:"Scheme"`
	RatingMastersCustomerSegment string        `bson:"RatingMastersCustomerSegment"`
	Value                        int           `bson:"Value"`
	Type                         string        `bson:"Type"`
}

type StandardMasterParam struct {
	StandardMasters []StandardMaster
}
