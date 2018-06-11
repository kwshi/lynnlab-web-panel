package main

import (
	"./ccu/controller"
	"./ccu"
	"./web"
	"log"
)

type App struct {
	server *web.Server  // web interface
	ccu    *ccu.CCU // for recording ccu data
	logger *log.Logger  // for logging info to command line
}

func NewApp(logger *log.Logger) (*App, error) {
	server, err := web.NewServer(logger)
	if err != nil {
		return nil, err
	}

	ccuController, err := controller.NewDummy(0)
	if err != nil {
		return nil, err
	}
	
	ccu, err := ccu.New(ccuController, "../data/log", logger)
	if err != nil {
		return nil, err
	}
	
	return &App{
		server: server,
		ccu: ccu,
		logger: logger,
	}, nil
}

func (app *App) listen() {
	for {
		select {
		case client := <-app.server.GetNewClient():
			app.logger.Println("received new client")
			client.DumpLog(app.ccu.GetLog())
			app.logger.Println("sent client logs")
		case entry := <-app.ccu.GetNewEntry():
			app.logger.Println("received new entry")
			app.server.BroadcastEntry(entry)
			app.logger.Println("broadcasted new entry")
		}
	}
}

func (app *App) Start(address string) {
	go app.ccu.Stream()
	go app.server.Start(address)
	app.listen()
}
