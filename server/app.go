package main

import (
	"log"
)

type App struct {
	WebServer
	CCULogger *ccu.Logger
	Logger *log.Logger
}

func NewApp() *App {
	
}


