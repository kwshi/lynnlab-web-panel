package main

import (
	"encoding/csv"
	"io"
	"os"
	"strconv"
	"time"
)

type FileCCUController struct {
	file   *os.File
	reader *csv.Reader
}

func NewFileCCUController(path string) (*FileCCUController, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	reader := csv.NewReader(file)
	_, err = reader.Read() // consume header row
	if err != nil {
		return nil, err
	}

	return &FileCCUController{
		file:   file,
		reader: reader,
	}, nil
}

func (ccu *FileCCUController) ReadEntry() (*DataEntry, error) {
	var row []string
	var err error
	for {
		row, err = ccu.reader.Read()
		if err != nil {
			if err == io.EOF {
				time.Sleep(100 * time.Millisecond)
				continue
			}
			return nil, err
		}
		break
	}
	sample, err := strconv.Atoi(row[0])
	if err != nil {
		return nil, err
	}
	unix, err := strconv.ParseFloat(row[1], 64)
	if err != nil {
		return nil, err
	}
	t := time.Unix(0, int64(unix*1e9))

	var data Data
	for i := range data {
		mean, err := strconv.ParseFloat(row[2*i+2], 64)
		if err != nil {
			return nil, err
		}
		sem, err := strconv.ParseFloat(row[2*i+3], 64)
		if err != nil {
			return nil, err
		}
		data[i] = &Stat{mean, sem}
	}

	return &DataEntry{sample, t, &data}, nil
}
