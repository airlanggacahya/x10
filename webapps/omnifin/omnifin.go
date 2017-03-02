package omnifin

import (
	"bytes"
	"eaciit/x10/consoleapps/OmnifinMaster/core"
	"eaciit/x10/consoleapps/OmnifinMaster/helpers"
	"eaciit/x10/webapps/controllers"
	hp "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"encoding/json"
	"errors"

	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	// "github.com/eaciit/orm"
	"io"
	"net/http"

	tk "github.com/eaciit/toolkit"
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

func PushMasterUser(list []UserMaster) error {
	con, err := helpers.GetConnection()
	if err != nil {
		panic(err.Error())
	}
	defer con.Close()

	// err = con.NewQuery().
	// 	Delete().
	// 	From("MasterUser").
	// 	SetConfig("multiexec", true).
	// 	Exec(nil)
	// if err != nil {
	// 	return err
	// }

	qinsert := con.NewQuery().
		From("MasterUser").
		SetConfig("multiexec", true).
		Save()

	// Convert userid to _id
	for _, i := range list {
		filter := []*dbox.Filter{}
		filter = append(filter, dbox.Eq("_id", i.UserId))

		userfix := NewUser{}

		user := []NewUser{}

		user, err = new(NewUser).Where(filter)
		if err != nil {
			panic(err)
		}

		if len(user) > 0 {
			userfix = user[0]
		}
		userfix.Id = i.UserId
		userfix.ID = i.UserId
		userfix.Userid = i.UserId
		userfix.Userempid = i.UserEmpId
		userfix.Username = hp.ToWordCase(i.UserName)
		userfix.Useremail = i.UserEmail
		userfix.Userphone1 = i.UserPhone1
		userfix.Userphone2 = string(i.UserPhone2)
		userfix.Userdepartment = i.UserDepartment
		userfix.Userpassword = i.UserPassword
		userfix.Accountstatus = i.AccountStatus
		userfix.Branchaccess = i.BranchAccess
		userfix.Makerid = i.MakerId
		userfix.Makerdate = i.MakerDate
		userfix.Autherid = i.AutherId
		userfix.Authordate = i.AuthorDate
		userfix.Validitydate = i.ValidityDate
		userfix.Operationtype = string(i.OperationType)
		userfix.Recstatus = i.RecStatus
		userfix.Securityquestion1 = i.SecurityQuestion1
		userfix.Securityanswer1 = i.SecurityAnswer1
		userfix.Securityquestion2 = i.SecurityQuestion2
		userfix.Securityanswer2 = i.SecurityAnswer2
		userfix.Userdefbranch = i.UserDefBranch
		userfix.Autherdate = i.AutherDate

		brancescur := []Branchaccesslist{}
		for _, v := range i.BranchAccessList {
			brancestembe := Branchaccesslist{}
			brancestembe.Id = v.Id
			brancestembe.Branchid = v.BranchId
			brancestembe.Makerid = v.MakerId
			brancestembe.Makerdate = v.MakerDate
			brancestembe.Autherid = string(v.AutherId)
			brancestembe.Recstatus = v.RecStatus
			brancestembe.Autherdate = string(v.AutherDate)

			brancescur = append(brancescur, brancestembe)
		}

		userfix.Branchaccesslist = brancescur

		csc := map[string]interface{}{"data": userfix}
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
