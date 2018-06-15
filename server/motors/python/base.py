import json
import sys
import abc


def message(payload=None, error=None):
    return {
        'payload': payload,
        'success': error is None,
        'error': error,
    }


class BaseMotorController(abc.ABC):
    def __init__(self):
        self.commands = {
            'list': self.command_list,
            'connect': self.command_connect,
            'reset': self.command_reset,
            'move': self.command_move,
            'state': self.command_state,
            'exit': self.command_exit,
            'ping': self.command_ping,
        }

    def command_ping(self):
        return None, None

    def command_exit(self):
        sys.exit(0)

    @abc.abstractmethod
    def command_list(self):
        pass

    @abc.abstractmethod
    def command_connect(self, sn):
        pass

    @abc.abstractmethod
    def command_reset(self):
        pass

    @abc.abstractmethod
    def command_move(self, sn, pos, block=False):
        pass

    @abc.abstractmethod
    def command_state(self):
        pass

    def call(self, command, args):
        if command not in self.commands:
            return message(None, 'invalid command')
        return message(*self.commands[command](*args))

    def listen(self):
        try:
            while True:
                command, *args = sys.stdin.readline().strip().split(' ')

                output = self.call(command, args)

                sys.stdout.write('{}\n'.format(json.dumps(output)))
                sys.stdout.flush()
        except KeyboardInterrupt:
            pass
