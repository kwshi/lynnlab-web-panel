package main

import (
	"time"
	"fmt"
	"strings"
)


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
