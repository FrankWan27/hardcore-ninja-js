class Scoreboard {
    
    constructor() {
        this.kd = {}
    }

    addPlayer(id) {
        this.kd[id] = {
            kills: 0,
            deaths: 0
        }
    }

    removePlayer(id) {
        delete this.kd[id]
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

        this.printScore()
    }

    printScore() {
        console.log(this.kd)
    }
}

module.exports = Scoreboard