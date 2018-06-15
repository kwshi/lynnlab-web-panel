package motors

import (
	"log"
	"os"
	"time"
)

type Hub struct {
	controller *Controller
	logger *log.Logger
	newState chan State
}

func New() (*Hub, error) {
	controller, err := NewController()
	if err != nil {
		return nil, err
	}

	logger := log.New(os.Stdout, "motor: ", log.LstdFlags)
	
	return &Hub{
		controller: controller,
		logger: logger,
		newState: make(chan State),
	}, nil
}

func (hub *Hub) GetNewState() <-chan State {
	return hub.newState
}

func (hub *Hub) Connect(sn int) error {
	return hub.controller.Connect(sn)
}

func (hub *Hub) ConnectAll() error {
	available, err := hub.controller.ListAvailable()
	if err != nil {
		return err
	}

	for _, sn := range available {
		err := hub.controller.Connect(sn)
		if err != nil {
			return err
		}
	}
	
	return nil
}

func (hub *Hub) Move(sn int, pos float64) error {
	return hub.controller.Move(sn, pos)
}

func (hub *Hub) Listen() {
	hub.controller.Start()
	hub.ConnectAll()

	for {
		hub.logger.Println("checking for motor state")
		time.Sleep(500 * time.Millisecond)
		state, err := hub.controller.State()
		hub.logger.Println("got motor state")
		if err != nil {
			panic(err)
		}
		hub.newState <- state
	}
	
	defer hub.controller.Stop()

	
}
