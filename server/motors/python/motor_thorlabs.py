import thorlabs_apt as apt
import sys
import os.path
sys.path.append('{!r}'.format(os.path.realpath(os.path.dirname(__file__))))
from base import BaseMotorController


class MotorController(BaseMotorController):
    def __init__(self):
        super().__init__()

        self.available = {sn for _, sn in apt.list_available_devices()}
        self.connected = {}

    def command_list(self):
        return list(self.available), None

    def command_connect(self, sn):
        try:
            sn = int(sn)
            motor = apt.Motor(sn)
            self.connected[sn] = motor
        except Exception:
            return None, 'failed to connect (invalid sn?)'

        return None, None

    def command_reset(self):
        apt.APTCleanUp()
        apt.APTInit()
        self.connected = {}
        return None, None

    def command_move(self, sn, pos, block=False):
        try:
            sn = int(sn)
            pos = float(pos)
            block = bool(block)
            self.connected[sn].move_to(pos, block)
        except ValueError:
            return None, 'invalid sn (not connected)'

        return None, None

    def command_state(self):
        return {
            sn: {
                'position': motor.position,
                'moving': motor.is_in_motion,
            }
            for sn, motor in self.connected.items()
        }, None


if __name__ == '__main__':
    MotorController().listen()
