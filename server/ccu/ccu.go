package ccu

import (
	"./controller"
)

type Manager struct {
	Controller controller.Controller
	Log        []*DataEntry
	logWriter  *LogWriter
	Channel    chan *DataEntry
}

func NewManager(
	controller controller.Controller,
	output string,
) (*Logger, error) {
	writer, err := NewLogWriter(output)
	if err != nil {
		return nil, err
	}

	return &Logger{
		Controller: controller,
		Log:        make([]*DataEntry, 0),
		logWriter:  writer,
		Channel:    make(chan *DataEntry),
	}, nil

}

func (ccu *Logger) Next() error {
	entry, err := ccu.Controller.ReadEntry()
	if err != nil {
		return err
	}
	ccu.Channel <- entry
	ccu.Log = append(ccu.Log, entry)
	return nil
}

func (ccu *Logger) Stream() error {
	for {
		err := ccu.Next()
		if err != nil {
			return err
		}
	}
}
