'use strict';

const App = require('express')();
const Http = require('http').Server(App);
const Io = require('socket.io')(Http);

const internals = {};

internals.gameInstances = {};
internals.numUsers = 0;

App.get('/', (req, res) => {

    res.sendFile(__dirname + '/html/index.html');
});

Io.on('connection', (socket) => {

    internals.numUsers++;
    socket.username = '';
    socket.gameId = '';

    console.log('User has connected');

    socket.on('disconnect', () => {

        internals.numUsers--;

        if (socket.username !== '' && socket.gameId !== '') {

            console.log(socket.username + ' left game ' + socket.gameId);

            internals.gameInstances[socket.gameId].userCount--;

            // If this is is the last user for this game instance, remove the game

            if (internals.gameInstances[socket.gameId].userCount === 0) {
                delete internals.gameInstances[socket.gameId];
                console.log('Removing game ' + socket.gameId);
            }

        }

        console.log('User has disconnected');
    });

    socket.on('create game', (username) => {

        const gameId = getUnusedGameId();

        if (gameId !== '') {
            socket.username = username;
            socket.gameId = gameId;
            internals.gameInstances[gameId] = { userCount: 1 };
            console.log(username + ' created new game ' + gameId);
        }
        else {
            console.log(username + ' is unable to create new game');
        }
    });

    socket.on('join game', (data) => {

        if (internals.gameInstances.hasOwnProperty(data.gameId)) {
            socket.username = data.username;
            socket.gameId = data.gameId;
            internals.gameInstances[socket.gameId].userCount++;
            console.log( data.username + ' joined game ' + data.gameId);
        }
        else {
            console.log(data.username + ' is unable to join game ' + data.gameId);
        }
    });

    socket.on('select team', (data) => {

    });

    socket.on('select as spymaster', (data) => {

    });

    socket.on('randomize team', (data) => {

    });

    socket.on('start game', (data) => {

    });

    socket.on('reset game', (data) => {

    });

    socket.on('provide clue', (data) => {

    });

    socket.on('select word', (data) => {

    });

    socket.on('pass turn', (data) => {

    });
});

Http.listen(3000, () => {

    console.log('listening on *:3000');
});

const getUnusedGameId = () => {

    let unusedGameId = '';

    for (let i = 0; i < 10; ++i) {
        if (!internals.gameInstances.hasOwnProperty(i.toString())) {
            unusedGameId = i.toString();
            break;
        }
    }

    return unusedGameId;
};
