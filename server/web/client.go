package web

import (
	"github.com/gorilla/websocket"
	"../ccu/data"
	"./message"
	"log"
	"io/ioutil"
)

type Client struct {
	connection *websocket.Conn
	sendQueue *messageQueue
	logger *log.Logger
}

func NewClient(connection *websocket.Conn) *Client {
	return &Client{
		connection: connection,
		sendQueue: newMessageQueue(),
		logger: log.New(ioutil.Discard, "client: ", log.LstdFlags),
	}

}

func (client *Client) sendMessage(m *message.Message) {
	client.logger.Println("enqueueing")
	client.sendQueue.enqueue() <- m
}

func (client *Client) SendDump(entries []*data.Entry) {
	client.sendMessage(message.NewDump(entries))
}

func (client *Client) SendEntry(entry *data.Entry) {
	client.sendMessage(message.NewEntry(entry))
}

func (client *Client) listen() {
	for {
		select {
		case m := <-client.sendQueue.dequeue():
			client.logger.Println("sending queue to client")
			err := client.connection.WriteJSON(m)
			if err != nil {
				// close client
			}
		}
	}
}
