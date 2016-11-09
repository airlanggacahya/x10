package main

import (
	"fmt"
	"io/ioutil"
)

func ReaderFile() {
	rawdata, err := ioutil.ReadFile("/data/goapp/src/eaciit/x10/consoleapps/CibilUploadHandler/repository/Process/Company/ARMEE INFOTECH-Partners/ARMEE INFOTECH-Partners.xml")
	if err != nil {
		fmt.Errorf(err.Error())
	}
	fmt.Println(string(rawdata))
}

func main() {
	ReaderFile()
}
