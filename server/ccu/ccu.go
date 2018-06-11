package ccu

import (
	"./controller"
	"./data"
	"log"
	//	"os"
	"io/ioutil"
)

type CCU struct {
	controller controller.Controller
	log        []*data.Entry
	newEntry    chan *data.Entry
	logger     *log.Logger
}

func New(
	controller controller.Controller,
) (*CCU, error) {

	return &CCU{
		controller: controller,
		log:        make([]*data.Entry, 0),
		newEntry:    make(chan *data.Entry),
		logger: log.New(ioutil.Discard, "ccu: ", log.LstdFlags),
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
