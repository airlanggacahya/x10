package core

type DepartmentMaster struct {
	DepartmentId          int    `json:"departmentId"`
	DepartmentDescription string `json:"departmentDescription"`
	// MakerId               string `json:"makerId"`
	// MakerDate             string `json:"makerDate"`
	// AuthorId              string `json:"authorId"`
	// AuthorDate            string `json:"authorDate"`
	RecStatus string `json:"recStatus"`
}
