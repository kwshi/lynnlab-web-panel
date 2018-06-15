import sys
import time
import os.path
sys.path.append('{!r}'.format(os.path.realpath(os.path.dirname(__file__))))
from base import BaseMotorController


class MotorController(BaseMotorController):
    def __init__(self):
        super().__init__()

        self.available = {83811901, 83811902, 83811903, 83811904}
        self.connected = {}

    def command_list(self):
        return list(self.available), None

    def command_connect(self, sn):
        sn = int(sn)

        if sn not in self.available:
            return None, 'invalid sn'

        self.connected[sn] = (0., False)
        return None, None

    def command_reset(self):
        self.connected = {}
        return None, None

    def command_move(self, sn, pos, block=False):
        sn = int(sn)
        pos = float(pos)
        if block:
            time.sleep(1)

        if sn not in self.connected:
            return None, 'invalid sn (not connected)'

        self.connected[sn] = (pos, self.connected[sn][1])
        return None, None

    def command_state(self):
        return {
            sn: {
                'position': motor[0],
                'moving': motor[1],
            }
            for sn, motor in self.connected.items()
        }, None


if __name__ == '__main__':
    MotorController().listen()
