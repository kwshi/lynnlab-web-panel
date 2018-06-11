package controller

import (
	"../data"
)

type Controller interface {
	ReadEntry() (*data.Entry, error)
}

