package data

import (
	"time"
	"fmt"
	"strings"
)


type Stat struct {
	Mean float64 `json:"mean"`
	SEM  float64 `json:"sem"`
}

type Packet [8]*Stat

type Entry struct {
	Sample int       `json:"sample"`
	Time   time.Time `json:"time"`
	Data   *Packet     `json:"data"`
}

func (entry *Entry) String() string {
	return fmt.Sprintf("Entry{%d, %v, %v}", entry.Sample, entry.Time, entry.Data)
}

func (packet *Packet) String() string {
	var builder strings.Builder
	builder.WriteString("[\n")
	for _, stat := range packet {
		builder.WriteString(fmt.Sprintf("  %.2f ± %.2f,\n", stat.Mean, stat.SEM))
	}
	builder.WriteString("]")
	return builder.String()
}
