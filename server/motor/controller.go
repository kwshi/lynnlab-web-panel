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

type MotorController struct {
	cmd *exec.Cmd
	cmdOut io.Reader
	cmdIn io.Writer
	outReader *bufio.Reader
}

func NewMotorController() *MotorController {
	cmd := exec.Command("python", "python/motor.py")

	cmd.Stderr = os.Stderr
	cmdIn, err := cmd.StdinPipe()
	if err != nil {
		panic(err)
	}
	cmdOut, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	_=err

	outReader := bufio.NewReader(cmdOut)
	
	return &MotorController{
		cmd: cmd,
		cmdIn: cmdIn,
		cmdOut: cmdOut,
		outReader: outReader,
	}
}

func (mc *MotorController) Start() {
	mc.cmd.Start()
}

func (mc *MotorController) send(cmd string) error {
	line := cmd + "\n"
	_, err := mc.cmdIn.Write([]byte(line))

	return err
}

func (mc *MotorController) receive(msg Msg) (error) {
	line, err := mc.outReader.ReadBytes('\n')
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

func (mc *MotorController) sendReceive(cmd string, msg Msg) (error) {
	err := mc.send(cmd)
	if err != nil {
		return err
	}

	err = mc.receive(msg)
	if err != nil {
		return err
	}

	return nil
}

func (mc *MotorController) Ping() error {
	var msg BlankMsg
	return mc.sendReceive("ping", &msg)
}

func (mc *MotorController) ListAvailable() ([]int, error) {
	var msg ListMsg
	err := mc.sendReceive("list", &msg)
	if err != nil {
		return nil, err
	}
	
	return msg.Payload, nil
}

func (mc *MotorController) Connect(sn int) error {
	var msg BlankMsg
	return mc.sendReceive(fmt.Sprintf("connect %d", sn), &msg)
}

func (mc *MotorController) Reset() error {
	var msg BlankMsg
	return mc.sendReceive("reset", &msg)
}

func (mc *MotorController) Move(sn int, pos float64) error {
	var msg BlankMsg
	return mc.sendReceive(fmt.Sprintf("move %d %f", sn, pos), &msg)
}

func (mc *MotorController) State() (State, error) {
	var msg StateMsg
	err := mc.sendReceive("state", &msg)
	if err != nil {
		return nil, err
	}

	return msg.Payload, nil
}

func (mc *MotorController) Exit() error {
	return mc.send("exit")
}

