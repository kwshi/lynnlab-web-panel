package controller

import (
	"fmt"
	"testing"
)

func TestFile(t *testing.T) {
	controller, err := NewFile("../../tmp/ccu-log.csv")
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
