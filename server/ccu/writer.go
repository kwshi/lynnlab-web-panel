package ccu

import (
	"encoding/csv"
	"os"
	"./data"
	"strconv"
)

type Writer struct {
	file   *os.File
	writer *csv.Writer
}

func NewWriter(path string) (*Writer, error) {
	file, err := os.Create(path)
	if err != nil {
		return nil, err
	}

	return &Writer{
		file,
		csv.NewWriter(file),
	}, nil
}

func (writer *Writer) WriteHeader() {
	writer.writer.Write([]string{
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

func (writer *Writer) Write(entry *data.Entry) {
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
	
	writer.writer.Write(record)
	writer.writer.Flush()
}
