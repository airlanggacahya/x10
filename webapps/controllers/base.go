package controllers

import (
	. "eaciit/x10/webapps/connection"
	_ "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"

	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
)

type IBaseController interface {
}
type BaseController struct {
	base       IBaseController
	Ctx        *orm.DataContext
	UploadPath string
	PdfPath    string
	LogoFile   string
	DocPath    string
	DbHost     string
	DbUsername string
	DbPassword string
	DbName     string
	BasePath   string
}

type PageInfo struct {
	PageTitle    string
	SelectedMenu string
	Breadcrumbs  map[string]string
}

type ResultInfo struct {
	IsError bool
	Message string
	Data    interface{}
}

type Previlege struct {
	View         bool
	Create       bool
	Edit         bool
	Delete       bool
	Approve      bool
	Process      bool
	Menuid       string
	Menuname     string
	Username     string
	TopMenu      string
	Grant        map[string]bool
	Rolename     interface{}
	Fullname     interface{}
	CustomerList []tk.M
}

func (c *BaseController) NewPrevilege(k *knot.WebContext) Previlege {
	DataAccess := Previlege{}

	DataAccess.CustomerList = c.LoadCustomerList(k)

	accessList := c.LoadBase(k)
	for _, o := range accessList {
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Username = o["Username"].(string)
		DataAccess.Rolename = o["Rolename"].(string)
		DataAccess.Fullname = o["Fullname"].(string)
		DataAccess.Grant = o["Grant"].(map[string]bool)
		DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

		return DataAccess
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)
	return DataAccess
}

func (b *BaseController) LoadCustomerList(k *knot.WebContext) []tk.M {
	if k.Session("CustomerProfileData") == nil {
		return []tk.M{}
	}

	return k.Session("CustomerProfileData").([]tk.M)
}

func (b *BaseController) LoadBase(k *knot.WebContext) []tk.M {
	k.Config.NoLog = true
	if k.Session("userid") == nil {
		http.Redirect(k.Writer, k.Request, "/login/default", http.StatusTemporaryRedirect)
		return nil
	}
	// b.IsAuthenticate(k)
	access := b.AccessMenu(k)
	return access
}

func (b *BaseController) IsAuthenticate(k *knot.WebContext) {
	if k.Session("userid") == nil {
		b.Redirect(k, "login", "default")
	}
	return
}

func fetchRole(userid string) []SysRolesModel {
	roles := make([]SysRolesModel, 0)
	con, err := GetConnection()
	if err != nil {
		return roles
	}
	defer con.Close()

	cur, err := con.NewQuery().From("MasterUser").
		Where(db.Eq("userid", userid)).
		Cursor(nil)
	if err != nil {
		return roles
	}

	user := NewUser{}
	err = cur.Fetch(&user, 1, true)
	if err != nil {
		return roles
	}

	wh := []*db.Filter{}
	for _, valx := range user.Catrole {
		wh = append(wh, db.Eq("name", valx))
	}

	cur, err = con.NewQuery().
		From("SysRoles").
		Where(db.Or(wh...)).
		Cursor(nil)
	if err != nil {
		return roles
	}
	err = cur.Fetch(&roles, 0, true)
	if err != nil {
		return roles
	}

	return roles
}

func (b *BaseController) AccessMenu(k *knot.WebContext) []tk.M {
	url := k.Request.URL.String()
	if strings.Index(url, "?") > -1 {
		url = url[:strings.Index(url, "?")]
	}

	access := []tk.M{}
	roles := fetchRole(k.Session("username").(string))
	if len(roles) == 0 {
		return access
	}

	// merge all role menu
	accessMenu := []Detailsmenu{}
	for _, r := range roles {
		accessMenu = append(accessMenu, r.Menu...)
	}

	// find matching url
	for _, o := range accessMenu {
		if o.Url == url {
			obj := tk.M{}
			obj.Set("Menuid", o.Menuid)
			obj.Set("Menuname", o.Menuname)
			obj.Set("Username", k.Session("username").(string))
			obj.Set("Rolename", roles[0].Name)
			obj.Set("Fullname", k.Session("fullname").(string))
			obj.Set("Grant", o.Grant)
			access = append(access, obj)
		}
	}

	return access
}

func (b *BaseController) IsLoggedIn(k *knot.WebContext) bool {
	if k.Session("userid") == nil {
		return false
	}
	return true
}
func (b *BaseController) GetCurrentUser(k *knot.WebContext) string {
	if k.Session("userid") == nil {
		return ""
	}
	return k.Session("username").(string)
}
func (b *BaseController) Redirect(k *knot.WebContext, controller string, action string) {
	log.Println("x10 -->> redirecting to " + controller + "/" + action)
	http.Redirect(k.Writer, k.Request, "/"+controller+"/"+action, http.StatusTemporaryRedirect)
}

func (b *BaseController) WriteLog(msg interface{}) {
	log.Printf("%#v\n\r", msg)
	return
}
func (b *BaseController) SetResultInfo(isError bool, msg string, data interface{}) ResultInfo {
	r := ResultInfo{}
	r.IsError = isError
	r.Message = msg
	r.Data = data
	return r
}

