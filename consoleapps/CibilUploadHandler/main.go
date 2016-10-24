package main

import (
	. "eaciit/x10/consoleapps/CibilUploadHandler/helpers"
)

func main() {
	config := ReadConfig()

	PathProcessCompany := config["processcompany"]
	PathFailedCompany := config["failedcompany"]
	PathSuccessCompany := config["successcompany"]
	PathInboxCompany := config["inboxcompany"]
	// PathProcessIndividual := config["processindividual"]
	// PathFailedIndividual := config["failedindividual"]
	// PathSuccessIndividual := config["successindividual"]
	// PathInboxIndividual := config["inboxindividual"]

	ProcessInbox(PathInboxCompany, PathProcessCompany)
	ProcessFile(PathProcessCompany, PathSuccessCompany, PathFailedCompany, "Company")
	// ProcessInbox(PathInboxIndividual, PathProcessIndividual)
	// ProcessFile(PathProcessIndividual, PathSuccessIndividual, PathFailedIndividual, "Individual")

}
