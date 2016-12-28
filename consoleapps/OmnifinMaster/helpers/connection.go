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

func GetHttpGETContentString(url string) string {
	response, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}

	return string(responseData)
}

func GetHttpPOSTContentString(url string, body string) (data string, err error) {
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
