package controller

import (
	"bufio"
	"errors"
	"github.com/tarm/serial"
	"gonum.org/v1/gonum/stat"
	"math"
	"time"
	"../data"
)

type FPGA struct {
	connection *serial.Port
	reader     *bufio.Reader
	sample     int
}

type RawPacket [8]int
type RawPackets []*RawPacket

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

func (ccu *FPGA) ReadPacket() (*RawPacket, error) {

	bytes, err := ccu.reader.ReadBytes(0xff)
	if err != nil {
		return nil, err
	}

	if len(bytes) != 41 {
		return nil, errors.New("incorrect number of bytes given before termination")
	}

	var rawPacket RawPacket
	for i := range rawPacket {
		rawPacket[i] = deserialize(bytes[5*i : 5*(i+1)])
	}

	return &rawPacket, nil
}

func (ccu *FPGA) Flush() error {
	_, err := ccu.reader.ReadBytes(0xff)
	return err
}

func (ccu *FPGA) ReadPackets(n int) (RawPackets, error) {
	rawPackets := make(RawPackets, n)
	for i := range rawPackets {
		rawPacket, err := ccu.ReadPacket()
		if err != nil {
			return nil, err
		}
		rawPackets[i] = rawPacket
	}
	return rawPackets, nil
}

func summarize(values []float64) *data.Stat {

	mean, std := stat.MeanStdDev(values, nil)
	sem := std / math.Sqrt(float64(len(values)))

	return &data.Stat{mean, sem}

}

func (rawPackets RawPackets) Summarize() *data.Packet {

	// "zip" values into channels
	values := [8][]float64{}
	for i := range values {
		values[i] = make([]float64, len(rawPackets))
	}

	for i, rawPacket := range rawPackets {
		for channel, value := range rawPacket {
			values[channel][i] = float64(value)
		}
	}
	
	var packet data.Packet

	for i := range values {
		packet[i] = summarize(values[i])
	}

	return &packet
}

func (ccu *FPGA) ReadEntry() (*data.Entry, error) {
	rawPackets, err := ccu.ReadPackets(10)
	if err != nil {
		return nil, err
	}
	packet := rawPackets.Summarize()
	ccu.sample++

	return &data.Entry{
		Sample: ccu.sample,
		Time:   time.Now(),
		Data:   packet,
	}, nil

}
