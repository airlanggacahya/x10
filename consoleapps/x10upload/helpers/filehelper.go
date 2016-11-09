package x10upload

import (
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	tk "github.com/eaciit/toolkit"
)

func MoveFile(From string, To string) {
	args := []string{"mv", From, To}
	args0 := strings.Join(args, " ")

	if err := exec.Command("/bin/sh", "-c", args0).Run(); err != nil {
		tk.Printf("Error: %#v\n", err.Error())
	}
}

func ProcessFile(inbox string, process string, failed string, success string, reporttype string) {

	inboxfolder, _ := ioutil.ReadDir(inbox)
	if len(inboxfolder) > 0 {
		for _, f := range inboxfolder {
			err := ConvertPdfToXml(inbox, process, f.Name())
			if err != nil {
				tk.Println(err.Error())
			}

			DeleteFile(".png", process)
			filename := strings.TrimRight(f.Name(), ".pdf")
			xmlfilename := filename + ".xml"
			ExtractPdfDataCibilReport(process, process, f.Name(), reporttype, xmlfilename)
			time.Sleep(5 * time.Second)
			formattedName := strings.Replace(f.Name(), " ", "\\ ", -1)
			MoveFile(inbox+"/"+formattedName, success)
			os.RemoveAll(process + "/" + xmlfilename)
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
