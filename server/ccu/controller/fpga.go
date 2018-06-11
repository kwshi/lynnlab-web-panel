package controller

import (
	"bufio"
	"errors"
	"fmt"
	"github.com/tarm/serial"
	"gonum.org/v1/gonum/stat"
	"math"
	"time"
)

type FPGA struct {
	connection *serial.Port
	reader     *bufio.Reader
	sample     int
}

type Packet [8]int
type Packets []*Packet

func NewFPGA(address string) (*FPGA, error) {
	config := &serial.Config{
		Name: address,
		Baud: 19200,
	}
	connection, err := serial.OpenPort(config)
	if err != nil {
		return nil, err
	}

	return &FPGA{
		connection: connection,
		reader:     bufio.NewReader(connection),
		sample:     0,
	}, nil
}

// deserialize (little-endian) byte-wise representation of number
func deserialize(digits []byte) int {
	sum := 0
	power := 1
	for _, digit := range digits {
		sum += power * int(digit)
		power <<= 1
	}
	return sum
}

func (ccu *FPGA) ReadPacket() (*Packet, error) {

	packetBytes, err := ccu.reader.ReadBytes(0xff)
	if err != nil {
		return nil, err
	}

	if len(packetBytes) != 41 {
		return nil, errors.New("incorrect number of bytes given before termination")
	}

	var packet Packet
	for i := range packet {
		packet[i] = deserialize(packetBytes[5*i : 5*(i+1)])
	}

	return &packet, nil
}

func (ccu *FPGA) Flush() error {
	_, err := ccu.reader.ReadBytes(0xff)
	return err
}

func (ccu *FPGA) ReadPackets(n int) (Packets, error) {
	packets := make(Packets, n)
	for i := range packets {
		packet, err := ccu.ReadPacket()
		if err != nil {
			return nil, err
		}
		packets[i] = packet
	}
	return packets, nil
}

func summarize(values []float64) *Stat {

	mean, std := stat.MeanStdDev(values, nil)
	sem := std / math.Sqrt(float64(len(values)))

	return &Stat{mean, sem}

}

func (packets Packets) Summarize() *Data {
	data := Data{}

	// "zip" values into channels
	values := [8][]float64{}
	for i := range values {
		values[i] = make([]float64, len(packets))
	}

	for i, packet := range packets {
		for channel, value := range packet {
			values[channel][i] = float64(value)
		}
	}

	for i := range values {
		data[i] = summarize(values[i])
	}

	return &data
}

func (ccu *FPGA) ReadEntry() (*DataEntry, error) {
	packets, err := ccu.ReadPackets(10)
	if err != nil {
		return nil, err
	}
	data := packets.Summarize()
	ccu.sample++

	return &DataEntry{
		Sample: ccu.sample,
		Time:   time.Now(),
		Data:   data,
	}, nil

}
