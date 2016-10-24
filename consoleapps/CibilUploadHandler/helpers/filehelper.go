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
	args := []string{"/C", "move", From, To}
	if err := exec.Command("cmd", args...).Run(); err != nil {
		tk.Printf("Error: %#v\n", err)
	}
}

func ProcessInbox(PathFrom string, PathTo string) {
	folders, _ := ioutil.ReadDir(PathFrom)

	if len(folders) > 0 {
		for _, files := range folders {
			pdffile := PathFrom + "\\" + files.Name()
			MoveFile(pdffile, PathTo)
		}
	} else {
		tk.Println("Inbox Empty")
	}

}

func DeleteFolderTemp(PathFolder string) {
	pathfold := `"` + PathFolder + `"`
	args := []string{"/C", `rmdir /s /q ` + pathfold}
	tk.Println(args)
	if err := exec.Command("cmd", args...).Run(); err != nil {
		tk.Printf("Error: %#v\n", err)
	}
}

func ProcessFile(From string, SuccessPath string, FailedPath string, ReportType string) {
	file, _ := ioutil.ReadDir(From)

	for _, f := range file {
		filename := strings.TrimRight(f.Name(), ".pdf")

		if filename == f.Name() {
			if f.IsDir() == false {
				MoveFile(From+"\\"+f.Name(), FailedPath)
			}
		} else {
			ConvertPdfToXml(From, From, f.Name())
			ExtractPdfDataCibilReport(From, From, f.Name(), ReportType)
			//DeleteFolderTemp(From + "\\" + filename)
			err := os.RemoveAll(From + "\\" + filename)
			// err := RemoveContents(From + "\\" + filename)
			if err != nil {
				tk.Println(err.Error)
			}
			MoveFile(From+"\\"+f.Name(), SuccessPath)
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
