package models

import (
	"time"
)

type Credit struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type Debit struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type NoOfDebit struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type NoOfCredit struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type TotalOw struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type TotalIw struct {
	TotalMonth1 float64
	TotalMonth2 float64
	TotalMonth3 float64
	TotalMonth4 float64
	TotalMonth5 float64
	TotalMonth6 float64
}

type Month struct {
	Month1 time.Time
	Month2 time.Time
	Month3 time.Time
	Month4 time.Time
	Month5 time.Time
	Month6 time.Time
}

type Summary struct {
	Month                time.Time
	TotalCredit          float64
	TotalDebit           float64
	NoOfCredit           float64
	NoOfDebit            float64
	OwCheque             float64
	IwCheque             float64
	Utilization          float64
	ImpMargin            float64
	OwReturnPercentage   float64
	LwReturnPercentage   float64
	DrCrReturnPercentage float64
}
