package controllers

import (
	. "eaciit/x10/webapps/models"

	db "github.com/eaciit/dbox"
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

func (c *DatamasterController) Accounts(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Account", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) CommissionGroup(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Commission Group", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) CommissionGroupFees(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Commission Group Fees", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Clients(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Client", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Contracts(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"datamaster/contracts-groupfees.html", "datamaster/contracts-contractexpiry.html"}
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Contract", "VIEW", k)

	return DataAccess
}

func (c *DatamasterController) Currencies(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Currencies", "VIEW", k)

	return DataAccess
}

func (c *DatamasterController) UpdAccounts(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-UPD Account", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) UpdContracts(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-UPD Contract", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) EntryManualSp(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	return ""
}

func (c *DatamasterController) Clearers(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Clearer", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) FxRates(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-FX Rates", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) AccountsFees(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Account Fee", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Exchange(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Exchange", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) UpdExchange(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-UPD Exchange", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) FlatFileCutOff(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Flat File Cut Off", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) ClientsGroup(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Client Group", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Titles(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Title", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Countries(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Country", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Companies(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	c.InsertActivityLog("Master-Companies", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) ReceiptPaymentType(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Payment Receipt Type", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) ContractExpiry(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Contract Expiry", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Clients_v2(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"datamaster/clients-account.html", "datamaster/clients-mapping.html", "datamaster/clients-reporting.html", "datamaster/clients-commfees.html", "datamaster/clients-document.html", "datamaster/clients-deal.html", "datamaster/clients-other.html"}
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Clients", "VIEW", k)
	return DataAccess
}

func (c *DatamasterController) Email(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Email", "VIEW", k)

	return DataAccess
}

func (c *DatamasterController) ContractGroup(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}
	c.InsertActivityLog("Master-Contract Group", "VIEW", k)
	return DataAccess
}

func (d *DatamasterController) GetClient(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id").From("Clients").Order("_id").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetClearer(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	oo := struct {
		Id int
	}{}
	err := r.GetPayload(&oo)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	query := d.Ctx.Connection.NewQuery()

	if oo.Id != 0 {
		query.Where(db.And(db.Eq("_id", oo.Id)))
	}

	result := []tk.M{}
	csr, e := query.
		Select("_id", "clearername").From("Clearers").Order("clearername").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetCurrency(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "currency_code").From("Currencies").Order("currency_code").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetContract(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "contract_code", "fullname").From("Contracts").Order("contract_code").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetAccount(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "clearer").From("Accounts").Order("_id").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetCommissionGroup(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "name").From("CommisionGroup").Order("name").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetCompany(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "companyname").From("Companies").Order("companyname").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetDivisor(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	oo := struct {
		ContractMap string
		FileType    string
	}{}
	err := r.GetPayload(&oo)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}
	result := tk.M{}
	divisor := 0.00

	query5 := tk.M{}.Set("where", db.And(db.Eq("contract_map", oo.ContractMap), db.Eq("filetype", oo.FileType)))
	query5.Set("limit", 1)
	data5 := make([]UpdContractModel, 0)
	cursor5, err5 := d.Ctx.Find(new(UpdContractModel), query5)
	if err5 != nil {
		tk.Println(err5.Error())
	}
	err5 = cursor5.Fetch(&data5, 0, false)
	if err5 != nil {
		tk.Println(err5.Error())
	}
	defer cursor5.Close()
	for _, i := range data5 {
		divisor = i.Upd_divisor
	}

	if divisor == 0 {
		query3 := tk.M{}
		query3.Set("where", db.Eq("contract_map", oo.ContractMap))
		query3.Set("limit", 1)
		data3 := make([]ContractModel, 0)
		cursor3, err3 := d.Ctx.Find(new(ContractModel), query3)
		if err3 != nil {
			tk.Println(err3.Error())
		}
		err3 = cursor3.Fetch(&data3, 0, false)
		if err3 != nil {
			tk.Println(err3.Error())
		}
		defer cursor3.Close()

		for _, i3 := range data3 {
			divisor = i3.Divisor
		}
	}

	result.Set("divisor", divisor)

	return result
}

func (d *DatamasterController) GetCountry(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("countriesisocode3", "countriesname").From("Countries").Order("countriesname").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetExchange(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("exchangename", "exchangedescription").From("Exchange").Order("exchangename").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetGroupClient(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "name").From("ClientGroups").Order("name").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetTitles(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("_id", "title").From("Titles").Order("title").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}

func (d *DatamasterController) GetAccountAll(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("acc_no_map", "acc_no_map").From("Accounts").Order("acc_no_map").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
}
func (c *DatamasterController) GetContractAll(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	data := make([]ContractModel, 0)
	crs, err := c.Ctx.Find(NewContractModel(), tk.M{}.Set("order", []string{"fullname"}))
	if err != nil {
		return c.ErrorResultInfo(err.Error(), nil)
	}
	defer crs.Close()
	err = crs.Fetch(&data, 0, false)
	ret.Data = data
	ret.IsError = false

	return ret
}

func (c *DatamasterController) GetClientFirstName(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	type StructRet struct {
		FirstName string
	}
	pipe := []tk.M{
		tk.M{}.Set("$group", tk.M{}.Set("_id", tk.M{}.Set("fname", "$fname")).
			Set("Count", tk.M{}.Set("$sum", 1))),
		tk.M{}.Set("$sort", tk.M{}.Set("_id.fname", 1))}
	crs, err := c.Ctx.Connection.NewQuery().Command("pipe", pipe).From("Clients").Cursor(nil)
	if err != nil {
		return ret
	}
	ds := []tk.M{}
	defer crs.Close()
	err = crs.Fetch(&ds, 0, false)
	if err != nil {
		return ret
	}
	data := make([]StructRet, 0)
	for _, _dt := range ds {
		tmp := _dt["_id"].(tk.M)
		dt := StructRet{
			FirstName: tmp["fname"].(string),
		}
		data = append(data, dt)
	}
	ret.Data = data

	return ret
}

func (c *DatamasterController) GetClientLastName(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	type StructRet struct {
		LastName string
	}
	pipe := []tk.M{
		tk.M{}.Set("$group", tk.M{}.Set("_id", tk.M{}.Set("lname", "$lname")).
			Set("Count", tk.M{}.Set("$sum", 1))),
		tk.M{}.Set("$sort", tk.M{}.Set("_id.lname", 1))}
	crs, err := c.Ctx.Connection.NewQuery().Command("pipe", pipe).From("Clients").Cursor(nil)
	if err != nil {
		return ret
	}
	ds := []tk.M{}
	defer crs.Close()
	err = crs.Fetch(&ds, 0, false)
	if err != nil {
		return ret
	}
	data := make([]StructRet, 0)
	for _, _dt := range ds {
		tmp := _dt["_id"].(tk.M)
		dt := StructRet{
			LastName: tmp["lname"].(string),
		}
		data = append(data, dt)
	}
	ret.Data = data

	return ret
}

func (d *DatamasterController) GetUsername(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	query := d.Ctx.Connection.NewQuery()
	result := []tk.M{}
	csr, e := query.
		Select("username").From("SysUsers").Order("username").Cursor(nil)
	e = csr.Fetch(&result, 0, false)

	if e != nil {
		return result
	}
	defer csr.Close()

	return result
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
