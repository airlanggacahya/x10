package helpers

import (
	"gopkg.in/gomail.v2"
)

func SendMail(header string, message string, recipient string) error {
	conf := gomail.NewDialer("smtp.office365.com", 587, "admin.support@eaciit.com", "B920Support")
	s, err := conf.Dial()
	if err != nil {
		return err
	}

	m := gomail.NewMessage()
	m.SetHeader("From", "admin.support@eaciit.com")
	m.SetHeader("To", recipient)
	m.SetHeader("Subject", header)
	m.SetBody("text/html", message)

	err = gomail.Send(s, m)
	m.Reset()

	return err
}
