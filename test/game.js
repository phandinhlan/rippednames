'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const GameModule = require('../game');
const Player = GameModule.Player;

lab.experiment('player', { timeout: 1000 }, () => {

    lab.test('can be instantiated', { parallel: true }, (done) => {

        const player = new Player(0);
        Code.expect(player).to.be.an.object();
        Code.expect(player.Id).to.equal(0);
        done();
    });
});
