package helper

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"strconv"

	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
)

var (
	DebugMode bool
)

var config_system = func() string {
	d, _ := os.Getwd()
	d += "/conf/confsystem.json"
	return d
}()

func GetPathConfig() (result map[string]interface{}) {
	result = make(map[string]interface{})

	ci := &dbox.ConnectionInfo{config_system, "", "", "", nil}
	conn, e := dbox.NewConnection("json", ci)
	if e != nil {
		return
	}

	e = conn.Connect()
	defer conn.Close()
	csr, e := conn.NewQuery().Select("*").Cursor(nil)
	if e != nil {
		return
	}
	defer csr.Close()
	data := []toolkit.M{}
	e = csr.Fetch(&data, 0, false)
	if e != nil {
		return
	}
	result["folder-path"] = data[0].GetString("folder-path")
	result["restore-path"] = data[0].GetString("restore-path")
	result["folder-img"] = data[0].GetString("folder-img")
	return
}

func CreateResult(success bool, data interface{}, message string) map[string]interface{} {
	if !success {
		fmt.Println("ERROR! ", message)
		if DebugMode {
			panic(message)
		}
	}

	return map[string]interface{}{
		"data":    data,
		"success": success,
		"message": message,
	}
}

func UploadHandler(r *knot.WebContext, filename, dstpath string, newnamefile string) (error, string) {
	file, handler, err := r.Request.FormFile(filename)
	if err != nil {
		return err, ""
	}
	defer file.Close()

	dstSource := dstpath + toolkit.PathSeparator + newnamefile
	fmt.Println(dstSource)
	f, err := os.OpenFile(dstSource, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return err, ""
	}
	defer f.Close()
	io.Copy(f, file)

	return nil, handler.Filename
}

func GetMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

func Ordinal(x int) string {
	suffix := "th"
	switch x % 10 {
	case 1:
		if x%100 != 11 {
			suffix = "st"
		}
	case 2:
		if x%100 != 12 {
			suffix = "nd"
		}
	case 3:
		if x%100 != 13 {
			suffix = "rd"
		}
	}
	return strconv.Itoa(x) + suffix
}
