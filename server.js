'use strict';

const App = require('express')();
const Http = require('http').Server(App);
const Io = require('socket.io')(Http);

const internals = {};

internals.gameInstances = {};
internals.numUsers = 0;

App.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

Io.on('connection', function(socket) {

    internals.numUsers++;
    socket.username = '';
    socket.gameId = '';

    console.log('User has connected');

    socket.on('disconnect', function () {
        internals.numUsers--;

        if (socket.username !== '' && socket.gameId !== '') {

            console.log(socket.username + ' left game ' + socket.gameId);

            internals.gameInstances[socket.gameId].userCount--;

            // If this is is the last user for this game instance, remove the game

            if (internals.gameInstances[socket.gameId].userCount == 0) {
                delete internals.gameInstances[socket.gameId];
                console.log('Removing game ' + socket.gameId);
            }

        }

        console.log('User has disconnected');
    });

    socket.on('create game', function(username) {

        let gameId = getUnusedGameId();
        let attemptCount = 0;

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

    socket.on('join game', function(data) {

        if(internals.gameInstances.hasOwnProperty(data.gameId)) {
            socket.username = data.username;
            socket.gameId = data.gameId;
            internals.gameInstances[socket.gameId].userCount++;
            console.log( data.username + ' joined game ' + data.gameId);
        }
        else {
            console.log(data.username + ' is unable to join game ' + data.gameId);
        }
    });

    socket.on('select team', function(data) {

    });

    socket.on('select as spymaster', function(data) {

    });

    socket.on('randomize team', function(data) {

    });

    socket.on('start game', function(data) {

    });

    socket.on('reset game', function(data) {

    });

    socket.on('provide clue', function(data) {

    });

    socket.on('select word', function(data) {

    });

    socket.on('pass turn', function(data) {

    });
});

Http.listen(3000, function () {
    console.log('listening on *:3000');
});

const getUnusedGameId = function () {
    let unusedGameId = '';

    for (let i = 0; i < 10; i++) {

        if(!internals.gameInstances.hasOwnProperty(i.toString())) {
            unusedGameId = i.toString();
            break
        }
    }

    return unusedGameId;
};
