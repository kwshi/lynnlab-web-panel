package main

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"log"
	"net/http"
	"./ccu"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type Server struct {
	Echo      *echo.Echo
	Upgrader  *websocket.Upgrader
	Clients   map[*websocket.Conn]bool
}

func NewServer() (*Server, error) {
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
		Echo:      echo.New(),
		Upgrader:  &websocket.Upgrader{},
		Clients:   make(map[*websocket.Conn]bool),
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
		select {
		case entry := <-server.CCULogger.Channel:
			log.Println("writing entry")
			for client := range server.Clients {
				client.WriteJSON(&Message{
					Type: "log",
					Payload: []*DataEntry{entry},
				})
			}
		}
	}
}

func (server *Server) ws(c echo.Context) error {
	ws, err := server.Upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	log.Println("joined")

	// write all log to client
	ws.WriteJSON(&Message{
		Type: "log",
		Payload: server.CCULogger.Log,
	})

	server.Clients[ws] = true

	return nil

}

func (server *Server) dumpJSON(c echo.Context) error {
	return c.JSON(http.StatusOK, server.CCULogger.Log)

}

func (server *Server) dumpCSV(c echo.Context) error {
	return c.String(http.StatusOK, "a,b,c")
}

func (server *Server) Start(address string) {
	go server.manage()
	go server.CCULogger.Stream()
	server.Echo.Logger.Fatal(server.Echo.Start(address))
}
