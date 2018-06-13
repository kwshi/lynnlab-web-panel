package messages

import (
	"../../ccu/data"
)

type Msg struct {
	Type string `json:"type"`
	Payload interface{} `json:"payload"`
}

func NewDump(entries []*data.Entry) *Msg {
	return &Msg{
		"log",
		entries,
	}
}

func NewEntry(entry *data.Entry) *Msg {
	return &Msg{
		"log",
		[]*data.Entry{entry},
	}
}
