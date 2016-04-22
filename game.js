'use strict';

const Hoek = require('hoek');

const internals = {};

exports = module.exports = internals.Player = function (id) {

    Hoek.assert(this instanceof internals.Player, 'Player must be instantiated using new');
    this.Id = id;
};

exports = module.exports = internals.Team = function (id) {

    Hoek.assert(this instanceof internals.Team, 'Team must be instantiated using new');
    this.Id = Id;
    this.players = new Map();
    this.spyMaster = null;
};

//--    Game
exports = module.exports = internals.Game = function (id, creator) {

    Hoek.assert(this instanceof internals.Game, 'Game must be instantiated using new');
    this.Id = id;
    this.players = new Map();
    this.players.set(creator.Id, creator);
    this.teams = [new Team(0), new Team(1)];  //note hardcoded to 2 teams
    this.teamedUp = false;
    //count down to 0 when all conditions to start game is meet
    //1 count for spymasters chosen, which requires players to have teamed up already
    const READY_TO_START_CONDITION_MAX = 1;
    this.readyToStart = READY_TO_START_CONDITION_MAX;
    this.gameStarted = false;
};

//--    Game setup
internals.Game.prototype.AddPlayer = function (player) {

    this.players.set(player.Id, player);
};

internals.Game.prototype.AssignPlayerToTeam = function (playerId, teamId) {

    const otherTeamId = (teamId === 0) ? 1 : 0;    //note: hardcoded to 2 teams
    if (this.teams[otherTeamId].has(playerId) === true) {
        this.teams[otherTeamId].delete(player.Id);
    }

    if (this.teams[teamId].has(player.Id) === false) {
        this.teams[teamId].set();
    }
};

internals.Game.prototype.ChooseSpyMasters = function () {

    if (this.teamedUp === false) {
        //TODO: handle\report error
        return;
    }

    let randomIndex = Math.floor(Math.random() * this.teams[0].size);
    this.teams[0].spyMaster = this.players[randomIndex];

    randomIndex = Math.floor(Math.random() * this.teams[1].size);
    this.teams[1].spyMaster = this.players[randomIndex];

    this._CreditReadyToStartCondition();
};

internals.Game.prototype.Start = function () {

    if (this._IsReadyToStart() === false) {
        return;
    }

    //TODO: implement
    //Setup board
    //Select spymaster map
    //What else?

    this.gameStarted = true;
};

internals.Game.prototype.IsReadyToStart = function () {

    return (this.readyToStart === 0);
};

internals.Game.prototype._CreditReadyToStartCondition = function () {

    Hoek.assert(this.IsReadyToStart() === false, 'Ready to start condition out of sync');
    --this.readyToStart;
};

internals.Game.prototype._DebitReadyToStartCondition = function () {

    Hoek.assert(this.readyToStart !== READY_TO_START_CONDITION_MAX, 'Ready to start condition out of sync');
    ++this.readyToStart;
};
