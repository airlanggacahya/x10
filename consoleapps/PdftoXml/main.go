package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
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

func main() {
	config := ReadConfig()
	PathFrom := config["PathFrom"]
	PathTo := config["PathTo"]

	files, _ := ioutil.ReadDir(PathFrom + "\\" + "Company")
	for _, f := range files {
		ConvertPdfToXml(PathFrom, PathTo, f.Name(), "Company")
	}

	filess, _ := ioutil.ReadDir(PathFrom + "\\" + "Promotor")
	for _, f := range filess {
		ConvertPdfToXml(PathFrom, PathTo, f.Name(), "Promotor")
	}
}

func ConvertPdfToXml(PathFrom string, PathTo string, FName string, CompanyType string) {
	Name := strings.TrimRight(FName, ".pdf")
	FileName := PathFrom + "\\" + CompanyType + "\\" + FName
	ResultName := PathTo + "\\" + CompanyType + "\\" + Name + "\\" + Name

	os.MkdirAll(PathTo+"\\"+CompanyType+"\\"+Name, 0)
	args := []string{"/C", "pdftohtml", "-xml", FileName, ResultName}
	if err := exec.Command("cmd", args...).Run(); err != nil {
		fmt.Printf("Error: %#v\n", err)
	} else {
		fmt.Println("Convert Success")
	}
}
