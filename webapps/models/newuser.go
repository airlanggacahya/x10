package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

func NewUserModel() *NewUser {
	m := new(NewUser)
	m.ID = bson.NewObjectId().Hex()
	return m
}

func (e *NewUser) RecordID() interface{} {
	return e.ID
}

func (m *NewUser) TableName() string {
	return "MasterUser"
}

type NewUser struct {
	orm.ModelBase     `bson:"-", json:"-"`
	Id                string `bson:"_id", json:"_id"`
	ID                string `bson:"id", json:"id"`
	Userid            string
	Userempid         string
	Username          string
	Useremail         string
	Userphone1        string
	Userphone2        string
	Userdepartment    int
	Userpassword      string
	Accountstatus     string
	Branchaccess      string
	Makerid           string
	Makerdate         string
	Autherid          string
	Authordate        string
	Validitydate      string
	Operationtype     string
	Recstatus         string
	Securityquestion1 string
	Securityanswer1   string
	Securityquestion2 string
	Securityanswer2   string
	Userdefbranch     int
	Branchaccesslist  []Branchaccesslist
	Role              []string `bson:"role,omitempty"`
	Catrole           []string `bson:"catrole,omitempty"`
	// Status            string   `bson:"status,omitempty"`
	Catstatus   string `bson:"catstatus,omitempty"`
	Catpassword string `bson:"catpassword,omitempty"`
	Autherdate  string
}

type Branchaccesslist struct {
	Id         int
	Branchid   string
	Makerid    string
	Makerdate  string
	Autherid   string
	Recstatus  string
	Autherdate string
}
