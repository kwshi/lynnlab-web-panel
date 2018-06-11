package ccu

import (
	"encoding/csv"
	"./data"
	"strconv"
	"io"
)

type Writer struct {
	csvWriter *csv.Writer
}

func NewWriter(writer io.Writer) *Writer {
	return &Writer{
		csv.NewWriter(writer),
	}
}

func (writer *Writer) WriteHeader() error {
	return writer.csvWriter.Write([]string{
		"sample",
		"time",
		"C0 (A)",
		"C1 (B)",
		"C2 (A')",
		"C3 (B')",
		"C4",
		"C5",
		"C6",
		"C7",
	})
}

func (writer *Writer) Write(entry *data.Entry) error {
	record := []string{
		strconv.Itoa(entry.Sample),
		strconv.FormatFloat(float64(entry.Time.UnixNano()) / 1e9, 'f', 3, 64),
	}

	for _, stat := range entry.Data {
		record = append(
			record,
			strconv.FormatFloat(stat.Mean, 'f', 2, 64),
			strconv.FormatFloat(stat.SEM, 'f', 2, 64),
		)
	}
	
	err := writer.csvWriter.Write(record)
	if err != nil {
		return err
	}
	writer.csvWriter.Flush()

	return nil

}
