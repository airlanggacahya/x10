package models

type Country struct {
	CountryCode       int    `xml:"countryCode"`
	CountryDecription string `xml:"countryDecription"`
	LastUpdate        string `xml:"lastUpdate"`
	Status            string `xml:"status"`
}

type MasterData struct {
	CountryMasterList Country `xml:"countryMasterList"`
	OperationMsg      string  `xml:"operationMsg"`
	OperationStatus   int     `xml:"operationStatus"`
	RecordCount       int     `xml:"recordCount"`
	ResponseDateTime  string  `xml:"responseDateTime"`
}
