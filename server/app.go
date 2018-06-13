package main

import (
	"./ccu"
	"./ccu/controller"
	"./web"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"time"
)


type App struct {
	server    *web.Server // web interface
	ccu       *ccu.CCU    // for recording ccu data
	logger    *log.Logger // for logging info to command line
	ccuWriter *ccu.Writer // for writing ccu data to log file
}

func NewApp() (*App, error) {
	server, err := web.NewServer()
	if err != nil {
		return nil, err
	}

	var ccuController controller.Controller
	if DEV_MODE {
		ccuController, err = controller.NewDummy(0)
	} else {
		ccuController, err = controller.NewFPGA("COM4")
	}
	if err != nil {
		return nil, err
	}

	ccu_, err := ccu.New(ccuController)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var dataDir string
	if DEV_MODE {
		dataDir = "data-dev"
	} else {
		dataDir = "data"
	}
	ccuLog, err := os.Create(fmt.Sprintf(
		"../%s/log_%d-%02d-%02d_%02d-%02d-%02d.csv",
		dataDir,
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

	var tempLogName string
	if DEV_MODE {
		tempLogName = "../../tmp/ccu-log-dev.csv"
	} else {
		tempLogName = "../../tmp/ccu-log.csv"
	}
	ccuTempLog, err := os.Create(tempLogName)
	if err != nil {
		return nil, err
	}

	ccuWriter := ccu.NewWriter(io.MultiWriter(ccuLog, ccuTempLog))
	ccuWriter.WriteHeader()

	return &App{
		server:    server,
		ccu:       ccu_,
		logger:    log.New(ioutil.Discard, "app: ", log.LstdFlags),
		ccuWriter: ccuWriter,
	}, nil
}

func (app *App) listen() {
	for {
		select {
		case client := <-app.server.GetNewClient():
			app.logger.Println("received new client, dumping log")
			client.SendDump(app.ccu.GetLog())
			app.logger.Println("log dumped")

		case entry := <-app.ccu.GetNewEntry():
			app.logger.Println("received new entry, broadcasting")
			app.server.BroadcastEntry(entry)
			app.logger.Println("broadcasted")

			app.logger.Println("writing entry to log files")
			app.ccuWriter.Write(entry)
			app.logger.Println("written")

			
		}
	}
}

func (app *App) Start(address string) {
	go app.ccu.Stream()
	go app.server.Start(address)
	app.listen()
}
