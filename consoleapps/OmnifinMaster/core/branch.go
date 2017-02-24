package core

import tk "github.com/eaciit/toolkit"

type BranchRegionData struct {
	RegionId        int    `json:"regionId"`
	RegionDesc      string `json:"regionDesc"`
	RegionDescLarge string `json:"regionDescLarge"`
	RecStatus       string `json:"recStatus"`
	MakerId         string `json:"makerId"`
}

type BranchMaster struct {
	BranchId   int              `json:"branchId"`
	BranchName string           `json:"branchName"`
	Status     string           `json:"status"`
	LastUpdate string           `json:"lastUpdate"`
	CountryId  int              `json:"countryId"`
	StateId    int              `json:"stateId"`
	DistrictId int              `json:"districtId"`
	ZoneId     EmptyString      `json:"zoneId"`
	Region     BranchRegionData `json:"comResonMData"`
}

func SaveBranch(data DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.BranchMasterList {
		preg := tk.M{}
		preg["regionid"] = val.Region.RegionId
		preg["name"] = val.Region.RegionDesc
		preg["desclarge"] = val.Region.RegionDescLarge

		p := tk.M{}
		p.Set("name", val.BranchName)
		p.Set("branchid", val.BranchId)
		p.Set("region", preg)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := SaveMasterAccountDetail("Branch", newData)

	return err
}
