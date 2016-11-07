package helpers

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func ConvertPdfToXml(PathFrom string, PathTo string, FName string) {
	// Name := strings.TrimRight(FName, ".pdf")
	// FileName := PathFrom + "/" + FName
	// ResultName := PathTo + "/" + Name + "/" + Name + ".xml"

	// formattedName := strings.Replace(FileName, " ", "\\ ", -1)
	// formattedResultName := strings.Replace(ResultName, " ", "\\ ", -1)

	// os.MkdirAll(PathTo+"/"+Name, 0700)
	// fmt.Printf("Converting %#v....\n", FName)

	// cmdstr := []string{"pdftohtml", "-xml", formattedName, formattedResultName}
	// cmdstrfinal := strings.Join(cmdstr, " ")

	// args := []string{"pdftohtml", "-xml", formattedName, formattedResultName}
	// args0 := strings.Join(args, " ")

	// cmd, err := exec.Command("sh", "-c", args0).Output()
	// time.Sleep(1 * time.Minute)
	// if err != nil {
	// 	tk.Println(err.Error())
	// } else {
	// 	tk.Println("Result: " + string(cmd))
	// }

	//args := []string{"-c", }
	//fmt.Println(cmdstrfinal)
	// if err := exec.Command("bin/ls", cmdstr...).Run(); err != nil {
	// 	fmt.Printf("Error: %#v\n", err.Error())
	// } else {
	// 	fmt.Printf("Converting %#v Success\n", FName)
	// }

	// cmd, err := exec.Command("/bin/sh", "-c", cmdstrfinal).Output()
	// time.Sleep(1 * time.Minute)
	// var out bytes.Buffer
	// var stderr bytes.Buffer
	// cmd.Stdout = &out
	// cmd.Stderr = &stderr
	// err := cmd.Run()
	// if err != nil {
	// 	fmt.Println(err.Error())
	// }
	// fmt.Println("Result: " + string(cmd))

	Name := strings.TrimRight(FName, ".pdf")
	FileName := PathFrom + "/" + FName
	//ResultName := PathTo + "/" + Name + "/" + Name + ".xml"

	//formattedName := strings.Replace(FileName, " ", "\\ ", -1)
	//formattedResultName := strings.Replace(ResultName, " ", "\\ ", -1)

	os.MkdirAll(PathTo+"/"+Name, 0777)
	fmt.Printf("Converting %#v....\n", FName)

	cmdStr := []string{"-xml", FileName}
	//finalcmd := strings.Join(cmdStr, " ")
	fmt.Println(cmdStr)
	if err := exec.Command("rm", "/data/goapp/src/eaciit/x10/consoleapps/CibilUploadHandler/repository/Process/Company/ARMEE INFOTEC-Partners.pdf").Run(); err != nil {
		fmt.Printf("Error: %#v\n", err.Error())
	} else {
		fmt.Println("success")
	}
}
