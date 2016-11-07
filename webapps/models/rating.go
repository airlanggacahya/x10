package models

import (
	. "eaciit/x10/webapps/connection"
	"fmt"
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"strconv"
	"strings"
	"time"
)

type RatingMaster struct {
	orm.ModelBase   `bson:"-",json:"-"`
	Id              string `bson:"_id" , json:"_id"`
	ParametersGroup string
	Parameters      string
	Categories      string
	Order           int
	ValueType       string

	From       string
	FieldId    string
	TimePeriod string
	Operator   string

	Value1 interface{}
	Value2 interface{}
}

func NewRatingMaster() *RatingMaster {
	m := new(RatingMaster)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *RatingMaster) RecordID() interface{} {
	return e.Id
}

func (m *RatingMaster) TableName() string {
	return "RatingMaster"
}

func (m *RatingMaster) IsValue1String() bool {
	if m.ValueType == "percentage" {
		return true
	}
	_, err := strconv.ParseFloat(fmt.Sprintf("%v", m.Value1), 64)
	return err != nil
}

func (m *RatingMaster) IsValue1Percentage() float64 {
	if strings.Contains(fmt.Sprintf("%v", m.Value1), "%") || m.ValueType == "percentage" {
		vtmp := strings.Replace(fmt.Sprintf("%v", m.Value1), "%", "", 1)
		res, err := strconv.ParseFloat(strings.TrimSpace(fmt.Sprintf("%v", vtmp)), 64)
		if err == nil {
			return res / 100
		} else {
			return -99
		}
	} else {
		return -99
	}
}

func (m *RatingMaster) IsValue2Percentage() float64 {
	if strings.Contains(fmt.Sprintf("%v", m.Value2), "%") || m.ValueType == "percentage" {
		vtmp := strings.Replace(fmt.Sprintf("%v", m.Value2), "%", "", 1)
		res, err := strconv.ParseFloat(strings.TrimSpace(fmt.Sprintf("%v", vtmp)), 64)
		if err == nil {
			return res / 100
		} else {
			return -99
		}
	} else {
		return -99
	}
}

func (m *RatingMaster) GetValue1AsString() string {
	return fmt.Sprintf("%v", m.Value1)
}

func (m *RatingMaster) GetValue1AsFloat() float64 {
	res, _ := strconv.ParseFloat(fmt.Sprintf("%v", m.Value1), 64)
	return res
}

func (m *RatingMaster) GetValue2AsFloat() float64 {
	res, _ := strconv.ParseFloat(fmt.Sprintf("%v", m.Value2), 64)
	return res
}

type RatingData struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string `bson:"_id" , json:"_id"`
	Name          string
	CreatedAt     time.Time

	ParametersGroupData []*ParametersGroupData
	ParametersData      []*ParametersData
	CategoriesData      []*CategoriesData
}

type ParametersGroupData struct {
	ParametersGroup               string
	WeightageOfGroupInCreditScore float64
	Use                           bool `bson:"Use,omitempty"`
}

type ParametersData struct {
	ParametersGroup      string
	Parameters           string
	WeightageWithinGroup float64
	Use                  bool `bson:"Use,omitempty"`
}

type CategoriesData struct {
	Id         string
	Definition string
	Profile    string
	Score      float64
}

func NewRatingData() *RatingData {
	m := new(RatingData)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *RatingData) RecordID() interface{} {
	return e.Id
}

func (m *RatingData) TableName() string {
	return "RatingData"
}

func GetLatestRatingData() (*RatingData, int, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, 0, err
	}

	csr, err := conn.NewQuery().
		From(new(RatingData).TableName()).
		Order("createdat", "desc").
		Cursor(nil)
	if err != nil {
		return nil, 0, err
	}

	results := make([]*RatingData, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, 0, err
	}

	if len(results) == 0 {
		return nil, 0, err
	}

	res := results[0]

	for _, val := range results {
		if res.CreatedAt.Before(val.CreatedAt) {
			res = val
		}
	}

	return res, len(results), nil
}
