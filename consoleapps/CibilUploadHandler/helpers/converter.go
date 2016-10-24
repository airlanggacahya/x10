package helpers

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func ConvertPdfToXml(PathFrom string, PathTo string, FName string) {
	Name := strings.TrimRight(FName, ".pdf")
	FileName := PathFrom + "\\" + FName
	ResultName := PathTo + "\\" + Name + "\\" + Name

	os.MkdirAll(PathTo+"\\"+Name, 0)
	fmt.Printf("Converting %#v....\n", FName)
	args := []string{"/C", "pdftohtml", "-xml", FileName, ResultName}
	if err := exec.Command("cmd", args...).Run(); err != nil {
		fmt.Printf("Error: %#v\n", err)
	} else {
		//fmt.Printf("Converting %#v Success\n", FName)
	}
}
