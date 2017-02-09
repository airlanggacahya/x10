package core

import tk "github.com/eaciit/toolkit"

type BranchMaster struct {
	BranchId   int         `json:"branchId"`
	BranchName string      `json:"branchName"`
	Status     string      `json:"status"`
	LastUpdate string      `json:"lastUpdate"`
	CountryId  int         `json:"countryId"`
	StateId    int         `json:"stateId"`
	DistrictId int         `json:"districtId"`
	ZoneId     EmptyString `json:"zoneId"`
}

func SaveBranch(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.BranchMasterList {
		p := tk.M{}
		p.Set("name", val.BranchName)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := SaveMasterAccountDetail("Branch", newData)

	return err
}
