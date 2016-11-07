package models

import (
	"github.com/eaciit/orm"
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
