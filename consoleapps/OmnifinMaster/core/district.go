package core

import tk "github.com/eaciit/toolkit"

type DistrictMaster struct {
	DistrictCode        int    `json:"districtCode"`
	DistrictDescription string `json:"districtDescription"`
	StateCode           int    `json:"stateCode"`
	Status              string `json:"status"`
	LastUpdate          string `json:"lastUpdate"`
}

func SaveDistrict(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.DistrictMasterList {
		p := tk.M{}
		p.Set("name", val.DistrictDescription)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := SaveMasterAccountDetail("District", newData)

	return err
}
