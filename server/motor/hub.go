package motor

import (
	"log"
	"os"
	"time"
)

type Hub struct {
	controller *Controller
	logger *log.Logger
}

func New() (*Hub, err) {
	controller, err := NewController()
	if err != nil {
		return nil, err
	}

	logger := log.New(os.Stdout, "motor: ", log.LstdFlags)
	
	return &Hub{
		controller: controller,
		logger: logger,
	}, nil
}


func (hub *Hub) Listen() {
	controller.Start()

	for {
		time.Sleep(100 * time.Millisecond)
	}
	
	defer controller.Stop()

	
}
