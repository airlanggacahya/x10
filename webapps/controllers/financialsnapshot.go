package controllers

import (
	// . "eaciit/x10/webapps/connection"
	// . "eaciit/x10/webapps/helper"
	// . "eaciit/x10/webapps/models"
	// //"errors"
	// "strconv"

	// // "fmt"
	// "time"

	// "github.com/eaciit/cast"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	// tk "github.com/eaciit/toolkit"
	// "gopkg.in/mgo.v2/bson"
)

type FinancialSnapshotController struct {
	*BaseController
}

func (c *FinancialSnapshotController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"shared/loading.html",
		"financialsnapshot/kiri.html",
		"financialsnapshot/kanan.html",
	}

	return DataAccess
}
