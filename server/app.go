package main

import (
	"./ccu"
	"./web"
	"log"
)

type App struct {
	Server *web.Server  // web interface
	CCU    *ccu.Manager // for recording ccu data
	Logger *log.Logger  // for logging info to command line
}

func NewApp() *App {
	
}

func (app *App) Start() error {
	return nil
}
