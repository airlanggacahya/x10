package main

import (
	. "eaciit/x10/consoleapps/UploadHandler/helpers"
	"io/ioutil"
	"log"

	"time"

	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type SysModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id" , json:"_id"`
	Configname    string        `bson:"Configname"`
	Configvalue   interface{}   `bson:"Configvalue"`
}

func main() {
	CheckingFolderChange()
}

func CheckingFolderChange() {
	config := ReadConfig()
	PathFrom := config["PathFrom"]
	//PathTo := config["PathTo"]

	conn, err := PrepareConnection()
	if err != nil {
		log.Println(err)
	}
	defer conn.Close()

	files, _ := ioutil.ReadDir(PathFrom)
	for _, f := range files {
		tk.Println("Checking", f.Name(), "Folder...")
		file, _ := ioutil.ReadDir(PathFrom + "\\" + f.Name())
		if len(file) == 0 {
			conf := SysModel{}
			conf.Id = bson.NewObjectId()
			conf.Configname = f.Name() + "FolderModified"
			conf.Configvalue = f.ModTime()
			query := conn.NewQuery().From("ConfigParam").Save()
			err = query.Exec(tk.M{
				"data": conf,
			})
			if err != nil {
				tk.Println(err.Error())
			}
			query.Close()
		} else {
			foldername := f.Name() + "FolderModified"
			res := []SysModel{}
			csr, err := conn.NewQuery().From("ConfigParam").Where(dbox.Eq("Configname", foldername)).Cursor(nil)
			if err != nil {
				tk.Println(err.Error())
			}
			err = csr.Fetch(&res, 0, false)
			defer csr.Close()

			if len(res) == 0 {
				conf := SysModel{}
				conf.Id = bson.NewObjectId()
				conf.Configname = f.Name() + "FolderModified"
				conf.Configvalue = f.ModTime()
				query := conn.NewQuery().From("ConfigParam").Save()
				err = query.Exec(tk.M{
					"data": conf,
				})
				if err != nil {
					tk.Println(err.Error())
				}
				query.Close()
			} else {
				lastmodified := res[0].Configvalue.(time.Time)
				tk.Println("Last Modified", lastmodified)
				tk.Println("New Date", f.ModTime())

				if lastmodified.Before(f.ModTime()) {
					conf := SysModel{}
					conf.Id = res[0].Id
					conf.Configname = res[0].Configname
					conf.Configvalue = f.ModTime()
					query := conn.NewQuery().From("ConfigParam").Save()
					err = query.Exec(tk.M{
						"data": conf,
					})
					if err != nil {
						tk.Println(err.Error())
					}
					query.Close()
					tk.Println("Folder Modified")
				} else {
					tk.Println("No Changes Folder")
				}
			}
		}
	}
}
