package motor

import (
	"os/exec"
	"io"
	"os"
	"bufio"
	"fmt"
	"encoding/json"
	"errors"
)

type Controller struct {
	cmd *exec.Cmd
	cmdOut io.Reader
	cmdIn io.Writer
	outReader *bufio.Reader
}

func NewController() (*Controller, error) {
	var path string
	if DEV_MODE {
		path = "python/motor_dev.py"
	} else {
		path = "python/motor_thorlabs.py"
	}
	cmd := exec.Command("python", path)

	cmd.Stderr = os.Stderr
	cmdIn, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}
	cmdOut, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}

	outReader := bufio.NewReader(cmdOut)

	return &Controller{
		cmd: cmd,
		cmdIn: cmdIn,
		cmdOut: cmdOut,
		outReader: outReader,
	}, nil
}

func (c *Controller) Start() {
	c.cmd.Start()
}

func (c *Controller) send(cmd string) error {
	line := cmd + "\n"
	_, err := c.cmdIn.Write([]byte(line))

	return err
}

func (c *Controller) receive(msg Msg) (error) {
	line, err := c.outReader.ReadBytes('\n')
	if err != nil {
		return err
	}

	err = json.Unmarshal(line, &msg)
	if err != nil {
		return err
	}

	if !msg.Success() {
		return errors.New(msg.Error())
	}

	return nil
}

func (c *Controller) sendReceive(cmd string, msg Msg) (error) {
	err := c.send(cmd)
	if err != nil {
		return err
	}

	err = c.receive(msg)
	if err != nil {
		return err
	}

	return nil
}

func (c *Controller) Ping() error {
	var msg BlankMsg
	return c.sendReceive("ping", &msg)
}

func (c *Controller) ListAvailable() ([]int, error) {
	var msg ListMsg
	err := c.sendReceive("list", &msg)
	if err != nil {
		return nil, err
	}
	
	return msg.Payload, nil
}

func (c *Controller) Connect(sn int) error {
	var msg BlankMsg
	return c.sendReceive(fmt.Sprintf("connect %d", sn), &msg)
}

func (c *Controller) Reset() error {
	var msg BlankMsg
	return c.sendReceive("reset", &msg)
}

func (c *Controller) Move(sn int, pos float64) error {
	var msg BlankMsg
	return c.sendReceive(fmt.Sprintf("move %d %f", sn, pos), &msg)
}

func (c *Controller) State() (State, error) {
	var msg StateMsg
	err := c.sendReceive("state", &msg)
	if err != nil {
		return nil, err
	}

	return msg.Payload, nil
}

func (c *Controller) Stop() error {
	return c.send("exit")
}

.
