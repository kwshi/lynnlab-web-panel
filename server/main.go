package main

import (
	"log"
	"os"
	"./config"
)

func main() {

	logger := log.New(os.Stdout, "main: ", log.LstdFlags)

	app, err := NewApp()
	if err != nil {
		logger.Panic(err)
	}

	app.Start(config.WEB_ADDRESS)	

}
