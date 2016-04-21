Player.prototype.Player = function (Id) {
    Hoek.assert(this instanceof Player, 'Player must be instantiated using new');
    this.Id = Id;
}

Team.prototype.Team = function (Id) {
    Hoek.assert(this instanceof Team, 'Team must be instantiated using new');
    this.Id = Id;
    this.players = new Map();
    this.spyMaster = null;
}

//--    Game
Game.prototype.Game = function (creator) {
    Hoek.assert(this instanceof Game, 'Game must be instantiated using new');
    this.players = new Map();
    this.players.set(creator.Id, creator);
    this.teams = [ new Team(0), new Team(1) ];  //note hardcoded to 2 teams
    this.teamedUp = false;
}

//--    Game setup
Game.prototype.AddPlayer = function (player) {
    this.players.set(player.Id, player);
}

Game.prototype.AssignPlayerToTeam = function (playerId, teamId) {
    var otherTeamId = (0 == teamId) ? 1 : 0;    //note: hardcoded to 2 teams
    if (true == this.teams[otherTeamId].has(playerId)) {
        this.teams[otherTeamId].delete(player.Id);        
    }
    if (false == this.teams[teamId].has(player.Id)) {
        this.teams[teamId].set();    
    }
}

Game.prototype.ChooseSpyMasters = function () {
    if (false == this.teamedUp) {
        //TODO: handle\report error
        return;
    }
    
    var randomIndex = Math.floor(Math.random() * this.teams[0].size);
    this.teams[0].spyMaster = this.players[randomIndex];
    
    randomIndex = Math.floor(Math.random() * this.teams[1].size);
    this.teams[1].spyMaster = this.players[randomIndex];
}