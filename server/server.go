package main

import (
	//	"encoding/csv"
	//"encoding/json"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"net/http"
	"log"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type Server struct {
	Echo *echo.Echo
	Upgrader *websocket.Upgrader
	Clients  map[*websocket.Conn]bool
	CCULogger *CCULogger
}

func NewServer() (*Server, error) {
	ccuController, err := NewDummyCCU(0)
	if err != nil {
		return nil, err
	}

	ccuLogger, err := NewCCULogger(
		ccuController,
		make(chan *DataEntry),
		"test-log.csv",
	)
	if err != nil {
		return nil, err
	}

	server := &Server{
		Echo: echo.New(),
		Upgrader: &websocket.Upgrader{},
		Clients:  make(map[*websocket.Conn]bool),
		CCULogger: ccuLogger,
	}

	server.Echo.File("/", "../client/root.html")
	server.Echo.Static("/static", "../static")
	server.Echo.GET("/ws", server.ws)
	server.Echo.GET("/dump/json", server.dumpJSON)
	server.Echo.GET("/dump/csv", server.dumpCSV)

	return server, nil
}

func (server *Server) manage() {
	for {
		
	}
}

func (server *Server) ws(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	log.Println("joined")
	clients[ws] = true

	if len(dataLog) < 500 {
		ch <- dataLog
	} else {
		ch <- dataLog[len(dataLog)-500:]
	}

	return nil

}

func (server *Server) dumpJSON(c echo.Context) error {
	return c.JSON(http.StatusOK, server.Logger.Log)

}

func (server *Server) dumpCSV(c echo.Context) error {
	return c.String(http.StatusOK, "a,b,c")
}

func (server *Server) Start(address string) {
	server.Echo.Logger.Fatal(server.Echo.Start(address))
}
