package controller

import (
	"encoding/csv"
	"io"
	"os"
	"strconv"
	"time"
	"../data"
)

type File struct {
	file   *os.File
	reader *csv.Reader
}

func NewFile(path string) (*File, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	reader := csv.NewReader(file)
	_, err = reader.Read() // consume header row
	if err != nil {
		return nil, err
	}

	return &File{
		file:   file,
		reader: reader,
	}, nil
}

func (ccu *File) ReadEntry() (*data.Entry, error) {
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

	var packet data.Packet
	for i := range packet {
		mean, err := strconv.ParseFloat(row[2*i+2], 64)
		if err != nil {
			return nil, err
		}
		sem, err := strconv.ParseFloat(row[2*i+3], 64)
		if err != nil {
			return nil, err
		}
		packet[i] = &data.Stat{mean, sem}
	}
	
	return &data.Entry{sample, t, &packet}, nil
}
