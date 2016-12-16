package main

import (
	. "eaciit/x10/consoleapps/OmnifinMaster/helpers"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Url struct {
	portName    string
	wsdlAddress string
}

func main() {
	urls := []Url{
		Url{"LeadOperations", "http://103.251.60.132:8085/OmniFinServices/leadOperationsWS?wsdl"},
		Url{"DealCAMDetail", "http://103.251.60.132:8085/OmniFinServices/dealCAMDetailWS?wsdl"},
		Url{"ChargeCode", "http://103.251.60.132:8085/OmniFinServices/chargeCodeWS?wsdl"},
		Url{"GenericOperation", "http://103.251.60.132:8085/OmniFinServices/genericOperationWS?wsdl"},
		Url{"Country", "http://103.251.60.132:8085/OmniFinServices/countryMasterWS?wsdl"},
		Url{"State", "http://103.251.60.132:8085/OmniFinServices/stateMasterWS?wsdl"},
		Url{"District", "http://103.251.60.132:8085/OmniFinServices/districtMasterWS?wsdl"},
		Url{"Tehsil", "http://103.251.60.132:8085/OmniFinServices/tehsilMasterWS?wsdl"},
		Url{"Pincode", "http://103.251.60.132:8085/OmniFinServices/pincodeMasterWS?wsdl"},
		Url{"Bank", "http://103.251.60.132:8085/OmniFinServices/bankMasterWS?wsdl"},
		Url{"BankBranch", "http://103.251.60.132:8085/OmniFinServices/bankBranchMasterWS?wsdl"},
		Url{"Product", "http://103.251.60.132:8085/OmniFinServices/productMasterWS?wsdl"},
		Url{"Scheme", "http://103.251.60.132:8085/OmniFinServices/schemeMasterWS?wsdl"},
		Url{"DocumentChecklist", "http://103.251.60.132:8085/OmniFinServices/documentChecklistMasterWS?wsdl"},
		Url{"Document", "http://103.251.60.132:8085/OmniFinServices/documentMasterWS?wsdl"},
		Url{"ChildDocument", "http://103.251.60.132:8085/OmniFinServices/childDocumentMasterWS?wsdl"},
		Url{"Charges", "http://103.251.60.132:8085/OmniFinServices/chargesMasterWS?wsdl"},
		Url{"Branch", "http://103.251.60.132:8085/OmniFinServices/branchMasterWS?wsdl"},
		Url{"DealDocumentOperation", "http://103.251.60.132:8085/OmniFinServices/dealDocumentOperationWS?wsdl"},
		Url{"ApplicationProcessing", "http://103.251.60.132:8085/OmniFinServices/applicationProcessingWS?wsdl"},
		Url{"AdditionalDisbursement", "http://103.251.60.132:8085/OmniFinServices/additionalDisbursementWS?wsdl"},
		Url{"ReportDownload", "http://103.251.60.132:8085/OmniFinServices/reportDownloadWS?wsdl"},
		Url{"DMSServiceHandlerImpl", "http://103.251.60.132:8085/OmniFinServices/DMSServiceHandlerWS?wsdl"},
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

		if log.Get("error") != nil {
			res := []tk.M{}
			query, err := conn.NewQuery().Select().From("OmnifinMail").Cursor(nil)
			defer query.Close()

			if err != nil {
				panic(err.Error())
			}
			err = query.Fetch(&res, 0, false)

			for _, mail := range res {
				addr := mail.GetString("address")
				if err := SendMail(
					tk.Sprintf("%v", "[noreply] CAT XML Error Reminder"),
					tk.Sprintf("%v", "XML receiver has some error.</br>Error Message : "+
						log.GetString("error")+".</br> Log ID : "+
						log.GetString("_id")),
					addr); err != nil {
					panic(err.Error())
				} else {
					tk.Println("Email sent to", addr)
					tk.Println("------- Error:", log.GetString("error"))
				}
			}
		}
	}

	for _, u := range urls {
		tk.Println("Getting", u.portName, "content from", u.wsdlAddress)
		log := tk.M{}
		log.Set("_id", bson.NewObjectId())
		log.Set("name", u.portName)
		log.Set("createddate", time.Now().UTC())
		log.Set("error", nil)
		log.Set("xmlstring", nil)
		log.Set("iscomplete", false)

		createLog(log)

		xmlString, err := GetHttpContentString(u.wsdlAddress)
		if err != nil {
			log.Set("error", err)
		}

		log.Set("xmlstring", xmlString)
		log.Set("iscomplete", err == nil)

		createLog(log)
	}
}
