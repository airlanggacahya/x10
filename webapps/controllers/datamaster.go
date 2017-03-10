package controllers

import (
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type DatamasterController struct {
	*BaseController
}

func (c *DatamasterController) Default(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	return ""
}

func (d *DatamasterController) GetRoles(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("name").From("SysRoles").Order("name").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}
