package models

import (
	"bytes"
	"io"
	"unicode/utf8"
)

type Encoder struct {
	w   io.Writer
	err error
}

func NewEncoder(w io.Writer) *Encoder {
	return &Encoder{w: w}
}

func (enc *Encoder) Write(s string) {
	enc.w.Write([]byte(s))
}

func (enc *Encoder) Encode(root *Node) error {
	if enc.err != nil {
		return enc.err
	}
	if root == nil {
		return nil
	}

	enc.err = enc.Format(root, 0)
	enc.Write("\n")

	return enc.err
}

func (enc *Encoder) Format(n *Node, lvl int) error {
	SanitiseString := func(s string) string {
		var hex = "0123456789abcdef"
		var buf bytes.Buffer

		buf.WriteByte('"')
		start := 0
		for i := 0; i < len(s); {
			if b := s[i]; b < utf8.RuneSelf {
				if 0x20 <= b && b != '\\' && b != '"' && b != '<' && b != '>' && b != '&' {
					i++
					continue
				}

				if start < i {
					buf.WriteString(s[start:i])
				}

				switch b {
				case '\\', '"':
					buf.WriteByte('\\')
					buf.WriteByte(b)
				case '\n':
					buf.WriteByte('\\')
					buf.WriteByte('n')
				case '\r':
					buf.WriteByte('\\')
					buf.WriteByte('r')
				case '\t':
					buf.WriteByte('\\')
					buf.WriteByte('t')
				default:
					buf.WriteString(`\u00`)
					buf.WriteByte(hex[b>>4])
					buf.WriteByte(hex[b&0xF])
				}

				i++
				start = i
				continue
			}

			c, size := utf8.DecodeRuneInString(s[i:])
			if c == utf8.RuneError && size == 1 {
				if start < i {
					buf.WriteString(s[start:i])
				}

				buf.WriteString(`\ufffd`)
				i += size
				start = i
				continue
			}

			if c == '\u2028' || c == '\u2029' {
				if start < i {
					buf.WriteString(s[start:i])
				}

				buf.WriteString(`\u202`)
				buf.WriteByte(hex[c&0xF])
				i += size
				start = i
				continue
			}

			i += size
		}

		if start < len(s) {
			buf.WriteString(s[start:])
		}

		buf.WriteByte('"')
		return buf.String()
	}

	if n.HasChildren() {
		enc.Write("{")

		if len(n.Data) > 0 {
			enc.Write("\"")
			enc.Write(contentPrefix)
			enc.Write("content")
			enc.Write("\": ")
			enc.Write(SanitiseString(n.Data))
			enc.Write(", ")
		}

		i := 0
		tot := len(n.Children)
		for label, children := range n.Children {
			enc.Write("\"")
			enc.Write(label)
			enc.Write("\": ")

			if len(children) > 1 {
				enc.Write("[")

				for j, c := range children {
					enc.Format(c, lvl+1)

					if j < len(children)-1 {
						enc.Write(", ")
					}
				}

				enc.Write("]")
			} else {
				enc.Format(children[0], lvl+1)
			}

			if i < tot-1 {
				enc.Write(", ")
			}
			i++
		}

		enc.Write("}")
	} else {
		enc.Write(SanitiseString(n.Data))
	}

	return nil
}
