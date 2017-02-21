package models

import (
	"encoding/json"
	"github.com/eaciit/orm"
)

type UserMaster struct {
	orm.ModelBase     `bson:"-",json:"-"`
	ID                string         `json:"_id,omitempty"`
	UserId            string         `json:"userId"`
	UserEmpId         string         `json:"userEmpId"`
	UserName          string         `json:"userName"`
	UserEmail         string         `json:"userEmail"`
	UserPhone1        string         `json:"userPhone1"`
	UserPhone2        EmptyString    `json:"userPhone2"`
	UserDepartment    int            `json:"userDepartment"`
	UserPassword      string         `json:"userPassword"`
	AccountStatus     string         `json:"accountStatus"`
	BranchAccess      string         `json:"branchAccess"`
	MakerId           string         `json:"makerId"`
	MakerDate         string         `json:"makerDate"`
	AutherId          string         `json:"autherId"`
	AuthorDate        string         `json:"authorDate"`
	ValidityDate      string         `json:"validityDate"`
	OperationType     EmptyString    `json:"operationType"`
	RecStatus         string         `json:"recStatus"`
	SecurityQuestion1 string         `json:"securityQuestion1"`
	SecurityAnswer1   string         `json:"securityAnswer1"`
	SecurityQuestion2 string         `json:"securityQuestion2"`
	SecurityAnswer2   string         `json:"securityAnswer2"`
	UserDefBranch     int            `json:"userDefBranch"`
	BranchAccessList  []BranchAccess `json:"branchAccessList"`
	AutherDate        string         `json:"autherDate"`
}

func (e *UserMaster) RecordID() interface{} {
	return e.ID
}

func (m *UserMaster) TableName() string {
	return "MasterUser"
}

type EmptyString string

type BranchAccess struct {
	Id         int         `json:"id"`
	BranchId   string      `json:"branchId"`
	MakerId    string      `json:"makerId"`
	MakerDate  string      `json:"makerDate"`
	AutherId   EmptyString `json:"autherId"`
	RecStatus  string      `json:"recStatus"`
	AutherDate EmptyString `json:"autherDate"`
}

type MasterUserResponse struct {
	RecordCount      int          `json:"recordCount"`
	OperationStatus  string       `json:"operationStatus"`
	OperationMsg     string       `json:"operationMsg"`
	ResponseDateTime string       `json:"responseDateTime"`
	UserMasterList   []UserMaster `json:"userMasterList"`
}

func (s *EmptyString) UnmarshalJSON(b []byte) (err error) {
	if string(b) == "null" {
		return nil
	}

	return json.Unmarshal(b, (*string)(s))
}
