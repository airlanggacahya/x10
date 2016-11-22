package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/orm"
	"github.com/eaciit/toolkit"
)

const (
	NormMasterOperatorMin     = "min"
	NormMasterOperatorMax     = "max"
	NormMasterOperatorGTE     = "greater than or equal"
	NormMasterOperatorLTE     = "lower than or equal"
	NormMasterOperatorEqual   = "equal"
	NormMasterOperatorBetween = "between"

	NormMasterTimePeriodEstimatedPreferred   = "estimated preferred"
	NormMasterTimePeriodProvisionalPreferred = "provisional preferred"
	NormMasterTimePeriodLastAudited          = "last audited"
	NormMasterTimePeriodNotApplicable        = "not applicable"
)

type NormMaster struct {
	orm.ModelBase            `bson:"-",json:"-"`
	Id                       string `bson:"_id",json:"_id"`
	From                     string
	Criteria                 string
	FieldId                  string
	InternalRating           string
	TimePeriod               string
	ValueType                string
	Product                  string
	Order                    int
	ShowInLoanApprovalReport bool
	ShowInLoanApprovalScreen bool
	Operator                 string
	Value1                   float64
	Value2                   float64
	NormLabel                string
	IsFreeze                 bool `bson:"IsFreeze,omitempty"`
}

func (n *NormMaster) RecordID() interface{} {
	return n.Id
}

func (n *NormMaster) TableName() string {
	return "NormMaster"
}

func (n *NormMaster) CalculateKeyPolicyNorms(valueTarget float64) bool {
	// switch m.KeyPolicyNormsType {
	// case NormTypeGreaterThan:
	// 	return (m.KeyPolicyNormsValue1 > valueTarget)
	// case NormTypeLowerThan:
	// 	return (m.KeyPolicyNormsValue1 < valueTarget)
	// case NormTypeEqual:
	// 	return (m.KeyPolicyNormsValue1 == valueTarget)
	// case NormTypeBetween:
	// 	return (m.KeyPolicyNormsValue1 <= valueTarget) && (valueTarget >= m.KeyPolicyNormsValue2)
	// }

	return false
}

func (n *NormMaster) GetData() ([]NormMaster, error) {
	result := []NormMaster{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return result, err
	}

	csr, err := conn.NewQuery().
		From(new(NormMaster).TableName()).
		Order("order").
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return result, err
	}

	err = csr.Fetch(&result, 0, false)
	if err != nil {
		return result, err
	}

	return result, err
}

func (n *NormMaster) SetFreeze(data []NormMaster, IsFreeze bool) interface{} {
	res := new(toolkit.Result)

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		res.SetError(err)
		return res
	}

	if len(data) > 0 {
		data[0].IsFreeze = IsFreeze

		qinsert := conn.NewQuery().
			From(new(NormMaster).TableName()).
			SetConfig("multiexec", true).
			Save()

		for _, val := range data {
			val.IsFreeze = IsFreeze

			ba := map[string]interface{}{"data": val}

			err := qinsert.Exec(ba)

			if err != nil {
				res.SetError(err)
				return res
			}
		}

		res.SetData(IsFreeze)
		return res
	}

	return res
}
