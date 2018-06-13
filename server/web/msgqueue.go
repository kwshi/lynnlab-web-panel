package web

import (
	"./message"
)

type messageQueue struct {
	enqueueChan chan *message.Message
	dequeueChan chan []*message.Message
	queue []*message.Message
}

func newMessageQueue() *messageQueue {
	mq := &messageQueue{
		enqueueChan: make(chan *message.Message),
		dequeueChan: make(chan []*message.Message),
		queue: make([]*message.Message, 0),
	}

	go mq.listen()

	return mq
}

func (mq *messageQueue) listen() {
	for {
		if len(mq.queue) == 0 {
			mq.queue = append(mq.queue, <-mq.enqueueChan)
			continue
		}
		
		select {
		case mq.dequeueChan <- mq.queue[:]:
			mq.queue = mq.queue[len(mq.queue):]
		case m := <-mq.enqueueChan:
			mq.queue = append(mq.queue, m)
		}
	}
}

func (mq *messageQueue) enqueue() chan<- *message.Message {
	return mq.enqueueChan
}

func (mq *messageQueue) dequeue() <-chan []*message.Message {
	return mq.dequeueChan
}

//todo close message queue
