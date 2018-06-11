package controller

type Controller interface {
	ReadEntry() (*DataEntry, error)
}

