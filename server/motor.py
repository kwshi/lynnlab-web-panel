import thorlabs_apt as apt
import sys


def send(message):
    sys.stdout.write('{}\n'.format(message))


def respond(query, message):
    sys.stdout.write('{} {}\n'.format(message))


sys.stdout.write('loaded\n')

motors = {sn: model for model, sn in apt.list_available_devices()}
