package models

import (
	"bytes"
	"encoding/json"
	"errors"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"io"
	"strings"
)

type ReturnedXML struct {
	InString    string
	ListTagName string

	GeneratedString struct {
		ListData   []string
		Additional string
	}
}

func NewReturnedXML() *ReturnedXML {
	return &ReturnedXML{}
}

func (x *ReturnedXML) FetchReturnValues() (err error) {
	listOpenertag := tk.Sprintf("<%s>", x.ListTagName)
	listCloserTag := tk.Sprintf("</%s>", x.ListTagName)

	if strings.Contains(x.InString, "<return>") {
		data := strings.Split(strings.Split(x.InString, "<return>")[1], "</return>")[0]

		splittedOpenerXmlString := strings.Split(data, listOpenertag)

		for i, eachString := range splittedOpenerXmlString {
			splittedCloserXmlString := strings.Split(eachString, listCloserTag)

			if i == 0 {
				x.GeneratedString.Additional += eachString
				continue
			} else {
				if len(splittedCloserXmlString) != 1 {
					x.GeneratedString.Additional += splittedCloserXmlString[1]
				}
				x.GeneratedString.ListData = append(x.GeneratedString.ListData, splittedCloserXmlString[0])
			}
		}
	} else {
		err = errors.New("WS Error.")
	}
	return
}

func (x *ReturnedXML) GenerateMasterData() interface{} {
	xmlToJson := func(r io.Reader) (*bytes.Buffer, error) {
		root := &Node{}
		err := NewDecoder(r).Decode(root)
		if err != nil {
			return nil, err
		}

		buf := new(bytes.Buffer)
		err = NewEncoder(buf).Encode(root)
		if err != nil {
			return nil, err
		}

		return buf, nil
	}

	generateMap := func(deString string) (ret map[string]interface{}) {
		xml := strings.NewReader(deString)
		generatedJson, err := xmlToJson(xml)
		if err != nil {
			panic(err)
		}

		err = json.Unmarshal([]byte(generatedJson.String()), &ret)
		return
	}

	returnData := make(map[string]interface{})
	returnData = generateMap(x.GeneratedString.Additional)
	returnData["_id"] = bson.NewObjectId()

	var listData []map[string]interface{}
	for _, ld := range x.GeneratedString.ListData {
		listData = append(listData, generateMap(ld))
	}

	returnData[x.ListTagName] = listData
	return returnData
}
