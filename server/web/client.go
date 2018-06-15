package web

import (
	"github.com/gorilla/websocket"
	"../ccu/data"
	"../motors"
	"./messages"
	"log"
	"os"
)

type Client struct {
	connection *websocket.Conn
	sendQueue *msgQueue
	logger *log.Logger
	server *Server
	readChannel chan *messages.Msg
	closeChannel chan struct{}
}

func NewClient(server *Server, connection *websocket.Conn) *Client {
	return &Client{
		server: server,
		connection: connection,
		sendQueue: newMsgQueue(),
		logger: log.New(os.Stdout, "client: ", log.LstdFlags),
		readChannel: make(chan *messages.Msg),
		closeChannel: make(chan struct{}),
	}

}

func (client *Client) sendMsg(msg *messages.Msg) {
	client.logger.Println("enqueueing message")
	client.sendQueue.enqueue() <- msg
}

func (client *Client) SendDump(entries []*data.Entry) {
	client.sendMsg(messages.NewDump(entries))
}

func (client *Client) SendEntry(entry *data.Entry) {
	client.logger.Println("sending data entry")
	client.sendMsg(messages.NewEntry(entry))
}

func (client *Client) SendState(state motors.State) {
	client.logger.Println("sending motor state")
	client.sendMsg(messages.NewMotorState(state))
}

func (client *Client) listenRead() error {
	for {
		var msg messages.Msg
		err := client.connection.ReadJSON(&msg)
		if err != nil {
			client.closeChannel <- struct{}{}
			return err
		}
		client.readChannel <- &msg
	}
}

func (client *Client) listen() {
	go client.listenRead()
	
	for {
		select {
		case msg := <-client.sendQueue.dequeue():
			client.logger.Println("dequeued; sending to client")
			err := client.connection.WriteJSON(msg)
			if err != nil {
				client.logger.Println("client send failed; removing")
				client.server.removeClient(client)
			}

		case msg := <-client.readChannel:
			client.logger.Println("received message from client", msg)
			client.server.newMessage <- msg
			
		case <-client.closeChannel:
			client.logger.Println("couldn't read; closing channel")
			client.server.removeClient(client)
		}
	}
}
