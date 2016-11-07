package helpers

import (
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	tk "github.com/eaciit/toolkit"
)

func MoveFile(From string, To string) {
	args := []string{"mv", From, To}
	args0 := strings.Join(args, " ")

	if err := exec.Command("/bin/sh", "-c", args0).Run(); err != nil {
		tk.Printf("Error: %#v\n", err.Error())
	}
}

func ProcessInbox(PathFrom string, PathTo string) {
	folders, _ := ioutil.ReadDir(PathFrom)

	if len(folders) > 0 {
		for _, files := range folders {
			formattedName := strings.Replace(files.Name(), " ", "\\ ", -1)
			pdffile := PathFrom + "/" + formattedName
			pdffileto := PathTo + "/" + formattedName
			MoveFile(pdffile, pdffileto)
		}
	} else {
		tk.Println("Inbox Empty")
	}

}

func ProcessFile(From string, SuccessPath string, FailedPath string, ReportType string) {
	file, _ := ioutil.ReadDir(From)

	for _, f := range file {
		formattedName := strings.Replace(f.Name(), " ", "\\ ", -1)
		filename := strings.TrimRight(f.Name(), ".pdf")

		if filename == f.Name() {
			if f.IsDir() == false {
				MoveFile(From+"/"+formattedName, FailedPath)
			}
		} else {
			ConvertPdfToXml(From, From, f.Name())

			//ExtractPdfDataCibilReport(From, From, formattedName, ReportType)
			// err := os.RemoveAll(From + "/" + filename)
			// if err != nil {
			// 	tk.Println(err.Error)
			// }
			//MoveFile(From+"/"+formattedName, SuccessPath)
		}

	}
}

func RemoveContents(dir string) error {
	d, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer d.Close()
	names, err := d.Readdirnames(-1)
	if err != nil {
		return err
	}
	for _, name := range names {
		err = os.RemoveAll(filepath.Join(dir, name))
		if err != nil {
			return err
		}
	}
	return nil
}
