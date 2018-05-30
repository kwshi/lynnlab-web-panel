import flask
import flask_socketio
import threading
import time

LOG_PATH = 'tmp/ccu-log.csv'

app = flask.Flask(__name__)
socketio = flask_socketio.SocketIO(app)


@app.route('/')
def root():
    return flask.send_file('client/root.html')


def reader():
    while True:
        print('sending log')
        socketio.emit('log', 'hi')
        time.sleep(1)


def main():
    socketio.run(app)


@socketio.on('message')
def handle_message(message):
    print(message)


@socketio.on('connect')
def handle_connect():
    print('connect')
    flask_socketio.send('hello')


@socketio.on('disconnect')
def handle_disconnect():
    print('disconnect')


@socketio.on('log')
def handle_log(message):
    print('log', message)


if __name__ == '__main__':
    main()
