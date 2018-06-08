package main

import (
	"fmt"
	"testing"
)

func TestFileCCU(t *testing.T) {
	ccu, err := NewFileCCU("../../tmp/ccu-log.csv")
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
