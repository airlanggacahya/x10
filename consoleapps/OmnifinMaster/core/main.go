package core

import (
	"bytes"
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	"encoding/json"
	"errors"
	"time"

	"net/http"

	"io"

	"io/ioutil"

	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type Url struct {
	Name        string
	Address     string
	SaveHandler func(DataResponse) error
}

//-------------------------

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

//-------------------------

type EmptyString string

func (s *EmptyString) UnmarshalJSON(b []byte) (err error) {
	if string(b) == "null" {
		return nil
	}

	return json.Unmarshal(b, (*string)(s))
}

type DataResponse struct {
	RecordCount                    int                `json:"recordCount"`
	OperationStatus                string             `json:"operationStatus"`
	OperationMsg                   string             `json:"operationMsg"`
	ResponseDateTime               string             `json:"responseDateTime"`
	ProductMasterList              []ProductMaster    `json:"productMasterList,omitempty"`
	SchemeMasterList               []SchemeMaster     `json:"schemeMasterList,omitempty"`
	SupplierMasterList             []SupplierMaster   `json:"manufactureSupplier,omitempty"`
	BranchMasterList               []BranchMaster     `json:"branchMasterList,omitempty"`
	DistrictMasterList             []DistrictMaster   `json:"districtMasterList,omitempty"`
	GenericMasterList              []GenericMaster    `json:"genericMasterList",omitempty`
	GenericStakeholderPositionList []GenericMaster    `json:"genericStackHolderManagementTypeList",omitempty`
	DepartmentMasterList           []DepartmentMaster `json:"comDepartmentMList",omitempty`
}

//-------------------------

func createLog(portName string) (tk.M, error) {
	log := tk.M{}
	log.Set("_id", bson.NewObjectId())
	log.Set("name", portName)
	log.Set("createddate", time.Now().UTC())
	log.Set("error", nil)
	log.Set("xmlstring", nil)
	log.Set("iscomplete", false)
	err := saveLog(log)
	return log, err
}

func saveLog(log tk.M) (err error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		panic(err.Error())
	}

	qinsert := conn.NewQuery().From("OmnifinMasterLog").SetConfig("multiexec", true).Save()
	defer qinsert.Close()

	csc := map[string]interface{}{"data": log}
	err = qinsert.Exec(csc)
	if err != nil {
		updateLog(log, err, "")
	}

	return

	// if log.Get("error") != nil {
	// 	res := []tk.M{}
	// 	query, err := conn.NewQuery().Select().From("OmnifinMail").Cursor(nil)
	// 	defer query.Close()

	// 	if err != nil {
	// 		panic(err.Error())
	// 	}
	// 	err = query.Fetch(&res, 0, false)

	// 	for _, mail := range res {
	// 		addr := mail.GetString("address")
	// 		if err := SendMail(
	// 			tk.Sprintf("%v", "[noreply] CAT XML Error Reminder"),
	// 			tk.Sprintf("%v", "XML receiver has some error.</br>Error Message : "+
	// 				log.GetString("error")+".</br> Log ID : "+
	// 				log.GetString("_id")),
	// 			addr); err != nil {
	// 			panic(err.Error())
	// 		} else {
	// 			tk.Println("Email sent to", addr)
	// 			tk.Println("------- Error:", log.GetString("error"))
	// 		}
	// 	}
	// }
}

func updateLog(log tk.M, err error, xmlString interface{}) {
	if err != nil {
		log.Set("error", err.Error())
	}
	log.Set("json", xmlString)
	log.Set("iscomplete", err == nil)
	saveLog(log)
}

func resetData() (err error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		panic(err.Error())
	}

	err = conn.NewQuery().
		Delete().
		From("OmnifinMasterData").
		SetConfig("multiexec", true).
		Exec(nil)
	if err != nil {
		return
	}

	return nil
}

func saveData(masterData interface{}) (err error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		panic(err.Error())
	}

	qinsert := conn.NewQuery().From("OmnifinMasterData").SetConfig("multiexec", true).Save()

	data := map[string]interface{}{"data": masterData}
	err = qinsert.Exec(data)
	if err != nil {
		return
	}

	return nil
}

var ErrorRemoteServer = errors.New("Response is not HTTP 200 OK")

func doRequest(url Url) (io.ReadCloser, error) {
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
	resp, err := http.Post(url.Address, "application/json", buf)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, ErrorRemoteServer
	}

	return resp.Body, nil
}

func DoMain() {
	urls := []Url{
		{
			"ProductMaster",
			"http://103.251.60.132:8085/OmniFinServices/restServices/productMasterService/productMaster",
			SaveProduct,
		},
		{
			"SchemeMaster",
			"http://103.251.60.132:8085/OmniFinServices/restServices/schemeMasterService/schemeMaster",
			SaveScheme,
		},
		{
			"SupplierMaster",
			"http://103.251.60.132:8085/OmniFinServices/restServices/manufacturerSupplierMaster/manufacturerSupplier",
			SaveSupplier,
		},
		{
			"BranchMaster",
			"http://103.251.60.132:8085/OmniFinServices/restServices/branchMasterService/branchMaster",
			SaveBranch,
		},
		{
			"DistrictMaster",
			"http://103.251.60.132:8085/OmniFinServices/restServices/districtMasterServices/districtMaster",
			SaveDistrict,
		},
		{
			"GenericMaster (Cust Constitution, Designation/Position)",
			"http://103.251.60.132:8085/OmniFinServices/restServices/genricServices/fetchCombinedGenericData",
			SaveGeneric,
		},
		{
			"GenericMaster (stakeHolderPosition)",
			"http://103.251.60.132:8085/OmniFinServices/restServices/combinedGenericService/combinegeneric",
			SaveGenericCombine,
		},
	}

	resetData()
	for _, u := range urls {
		tk.Printfn("Process %s", u.Name)

		log, err := createLog(u.Name)
		if err != nil {
			tk.Println("Error creating log:", err.Error())
		}

		fp, err := doRequest(u)
		if err != nil {
			updateLog(log, err, "")
			tk.Println(err.Error())
			continue
		}
		defer fp.Close()

		jsonResp, err := ioutil.ReadAll(fp)
		if err != nil {
			updateLog(log, err, "")
			tk.Println(err.Error())
			continue
		}

		// Increase to 8 megs, max MongoDB Doc Size is 16 megs
		if len(jsonResp) > 8388608 {
			updateLog(log, err, jsonResp[:8388608])
		} else {
			updateLog(log, err, jsonResp)
		}

		// tk.Printfn("%v", string(jsonResp))

		var data DataResponse
		err = json.Unmarshal(jsonResp, &data)
		if err != nil {
			updateLog(log, err, "")
			tk.Println(err.Error())
			continue
		}

		// operation success is either
		//  operationMsg = Operation Compleated Successfully (NOT TYPO)
		//  or
		//  operationStatus = 1
		if data.OperationMsg != "Operation Compleated Successfully" &&
			data.OperationStatus != "1" {
			err := errors.New("Operation status is not met")
			updateLog(log, err, jsonResp)
			tk.Println(err.Error())
			continue
		}

		// save to OmnifinMasterData
		err = saveData(data)
		if err != nil {
			updateLog(log, err, jsonResp)
			tk.Println(err.Error())
			continue
		}

		// run individual save code transformation
		// we do save to master collection here according to url.SaveHandler
		if u.SaveHandler != nil {
			err = u.SaveHandler(data)
		}

		if err != nil {
			updateLog(log, err, jsonResp)
			tk.Println(err.Error())
			continue
		}
	}
}
