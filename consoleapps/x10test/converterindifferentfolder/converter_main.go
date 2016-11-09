package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func main()  {
    FileName := "/data/goapp/src/eaciit/x10/consoleapps/CibilUploadHandler/repository/Process/Company/ARMEE INFOTECH-Partners.pdf"
	ResultName := "/data/goapp/src/eaciit/x10/consoleapps/CibilUploadHandler/repository/Process/Company/ARMEE INFOTECH-Partners/ARMEE INFOTECH-Partners.xml"

	formattedName := strings.Replace(FileName, " ", "\\ ", -1)
	formattedResultName := strings.Replace(ResultName, " ", "\\ ", -1)

	os.MkdirAll("/data/goapp/src/eaciit/x10/consoleapps/CibilUploadHandler/repository/Process/Company/ARMEE INFOTECH-Partners", 0700)
	fmt.Printf("Converting %#v....\n", "ARMEE INFOTECH-Partners.pdf")

	cmdStr := []string{"pdftohtml", "-xml", formattedName, formattedResultName}
	finalcmd := strings.Join(cmdStr, " ")
	fmt.Println(finalcmd)
	if err := exec.Command("/bin/sh", "-c", finalcmd).Run(); err != nil {
		fmt.Errorf("Error: %#v\n", err.Error())
	} else {
		fmt.Println("Converting Success")
	}
}