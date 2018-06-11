package controller

import (
	"gonum.org/v1/gonum/stat"
	"math"
	"math/rand"
	"time"
)

type Dummy struct {
	rand   *rand.Rand
	sample int
}

func NewDummy(seed int64) (*Dummy, error) {
	r := rand.New(rand.NewSource(seed))
	return &Dummy{
		rand:   r,
		sample: 0,
	}, nil
}

func (ccu *Dummy) randomSummary(size int) (float64, float64) {
	stuff := make([]float64, size)
	for i := range stuff {
		stuff[i] = ccu.rand.NormFloat64()*100 + 1000
	}
	mean, std := stat.MeanStdDev(stuff, nil)
	sem := std / math.Sqrt(float64(size))
	return mean, sem
}

func (ccu *Dummy) ReadEntry() (*DataEntry, error) {
	time.Sleep(1 * time.Second)
	ccu.sample++

	var data Data
	for i := range data {
		mean, sem := ccu.randomSummary(100)
		data[i] = &Stat{mean, sem}
	}

	return &DataEntry{
		Sample: ccu.sample,
		Time:   time.Now(),
		Data:   &data,
	}, nil
}
