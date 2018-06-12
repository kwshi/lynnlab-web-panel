import thorlabs_apt as apt
import sys
import json


def send(message):
    sys.stdout.write('{}\n'.format(json.dumps(message)))


def receive():
    return sys.stdin.readline().strip().split(' ')


# commands
LIST = 'list'
CONNECT = 'connect'
REFRESH = 'refresh'
MOVE = 'move'
STATE = 'state'

motors = {sn: model for model, sn in apt.list_available_devices()}
connected = {}

while True:
    command, *args = receive()

    if command == LIST:
        send(list(motors.keys()))

    elif command == CONNECT:
        sn, = args
        motor = apt.Motor(sn)
        connected[sn] = motor

    elif command == REFRESH:
        apt.APTCleanUp()
        apt.APTInit()

    elif command == MOVE:

        pass

    elif command == STATE:
        pass
