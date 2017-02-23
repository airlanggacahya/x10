package controllers

import (
	"github.com/eaciit/knot/knot.v1"
)

type FormulaController struct {
	*BaseController
}

func (c *FormulaController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"shared/loading.html",
	}

	return DataAccess
}

func (c *FormulaController) KeyPolicyNorms(k *knot.WebContext) interface{} {
	return c.Default(k)
}