func (b *BaseController) ErrorResultInfo(msg string, data interface{}) ResultInfo {
	r := ResultInfo{}
	r.IsError = true
	r.Message = msg
	r.Data = data
	return r
}
func (b *BaseController) ErrorMessageOnly(msg string) ResultInfo {
	r := ResultInfo{}
	r.IsError = true
	r.Message = msg
	r.Data = nil
	return r
}

func (b *BaseController) Round(f float64) float64 {
	return math.Floor(f + .5)
}
func (b *BaseController) RoundPlus(f float64, places int) float64 {
	shift := math.Pow(10, float64(places))
	return b.Round(f*shift) / shift
}

//val is float value, roundon is what value must go up e.g: .6 will convert 1.23457 to 1.2346, places: how many digits do you want at the backyard :)s
func (b *BaseController) Round64Set(val float64, roundOn float64, places int) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * val
	_, div := math.Modf(digit)
	_div := math.Copysign(div, val)
	_roundOn := math.Copysign(roundOn, val)
	if _div >= _roundOn {
		round = math.Ceil(digit)
	} else {
		round = math.Floor(digit)
	}
	newVal = round / pow
	return
}
func (b *BaseController) FirstMonday(year int, mn int) int {
	month := time.Month(mn)
	t := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)

	d0 := (8-int(t.Weekday()))%7 + 1
	s := strconv.Itoa(year) + fmt.Sprintf("%02d", mn) + fmt.Sprintf("%02d", d0)
	ret, _ := strconv.Atoi(s)
	return ret
}

func (b *BaseController) FirstWorkDay(ym string) int {
	t, err := time.Parse("2006-01-02", ym+"-01")
	if err != nil {
		fmt.Println(err.Error())
	}
	for t.Weekday() == 0 || t.Weekday() == 6 {
		if t.Weekday() == 0 {
			t = t.AddDate(0, 0, 1)
		} else if t.Weekday() == 6 {
			t = t.AddDate(0, 0, 2)
		}
	}
	ret, _ := strconv.Atoi(t.Format("20060102"))
	return ret
}

func (b *BaseController) GetNextIdSeq(collName string) (int, error) {
	ret := 0
	mdl := NewSequenceModel()
	crs, err := b.Ctx.Find(NewSequenceModel(), tk.M{}.Set("where", db.Eq("collname", collName)))
	if err != nil {
		return -9999, err
	}
	defer crs.Close()
	err = crs.Fetch(mdl, 1, false)
	if err != nil {
		return -9999, err
	}
	ret = mdl.Lastnumber + 1
	mdl.Lastnumber = ret
	b.Ctx.Save(mdl)
	return ret, nil
}

func (b *BaseController) GetDateList(ym string) []string {
	ret := make([]string, 0)
	tmp, _ := time.Parse("2006-01", ym)
	year, month, _ := tmp.Date()
	t := time.Date(year, month+1, 0, 0, 0, 0, 0, time.UTC)
	for d := 1; d <= t.Day(); d++ {
		day := tk.Sprintf("%02d", d)
		ret = append(ret, ym+"-"+day)
	}
	return ret
}

func (b *BaseController) InsertActivityLog(pageName string, pageActivity string, k *knot.WebContext) {
	username := k.Session("username").(string)
	sUrl := k.Request.URL.String()
	tk.Println("URL-BASE: ", sUrl)
	sUrl = sUrl[:strings.Index(sUrl, "/")]
	ipaddress := k.Request.RemoteAddr
	mdl := NewActivityLogModel()
	mdl.Username = username
	mdl.IpAddress = ipaddress[:strings.Index(ipaddress, ":")]
	mdl.PageName = pageName
	mdl.PageUrl = sUrl
	mdl.Activity = pageActivity
	mdl.AccessTime = time.Now()
	mdl.AccessDate, _ = strconv.Atoi(time.Now().Format("20060102"))
	b.Ctx.Save(mdl)
	return
}

func (b *BaseController) GetTopMenuName(menuname string) string {
	res := []tk.M{}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		tk.Println(err.Error())
	}

	csr, err := conn.NewQuery().Select().From("TopMenu").Where(db.Eq("Title", menuname)).Cursor(nil)
	if err != nil {
		tk.Println(err.Error())
	}
	err = csr.Fetch(&res, 0, false)
	defer csr.Close()
	parentId := ""

	for _, val := range res {
		parentId = val.GetString("Parent")
	}

	csr, err = conn.NewQuery().Select().From("TopMenu").Where(db.Eq("_id", parentId)).Cursor(nil)
	if err != nil {
		tk.Println(err.Error())
	}
	res2 := []tk.M{}
	err = csr.Fetch(&res2, 0, false)
	defer csr.Close()
	Title := ""
	for _, val := range res2 {
		Title = val.GetString("Title")
	}

	return Title
}
