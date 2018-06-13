package web

import (
	"./messages"
)

type msgQueue struct {
	enqueueChan chan *messages.Msg
	dequeueChan chan []*messages.Msg
	queue []*messages.Msg
}

func newMsgQueue() *msgQueue {
	mq := &msgQueue{
		enqueueChan: make(chan *messages.Msg),
		dequeueChan: make(chan []*messages.Msg),
		queue: make([]*messages.Msg, 0),
	}

	go mq.listen()

	return mq
}

func (mq *msgQueue) listen() {
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

func (mq *msgQueue) enqueue() chan<- *messages.Msg {
	return mq.enqueueChan
}

func (mq *msgQueue) dequeue() <-chan []*messages.Msg {
	return mq.dequeueChan
}

//todo close message queue
