package main

import (
	"bufio"
	"fmt"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/mongo"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/gomail.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"
)

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

func GetConnection() (dbox.IConnection, error) {

	c := ReadConfig()
	ci := &dbox.ConnectionInfo{c["host"], c["database"], c["username"], c["password"], nil}
	conn, e := dbox.NewConnection("mongo", ci)

	e = conn.Connect()
	if e != nil {
		return nil, e
	}

	return conn, nil
}

func GetContentString(url string) (string, error) {
	r, e := http.Get(url)
	defer r.Body.Close()
	if e != nil {
		return "", e
	}

	x, e := ioutil.ReadAll(r.Body)
	if e != nil {
		return "", e
	}

	return string(x), e
}

func SendMail(em string, logID string) {
	conf := gomail.NewDialer("smtp.office365.com", 587, "admin.support@eaciit.com", "B920Support")
	s, err := conf.Dial()
	if err != nil {
		panic(err)
	}
	mailsubj := tk.Sprintf("%v", "[noreply] CAT XML Error Reminder")
	mailmsg := tk.Sprintf("%v", "XML receiver has some error.</br>Error Message : "+em+".</br> Log ID : "+logID)
	m := gomail.NewMessage()

	m.SetHeader("From", "admin.support@eaciit.com")
	m.SetHeader("To", "reza.saputra@eaciit.com")
	m.SetHeader("Subject", mailsubj)
	m.SetBody("text/html", mailmsg)

	if err := gomail.Send(s, m); err != nil {
		fmt.Println(err.Error(), "-----------ERROR")
	} else {
		fmt.Println("Successfully Send Mails")
	}
	m.Reset()
}

func CreateLog(LogData tk.M) error {
	conn, err := GetConnection()

	defer conn.Close()
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	qinsert := conn.NewQuery().
		From("OmnifinMasterLog").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": LogData}
	err = qinsert.Exec(csc)
	if err != nil {
		fmt.Print(err.Error())
		return err
	}

	if LogData.Get("error") != nil {
		SendMail(LogData.GetString("error"), LogData.GetString("_id"))
	}

	return nil
}

func main() {
	log := tk.M{}
	log.Set("_id", bson.NewObjectId())
	log.Set("createddate", time.Now().UTC())
	log.Set("error", nil)
	log.Set("xmlstring", "")
	log.Set("iscomplete", false)
	CreateLog(log)

	xmlString, err := GetContentString("http://103.251.60.132:8085/OmniFinServices/leadOperationsWS?wsdl")
	if err != nil {
		log.Set("error", err)
	}

	log.Set("xmlstring", xmlString)
	log.Set("iscomplete", err == nil)
	CreateLog(log)
}
