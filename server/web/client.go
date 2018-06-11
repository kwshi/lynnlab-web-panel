package web

import (
	"github.com/gorilla/websocket"
	"../ccu/data"
)

type Message struct {
	Type string `json:"type"`
	Payload interface{} `json:"payload"`
}

type Client struct {
	server *Server
	connection *websocket.Conn
	
}

func (client *Client) DumpLog(log []*data.Entry) error {
	return client.connection.WriteJSON(&Message{
		"log",
		log,
	})
}

func (client *Client) SendEntry(entry *data.Entry) error {
	return client.connection.WriteJSON(&Message{
		"log",
		[]*data.Entry{entry},
	})
}

func (client *Client) listen() {
	
}
