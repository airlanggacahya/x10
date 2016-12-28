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

func main() {
	urls := []Url{
		// Url{"MasterLeadOperations", "http://103.251.60.132:8085/OmniFinServices/leadOperationsWS?wsdl"},
		// Url{"MasterDealCAMDetail", "http://103.251.60.132:8085/OmniFinServices/dealCAMDetailWS?wsdl"},
		// Url{"MasterChargeCode", "http://103.251.60.132:8085/OmniFinServices/chargeCodeWS?wsdl"},
		// Url{"MasterGenericOperation", "http://103.251.60.132:8085/OmniFinServices/genericOperationWS?wsdl"},
		Url{"MasterCountry", "http://103.251.60.132:8085/OmniFinServices/countryMasterWS?wsdl"},
		// Url{"MasterState", "http://103.251.60.132:8085/OmniFinServices/stateMasterWS?wsdl"},
		// Url{"MasterDistrict", "http://103.251.60.132:8085/OmniFinServices/districtMasterWS?wsdl"},
		// Url{"MasterTehsil", "http://103.251.60.132:8085/OmniFinServices/tehsilMasterWS?wsdl"},
		// Url{"MasterPincode", "http://103.251.60.132:8085/OmniFinServices/pincodeMasterWS?wsdl"},
		// Url{"MasterBank", "http://103.251.60.132:8085/OmniFinServices/bankMasterWS?wsdl"},
		// Url{"MasterBankBranch", "http://103.251.60.132:8085/OmniFinServices/bankBranchMasterWS?wsdl"},
		// Url{"MasterProduct", "http://103.251.60.132:8085/OmniFinServices/productMasterWS?wsdl"},
		// Url{"MasterScheme", "http://103.251.60.132:8085/OmniFinServices/schemeMasterWS?wsdl"},
		// Url{"MasterDocumentChecklist", "http://103.251.60.132:8085/OmniFinServices/documentChecklistMasterWS?wsdl"},
		// Url{"MasterDocument", "http://103.251.60.132:8085/OmniFinServices/documentMasterWS?wsdl"},
		// Url{"MasterChildDocument", "http://103.251.60.132:8085/OmniFinServices/childDocumentMasterWS?wsdl"},
		// Url{"MasterCharges", "http://103.251.60.132:8085/OmniFinServices/chargesMasterWS?wsdl"},
		// Url{"MasterBranch", "http://103.251.60.132:8085/OmniFinServices/branchMasterWS?wsdl"},
		// Url{"MasterDealDocumentOperation", "http://103.251.60.132:8085/OmniFinServices/dealDocumentOperationWS?wsdl"},
		// Url{"MasterApplicationProcessing", "http://103.251.60.132:8085/OmniFinServices/applicationProcessingWS?wsdl"},
		// Url{"MasterAdditionalDisbursement", "http://103.251.60.132:8085/OmniFinServices/additionalDisbursementWS?wsdl"},
		// Url{"MasterReportDownload", "http://103.251.60.132:8085/OmniFinServices/reportDownloadWS?wsdl"},
		// Url{"MasterDMSServiceHandlerImpl", "http://103.251.60.132:8085/OmniFinServices/DMSServiceHandlerWS?wsdl"},
	}

	createLog := func(log tk.M) {
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

	updateLog := func(log tk.M, err error, xmlString string) {
		log.Set("error", err)
		log.Set("xmlstring", xmlString)
		log.Set("iscomplete", err == nil)
		createLog(log)
	}

	saveData := func(masterData MasterData) (err error) {
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

		xmlString, err := GetHttpContentString(u.WSDLAddress)
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
