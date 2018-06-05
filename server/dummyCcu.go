package main

import (
	"math/rand"
	"gonum.org/v1/gonum/stat"
)

func genRanDumb(r *rand.Rand, size int) (float64, float64) {
	stuff := make([]float64, size)
	for i := range stuff {
		stuff[i] = r.NormFloat64()*100 + 1000
	}
	return stat.MeanStdDev(stuff, nil)
}


