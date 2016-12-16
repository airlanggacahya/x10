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
		Url{"MasterLeadOperations", "http://103.251.60.132:8085/OmniFinServices/leadOperationsWS?wsdl"},
		Url{"MasterDealCAMDetail", "http://103.251.60.132:8085/OmniFinServices/dealCAMDetailWS?wsdl"},
		Url{"MasterChargeCode", "http://103.251.60.132:8085/OmniFinServices/chargeCodeWS?wsdl"},
		Url{"MasterGenericOperation", "http://103.251.60.132:8085/OmniFinServices/genericOperationWS?wsdl"},
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
		Url{"MasterDealDocumentOperation", "http://103.251.60.132:8085/OmniFinServices/dealDocumentOperationWS?wsdl"},
		Url{"MasterApplicationProcessing", "http://103.251.60.132:8085/OmniFinServices/applicationProcessingWS?wsdl"},
		Url{"MasterAdditionalDisbursement", "http://103.251.60.132:8085/OmniFinServices/additionalDisbursementWS?wsdl"},
		Url{"MasterReportDownload", "http://103.251.60.132:8085/OmniFinServices/reportDownloadWS?wsdl"},
		Url{"MasterDMSServiceHandlerImpl", "http://103.251.60.132:8085/OmniFinServices/DMSServiceHandlerWS?wsdl"},
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
