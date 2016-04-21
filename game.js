function Player(Id) {
    this.Id = Id;
}

function Team(Id) {
    this.Id = Id;
    this.players = new Map();
    this.spyMaster = null;
}

function Game(creator) {
    this.players = new Map();
    this.players.set(creator.Id, creator);
    this.teams = [ new Team(0), new Team(1) ];  //note hardcoded to 2 teams
    this.teamedUp = false;
    
    //--    Setup
    this.AddPlayer = function (player) {
        this.players.set(player.Id, player);
    }
    
    this.AssignPlayerToTeam = function (player, teamId) {
        var otherTeamId = (0 == teamId) ? 1 : 0;    //note: hardcoded to 2 teams
        if (true == this.teams[otherTeamId].has(teamId)) {
            this.teams[otherTeamId].delete(player.Id);        
        }
        if (false == this.teams[teamId].has(player.Id)) {
            this.teams[teamId].set();    
        }   
    }
    
    this.ChooseSpyMasters = function () {
        if (false == this.teamedUp) {
            //TODO: handle\report error
            return;
        }
        
        var randomIndex = Math.floor(Math.random() * this.teams[0].size);
        this.teams[0].spyMaster = this.players[randomIndex];
        
        randomIndex = Math.floor(Math.random() * this.teams[1].size);
        this.teams[0].spyMaster = this.players[randomIndex];
    }
    //--
}