package main

import (
	"fmt"
	"strings"
	"time"
)

type CCU interface {
	ReadEntry() (*DataEntry, error)
}

type Stat struct {
	Mean float64 `json:"mean"`
	SEM  float64 `json:"sem"`
}

type Data [8]*Stat

type DataEntry struct {
	Sample int       `json:"sample"`
	Time   time.Time `json:"time"`
	Data   *Data     `json:"data"`
}

func (entry *DataEntry) String() string {
	return fmt.Sprintf("DataEntry{%d, %v, %v}", entry.Sample, entry.Time, entry.Data)
}

func (data *Data) String() string {
	var builder strings.Builder
	builder.WriteString("[\n")
	for _, stat := range data {
		builder.WriteString(fmt.Sprintf("  %.2f ± %.2f,\n", stat.Mean, stat.SEM))
	}
	builder.WriteString("]")
	return builder.String()
}

type CCUStream struct {
	CCU
}

func (ccuStream *CCUStream) Stream(c chan *DataEntry) error {
	for {
		entry, err := ccuStream.CCU.ReadEntry()
		if err != nil {
			return err
		}
		c <- entry
	}
}
