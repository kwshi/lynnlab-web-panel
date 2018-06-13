package ccu

import (
	"./controller"
	"./data"
	"log"
	//	"os"
	"io/ioutil"
)

type Hub struct {
	controller controller.Controller
	log        []*data.Entry
	newEntry    chan *data.Entry
	logger     *log.Logger
}

func New(
	controller controller.Controller,
) (*Hub, error) {

	return &Hub{
		controller: controller,
		log:        make([]*data.Entry, 0),
		newEntry:    make(chan *data.Entry),
		logger: log.New(ioutil.Discard, "ccu: ", log.LstdFlags),
	}, nil

}

func (ccu *Hub) GetLog() []*data.Entry {
	return ccu.log
}

func (ccu *Hub) GetNewEntry() <-chan *data.Entry {
	return ccu.newEntry
}

func (ccu *Hub) next() error {
	entry, err := ccu.controller.ReadEntry()
	if err != nil {
		return err
	}
	ccu.newEntry <- entry
	ccu.log = append(ccu.log, entry)
	return nil
}

func (ccu *Hub) Stream() error {
	for {
		ccu.logger.Println("reading data entry")
		err := ccu.next()
		if err != nil {
			return err
		}
	}
}
