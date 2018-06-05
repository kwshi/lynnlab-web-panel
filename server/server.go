package main

import (
	"encoding/json"
	"fmt"
	//"io/ioutil"
	"time"
	"math/rand"
	//"bytes"
	"net/http"
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


var upgrader = websocket.Upgrader{}
var clients = make(map[*websocket.Conn]bool)
var dataLog = make([]*DataEntry, 0)
var ch = make(chan []*DataEntry)


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

func dumpJson(c echo.Context) error {
	return c.JSON(http.StatusOK, dataLog)

}

func dumpCsv(c echo.Context) error {
	return c.String(http.StatusOK, "a,b,c")
}

func main() {
	e := echo.New()
	
	e.File("/", "../client/root.html")
	e.Static("/static", "../static")
	e.GET("/ws", ws)
	e.GET("/dump/json", dumpJson)
	e.GET("/dump/csv", dumpCsv)

		go hub()
		
		e.Logger.Fatal(e.Start(":5000"))
	}
