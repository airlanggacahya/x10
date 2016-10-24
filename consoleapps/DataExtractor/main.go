package main

import (
	"bufio"
	. "eaciit/x10/consoleapps/DataExtractor/models"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/mongo"
	. "github.com/eaciit/textsearch"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type Text struct {
	Top     int    `xml:"top,attr"`
	Left    int    `xml:"left,attr"`
	Content string `xml:",chardata"`
	Width   int    `xml:"width,attr"`
	Inline  string `xml:",innerxml"`
}

type Page struct {
	Width  int    `xml:"width,attr"`
	Height int    `xml:"height,attr"`
	Texts  []Text `xml:"text"`
}

type Pdf2xml struct {
	Pages []Page `xml:"page"`
}

var (
	wd = func() string {
		d, _ := os.Getwd()
		return d + "/"
	}()
)

func ReadConfig() map[string]string {
	ret := make(map[string]string)
	file, err := os.Open(wd + "conf/app.conf")
	if err == nil {
		defer file.Close()

		reader := bufio.NewReader(file)
		for {
			line, _, e := reader.ReadLine()
			if e != nil {
				break
			}

			sval := strings.Split(string(line), "=")
			ret[sval[0]] = sval[1]
		}
	} else {
		fmt.Println(err.Error())
	}

	return ret
}

func PrepareConnection() (dbox.IConnection, error) {
	config := ReadConfig()
	ci := &dbox.ConnectionInfo{config["host"], config["database"], config["username"], config["password"], nil}
	c, e := dbox.NewConnection("mongo", ci)

	if e != nil {
		return nil, e
	}

	e = c.Connect()
	if e != nil {
		return nil, e
	}

	return c, nil
}

func main() {
	config := ReadConfig()
	PathFrom := config["PathFrom"]
	PathTo := config["PathTo"]

	ExtractPdfDataCibilReport(PathFrom, PathTo, "ARMEE INFOTECH-Partners.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "CHIP COM TRADERS PVT LTD.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "INFLOW TECHNOLOGIES PVT LTD.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "MEGA BYTE CORPORATION-2.pdf", "Company")
	//ExtractPdfDataCibilReport(PathFrom, PathTo, "MEGABYTE CORPORATION.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "MINITEK SYSTEMS INDIA PRIVATE LIMITED.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "NETSOFT CONSULTING SERVICE PRIVATE LIMITED-2.pdf", "Company")
	ExtractPdfDataCibilReport(PathFrom, PathTo, "TELEXCELL INFORMATION SYSTEMS LTD.pdf", "Company")

	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Ami Ridhish Patel.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "ARCHANA CIBIL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Ashish Netsoft CIBIL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "baid basu shree cibil.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Bhargav.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "byju pillai.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "dharmednra baid additional match.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "dharmendra baid cibil.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "JAWAHAR LAL MAHENDER KUMAR LALWANI-756.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "JAWAHAR LAL MAHENDER KUMAR LALWANI-783 -aditional matches.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "KIRITKUMAR CHIMANBHAI PATEL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "mahendra baid cibil.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "PRASHANT CHADDA.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Rajani Balla.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "rajesh kumar rengachari.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "RAJIV CIBIL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "rajjiv unnikrishnan.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "RIDHISH KIRITIBHAI PATEL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "RIDHISH KIRITIBHAI PATEL-addition matches.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Sameer Gulati netsoft.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "santosh sankunny.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "TARUN LALWANI.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Umes CIBIL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "umesh menon.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "v pradeepan Cibil.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Vanigota CIBIL.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "Venkata.pdf", "Promotor")
	// ExtractPdfDataCibilReport(PathFrom, PathTo, "vijay g new.pdf", "Promotor")
}

func ExtractCompanyCibilReport(PathFrom string, Filename string) CibilReportModel {
	XmlFolder := strings.TrimRight(Filename, ".xml")
	XmlFile := PathFrom + "\\" + "Company" + "\\" + XmlFolder + "\\" + Filename
	v := &Pdf2xml{}
	rawdata, err := ioutil.ReadFile(XmlFile)
	if err != nil {
		tk.Println(err.Error())
	}
	xml.Unmarshal(rawdata, &v)

	topcreditsummarylayout := 0
	botcreditsummarylayout := 0
	topageindexcreditsummary := 0
	botpageindexcreditsummary := 0
	Profiles := Profile{}
	ReportSummarys := ReportSummary{}
	CreditTypeSummarys := []CreditTypeSummary{}
	CreditTypeSummaryData := CreditTypeSummary{}
	ReportSummaryDetails := ReportSummaryDetail{}
	DetailReportSummary := []ReportSummaryDetail{}
	EnquirySummarys := EnquirySummary{}
	CreditType := ""
	Address := ""
	nametop := 0
	pantop := 0
	citytop := 0
	statetop := 0
	countrytop := 0
	dunsnumbertop := 0
	addresstop := 0
	telephonetop := 0
	pincodetop := 0
	fileopentop := 0
	creditgranttop := 0
	creditfacilityguaranttop := 0
	standardtop := 0
	topenquirysummarylayout := 0
	topenquirysummaryindex := 0

	//Create Layout
	for i, page := range v.Pages {
		for _, text := range page.Texts {
			if text.Content == "Mention A/C" {
				topcreditsummarylayout = text.Top
				topageindexcreditsummary = i
			}
			if text.Content == "Enquiry Summary" {
				botcreditsummarylayout = text.Top
				topenquirysummaryindex = i
				botpageindexcreditsummary = i
			}
			if text.Content == "No. of Enquiries" {
				topenquirysummarylayout = text.Top
			}
		}
	}

	for _, page := range v.Pages {
		for _, text := range page.Texts {
			//Extract Profile
			if text.Content == "Name" {
				nametop = text.Top
			}
			if text.Content == "PAN" && pantop == 0 {
				pantop = text.Top
			}
			if text.Content == "City / Town" && citytop == 0 {
				citytop = text.Top
			}
			if text.Content == "State / Union Territory" && statetop == 0 {
				statetop = text.Top
			}
			if text.Content == "Country" && countrytop == 0 {
				countrytop = text.Top
			}
			if text.Content == "Short Name" && dunsnumbertop == 0 {
				dunsnumbertop = text.Top
			}
			if text.Content == "Address" && addresstop == 0 {
				addresstop = text.Top
			}
			if text.Content == "Telephone Number" && telephonetop == 0 {
				telephonetop = text.Top
			}
			if text.Content == "PIN Code" && pincodetop == 0 {
				pincodetop = text.Top
			}
			if text.Content == "File Open Date" && fileopentop == 0 {
				fileopentop = text.Top
			}
			if text.Content == "No. of Credit Grantors" {
				creditgranttop = text.Top
			}
			if text.Content == "No. of Credit Facilities" {
				creditfacilityguaranttop = text.Top
			}
		}
	}
	//End Of Create Layout

	for i, page := range v.Pages {
		for _, text := range page.Texts {
			if i == 0 {
				if text.Top == nametop && text.Left == 275 {
					Profiles.CompanyName = text.Content
				}
				if text.Top == pantop && text.Left == 275 {
					Profiles.Pan = text.Content
				}
				if (text.Top == citytop || text.Top == citytop-1) && text.Left == 275 {
					Profiles.CityTown = text.Content
				}
				if (text.Top == statetop || text.Top == statetop-1) && text.Left == 275 {
					Profiles.StateUnion = text.Content
				}
				if (text.Top == countrytop || text.Top == countrytop-1) && text.Left == 275 {
					Profiles.Country = text.Content
				}
				if text.Top == dunsnumbertop && text.Left == 626 {
					Profiles.DunsNumber = text.Content
				}
				if text.Top >= addresstop && text.Top < telephonetop {
					if text.Left == 626 {
						Address = Address + " " + text.Content
						Profiles.Address = Address
					}
				}
				if (text.Top == telephonetop || text.Top == telephonetop-1) && text.Left == 626 {
					Profiles.Telephone = text.Content
				}
				if (text.Top == pincodetop || text.Top == pincodetop-1) && text.Left == 626 {
					Profiles.PinCode = text.Content
				}
				if (text.Top == fileopentop || text.Top == fileopentop-1) && text.Left == 626 {
					Profiles.FileOpenDate = text.Content
				}
				if text.Content == "Standard" {
					standardtop = text.Top
				}
			}
			//End Of Extract Profile

			//Extract Report Summary
			if (text.Top == creditgranttop-1 || text.Top == creditgranttop) && text.Left == 248 {
				ReportSummarys.Grantors = text.Content
			}
			if (text.Top == creditgranttop-1 || text.Top == creditgranttop) && text.Left == 469 {
				ReportSummarys.Facilities = text.Content
			}
			if (text.Top == creditgranttop-1 || text.Top == creditgranttop) && text.Left == 691 {
				ReportSummarys.CreditFacilities = text.Content
			}
			if (text.Top == creditfacilityguaranttop-1 || text.Top == creditfacilityguaranttop) && text.Left == 248 {
				ReportSummarys.FacilitiesGuaranteed = text.Content
			}
			if (text.Top == creditfacilityguaranttop-1 || text.Top == creditfacilityguaranttop) && text.Left == 469 {
				ReportSummarys.LatestCreditFacilityOpenDate = text.Content
			}
			if (text.Top == creditfacilityguaranttop-1 || text.Top == creditfacilityguaranttop) && text.Left == 691 {
				ReportSummarys.FirstCreditFacilityOpenDate = text.Content
			}
			if i == 0 {
				if text.Top > standardtop && text.Top < topcreditsummarylayout-21 {
					if text.Left >= 100 && text.Left <= 724 {
						if text.Left == 100 {
							if text.Content != "Credit Type Summary" {
								ReportSummaryDetails.CreditFacilities = text.Content
							}
						}
						if text.Left == 200 {
							ReportSummaryDetails.NoOfStandard = text.Content
						}
						if text.Left == 300 {
							ReportSummaryDetails.CurrentBalanceStandard = text.Content
						}
						if text.Left == 401 {
							ReportSummaryDetails.NoOfOtherThanStandard = text.Content
						}
						if text.Left == 501 {
							ReportSummaryDetails.CurrentBalanceOtherThanStandard = text.Content
						}
						if text.Left == 601 {
							ReportSummaryDetails.NoOfLawSuits = text.Content
						}
						if text.Left == 701 {
							ReportSummaryDetails.NoOfWilfulDefaults = text.Content
							DetailReportSummary = append(DetailReportSummary, ReportSummaryDetails)
						}
					}
				}
			}
			//End Of Extract Report Summary

			//Extract Credit Type Summary
			if topageindexcreditsummary != botpageindexcreditsummary {
				if i == topageindexcreditsummary {
					if text.Top > topcreditsummarylayout {
						if text.Left >= 100 && text.Left <= 724 {
							if text.Left == 100 {
								CreditTypeSummaryData.NoCreditFacilitiesBorrower = text.Content
							}
							if text.Left == 178 {
								CreditType = CreditType + " " + text.Content
								CreditTypeSummaryData.CreditType = CreditType
							}
							if text.Left == 256 {
								CreditTypeSummaryData.CurrencyCode = text.Content
							}
							if text.Left == 334 {
								CreditTypeSummaryData.Standard = text.Content
							}
							if text.Left == 724 {
								CreditTypeSummaryData.TotalCurrentBalance = text.Content
								if CreditTypeSummaryData.CurrencyCode != "Total" {
									CreditTypeSummarys = append(CreditTypeSummarys, CreditTypeSummaryData)
								}
								CreditType = ""
							}
						}
					}
				}

				if i == botpageindexcreditsummary {
					if text.Top < botcreditsummarylayout {
						if text.Left >= 100 && text.Left <= 724 {
							if text.Left == 100 {
								CreditTypeSummaryData.NoCreditFacilitiesBorrower = text.Content
							}
							if text.Left == 178 {
								CreditType = CreditType + " " + text.Content
								CreditTypeSummaryData.CreditType = CreditType
							}
							if text.Left == 256 {
								CreditTypeSummaryData.CurrencyCode = text.Content
							}
							if text.Left == 334 {
								CreditTypeSummaryData.Standard = text.Content
							}
							if text.Left == 724 {
								CreditTypeSummaryData.TotalCurrentBalance = text.Content
								if CreditTypeSummaryData.CurrencyCode != "Total" {
									CreditTypeSummarys = append(CreditTypeSummarys, CreditTypeSummaryData)
								}
								CreditType = ""
							}
						}
					}
				}
			} else {
				if i == topageindexcreditsummary {
					if text.Top > topcreditsummarylayout {
						if text.Left >= 100 && text.Left <= 724 {
							if text.Left == 100 {
								CreditTypeSummaryData.NoCreditFacilitiesBorrower = text.Content
							}
							if text.Left == 178 {
								CreditType = CreditType + " " + text.Content
								CreditTypeSummaryData.CreditType = CreditType
							}
							if text.Left == 256 {
								CreditTypeSummaryData.CurrencyCode = text.Content
							}
							if text.Left == 334 {
								CreditTypeSummaryData.Standard = text.Content
							}
							if text.Left == 724 {
								CreditTypeSummaryData.TotalCurrentBalance = text.Content
								if CreditTypeSummaryData.CurrencyCode != "Total" {
									CreditTypeSummarys = append(CreditTypeSummarys, CreditTypeSummaryData)
								}
								CreditType = ""
							}
						}
					}
				}
			}
			//End Of Credit Type Summary
			//Extract Enquiry Summary
			if i == topenquirysummaryindex {
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 205 {
					EnquirySummarys.Enquiries3Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 275 {
					EnquirySummarys.Enquiries6Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 345 {
					EnquirySummarys.Enquiries9Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 416 {
					EnquirySummarys.Enquiries12Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 486 {
					EnquirySummarys.Enquiries24Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 556 {
					EnquirySummarys.Enquiriesthan24Month = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 626 {
					EnquirySummarys.TotalEnquiries = text.Content
				}
				if (text.Top == topenquirysummarylayout || text.Top == topenquirysummarylayout-1) && text.Left == 696 {
					EnquirySummarys.MostRecentDate = text.Content
				}
			}
			//End Of Extract Enquiry Summary
		}
	}

	CibilReport := CibilReportModel{}
	CibilReport.ReportType = "Company"
	CibilReport.Profile = Profiles
	CibilReport.Detail = DetailReportSummary
	CibilReport.ReportSummary = ReportSummarys
	CibilReport.CreditTypeSummary = CreditTypeSummarys
	CibilReport.EnquirySummary = EnquirySummarys
	return CibilReport

}

func ExtractIndividualCibilReport(PathFrom string, Filename string) ReportData {
	XmlFolder := strings.Split(Filename, ".xml")
	XmlFile := PathFrom + "\\" + "Promotor" + "\\" + XmlFolder[0] + "\\" + Filename
	v := &Pdf2xml{}
	rawdata, err := ioutil.ReadFile(XmlFile)
	if err != nil {
		tk.Println(err.Error())
	}
	xml.Unmarshal(rawdata, &v)

	nametop := 0
	nameleft := 96
	bodtop := 0
	bodleft := 128
	gendertop := 0
	genderleft := 508
	datereporttop := 0
	datereportleft := 712
	timereporttop := 0
	timereportleft := 711
	cibilscoreversiontop := 450
	cibilscoreversionleft := 42
	cibilscoretop := 432
	cibilscoreleft := 248
	scoringfactortop := 440
	scoringfactorleft := 331
	scoringfactorbot := 0
	ishavescoringfactor := false
	incometaxtop := 0
	incometaxleft := 291
	passportnumbertop := 0
	passportnumberleft := 291
	telephonetop := 0
	telephonebot := 0
	emailtop := 0
	emailbot := 0
	emailtopindex := 0
	emailbotindex := 0
	addresstop := 0
	addressbot := 0
	addresstopindex := 0
	addressbotindex := 0
	accounttop := 0
	accountbot := 0
	totalacctop := 0
	totalaccleft := 289
	overduetop := 0
	overdueleft := 289
	zerobalancetop := 0
	zerobalanceleft := 289
	highcreditsanctiontop := 0
	highcreditsancright := 0
	//highcreditsanctionleft := 465
	currentbalancetop := 0
	currentbalanceright := 0
	currentbalanceleft := 631
	overduebalancetop := 0
	overduebalanceright := 0
	//overduebalanceleft := 648
	dateopenrecenttop := 0
	dateopenrecentleft := 800
	dateopenoldesttop := 0
	dateopenoldestleft := 800
	enquirytop := 0
	enquiryright := 0
	//enquirytotalleft := 322
	//enquirypast30left := 455
	enquirypast30right := 0
	enquiryrecentdateleft := 800
	enquirybot := 0
	addressdetailtop := 0
	addressdetailpermanentleft := 124
	addressdetailleft := 109
	addresscategorytop := 0
	addresscategoryleft := 119
	addressdatereportedtop := 0
	addressdatereportedleft := 706
	scoringfactors := []string{}
	telephonedata := ReportTelephone{}
	telephones := []ReportTelephone{}
	emails := []string{}
	addressdetail := ReportAddress{}
	addressdetails := []ReportAddress{}
	consumerinfo := ConsumerInfo{}
	reportdata := ReportData{}
	layout := "02-01-2006"
	layoutdatetime := "15:04:05"

	//Create Layout
	for i, page := range v.Pages {
		for _, text := range page.Texts {
			if text.Inline == "<b> CONSUMER: </b>" && nametop == 0 {
				nametop = text.Top - 1
			}
			if text.Inline == "<i>DATE OF BIRTH: </i>" && bodtop == 0 {
				bodtop = text.Top - 1
			}
			if text.Inline == "<i>GENDER: </i>" && gendertop == 0 {
				gendertop = text.Top - 1
			}
			if text.Inline == "<b>DATE:</b>" && datereporttop == 0 {
				datereporttop = text.Top - 1
			}
			if text.Inline == "<b>TIME: </b>" && timereporttop == 0 {
				timereporttop = text.Top - 1
			}
			if text.Top == scoringfactortop && text.Left == scoringfactorleft && text.Content != "" {
				ishavescoringfactor = true
			}
			if text.Content == "POSSIBLE RANGE FOR CIBIL TRANSUNION SCORE VERSION 1.0" && scoringfactorbot == 0 {
				scoringfactorbot = text.Top
			}
			if text.Content == "INCOME TAX ID NUMBER (PAN) " && incometaxtop == 0 {
				incometaxtop = text.Top
			}
			if text.Content == "PASSPORT NUMBER " && passportnumbertop == 0 {
				passportnumbertop = text.Top
			}
			if text.Inline == "<b>TELEPHONE TYPE</b>" && telephonetop == 0 {
				telephonetop = text.Top
			}
			if text.Inline == "<b>EMAIL CONTACT(S):</b>" && telephonebot == 0 {
				telephonebot = text.Top
			}
			if text.Inline == "<b>EMAIL CONTACT(S):</b>" && emailtop == 0 {
				emailtop = text.Top
				emailtopindex = i
			}
			if text.Inline == "<b>ADDRESS(ES): </b>" && emailbot == 0 {
				emailbot = text.Top
				emailbotindex = i
			}
			if text.Inline == "<b>ADDRESS(ES): </b>" && addresstop == 0 {
				addresstop = text.Top
				addresstopindex = i
			}
			if text.Inline == "<b>ACCOUNT TYPE</b>" && addressbot == 0 {
				addressbot = text.Top
				addressbotindex = i
			}
			if text.Inline == "<b>ACCOUNT(S) </b>" && accounttop == 0 {
				accounttop = text.Top
			}
			if text.Inline == "<i>TOTAL: </i>" && totalacctop == 0 {
				totalacctop = text.Top - 1
			}
			if text.Inline == "<i>OVERDUE: </i>" && overduetop == 0 {
				overduetop = text.Top - 1
			}
			if text.Inline == "<i>ZERO-BALANCE: </i>" && zerobalancetop == 0 {
				zerobalancetop = text.Top - 1
			}
			if text.Inline == "<i>HIGH CR/SANC. AMT: </i>" && highcreditsanctiontop == 0 {
				highcreditsanctiontop = text.Top - 1
				highcreditsancright = text.Left + text.Width
			}
			if text.Inline == "<i>CURRENT: </i>" && currentbalancetop == 0 {
				currentbalancetop = text.Top - 1
				currentbalanceright = text.Left + text.Width
			}
			if text.Inline == "<i>OVERDUE: </i>" && overduebalancetop == 0 {
				overduebalancetop = text.Top - 1
				overduebalanceright = text.Left + text.Width
			}
			if text.Inline == "<i>RECENT: </i>" && dateopenrecenttop == 0 {
				dateopenrecenttop = text.Top - 1
			}
			if text.Inline == "<i>OLDEST: </i>" && dateopenoldesttop == 0 {
				dateopenoldesttop = text.Top - 1
			}
			if text.Inline == "<b>ENQUIRIES </b>" && accountbot == 0 {
				accountbot = text.Top
			}
			// if text.Inline == "<b>ENQUIRIES </b>" && enquirytop == 0 {
			// 	enquirytop = text.Top
			// }
			if text.Inline == "<b>All Enquiries</b>" && enquirybot == 0 {
				enquirybot = text.Top
			}
			if text.Inline == "<b>TOTAL </b>" && enquirytop == 0 {
				enquirytop = text.Top
				enquiryright = text.Left + text.Width
			}
			if text.Inline == "<b>PAST 30 DAYS </b>" {
				enquirypast30right = text.Left + text.Width
			}

		}
	}

	for i, page := range v.Pages {
		for _, text := range page.Texts {
			if text.Top == nametop && text.Left == nameleft {
				consumerinfo.ConsumerName = text.Content
			}
			if text.Top == bodtop && text.Left == bodleft {
				bodval, _ := time.Parse(layout, text.Content)
				consumerinfo.DateOfBirth = bodval
			}
			if text.Top == gendertop && text.Left == genderleft {
				consumerinfo.Gender = text.Content
			}
			if i == 0 {

				if text.Top == datereporttop && text.Left == datereportleft {
					//dateval = dateval + text.Content
					dates, _ := time.Parse(layout, text.Content)
					reportdata.DateOfReport = dates
				}
				if text.Top == timereporttop && text.Left == timereportleft {
					times, _ := time.Parse(layoutdatetime, text.Content)
					reportdata.TimeOfReport = times
				}
			}
			if text.Top == cibilscoreversiontop && text.Left == cibilscoreversionleft {
				reportdata.CibilScoreVersion = text.Content
			}
			if text.Top == cibilscoretop && text.Left == cibilscoreleft {
				score, _ := strconv.Atoi(text.Content)
				reportdata.CibilScore = score
			}
			if ishavescoringfactor == true {
				if text.Top >= scoringfactortop-2 && text.Top < scoringfactorbot && text.Left == 345 {
					scoringfactors = append(scoringfactors, text.Content)
				}
			}
			if text.Top == incometaxtop && text.Left == incometaxleft {
				reportdata.IncomeTaxIdNumber = text.Content
			}
			if text.Top == passportnumbertop && text.Left == passportnumberleft {
				reportdata.PassportNumber = text.Content
			}
			if text.Top > telephonetop && text.Top < telephonebot && text.Left == 42 {
				telephonedata.Type = text.Content
			}
			if text.Top > telephonetop && text.Top < telephonebot && text.Left == 333 {
				telephonedata.Number = text.Content
				telephones = append(telephones, telephonedata)
			}
			if emailtopindex != emailbotindex {
				if i == emailtopindex {
					if text.Top > emailtop && text.Left == 42 {
						emails = append(emails, text.Content)
					}
				}
				if i == emailbotindex {
					if text.Top < emailbot && text.Left == 42 {
						emails = append(emails, text.Content)
					}
				}
			} else {
				if text.Top > emailtop && text.Top < emailbot && text.Left == 42 {
					emails = append(emails, text.Content)
				}
			}
			if text.Top == totalacctop && (text.Left == totalaccleft || text.Left == 283) {
				strs := strings.Split(text.Content, " ")
				if len(strs) > 0 {
					totalacc, _ := strconv.Atoi(strs[0])
					reportdata.TotalAccount = totalacc
				} else {
					tk.Println("else")
					totalacc, _ := strconv.Atoi(text.Content)
					reportdata.TotalAccount = totalacc
				}
			}
			if text.Top == overduetop && (text.Left == overdueleft || text.Left == 283) {
				strs := strings.Split(text.Content, " ")
				if len(strs) > 0 {
					overdue, _ := strconv.Atoi(strs[0])
					reportdata.TotalOverdues = overdue
				} else {
					overdue, _ := strconv.Atoi(text.Content)
					reportdata.TotalOverdues = overdue
				}
			}
			if text.Top == zerobalancetop && (text.Left == zerobalanceleft || text.Left == 283) {
				strs := strings.Split(text.Content, " ")
				if len(strs) > 0 {
					zerobalance, _ := strconv.Atoi(strs[0])
					reportdata.TotalZeroBalanceAcc = zerobalance
				} else {
					zerobalance, _ := strconv.Atoi(text.Content)
					reportdata.TotalZeroBalanceAcc = zerobalance
				}

			}
			if text.Top == highcreditsanctiontop && text.Left >= highcreditsancright && text.Left < currentbalanceleft {
				val := ReplaceString(text.Content)
				highcredit, _ := strconv.ParseFloat(val, 64)
				reportdata.HighCreditSanctionAmount = highcredit
			}
			if text.Top == currentbalancetop && text.Left >= currentbalanceright && text.Left < dateopenrecentleft {
				val := ReplaceString(text.Content)
				currentbalance, _ := strconv.ParseFloat(val, 64)
				reportdata.CurrentBalance = currentbalance
			}
			if text.Top == overduebalancetop && text.Left >= overduebalanceright && text.Left < dateopenoldestleft {
				val := ReplaceString(text.Content)
				overduebalance, _ := strconv.ParseFloat(val, 64)
				reportdata.OverdueBalance = overduebalance
			}
			if text.Top == dateopenrecenttop && text.Left == dateopenrecentleft {
				dateopenrecent, _ := time.Parse(layout, text.Content)
				reportdata.DateOpenedRecent = dateopenrecent
			}
			if text.Top == dateopenoldesttop && text.Left == dateopenoldestleft {
				dateopenoldest, _ := time.Parse(layout, text.Content)
				reportdata.DateOpenedOldest = dateopenoldest
			}
			if text.Top == enquirybot && text.Left <= enquiryright {
				enquirytotal, _ := strconv.Atoi(text.Content)
				reportdata.TotalEnquiries = enquirytotal
			}
			if text.Top == enquirybot && text.Left <= enquirypast30right {
				enquiry30, _ := strconv.Atoi(text.Content)
				reportdata.TotalEnquiries30Days = enquiry30
			}
			if text.Top == enquirybot && text.Left == enquiryrecentdateleft {
				enquiryrecentdate, _ := time.Parse(layout, text.Content)
				reportdata.RecentEnquiriesDates = enquiryrecentdate
			}

			if addresstopindex != addressbotindex {
				if i == addresstopindex {
					if text.Content == "ADDRESS:" || text.Content == "ADDRESS(e):" {
						addressdetailtop = text.Top
					}
					if text.Content == "CATEGORY:" {
						addresscategorytop = text.Top
					}
					if text.Content == "DATE REPORTED:" {
						addressdatereportedtop = text.Top
					}
					if text.Top == addressdetailtop && text.Left == addressdetailpermanentleft {
						addressdetail.AddressPinCode = text.Content
					}
					if text.Top == addressdetailtop && text.Left == addressdetailleft {
						addressdetail.AddressPinCode = text.Content
					}
					if text.Top == addressdetailtop+14 && text.Left == 48 {
						addressdetail.AddressPinCode = addressdetail.AddressPinCode + " " + text.Content
					}
					if text.Top == addresscategorytop && text.Left == addresscategoryleft {
						addressdetail.Category = text.Content
					}
					if text.Top == addressdatereportedtop && text.Left == addressdatereportedleft {
						addressreport, _ := time.Parse(layout, text.Content)
						addressdetail.DateReported = addressreport
						addressdetails = append(addressdetails, addressdetail)
					}
				}
				if i == addressbotindex {
					if text.Content == "ADDRESS:" || text.Content == "ADDRESS(e):" {
						addressdetailtop = text.Top
					}
					if text.Content == "CATEGORY:" {
						addresscategorytop = text.Top
					}
					if text.Content == "DATE REPORTED:" {
						addressdatereportedtop = text.Top
					}
					if text.Top == addressdetailtop && text.Left == addressdetailpermanentleft {
						addressdetail.AddressPinCode = text.Content
					}
					if text.Top == addressdetailtop && text.Left == addressdetailleft {
						addressdetail.AddressPinCode = text.Content
					}
					if text.Top == addressdetailtop+14 && text.Left == 48 {
						addressdetail.AddressPinCode = addressdetail.AddressPinCode + " " + text.Content
					}
					if text.Top == addresscategorytop && text.Left == addresscategoryleft {
						addressdetail.Category = text.Content
					}
					if text.Top == addressdatereportedtop && text.Left == addressdatereportedleft {
						addressreport, _ := time.Parse(layout, text.Content)
						addressdetail.DateReported = addressreport
						addressdetails = append(addressdetails, addressdetail)
					}
				}
			} else {
				if text.Content == "ADDRESS:" || text.Content == "ADDRESS(e):" {
					addressdetailtop = text.Top
				}
				if text.Content == "CATEGORY:" {
					addresscategorytop = text.Top
				}
				if text.Content == "DATE REPORTED:" {
					addressdatereportedtop = text.Top
				}
				if text.Top == addressdetailtop && text.Left == addressdetailpermanentleft {
					addressdetail.AddressPinCode = text.Content
				}
				if text.Top == addressdetailtop && text.Left == addressdetailleft {
					addressdetail.AddressPinCode = text.Content
				}
				if text.Top == addresscategorytop && text.Left == addresscategoryleft {
					addressdetail.Category = text.Content
				}
				if text.Top == addressdatereportedtop && text.Left == addressdatereportedleft {
					addressreport, _ := time.Parse(layout, text.Content)
					addressdetail.DateReported = addressreport
					addressdetails = append(addressdetails, addressdetail)
				}
			}
		}
	}
	reportdata.ConsumersInfos = consumerinfo
	reportdata.ScoringFactor = scoringfactors
	reportdata.Telephones = telephones
	reportdata.EmailAddress = emails
	reportdata.AddressData = addressdetails
	reportdata.ReportType = "Promotor"
	return reportdata
}

func ExtractPdfDataCibilReport(PathFrom string, PathTo string, FName string, ReportType string) {
	ConvertPdfToXml(PathFrom, PathTo, FName, ReportType)
	Name := strings.TrimRight(FName, ".pdf")
	XmlFileName := Name + ".xml"

	conn, err := PrepareConnection()
	if err != nil {
		log.Println(err)
	}
	defer conn.Close()

	if ReportType == "Company" {
		reportobj := ExtractCompanyCibilReport(PathTo, XmlFileName)
		customer := strings.Split(reportobj.Profile.CompanyName, " ")
		res := []tk.M{}
		cursor, err := conn.NewQuery().Select().From("CustomerProfile").Where(dbox.Contains("applicantdetail.CustomerName", customer[0])).Cursor(nil)
		if err != nil {
			tk.Println(err.Error())
		}
		err = cursor.Fetch(&res, 0, false)
		defer cursor.Close()

		if len(res) > 0 {
			for _, val := range res {
				customername := val["applicantdetail"].(tk.M)["CustomerName"].(string)
				setting := NewSimilaritySetting()
				setting.SplitDelimeters = []rune{' ', '.', '-'}
				similar := Similarity(reportobj.Profile.CompanyName, customername, setting)

				if similar > 80 {
					reportobj.Id = bson.NewObjectId()
					app := val.Get("applicantdetail").(tk.M)
					reportobj.Profile.CustomerId = app.GetInt("CustomerID")
					reportobj.Profile.DealNo = val["applicantdetail"].(tk.M)["DealNo"].(string)
					reportobj.FilePath = PathFrom + "\\" + ReportType + "\\" + Name + "\\" + FName
					reportobj.FileName = FName
					reportobj.IsMatch = true
					query := conn.NewQuery().From("CibilReport").Save()
					err = query.Exec(tk.M{
						"data": reportobj,
					})
					if err != nil {
						tk.Println(err.Error())
					}
					query.Close()
				}
			}
		} else {
			reportobj.Id = bson.NewObjectId()
			reportobj.FilePath = PathFrom + "\\" + ReportType + "\\" + Name + "\\" + FName
			reportobj.FileName = FName
			reportobj.IsMatch = false
			query := conn.NewQuery().From("CibilReport").Save()
			err = query.Exec(tk.M{
				"data": reportobj,
			})
			if err != nil {
				tk.Println(err.Error())
			}
			query.Close()
		}
	} else {
		reportobj := ExtractIndividualCibilReport(PathTo, XmlFileName)
		res := []tk.M{}
		cursor, err := conn.NewQuery().Select().From("CustomerProfile").Where(dbox.And(dbox.Eq("detailofpromoters.biodata.Name", reportobj.ConsumersInfos.ConsumerName), dbox.Eq("detailofpromoters.biodata.PAN", reportobj.IncomeTaxIdNumber))).Cursor(nil)
		if err != nil {
			tk.Println(err.Error())
		}
		err = cursor.Fetch(&res, 0, false)
		defer cursor.Close()

		if len(res) > 0 {
			for _, val := range res {

				reportobj.Id = bson.NewObjectId()
				app := val.Get("applicantdetail").(tk.M)
				reportobj.ConsumersInfos.CustomerId = app.GetInt("CustomerID")
				reportobj.ConsumersInfos.DealNo = val["applicantdetail"].(tk.M)["DealNo"].(string)
				reportobj.FilePath = PathFrom + "\\" + ReportType + "\\" + Name + "\\" + FName
				reportobj.FileName = FName
				reportobj.IsMatch = true
				query := conn.NewQuery().From("CibilReportIndividual").Save()
				err = query.Exec(tk.M{
					"data": reportobj,
				})
				if err != nil {
					tk.Println(err.Error())
				}
				query.Close()

			}
		} else {
			reportobj.Id = bson.NewObjectId()
			reportobj.FilePath = PathFrom + "\\" + ReportType + "\\" + Name + "\\" + FName
			reportobj.FileName = FName
			reportobj.IsMatch = false
			query := conn.NewQuery().From("CibilReportIndividual").Save()
			err = query.Exec(tk.M{
				"data": reportobj,
			})
			if err != nil {
				tk.Println(err.Error())
			}
			query.Close()
		}
	}
}

func ConvertPdfToXml(PathFrom string, PathTo string, FName string, CompanyType string) {
	Name := strings.TrimRight(FName, ".pdf")
	FileName := PathFrom + "\\" + CompanyType + "\\" + FName
	ResultName := PathTo + "\\" + CompanyType + "\\" + Name + "\\" + Name

	os.MkdirAll(PathTo+"\\"+CompanyType+"\\"+Name, 0)
	fmt.Printf("Converting %#v....\n", FName)
	args := []string{"/C", "pdftohtml", "-xml", FileName, ResultName}
	if err := exec.Command("cmd", args...).Run(); err != nil {
		fmt.Printf("Error: %#v\n", err)
	} else {
		fmt.Printf("Converting %#v Success\n", FName)
	}
}

func ReplaceString(number string) string {
	rex := regexp.MustCompile("[^0-9]")
	valStr := rex.ReplaceAllString(number, "")
	return valStr
}
