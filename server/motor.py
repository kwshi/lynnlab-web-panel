import thorlabs_apt as apt
import sys


sys.stdout.write('loaded\n')

motors = {sn, model for model, sn in apt.list_available_devices()}
