package message

import (
	"../../ccu/data"
)

type Message struct {
	Type string `json:"type"`
	Payload interface{} `json:"payload"`
}

func NewDump(entries []*data.Entry) *Message {
	return &Message{
		"log",
		entries,
	}
}

func NewEntry(entry *data.Entry) *Message {
	return &Message{
		"log",
		[]*data.Entry{entry},
	}
}
