package x10test

import (
	//"os"
	"os/exec"
	"strings"
	"testing"
	"fmt"
)

func TestConvertPDFtoXML (t *testing.T){
	FileName := "ARMEE INFOTECH-Partners.pdf"
	ResultName := "ARMEE INFOTECH-Partners.xml"

	formattedName := strings.Replace(FileName, " ", "\\ ", -1)
	formattedResultName := strings.Replace(ResultName, " ", "\\ ", -1)

	//os.MkdirAll("repository/ARMEE INFOTECH-Partners", 0700)
	fmt.Printf("Converting %#v....\n", "ARMEE INFOTECH-Partners.pdf")

	cmdStr := []string{"pdftohtml", "-xml", formattedName, formattedResultName}
	finalcmd := strings.Join(cmdStr, " ")
	fmt.Println(finalcmd)
	if err := exec.Command("/bin/sh", "-c", finalcmd).Run(); err != nil {
		t.Errorf("Error: %#v\n", err.Error())
	} else {
		fmt.Println("Converting Success")
	}
}