package main

import (
	"fmt"
	"github.com/tarm/serial"
	"gonum.org/v1/gonum/stat"
	"bufio"
	"errors"
	"math"
)

type Ccu struct {
	connection *serial.Port
	reader *bufio.Reader
}

type Packet [8]int
type Packets []*Packet

type Stat struct {
	Mean float64
	Sem float64
}

type StatPacket [8]*Stat

func ConnectCcu(address string) (*Ccu, error) {
	config := &serial.Config{
		Name: address,
		Baud: 19200,
	}
	connection, err := serial.OpenPort(config)
	if err != nil {
		return nil, err
	}
	
	return &Ccu{connection, bufio.NewReader(connection)}, nil
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

func (ccu *Ccu) ReadPacket() (*Packet, error) {

	packetBytes, err := ccu.reader.ReadBytes(0xff)
	if err != nil {
		return nil, err
	}

	if len(packetBytes) != 41 {
		return nil, errors.New("incorrect number of bytes given before termination")
	}
	
	var packet Packet
	for i := range packet {
		packet[i] = deserialize(packetBytes[5*i:5*(i+1)])
	}
	
	return &packet, nil
}

func (ccu *Ccu) ReadPackets(n int) (Packets, error) {
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

func (ccu *Ccu) Flush() error {
	_, err := ccu.reader.ReadBytes(0xff)
	return err
}

func summarize(values []float64) *Stat {

	mean, std := stat.MeanStdDev(values, nil)
	sem := std / math.Sqrt(float64(len(values)))

	return &Stat{mean, sem}
	
}

func (packets Packets) Summarize() *StatPacket {
	statPacket := StatPacket{}

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
		statPacket[i] = summarize(values[i])
	}

	return &statPacket
}

func main_test() {

	ccu, err := ConnectCcu("COM4")

	if err != nil {
		fmt.Println("error", err)
		return
	}
	
	ccu.Flush()
	for i := 0; i < 50; i++ {
		fmt.Println(ccu.ReadPacket())
	}

	
}
