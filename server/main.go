package main

import (
	"log"
	"os"
)

func main() {

	logger := log.New(os.Stdout, "", log.LstdFlags)

	app, err := NewApp(logger)
	if err != nil {
		logger.Panic(err)
	}

	app.Start(WEB_ADDRESS)	

}
