package main

type CCUController interface {
	ReadEntry() (*DataEntry, error)
}

type CCULogger struct {
	Controller CCUController
	Log        []*DataEntry
	logWriter     *LogWriter
}

func NewCCULogger(
	controller CCUController,
	channel chan<- *DataEntry,
	output string,
) (*CCULogger, error) {
	writer, err := NewLogWriter(output)
	if err != nil {
		return nil, err
	}

	return &CCULogger{
		Controller: controller,
		Log:        make([]*DataEntry, 0),
		logWriter:  writer,
	}, nil
}

func (ccu *CCULogger) Next(c chan<- *DataEntry) error {
	entry, err := ccu.Controller.ReadEntry()
	if err != nil {
		return err
	}
	ccu.Log = append(ccu.Log, entry)
	c <- entry
	return nil
}


func (ccu *CCULogger) Stream(c chan<- *DataEntry) error {
	for {
		err := ccu.Next(c)
		if err != nil {
			return err
		}
	}
}
