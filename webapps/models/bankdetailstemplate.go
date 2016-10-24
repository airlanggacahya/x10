package models

import "gopkg.in/mgo.v2/bson"

type BankDetailsTemplate struct {
	Id          bson.ObjectId `bson:"_id" , json:"_id" `
	CustomerId  string        `bson:"CustomerId"`
	BankDetails []BankDetails `bson:"BankDetails"`
}
