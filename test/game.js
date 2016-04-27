'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const GameModule = require('../game');
const Player = GameModule.Player;
const Game = GameModule.Game;
const BoardDeck = GameModule.BoardDeck;
const SpymastersDeck = GameModule.SpymastersDeck;

lab.experiment('player', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const player = new Player(0);
        Code.expect(player).to.be.an.object();
        Code.expect(player.id).to.equal(0);
        done();
    });
});

lab.experiment('boardDeck', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const deck = new BoardDeck(0);
        Code.expect(deck).to.be.an.object();
        Code.expect(deck.id).to.equal(0);
        done();
    });
});

lab.experiment('spymastersDeck', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const deck = new SpymastersDeck(0);
        Code.expect(deck).to.be.an.object();
        Code.expect(deck.id).to.equal(0);
        done();
    });
});

lab.experiment('game', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const creator = new Player(0);
        Code.expect(creator.id).to.equal(0); //avoid no-unused vars from lint

        const game = new Game(0, creator);
        Code.expect(game).to.be.an.object();
        Code.expect(game.id).to.equal(0);
        Code.expect(game.players.size).to.equal(1);

        done();
    });
});

lab.experiment('game', { timeout: 1000 }, () => {

    lab.test('can be started', { parallel: true }, (done) => {

        const creator = new Player(0);
        Code.expect(creator.id).to.equal(0); //avoid no-unused vars from lint

        const game = new Game(0, creator);
        Code.expect(game).to.be.an.object();
        Code.expect(game.id).to.equal(0);
        Code.expect(game.players.size).to.equal(1);

        const player1 = new Player(1);
        const player2 = new Player(2);
        const player3 = new Player(3);

        game.AddPlayer(player1);
        Code.expect(game.players.size).to.equal(2);
        game.AddPlayer(player2);
        Code.expect(game.players.size).to.equal(3);

        //Do a game.Start here and expect an exception to be thrown because not enough players

        game.AddPlayer(player3);
        Code.expect(game.players.size).to.equal(4);

        //Do a game.Start here and expect an exception to be thrown because team not assigned

        game.AssignPlayerToTeam(creator.id, 0);
        game.AssignPlayerToTeam(player1.id, 0);
        game.AssignPlayerToTeam(player2.id, 1);
        game.AssignPlayerToTeam(player3.id, 1);

        //Do a game.Start here and expect an exception to be thrown because spy masters not assigned

        game.ChooseSpyMasters();

        const boardDeck = new BoardDeck(0);
        const spymastersDeck = new SpymastersDeck(0);

        game.Start(boardDeck, spymastersDeck);

        done();
    });
});
