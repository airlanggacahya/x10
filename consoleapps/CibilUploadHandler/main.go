package main

import (
	. "eaciit/x10/consoleapps/CibilUploadHandler/helpers"
	"fmt"
	"strings"

	tk "github.com/eaciit/toolkit"
	"github.com/howeyc/fsnotify"
)

func main() {
	config := ReadConfig()

	PathProcessCompany := config["processcompany"]
	PathFailedCompany := config["failedcompany"]
	PathSuccessCompany := config["successcompany"]
	PathInboxCompany := config["inboxcompany"]
	PathProcessIndividual := config["processindividual"]
	PathFailedIndividual := config["failedindividual"]
	PathSuccessIndividual := config["successindividual"]
	PathInboxIndividual := config["inboxindividual"]

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		tk.Println(err.Error())
	}

	watcher2, err2 := fsnotify.NewWatcher()
	if err2 != nil {
		tk.Println(err2.Error())
	}

	done := make(chan bool)

	// Process events
	go func() {
		for {
			select {
			case ev := <-watcher.Event:
				strEV := strings.Split(""+ev.String(), ":")
				action := strings.Trim(strEV[len(strEV)-1], " ")
				if action == "MODIFY" {
					ProcessInbox(PathInboxCompany, PathProcessCompany)
					ProcessFile(PathProcessCompany, PathSuccessCompany, PathFailedCompany, "Company")
				}
			case err := <-watcher.Error:
				tk.Println("error:", err)
			case ev2 := <-watcher2.Event:
				strEV2 := strings.Split(""+ev2.String(), ":")
				action2 := strings.Trim(strEV2[len(strEV2)-1], " ")
				if action2 == "MODIFY" {
					ProcessInbox(PathInboxIndividual, PathProcessIndividual)
					ProcessFile(PathProcessIndividual, PathSuccessIndividual, PathFailedIndividual, "Individual")
				}
			case err2 := <-watcher.Error:
				tk.Println("error:", err2)
			}

		}
	}()

	err = watcher.Watch(PathInboxCompany)
	if err != nil {
		tk.Println(err.Error())
	}

	err2 = watcher2.Watch(PathInboxIndividual)
	if err2 != nil {
		tk.Println(err2.Error())
	}

	fmt.Println("Watcher Started...")

	// Hang so program doesn't exit
	<-done

	/* ... do stuff ... */
	watcher.Close()
}
