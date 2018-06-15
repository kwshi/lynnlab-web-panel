package messages

import (
	"../../ccu/data"
	"../../motors"
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

func NewMotorState(state motors.State) *Msg {
	return &Msg{
		"motorState",
		state,
	}
}
