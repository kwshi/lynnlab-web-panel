package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	//"io/ioutil"
	"math"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"
	//"bytes"
	//"net/http"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

type DataEntry struct {
	Sample int        `json:"sample"`
	Time   time.Time  `json:"time"`
	Mean   [8]float64 `json:"mean"`
	Sem    [8]float64 `json:"sem"`
}

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

const log_path = "../tmp/ccu-log.csv"

var upgrader = websocket.Upgrader{}
var clients = make(map[*websocket.Conn]bool)
var dataLog = make([]*DataEntry, 0)
var ch = make(chan []*DataEntry)

func decodeRow(row []byte) *DataEntry {
	cells := strings.Split(string(row), ",")

	sample, err := strconv.Atoi(cells[0])
	if err != nil {
		sample = -1
	}
	timestamp, err := strconv.ParseFloat(cells[1], 64)
	if err != nil {
		timestamp = -1
	}

	t := time.Unix(0, int64(timestamp*1e9))

	mean := [8]float64{}
	sem := [8]float64{}

	for i := range mean {
		mean[i], err = strconv.ParseFloat(cells[2*i+2], 64)
		sem[i], err = strconv.ParseFloat(cells[2*i+3], 64)
	}

	return &DataEntry{
		Sample: sample,
		Time:   t,
		Mean:   mean,
		Sem:    sem,
	}
}

func readFile(path string, c chan []*DataEntry) {
	file, err := os.Open(log_path)
	defer file.Close()
	if err != nil {
		fmt.Println("could not open", err)
		os.Exit(1)
	}
	reader := bufio.NewReader(file)

	// skip header
	reader.ReadBytes('\n')

	for {
		row, err := reader.ReadBytes('\n')
		if err != nil {
			// waiting for more lines
			time.Sleep(100 * time.Millisecond)
			continue
		}

		entry := decodeRow(row)
		dataLog = append(dataLog, entry)
		c <- []*DataEntry{entry}
	}
}

func genRanDumb(r *rand.Rand, size int) (float64, float64) {
	stuff := make([]float64, size)
	var sum float64 = 0
	var ss float64 = 0
	for i := range stuff {
		stuff[i] = r.NormFloat64()*100 + 1000
		sum += stuff[i]
		ss += stuff[i] * stuff[i]
	}
	mean := sum / float64(size)
	variance := ss/float64(size-1) - sum*sum/float64(size*(size-1))
	return mean, math.Sqrt(variance / float64(size))
}

func dummyGenerator(c chan []*DataEntry) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	for s := 1; ; s++ {
		t := time.Now()
		mean := [8]float64{}
		sem := [8]float64{}

		for i := range mean {
			m, s := genRanDumb(r, 100)
			mean[i] = m
			sem[i] = s
		}

		entry := &DataEntry{
			Sample: s,
			Time:   t,
			Mean:   mean,
			Sem:    sem,
		}
		dataLog = append(dataLog, entry)
		c <- []*DataEntry{entry}
		time.Sleep(1000 * time.Millisecond)
	}
}

func ws(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	fmt.Println("joined")
	clients[ws] = true

	ch <- dataLog
	return nil

}

func hub() {
	go dummyGenerator(ch)
	for {
		entry := <-ch
		js, err := json.Marshal(&Message{
			Type:    "data-log",
			Payload: entry,
		})
		if err != nil {
			continue
		}
		for ws := range clients {
			err := ws.WriteMessage(
				websocket.TextMessage,
				js,
			)
			if err != nil {
				ws.Close()
				delete(clients, ws)
			}
		}
	}
}

func main() {
	e := echo.New()
	
	e.File("/", "client/root.html")
	e.Static("/static", "static")
	e.GET("/ws", ws)

	go hub()

	e.Logger.Fatal(e.Start(":5000"))
}
