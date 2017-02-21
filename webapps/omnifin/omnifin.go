package omnifin

import (
	"bytes"
	"eaciit/x10/webapps/controllers"
	"encoding/json"
	"errors"
	"github.com/eaciit/cast"
	tk "github.com/eaciit/toolkit"
	"io"
	"net/http"

	"eaciit/x10/consoleapps/OmnifinMaster/core"
	"eaciit/x10/consoleapps/OmnifinMaster/helpers"
)

var ErrorRemoteServer = errors.New("Remote Server Error")

type CredentialRequest struct {
	Id       string `json:"userId"`
	Password string `json:"userPassword"`
}

type SyncParameter struct {
	LastUpdate     string `json:"lastUpdate"`
	FetchFull      int    `json:"fetchFull"`
	LastAcceptedId string `json:"lastAcceptedId"`
}

type DataRequest struct {
	UserCredentials CredentialRequest `json:"userCredentials"`
	SyncParameter   SyncParameter     `json:"syncParameter"`
}

func DoRequest(address string) (io.ReadCloser, error) {
	buf := new(bytes.Buffer)
	req := DataRequest{
		CredentialRequest{
			Id:       "CAT",
			Password: "44382d31c7fc609d8ff46ad3add2e4a5",
		},
		SyncParameter{
			LastUpdate:     "",
			FetchFull:      1,
			LastAcceptedId: "",
		},
	}

	json.NewEncoder(buf).Encode(req)
	resp, err := http.Post(address, "application/json", buf)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, ErrorRemoteServer
	}

	return resp.Body, nil
}

type EmptyString string

func (s *EmptyString) UnmarshalJSON(b []byte) (err error) {
	if string(b) == "null" {
		return nil
	}

	return json.Unmarshal(b, (*string)(s))
}

type BranchAccess struct {
	Id         int         `json:"id"`
	BranchId   string      `json:"branchId"`
	MakerId    string      `json:"makerId"`
	MakerDate  string      `json:"makerDate"`
	AutherId   EmptyString `json:"autherId"`
	RecStatus  string      `json:"recStatus"`
	AutherDate EmptyString `json:"autherDate"`
}

type UserMaster struct {
	ID                string         `json:"_id,omitempty"`
	UserId            string         `json:"userId"`
	UserEmpId         string         `json:"userEmpId"`
	UserName          string         `json:"userName"`
	UserEmail         string         `json:"userEmail"`
	UserPhone1        string         `json:"userPhone1"`
	UserPhone2        EmptyString    `json:"userPhone2"`
	UserDepartment    int            `json:"userDepartment"`
	UserPassword      string         `json:"userPassword"`
	AccountStatus     string         `json:"accountStatus"`
	BranchAccess      string         `json:"branchAccess"`
	MakerId           string         `json:"makerId"`
	MakerDate         string         `json:"makerDate"`
	AutherId          string         `json:"autherId"`
	AuthorDate        string         `json:"authorDate"`
	ValidityDate      string         `json:"validityDate"`
	OperationType     EmptyString    `json:"operationType"`
	RecStatus         string         `json:"recStatus"`
	SecurityQuestion1 string         `json:"securityQuestion1"`
	SecurityAnswer1   string         `json:"securityAnswer1"`
	SecurityQuestion2 string         `json:"securityQuestion2"`
	SecurityAnswer2   string         `json:"securityAnswer2"`
	UserDefBranch     int            `json:"userDefBranch"`
	BranchAccessList  []BranchAccess `json:"branchAccessList"`
	AutherDate        string         `json:"autherDate"`
}

type MasterUserResponse struct {
	RecordCount      int          `json:"recordCount"`
	OperationStatus  string       `json:"operationStatus"`
	OperationMsg     string       `json:"operationMsg"`
	ResponseDateTime string       `json:"responseDateTime"`
	UserMasterList   []UserMaster `json:"userMasterList"`
}

func PushMasterUser(list []UserMaster) error {
	con, err := helpers.GetConnection()
	if err != nil {
		panic(err.Error())
	}
	defer con.Close()

	err = con.NewQuery().
		Delete().
		From("MasterUser").
		SetConfig("multiexec", true).
		Exec(nil)
	if err != nil {
		return err
	}

	qinsert := con.NewQuery().
		From("MasterUser").
		SetConfig("multiexec", true).
		Save()

	// Convert userid to _id
	for _, i := range list {
		i.ID = i.UserId
		// fmt.Printf("%s\n", i.UserId)
		csc := map[string]interface{}{"data": i}
		err = qinsert.Exec(csc)
		if err != nil {
			return err
		}
	}

	return nil
}

func PullMasterUser() (*MasterUserResponse, error) {
	fp, err := DoRequest("http://103.251.60.132:8085/OmniFinServices/restServices/userMasterService/userMaster")
	if err != nil {
		return nil, err
	}
	defer fp.Close()

	payload := MasterUserResponse{}
	err = json.NewDecoder(fp).Decode(&payload)

	if err != nil {
		return nil, err
	}

	return &payload, nil
}

func PullDepartment() (*core.DataResponse, error) {
	fp, err := DoRequest("http://103.251.60.132:8085/OmniFinServices/restServices/deparmentMasterService/deparmentMaster")
	if err != nil {
		return nil, err
	}
	defer fp.Close()

	payload := core.DataResponse{}
	err = json.NewDecoder(fp).Decode(&payload)

	if err != nil {
		return nil, err
	}

	return &payload, nil
}

func SaveDepartment(data *core.DataResponse) error {
	newData := []tk.M{}
	for _, val := range data.DepartmentMasterList {
		p := tk.M{}
		p.Set("name", val.DepartmentDescription)
		p.Set("departmentId", cast.ToString(val.DepartmentId))
		p.Set("recStatus", val.RecStatus)
		// tk.Printfn("%v", p)
		newData = append(newData, p)
	}

	err := core.SaveMasterAccountDetail("Departments", newData)

	return err
}

func ProcessDepartment() error {
	list, err := PullDepartment()
	if err != nil {
		return err
	}

	err = SaveDepartment(list)
	if err != nil {
		return err
	}

	return nil
}

func ProcessMasterUser() error {
	list, err := PullMasterUser()
	if err != nil {
		return err
	}

	err = checkMasterDepartment(list)
	if err != nil {
		return err
	}

	err = PushMasterUser(list.UserMasterList)
	if err != nil {
		return err
	}

	return nil
}

func checkMasterDepartment(data *MasterUserResponse) error {
	// list all check
	for _, valx := range data.UserMasterList {
		ad := valx
		checklist := map[string]string{
			"Departments": cast.ToString(ad.UserDepartment),
		}
		found := true
		for key, val := range checklist {
			if len(val) == 0 {
				continue
			}

			exists, err := controllers.CheckMaster(key, "departmentId", val)
			if err != nil {
				return err
			}
			if exists {
				// tk.Printf("CHECK %s - %s...FOUND", key, val)
				continue
			}
			// tk.Printf("CHECK %s - %s...NOT FOUND", key, val)
			found = found && exists
		}

		if found {
			continue
		}

		err := ProcessDepartment()
		tk.Println("========= Pull Department Data =========")
		if err != nil {
			return err
		}
		for key, val := range checklist {
			found, err := controllers.CheckMaster(key, "departmentId", val)
			if err != nil {
				return err
			}
			if found {
				continue
			}
			tk.Printf("======== Departement Not Found (%v) ========", cast.ToString(ad.UserDepartment))
			return errors.New("Departements Master Not Found")
		}
	}
	return nil
}
