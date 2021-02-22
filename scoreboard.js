class Scoreboard {
    
    constructor(game) {
        this.kd = {}
        this.idToTeam = {}
        this.roundScore = {}
        this.resetScore()
        this.game = game
    }

    addPlayer(id, team) {
        this.kd[id] = {
            kills: 0,
            deaths: 0
        }
        this.idToTeam[id] = team
    }

    removePlayer(id) {
        delete this.kd[id]
        delete this.idToTeam[id]
    }


    playerKill(killer, death) {
        this.kd[killer] = {
            kills: this.kd[killer].kills + 1,
            deaths: this.kd[killer].deaths
        }

        this.kd[death] = {
            kills: this.kd[death].kills,
            deaths: this.kd[death].deaths + 1
        }
        this.updateKDScore()
    }

    resetScore() {
        this.roundScore[1] = 0
        this.roundScore[2] = 0
    }

    roundWin(team) {
        this.roundScore[team] = this.roundScore[team] + 1
        this.updateRoundScore()
    }

    printScore() {
        console.log(this.kd)
        console.log(this.roundScore)
    }

    updateRoundScore() {
        this.game.broadcast('update-roundscore', this.roundScore)
    }

    updateKDScore() {
        let packet = {}
        packet[1] = {}
        packet[2] = {}

        for(let id in this.kd) {
            let team = this.idToTeam[id]
            packet[team][id] = this.kd[id]
        }

        this.game.broadcast('update-kd', packet)
    }
}

module.exports = Scoreboard