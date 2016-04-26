'use strict';

const Hoek = require('hoek');

const internals = {};

exports.Player = module.exports.Player = internals.Player = function (id) {

    Hoek.assert(this instanceof internals.Player, 'Player must be instantiated using new');
    this.Id = id;
};

exports.Team = module.exports.Team = internals.Team = function (id) {

    Hoek.assert(this instanceof internals.Team, 'Team must be instantiated using new');
    this.Id = id;
    this.players = new Map();
    this.spyMaster = null;
};

exports.BoardDeck = module.exports.BoardDeck = internals.BoardDeck = function (id) {

    Hoek.assert(this instanceof internals.BoardDeck, 'BoardDeck must be instantiated using new');
    this.Id = id;
    //--    Hardcode the content for now
    this.content = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
};

exports.SpymastersDeck = module.exports.SpymastersDeck = internals.SpymastersDeck = function (id) {

    Hoek.assert(this instanceof internals.SpymastersDeck, 'SpymastersDeck must be instantiated using new');
    this.Id = id;

    this.TILE_TYPE_RED_AGENT = 0;
    this.TILE_TYPE_BLUE_AGENT = 1;
    this.TILE_TYPE_ASSASSIN = 2;
    this.TILE_TYPE_CIVILIAN = 3;

    this.MAP_SIZE = 25;

    //--    Hardcode the content for now
    this.content = [
        [
            this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT,
            this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT,
            this.TILE_TYPE_ASSASSIN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN,
            this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT,
            this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT
        ],
        [
            this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT,
            this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT,
            this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT, this.TILE_TYPE_RED_AGENT,
            this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT, this.TILE_TYPE_BLUE_AGENT,
            this.TILE_TYPE_ASSASSIN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN, this.TILE_TYPE_CIVILIAN
        ]
    ];
};

//--    Game
exports.Game = module.exports.Game = internals.Game = function (id, creator) {

    Hoek.assert(this instanceof internals.Game, 'Game must be instantiated using new');
    this.Id = id;
    this.players = new Map();
    this.players.set(creator.Id, creator);
    this.teams = [new internals.Team(0), new internals.Team(1)];  //note hardcoded to 2 teams
    this.teamedUp = false;
    //count down to 0 when all conditions to start game is meet
    //1 count for spymasters chosen, which requires players to have teamed up already
    const READY_TO_START_CONDITION_MAX = 1;
    this.readyToStart = READY_TO_START_CONDITION_MAX;
    this.gameStarted = false;

    this.BOARD_SIZE = 25;
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

internals.Game.prototype.Start = function (boardDeck, spymastersDeck) {

    if (this._IsReadyToStart() === false) {
        return;
    }

    //Setup board
    //Here we are faced with a few choices
    //1. Shuffle the boardDeck
    //2. Randomly choose from the boardDeck and do ignore on duplication (chosen because presumably board size is relatively smaller than boardDeck size)
    const boardDeckIndices = [];
    while (boardDeckIndices.size < this.BOARD_SIZE) {
        const randomIndex = Math.floor(Math.random() * boardDeck.content.size);
        if (boardDeckIndices.indexOf(randomIndex) === -1) {
            boardDeckIndices.push(randomIndex);
        }
    }
    this.board = [];
    for (index = 0; index < this.BOARD_SIZE; ++i) {
        board.push(boardDeck.content[boardDeckIndices[index]]);
    }

    //Select spymaster map
    const spymastersMapIndex = Math.floor(Math.random() * spymastersDeck.content.size);
    this.spymastersMap = spymastersDeck.content[spymastersMapIndex];

    //TODO: implement
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
