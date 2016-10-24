package main

import (
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/json"
	_ "github.com/eaciit/dbox/dbc/mongo"
	_ "github.com/eaciit/dbox/dbc/mysql"
	tk "github.com/eaciit/toolkit"
	"os"
	"path/filepath"
	"runtime"
	"sync"
	"time"
)

var Conf = tk.M{}
var anyChanges = false
var ErrList = []tk.M{}
var ProcessStart = time.Now().UTC()
var muinsert = &sync.Mutex{}

func delayMinute(n time.Duration) {
	time.Sleep(n * time.Minute)
}

func main() {
	tk.Println("--------Syncronizing EACIIT - X10----------")
	runtime.GOMAXPROCS(4)

	GetDBConfig()

	//Mongo Connection
	cMongo, em := GetMongoConnection()
	defer cMongo.Close()
	if em != nil {
		tk.Println(em.Error())
	}

	cust := GenerateDummy()

	qinsert := cMongo.NewQuery().
		From("CustomerScores").
		SetConfig("multiexec", true).
		Insert()
	defer qinsert.Close()
	insdata := map[string]interface{}{"data": cust}
	e := qinsert.Exec(insdata)
	if e != nil {
		tk.Println(e.Error())
	}
}

var config_file = func() string {
	d, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	d += "/conf.json"
	return d
}()

func GetDBConfig() {
	ci := &dbox.ConnectionInfo{config_file, "", "", "", nil}
	conn, e := dbox.NewConnection("json", ci)
	if e != nil {
		tk.Println(e.Error())
		return
	}
	e = conn.Connect()
	defer conn.Close()
	csr, e := conn.NewQuery().Select("*").Cursor(nil)
	if e != nil {
		tk.Println(e.Error())
		return
	}
	defer csr.Close()
	data := []tk.M{}
	e = csr.Fetch(&data, 0, false)
	if e != nil {
		tk.Println(e.Error())
		return
	}
	for _, d := range data {
		Conf = d
	}

	return
}

func GetMongoConnection() (dbox.IConnection, error) {
	ci := &dbox.ConnectionInfo{Conf["mongohost"].(string), Conf["mongodbname"].(string), Conf["mongouser"].(string), Conf["mongopassword"].(string), nil}
	conn, e := dbox.NewConnection("mongo", ci)
	e = conn.Connect()
	if e != nil {
		tk.Println(e.Error())
	}
	return conn, nil
}
