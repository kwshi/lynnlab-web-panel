package web

import (
	"github.com/gorilla/websocket"
	"../ccu/data"
	"./message"
)


type Client struct {
	connection *websocket.Conn
}

func NewClient(connection *websocket.Conn) *Client {
	return &Client{
		connection: connection,
	}

}

func (client *Client) DumpLog(log []*data.Entry) error {
	return client.connection.WriteJSON(message.NewDump(log))
}

func (client *Client) SendEntry(entry *data.Entry) error {
	
	return client.connection.WriteJSON(message.NewEntry(entry))
}

func (client *Client) listen() {

}
