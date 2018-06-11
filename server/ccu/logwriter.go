package main

import (
	"os"
	"encoding/csv"
)

type LogWriter struct {
	file *os.File
	writer *csv.Writer
}

func NewLogWriter(path string) (*LogWriter, error) {
	file, err := os.Create(path)
	if err != nil {
		return nil, err
	}
	
	return &LogWriter{
		file,
		csv.NewWriter(file),
	}, nil
}
