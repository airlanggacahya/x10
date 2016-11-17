package x10upload

import (
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/eaciit/dbox"
	tk "github.com/eaciit/toolkit"
)

func MoveFile(From string, To string) {
	args := []string{"mv", From, To}
	args0 := strings.Join(args, " ")

	if err := exec.Command("/bin/sh", "-c", args0).Run(); err != nil {
		tk.Printf("Error: %#v\n", err.Error())
	}
}

func CopyFile(From string, To string) {
	args := []string{"cp", From, To}
	args0 := strings.Join(args, " ")

	if err := exec.Command("/bin/sh", "-c", args0).Run(); err != nil {
		tk.Printf("Error: %#v\n", err.Error())
	}
}

func UrlReplacer(Url string) string {
	formattedstring := strings.Replace(Url, " ", "\\ ", -1)
	return formattedstring
}

func ProcessFile(inbox string, process string, failed string, success string, reporttype string, webapps string) {

	inboxfolder, _ := ioutil.ReadDir(inbox)
	if len(inboxfolder) > 0 {
		for _, f := range inboxfolder {
			err := ConvertPdfToXml(inbox, process, f.Name())
			if err != nil {
				tk.Println(err.Error())
			}
			filename := strings.TrimRight(f.Name(), ".pdf")
			xmlfilename := filename + ".xml"

			DeleteFile(".png", process)
			DeleteFile(".jpg", process)

			timestamp := time.Now()
			datestr := timestamp.String()
			dates := strings.Split(datestr, " ")
			newfilename := filename + "_" + dates[0] + "_" + dates[1] + ".pdf"
			os.Rename(inbox+"/"+f.Name(), inbox+"/"+newfilename)
			formattedName := strings.Replace(newfilename, " ", "\\ ", -1)

			// ExtractPdfDataCibilReport(process, process, f.Name(), reporttype, xmlfilename, inbox, success, failed, webapps)

			if reporttype == "Individual" {
				reportobj := ExtractIndividualCibilReport(process, xmlfilename)
				if reportobj.CibilScore == 0 {
					MoveFile(inbox+"/"+formattedName, failed)
					os.RemoveAll(PathFrom + "/" + XmlName)
				} else {
					customer := strings.Split(reportobj.ConsumersInfos.ConsumerName, " ")
					res := []tk.M{}
					filter := []*dbox.Filter{}
					isMatch := false
					customerid := 0
					dealno := ""

					for _, splited := range customer {
						if len(splited) > 2 {
							filter = append(filter, dbox.Contains("detailofpromoters.biodata.Name", splited))
						}
					}

					cursor, err := conn.NewQuery().Select().From("CustomerProfile").Where(filter...).Cursor(nil)
					if err != nil {
						tk.Println(err.Error())
					}
					err = cursor.Fetch(&res, 0, false)
					defer cursor.Close()

					if len(res) > 0 {
						for _, val := range res {
							customername := val.Get("detailofpromoters").(tk.M)["biodata"]
							bio := customername.([]interface{})
							app := val.Get("applicantdetail").(tk.M)
							customerid = app.GetInt("CustomerID")
							dealno = val["applicantdetail"].(tk.M)["DealNo"].(string)

							for _, vals := range bio {
								data := vals.(tk.M)
								setting := NewSimilaritySetting()
								setting.SplitDelimeters = []rune{' ', '.', '-'}
								similar := Similarity(reportobj.ConsumersInfos.ConsumerName, data.GetString("Name"), setting)
								dob, isdate := data.Get("DateOfBirth").(time.Time)

								if isdate {
									if similar >= 50 && reportobj.ConsumersInfos.DateOfBirth == dob.UTC() {
										isMatch = true
									}
								} else {
									if similar >= 50 && reportobj.IncomeTaxIdNumber == data.GetString("PAN") {
										isMatch = true
									}
								}
							}
						}
					}

					if isMatch {
						filter := []*dbox.Filter{}
						filter = append(filter, dbox.Eq("ConsumerInfo.ConsumerName", reportobj.ConsumersInfos.ConsumerName))
						filter = append(filter, dbox.Eq("ConsumerInfo.CustomerId", customerid))
						filter = append(filter, dbox.Eq("ConsumerInfo.DealNo", dealno))
						cursor, err = conn.NewQuery().Select().From("CibilReportPromotorFinal").Where(filter...).Cursor(nil)
						if err != nil {
							tk.Println(err.Error())
						}
						result := []tk.M{}

						err = cursor.Fetch(&result, 0, false)

						if len(result) == 0 {
							reportobj.Id = bson.NewObjectId()
							reportobj.ConsumersInfos.CustomerId = customerid
							reportobj.ConsumersInfos.DealNo = dealno
							reportobj.FilePath = PathFrom + "/" + ReportType + "/" + Name + "/" + FName
							reportobj.FileName = FName
							reportobj.Status = 0
							reportobj.IsMatch = isMatch
							query := conn.NewQuery().From("CibilReportPromotorFinal").Save()
							err = query.Exec(tk.M{
								"data": reportobj,
							})
							if err != nil {
								tk.Println(err.Error())
							}
							query.Close()
							MoveFile(inbox+"/"+formattedName, success)
							//CopyFile(inbox+"/"+formattedName, webapps)
						} else {
							for _, existdata := range result {
								if existdata.GetInt("Status") != 1 {
									datereport := existdata.Get("DateOfReport").(time.Time)
									timereport := existdata.Get("TimeOfReport").(time.Time)
									if datereport.Before(reportobj.DateOfReport) || datereport == reportobj.DateOfReport && timereport.Before(reportobj.TimeOfReport) {
										wh := []*dbox.Filter{}
										ids := existdata.Get("_id").(bson.ObjectId)
										wh = append(wh, dbox.Eq("_id", ids))
										err = conn.NewQuery().From("CibilReportPromotorFinal").Delete().Where(filter...).Exec(nil)
										if err != nil {
											tk.Println(err.Error())
										}

										reportobj.Id = bson.NewObjectId()
										reportobj.ConsumersInfos.CustomerId = customerid
										reportobj.ConsumersInfos.DealNo = dealno
										reportobj.FilePath = PathFrom + "/" + ReportType + "/" + Name + "/" + FName
										reportobj.FileName = FName
										reportobj.Status = 0
										reportobj.IsMatch = isMatch
										query := conn.NewQuery().From("CibilReportPromotorFinal").Save()
										err = query.Exec(tk.M{
											"data": reportobj,
										})
										if err != nil {
											tk.Println(err.Error())
										}
										query.Close()

										MoveFile(inbox+"/"+formattedName, success)
										//CopyFile(inbox+"/"+formattedName, webapps)
									}
								}
							}
						}
					} else {
						filter := []*dbox.Filter{}
						filter = append(filter, dbox.Eq("ConsumerInfo.ConsumerName", reportobj.ConsumersInfos.ConsumerName))
						cursor, err = conn.NewQuery().Select().From("CibilReportPromotorFinal").Where(filter...).Cursor(nil)
						if err != nil {
							tk.Println(err.Error())
						}
						result := []tk.M{}

						err = cursor.Fetch(&result, 0, false)

						if len(result) == 0 {
							reportobj.Id = bson.NewObjectId()
							reportobj.FilePath = PathFrom + "/" + ReportType + "/" + Name + "/" + FName
							reportobj.FileName = FName
							reportobj.Status = 0
							reportobj.IsMatch = isMatch
							query := conn.NewQuery().From("CibilReportPromotorFinal").Save()
							err = query.Exec(tk.M{
								"data": reportobj,
							})
							if err != nil {
								tk.Println(err.Error())
							}
							query.Close()

							MoveFile(inbox+"/"+formattedName, success)
							//CopyFile(inbox+"/"+formattedName, webapps)
						} else {
							for _, existdata := range result {
								if existdata.GetInt("Status") != 1 {
									datereport := existdata.Get("DateOfReport").(time.Time).UTC()
									timereport := existdata.Get("TimeOfReport").(time.Time).UTC()
									if datereport.Before(reportobj.DateOfReport.UTC()) || datereport == reportobj.DateOfReport.UTC() && timereport.Before(reportobj.TimeOfReport.UTC()) {
										wh := []*dbox.Filter{}
										ids := existdata.Get("_id").(bson.ObjectId)
										wh = append(wh, dbox.Eq("_id", ids))
										err = conn.NewQuery().From("CibilReportPromotorFinal").Delete().Where(filter...).Exec(nil)
										if err != nil {
											tk.Println(err.Error())
										}

										reportobj.Id = bson.NewObjectId()
										reportobj.FilePath = PathFrom + "/" + ReportType + "/" + Name + "/" + FName
										reportobj.FileName = FName
										reportobj.Status = 0
										reportobj.IsMatch = isMatch
										query := conn.NewQuery().From("CibilReportPromotorFinal").Save()
										err = query.Exec(tk.M{
											"data": reportobj,
										})
										if err != nil {
											tk.Println(err.Error())
										}
										query.Close()

										MoveFile(inbox+"/"+formattedName, success)
										//CopyFile(inbox+"/"+formattedName, webapps)
									}
								}
							}
						}
					}
				}
			}

		}
	}

}

func DeleteFile(ext string, folder string) {
	procinbox, _ := ioutil.ReadDir(folder)
	for _, files := range procinbox {
		if filepath.Ext(files.Name()) == ext {
			os.RemoveAll(folder + "/" + files.Name())
		}
	}
}
