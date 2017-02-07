package main

import "eaciit/x10/consoleapps/OmnifinMaster/core"

func main() {
	// we move main code to core
	// because this code is loaded from webapps controller
	core.DoMain()
}
