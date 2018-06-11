package ccu

import (
	"./controller"
	"./data"
	"log"
	"fmt"
	"time"
)

type CCU struct {
	controller controller.Controller
	log        []*data.Entry
	writer     *Writer
	newEntry    chan *data.Entry
	logger     *log.Logger
}

func New(
	controller controller.Controller,
	output string,
	logger *log.Logger,
) (*CCU, error) {

	now := time.Now()
	writer, err := NewWriter(fmt.Sprintf(
		"%s_%d-%02d-%02d_%02d-%02d-%02d.csv",
		output,
		now.Year(),
		now.Month(),
		now.Day(),
		now.Hour(),
		now.Minute(),
		now.Second(),
	))
	
	if err != nil {
		return nil, err
	}
	writer.WriteHeader()

	return &CCU{
		controller: controller,
		log:        make([]*data.Entry, 0),
		newEntry:    make(chan *data.Entry),
		writer:     writer,
		logger: logger,
	}, nil

}

func (ccu *CCU) GetLog() []*data.Entry {
	return ccu.log
}

func (ccu *CCU) GetNewEntry() <-chan *data.Entry {
	return ccu.newEntry
}

func (ccu *CCU) next() error {
	entry, err := ccu.controller.ReadEntry()
	if err != nil {
		return err
	}
	ccu.newEntry <- entry
	ccu.writer.Write(entry)
	ccu.log = append(ccu.log, entry)
	return nil
}

func (ccu *CCU) Stream() error {
	for {
		ccu.logger.Println("reading data entry")
		err := ccu.next()
		if err != nil {
			return err
		}
	}
}
