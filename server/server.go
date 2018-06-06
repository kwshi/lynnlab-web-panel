package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)


type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}


var upgrader = websocket.Upgrader{}
var clients = make(map[*websocket.Conn]bool)
var dataLog = make([]*DataEntry, 0)
var ch = make(chan []*DataEntry)


func ws(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	fmt.Println("joined")
	clients[ws] = true

	if len(dataLog) < 500 {
		ch <- dataLog
	} else {
		ch <- dataLog[len(dataLog)-500:]
	}
	
	return nil

}

func hub() {
	ccu, err := NewDummyCCU(0)
	if err != nil {
		fmt.Println(err)
		return
	}
	stream := CCUStream{ccu}
	go func() {
		c := make(chan *DataEntry)
		go stream.Stream(c)

		for {
			entry := <-c
			dataLog = append(dataLog, entry)
			ch <- []*DataEntry{entry}
		}
	}()
	
	for {
		entries := <-ch
		js, err := json.Marshal(&Message{
			Type:    "log",
			Payload: entries,
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

