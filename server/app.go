package main

import (
	"./ccu"
	"./ccu/controller"
	"./motors"
	"./config"
	"./web"
	"fmt"
	"io"
	"log"
	"os"
	"encoding/json"
	"time"
)

type App struct {
	server    *web.Server // web interface
	ccu       *ccu.Hub    // for recording ccu data
	motors    *motors.Hub  // interfacing with motors
	logger    *log.Logger // for logging info to command line
	ccuWriter *ccu.Writer // for writing ccu data to log file
}

func NewApp() (*App, error) {
	server, err := web.NewServer()
	if err != nil {
		return nil, err
	}

	var ccuController controller.Controller
	if config.DEV_MODE {
		ccuController, err = controller.NewDummy(0)
	} else {
		ccuController, err = controller.NewFPGA("COM4")
	}
	if err != nil {
		return nil, err
	}

	ccuHub, err := ccu.New(ccuController)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var dataDir string
	if config.DEV_MODE {
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
	if config.DEV_MODE {
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

	motorHub, err := motors.New()
	if err != nil {
		return nil, err
	}

	return &App{
		server:    server,
		ccu:       ccuHub,
		motors:    motorHub,
		logger:    log.New(os.Stdout, "app: ", log.LstdFlags),
		ccuWriter: ccuWriter,
	}, nil
}

func (app *App) listen() {
	for {
		select {
		case client := <-app.server.GetNewClient():
			app.logger.Println("acknowledged new client")
			client.SendDump(app.ccu.GetLog())

		case entry := <-app.ccu.GetNewEntry():
			app.logger.Println("broadcasting new data entry")
			app.server.BroadcastEntry(entry)
			app.ccuWriter.Write(entry)

		case state := <-app.motors.GetNewState():
			app.logger.Println("broadcasting new motor state")
			app.server.BroadcastState(state)

		case msg := <-app.server.GetNewMessage():
			app.logger.Println("acknowledged message", msg)
			switch msg.Type {
			case "motor-move":
				var payload struct{
					Motor int `json:"motor,string"`
					Position float64 `json:"position,string"`
				}
				json.Unmarshal([]byte(msg.Payload.(string)), &payload)
				app.motors.Move(payload.Motor, payload.Position)
			default:
			}
		}
	}
}

func (app *App) Start(address string) {
	go app.ccu.Stream()
	go app.motors.Listen()
	go app.server.Start(address)
	app.listen()
}
