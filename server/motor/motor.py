import thorlabs_apt as apt
import sys


def send(message):
    sys.stdout.write('{}\n'.format(message))


def receive(message):
    return sys.stdout.readline()


sys.stdout.write('loaded\n')

motors = {sn: model for model, sn in apt.list_available_devices()}
