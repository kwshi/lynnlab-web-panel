package main

import (
	"fmt"
	"testing"
)

func TestFPGACCU(t *testing.T) {
	ccu, err := NewFPGACCU("COM4")
	if err != nil {
		t.Error(err)
		return
	}

	for sample := 1; sample <= 5; sample++ {
		entry, err := ccu.ReadEntry()
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
