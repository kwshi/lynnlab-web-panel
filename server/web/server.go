package main

import (
	"./ccu"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"log"
	"net/http"
)

type Server struct {
	echo     *echo.Echo
	upgrader *websocket.Upgrader
	clients  map[*websocket.Conn]bool
	logger   *log.Logger
}

func NewServer(logger *log.Logger) (*Server, error) {
	ccuController, err := NewDummyCCUController(0)
	if err != nil {
		return nil, err
	}

	ccuLogger, err := NewCCULogger(
		ccuController,
		"test-log.csv",
	)
	if err != nil {
		return nil, err
	}

	server := &Server{
		echo:     echo.New(),
		upgrader: &websocket.Upgrader{},
		clients:  make(map[*websocket.Conn]bool),
		logger:   logger,
	}

	server.echo.File("/", "../client/root.html")
	server.echo.Static("/static", "../static")
	server.echo.GET("/ws", server.ws)
	server.echo.GET("/dump/json", server.dumpJSON)
	server.echo.GET("/dump/csv", server.dumpCSV)

	return server, nil
}

func (server *Server) ws(c echo.Context) error {
	ws, err := server.upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	server.logger.Println("joined")

	// write all log to client

	server.clients[ws] = true

	return nil

}

func (server *Server) Start(address string) error {
	return server.Echo.Start(address)
}
