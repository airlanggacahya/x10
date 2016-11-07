package models

type CreditScoreCardItem struct {
	Id          string
	IsHeader    bool
	Name        string
	Category    string
	Score       interface{}
	Weight      interface{}
	WeightScore interface{}
	Order       int
	Value       float64
	DataType    string

	from       string
	fieldId    string
	period     string
	categories []RatingMaster
}

type CreditScoreCardResult struct {
	Items            []*CreditScoreCardItem
	TotalWeightScore float64
	Rating           string
}
