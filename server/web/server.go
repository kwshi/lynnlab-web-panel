package web

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"log"
	"os"
	"../ccu/data"
)

type Server struct {
	echo     *echo.Echo
	upgrader *websocket.Upgrader
	clients  map[*Client]bool
	logger   *log.Logger
	newClient chan *Client
}

func NewServer() (*Server, error) {
	server := &Server{
		echo:     echo.New(),
		upgrader: &websocket.Upgrader{},
		clients:  make(map[*Client]bool),
		logger:   log.New(os.Stdout, "server: ", log.LstdFlags),
		newClient: make(chan *Client),
	}

	server.echo.File("/", "../client/root.html")
	server.echo.Static("/static", "../static")
	server.echo.GET("/ws", server.handleWebsocket)

	return server, nil
}

func (server *Server) addClient(client *Client) {
	server.logger.Println("adding new client")
	server.newClient <- client
	server.clients[client] = true
}

func (server *Server) removeClient(client *Client) {
	delete(server.clients, client)
}

func (server *Server) handleWebsocket(context echo.Context) error {

	server.logger.Println("websocket connection requested from", context.RealIP())

	server.logger.Println("initiating websocket connection")
	connection, err := server.upgrader.Upgrade(
		context.Response(),
		context.Request(),
		nil,
	)
	if err != nil {
		return err
	}

	server.logger.Println("websocket connection created")
	
	client := NewClient(connection)

	server.addClient(client)

	go client.listen()
	
	return nil
}

func (server *Server) BroadcastEntry(entry *data.Entry) {
	for client := range server.clients {
		client.SendEntry(entry)
		//		if err != nil {
		//			server.removeClient(client)
		//		}
	}
}

func (server *Server) GetNewClient() <-chan *Client {
	return server.newClient
}

func (server *Server) Start(address string) error {
	return server.echo.Start(address)
}

