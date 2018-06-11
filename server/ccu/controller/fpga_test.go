package controller

import (
	"fmt"
	"testing"
)

func TestFPGA(t *testing.T) {
	controller, err := NewFPGA("COM4")
	if err != nil {
		t.Error(err)
		return
	}

	for sample := 1; sample <= 5; sample++ {
		entry, err := controller.ReadEntry()
		if err != nil {
			t.Error(err)
			return
		}
		if entry.Sample != sample {
			t.Errorf("mismatched sample")
		}
		fmt.Println(entry)
	}
}
