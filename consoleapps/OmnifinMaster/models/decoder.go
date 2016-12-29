package models

import (
	"encoding/xml"
	"golang.org/x/net/html/charset"
	"io"
	"unicode"
)

const (
	attrPrefix    = "-"
	contentPrefix = "#"
)

type Decoder struct {
	r   io.Reader
	err error
}

func NewDecoder(r io.Reader) *Decoder {
	return &Decoder{r: r}
}

func (dec *Decoder) Decode(root *Node) error {
	xmlDec := xml.NewDecoder(dec.r)

	xmlDec.CharsetReader = charset.NewReaderLabel

	elem := &Element{
		parent: nil,
		n:      root,
	}

	for {
		t, _ := xmlDec.Token()
		if t == nil {
			break
		}

		switch se := t.(type) {
		case xml.StartElement:
			elem = &Element{
				parent: elem,
				n:      &Node{},
				label:  se.Name.Local,
			}

			for _, a := range se.Attr {
				elem.n.AddChild(attrPrefix+a.Name.Local, &Node{Data: a.Value})
			}
		case xml.CharData:

			s := string(xml.CharData(se))
			if s == "" {
				elem.n.Data = s
			} else {
				var first *int
				var last int

				for i, r := range []rune(s) {
					if !unicode.IsGraphic(r) || unicode.IsSpace(r) {
						continue
					}

					if first == nil {
						f := i
						first = &f
						last = i
					} else {
						last = i
					}
				}

				if first == nil {
					elem.n.Data = ""
				} else {
					elem.n.Data = string([]rune(s)[*first : last+1])
				}
			}

		case xml.EndElement:
			if elem.parent != nil {
				elem.parent.n.AddChild(elem.label, elem.n)
			}

			elem = elem.parent
		}
	}

	return nil
}
