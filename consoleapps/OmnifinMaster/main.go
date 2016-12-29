package main

import (
	"bytes"
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	. "eaciit/x10/consoleapps/OmnifinMaster/models"
	"encoding/json"
	"encoding/xml"
	"errors"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"io"
	"strings"
	"time"
)

type Url struct {
	PortName    string
	WSDLAddress string
}

//-------------------------

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
	log.Set("xmlstring", xmlString)
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

func xmlToJson(r io.Reader) (*bytes.Buffer, error) {
	root := &Node{}
	err := NewDecoder(r).Decode(root)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	err = NewEncoder(buf).Encode(root)
	if err != nil {
		return nil, err
	}

	return buf, nil
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

	resetData()
	for _, u := range urls {
		tk.Println("")
		tk.Println("Getting", u.PortName, "content from", u.WSDLAddress)

		log, err := createLog(u.PortName)
		if err != nil {
			tk.Println("Error creating log:", err.Error())
		}

		operationName, err := getOperationName(u.WSDLAddress)
		if err != nil {
			updateLog(log, err, "")
			continue
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
			      	</web:%s>
			   	</soapenv:Body>
			</soapenv:Envelope>`, operationName, operationName)

		xmlString, err := GetHttpPOSTContentString(u.WSDLAddress, body)
		updateLog(log, err, xmlString)
		if err != nil {
			continue
		}

		xml := strings.NewReader(xmlString)
		resultah, err := xmlToJson(xml)
		if err != nil {
			panic(err)
		}

		var msg interface{}
		err = json.Unmarshal([]byte(resultah.String()), &msg)

		msgMap, ok := msg.(map[string]interface{})
		if ok {
			envelope := msgMap["Envelope"]
			if envelopeMap := envelope.(map[string]interface{}); envelopeMap != nil {

				bodi := envelopeMap["Body"]
				if bodiMap := bodi.(map[string]interface{}); bodiMap != nil {

					var beforeReturn interface{}
					beforeReturn = bodiMap[operationName]
					if beforeReturn == nil {
						operationName = operationName + "Response"
						beforeReturn = bodiMap[operationName]
						if beforeReturn == nil {
							err = errors.New("WS Error.")
							tk.Println(err.Error())
							updateLog(log, err, xmlString)
							continue
						}
					}

					if beforeReturnMap := beforeReturn.(map[string]interface{}); beforeReturnMap != nil {

						riturn := beforeReturnMap["return"]
						if riturnMap := riturn.(map[string]interface{}); riturnMap != nil {
							tk.Printf("Operation Status: %+v\n", riturnMap["operationStatus"])

							if tk.ToInt(riturnMap["operationStatus"], "Int64") == 1 {
								riturnMap["_id"] = bson.NewObjectId()
								err = saveData(riturn)
							} else {
								err = errors.New("Operation status is not met.")
							}
							if err != nil {
								updateLog(log, err, xmlString)
								tk.Println(err.Error())
								continue
							} else {
								tk.Println("Saved.")
							}

						}
					}
				}
			}
		} else {
			tk.Println("Unknown Error.")
			continue
		}
	}
}
