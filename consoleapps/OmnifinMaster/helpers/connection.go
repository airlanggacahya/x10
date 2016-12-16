package helpers

import (
	"bufio"
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

func GetHttpContentString(url string) (string, error) {
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
