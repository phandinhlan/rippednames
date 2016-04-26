'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const GameModule = require('../game');
const Player = GameModule.Player;
const Game = GameModule.Game;

lab.experiment('player', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const player = new Player(0);
        Code.expect(player).to.be.an.object();
        Code.expect(player.Id).to.equal(0);
        done();
    });
});

lab.experiment('game', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const creator = new Player(0);
        Code.expect(creator.Id).to.equal(0); //avoid no-unused vars from lint

        const game = new Game(0, creator);
        Code.expect(game).to.be.an.object();
        Code.expect(game.Id).to.equal(0);
        Code.expect(game.players.size).to.equal(1);
        done();
    });
});
