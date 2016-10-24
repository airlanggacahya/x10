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

	from       string
	fieldId    string
	categories []RatingMaster
}

type CreditScoreCardResult struct {
	Items            []*CreditScoreCardItem
	TotalWeightScore float64
	Rating           string
}
