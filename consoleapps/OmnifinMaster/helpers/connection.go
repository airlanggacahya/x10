package helpers

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/mongo"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
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

func GetHttpContentString(url string) (data string, err error) {
	body := `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.omnifin.a3spl.com/">
				<soapenv:Header/>
				   <soapenv:Body>
				      <web:fetchcountryMaster>
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
				</soapenv:Envelope>`
	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte(body)))

	req.Header.Set("Content-Type", "text/xml; charset=utf-8")
	req.Header.Set("Authorization", "Basic Og==")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	data = string(b)

	return
}
