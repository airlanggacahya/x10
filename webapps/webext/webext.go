package webext

import (
	"bufio"
	. "eaciit/x10/webapps/controllers"
	"log"
	"os"
	"strings"

	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/mongo"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/orm"
	"github.com/eaciit/toolkit"
)

var (
	wd = func() string {
		d, _ := os.Getwd()
		return d + "/"
	}()
)
var HdrCtx *orm.DataContext

func init() {
	cfg := ReadConfig()

	conn, err := PrepareConnection()
	if err != nil {
		log.Println(err)
	}
	//	uploadPath := PrepareUploadPath()
	//	pdfPath := PreparePDFPath()
	//	logoFile := PrepareLogoFile()
	ctx := orm.New(conn)
	baseCtrl := new(BaseController)
	baseCtrl.Ctx = ctx
	HdrCtx = ctx
	//	baseCtrl.UploadPath = uploadPath
	baseCtrl.UploadPath = cfg["uploadPath"]
	//	baseCtrl.PdfPath = pdfPath
	baseCtrl.PdfPath = cfg["pdfPath"]
	//	baseCtrl.LogoFile = logoFile
	baseCtrl.LogoFile = cfg["logoFile"]
	//	baseCtrl.DocPath = PrepareDocPath()
	baseCtrl.DocPath = cfg["docPath"]
	baseCtrl.DbHost = cfg["host"]
	baseCtrl.DbName = cfg["database"]
	baseCtrl.DbUsername = cfg["username"]
	baseCtrl.DbPassword = cfg["password"]
	baseCtrl.BasePath = cfg["basePath"]

	app := knot.NewApp("X10-dev")
	app.ViewsPath = wd + "views/"
	app.Register(&LoginController{baseCtrl})
	app.Register(&LogoutController{baseCtrl})
	app.Register(&RtrController{baseCtrl})
	app.Register(&InternalRtrController{baseCtrl})
	app.Register(&DashboardController{baseCtrl})
	app.Register(&DataBrowserController{baseCtrl})
	app.Register(&AccountDetailController{baseCtrl})
	app.Register(&XMLReceiverController{baseCtrl})

	app.Register(&UserSettingController{baseCtrl})
	app.Register(&MenuSettingController{baseCtrl})
	app.Register(&CreditScoreCardController{baseCtrl})

	app.Register(&SysRolesController{baseCtrl})

	app.Register(&ActivityLogController{baseCtrl})
	app.Register(&DatamasterController{baseCtrl})
	app.Register(&DataCapturingController{baseCtrl})
	app.Register(&BankAnalysisController{baseCtrl})
	app.Register(&RatioController{baseCtrl})
	app.Register(&RatingController{baseCtrl})
	app.Register(&AccountDetailController{baseCtrl})
	app.Register(&LoanApprovalController{baseCtrl})
	app.Register(&FormulaGlossaryController{baseCtrl})
	app.Register(&FormsAndReportLogicController{baseCtrl})
	app.Register(&CibilCompanyController{baseCtrl})

	app.Register(&FormulaController{baseCtrl})
	app.Register(&NormMasterController{baseCtrl})
	app.Register(&DueDiligenceController{baseCtrl})
	app.Register(&CreditAnalysisController{baseCtrl})
	app.Register(&FinancialSnapshotController{baseCtrl})
	app.Register(&ApprovalController{baseCtrl})
	app.Register(&StandardController{baseCtrl})
	app.Register(&CibilTransitoryController{baseCtrl})
	app.Register(&UatDocumentsController{baseCtrl})
	app.Register(&CibilCompanyController{baseCtrl})
	app.Register(&MasterSuplierController{baseCtrl})

	app.Static("static", wd+"assets")
	app.LayoutTemplate = "_layout.html"
	knot.RegisterApp(app)
	log.Println("___INIT FINISH_____")
}

func PrepareConnection() (dbox.IConnection, error) {
	config := ReadConfig()

	toolkit.Printfn("%#v", config)
	ci := &dbox.ConnectionInfo{config["host"], config["database"], config["username"], config["password"], nil}
	c, e := dbox.NewConnection("mongo", ci)

	if e != nil {
		return nil, e
	}

	e = c.Connect()
	if e != nil {
		return nil, e
	}

	return c, nil
}

func PrepareUploadPath() string {
	config := ReadConfig()
	return config["uploadPath"]
}

func PrepareDocPath() string {
	config := ReadConfig()
	return config["docPath"]
}

func PreparePDFPath() string {
	config := ReadConfig()
	return config["pdfPath"]
}

func PrepareLogoFile() string {
	config := ReadConfig()
	return config["logoFile"]
}

func ReadConfig() map[string]string {
	ret := make(map[string]string)
	file, err := os.Open(wd + "conf/app.conf")
	if err == nil {
		defer file.Close()

		reader := bufio.NewReader(file)
		for {
			line, _, e := reader.ReadLine()
			if e != nil {
				break
			}

			sval := strings.Split(string(line), "=")
			val := ""
			if len(sval) > 1 {
				val = sval[1]
			}
			ret[sval[0]] = val
		}
	} else {
		log.Println(err.Error())
	}

	return ret
}
