package main

import (
	"./ccu"
	"./ccu/controller"
	"./web"
	"fmt"
	"io/ioutil"
	"log"
	"time"
	"io"
	"os"
)

type multiWriter struct {
	writers []io.Writer
}

func newMultiWriter(writers ...io.Writer) *multiWriter {
	return &multiWriter{writers}
}

func (m *multiWriter) Write(p []byte) (n int, err error) {
	for _, writer := range m.writers {
		n, err = writer.Write(p)
		if err != nil {
			return 
		}
	}
	return
}

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

	ccuController, err := controller.NewDummy(0)
	if err != nil {
		return nil, err
	}

	ccu_, err := ccu.New(ccuController)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	ccuLog, err := os.Create(fmt.Sprintf(
		"../data/log_%d-%02d-%02d_%02d-%02d-%02d.csv",
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

	ccuTempLog, err := os.Create(fmt.Sprintf(
		"../../tmp/ccu-log.csv",
	))
	if err != nil {
		return nil, err
	}

	ccuWriter := ccu.NewWriter(newMultiWriter(ccuLog, ccuTempLog))
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
			client.DumpLog(app.ccu.GetLog())
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
