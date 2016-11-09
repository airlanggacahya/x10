package helpers

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func ConvertPdfToXml(PathFrom string, PathTo string, FName string) {

	Name := strings.TrimRight(FName, ".pdf")

	os.MkdirAll(PathTo+"/"+Name, 0700)
	fmt.Printf("Converting %#v....\n", FName)

	FileName := PathFrom + "/" + FName
	ResultName := PathTo + "/" + Name + "/" + Name + ".xml"

	formattedName := strings.Replace(FileName, " ", "\\ ", -1)
	formattedResultName := strings.Replace(ResultName, " ", "\\ ", -1)

	if _, err := os.Stat(FileName); err == nil {
		cmdStr := []string{"pdftohtml", "-xml", formattedName, formattedResultName}
		finalcmd := strings.Join(cmdStr, " ")
		fmt.Println(finalcmd)
		if err := exec.Command("/bin/sh", "-c", finalcmd).Run(); err != nil {
			fmt.Printf("Error: %#v\n", err.Error())
		} else {
			fmt.Println("Converting Success")
		}
	} else {
		fmt.Println("File Doesn't Exist")
	}

}
