package web

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"log"
	"os"
	"../ccu/data"
	"../motors"
	"./messages"
)

type Server struct {
	echo     *echo.Echo
	upgrader *websocket.Upgrader
	clients  map[*Client]bool
	logger   *log.Logger
	newClient chan *Client
	newMessage chan *messages.Msg
}

func NewServer() (*Server, error) {
	server := &Server{
		echo:     echo.New(),
		upgrader: &websocket.Upgrader{},
		clients:  make(map[*Client]bool),
		logger:   log.New(os.Stdout, "server: ", log.LstdFlags),
		newClient: make(chan *Client),
		newMessage: make(chan *messages.Msg),
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
	
	client := NewClient(server, connection)

	server.addClient(client)

	go client.listen()
	
	return nil
}

func (server *Server) BroadcastEntry(entry *data.Entry) {
	server.logger.Println("broadcasting data entry")
	for client := range server.clients {
		client.SendEntry(entry)
	}
}

func (server *Server) BroadcastState(state motors.State) {
	server.logger.Println("broadcasting motor state")
	for client := range server.clients {
		client.SendState(state)
	}
}

func (server *Server) GetNewClient() <-chan *Client {
	return server.newClient
}

func (server *Server) GetNewMessage() <-chan *messages.Msg {
	return server.newMessage
}

func (server *Server) Start(address string) error {
	return server.echo.Start(address)
}

