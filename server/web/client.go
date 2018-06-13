package web

import (
	"github.com/gorilla/websocket"
	"../ccu/data"
	"./messages"
	"log"
	"io/ioutil"
)

type Client struct {
	connection *websocket.Conn
	sendQueue *msgQueue
	logger *log.Logger
}

func NewClient(connection *websocket.Conn) *Client {
	return &Client{
		connection: connection,
		sendQueue: newMsgQueue(),
		logger: log.New(ioutil.Discard, "client: ", log.LstdFlags),
	}

}

func (client *Client) sendMsg(msg *messages.Msg) {
	client.logger.Println("enqueueing")
	client.sendQueue.enqueue() <- msg
}

func (client *Client) SendDump(entries []*data.Entry) {
	client.sendMsg(messages.NewDump(entries))
}

func (client *Client) SendEntry(entry *data.Entry) {
	client.sendMsg(messages.NewEntry(entry))
}

func (client *Client) listen() {
	for {
		select {
		case msg := <-client.sendQueue.dequeue():
			client.logger.Println("sending queue to client")
			err := client.connection.WriteJSON(msg)
			if err != nil {
				// close client
			}
		}
	}
}
