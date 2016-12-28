package main

import (
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	. "eaciit/x10/consoleapps/OmnifinMaster/models"
	"encoding/xml"
	"errors"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Url struct {
	PortName    string
	WSDLAddress string
}

type Fetch struct {
	MasterData MasterData `xml:"return"`
}

type Body struct {
	Fetch Fetch `xml:"fetchcountryMasterResponse"`
}

type RespEnvelope struct {
	XMLName xml.Name `xml:"Envelope"`
	Body    Body     `xml:"Body"`
}

type RespWSDL struct {
	XMLName xml.Name `xml:"definitions"`
	Binding Binding  `xml:"binding"`
}

type Binding struct {
	Operation Operation `xml:"operation"`
}

type Operation struct {
	Name string `xml:"name,attr"`
}

func createLog(log tk.M) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		panic(err.Error())
	}

	qinsert := conn.NewQuery().From("OmnifinMasterLog").SetConfig("multiexec", true).Save()

	csc := map[string]interface{}{"data": log}
	if err := qinsert.Exec(csc); err != nil {
		panic(err.Error())
	}

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

func updateLog(log tk.M, err error, xmlString string) {
	log.Set("error", err)
	log.Set("xmlstring", xmlString)
	log.Set("iscomplete", err == nil)
	createLog(log)
}

func saveData(masterData MasterData) (err error) {
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

	qinsert := conn.NewQuery().From("OmnifinMasterData").SetConfig("multiexec", true).Save()

	data := map[string]interface{}{"data": masterData}
	err = qinsert.Exec(data)
	if err != nil {
		return
	}

	return nil
}

func getOperationName(url string) (string, error) {
	xmlString := GetHttpGETContentString(url)

	resp := RespWSDL{}
	err := xml.Unmarshal([]byte(xmlString), &resp)
	if err != nil {
		tk.Printf("error: %v", err)
		return "", err
	}
	return resp.Binding.Operation.Name, nil
}

func main() {
	urls := []Url{
		Url{"MasterCountry", "http://103.251.60.132:8085/OmniFinServices/countryMasterWS?wsdl"},
		Url{"MasterState", "http://103.251.60.132:8085/OmniFinServices/stateMasterWS?wsdl"},
		Url{"MasterDistrict", "http://103.251.60.132:8085/OmniFinServices/districtMasterWS?wsdl"},
		Url{"MasterTehsil", "http://103.251.60.132:8085/OmniFinServices/tehsilMasterWS?wsdl"},
		Url{"MasterPincode", "http://103.251.60.132:8085/OmniFinServices/pincodeMasterWS?wsdl"},
		Url{"MasterBank", "http://103.251.60.132:8085/OmniFinServices/bankMasterWS?wsdl"},
		Url{"MasterBankBranch", "http://103.251.60.132:8085/OmniFinServices/bankBranchMasterWS?wsdl"},
		Url{"MasterProduct", "http://103.251.60.132:8085/OmniFinServices/productMasterWS?wsdl"},
		Url{"MasterScheme", "http://103.251.60.132:8085/OmniFinServices/schemeMasterWS?wsdl"},
		Url{"MasterDocumentChecklist", "http://103.251.60.132:8085/OmniFinServices/documentChecklistMasterWS?wsdl"},
		Url{"MasterDocument", "http://103.251.60.132:8085/OmniFinServices/documentMasterWS?wsdl"},
		Url{"MasterChildDocument", "http://103.251.60.132:8085/OmniFinServices/childDocumentMasterWS?wsdl"},
		Url{"MasterCharges", "http://103.251.60.132:8085/OmniFinServices/chargesMasterWS?wsdl"},
		Url{"MasterBranch", "http://103.251.60.132:8085/OmniFinServices/branchMasterWS?wsdl"},
	}

	for _, u := range urls {
		tk.Println("Getting", u.PortName, "content from", u.WSDLAddress)

		log := tk.M{}
		log.Set("_id", bson.NewObjectId())
		log.Set("name", u.PortName)
		log.Set("createddate", time.Now().UTC())
		log.Set("error", nil)
		log.Set("xmlstring", nil)
		log.Set("iscomplete", false)
		createLog(log)

		operationName, err := getOperationName(u.WSDLAddress)
		if err != nil {
			updateLog(log, err, "")
			break
		}

		body := tk.Sprintf(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.omnifin.a3spl.com/">
			<soapenv:Header/>
			   	<soapenv:Body>
			      	<web:%s>
			        	<!--Optional:-->
			         	<inputParameterWrapper>
			            	<!--Optional:-->
			            	<syncParameter>
				               	<!--Optional:-->
				               	<fetchFull>1</fetchFull>
				               	<!--Optional:-->
				               	<lastUpdate>?</lastUpdate>
			            	</syncParameter>
				            <!--Optional:-->
				            <userCredentials>
				               	<!--Optional:-->
				               	<userId>CAT</userId>
				               	<!--Optional:-->
				               	<userPassword>0775f757de88e601a24c197d68cfb2b7</userPassword>
				            </userCredentials>
			         	</inputParameterWrapper>
			      	</web:fetchcountryMaster>
			   	</soapenv:Body>
			</soapenv:Envelope>`, operationName)

		xmlString, err := GetHttpPOSTContentString(u.WSDLAddress, body)
		if err != nil {
			updateLog(log, err, "")
			break
		}
		updateLog(log, err, xmlString)

		resp := RespEnvelope{}
		err = xml.Unmarshal([]byte(xmlString), &resp)
		if err != nil {
			updateLog(log, err, "")
			break
		}

		masterData := resp.Body.Fetch.MasterData

		if masterData.OperationStatus == 1 {
			err = saveData(masterData)
		} else {
			err = errors.New("Operation status is not met")
		}
		if err != nil {
			updateLog(log, err, "")
			break
		}
	}
}
