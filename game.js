const Player = require('./player')
const Shockwave = require('./shockwave')
const Scoreboard = require('./scoreboard')
const Room = require('./room')

const GAME_WIDTH = 1024
const GAME_HEIGHT = 768
const GAME_STATE = Object.freeze({"WAITING" : 1, "PLAYING" : 2})

class Game {
    constructor(socketList) {
        this.players = {}
        this.shockwaves = []
        this.socketList = socketList
        this.scoreboard = new Scoreboard(this)
        this.teams = [1, 2]
        this.teamCount = {}
        this.state = GAME_STATE.WAITING
        this.resetTeamCount()
        
    }

    addPlayer(id) {
        let team = this.nextTeam()
        this.respawnPlayer(id, team)
        if(this.state == GAME_STATE.PLAYING) {
            this.players[id].dead = true
        }
        this.scoreboard.addPlayer(id, team)
    }

    removePlayer(id) {
        delete this.players[id]
        this.scoreboard.removePlayer(id)
    }

    movePlayer(id, target) {
        this.players[id].moveTo(target)
    }

    blinkPlayer(id, target) {
        this.players[id].blinkTo(target)
    }

    shieldPlayer(id) {
        this.players[id].applyShield()
    }

    addShockwave(player, x, y) {
        let shockwave = new Shockwave(player, x, y)
        this.shockwaves.push(shockwave)
        this.players[player.id].rotation = shockwave.direction.heading() + Math.PI / 2
    }

    //get next team, or default to team 1
    nextTeam() {
        let counter = {}
        this.teams.forEach((team) => {
            counter[team] = 0
        })


        for(let id in this.players) {
            let team = this.players[id].team
            counter[team] = counter[team] + 1
        }

        //hardcoded to be 2 teams
        if (counter[2] < counter[1]) {
            return 2
        } 
        return 1
    }

    respawnPlayers() {
        this.resetTeamCount()
        for(let id in this.players) {
            this.respawnPlayer(id, this.players[id].team)
            this.teamCount[this.players[id].team] = this.teamCount[this.players[id].team] + 1
        }
    }

    respawnPlayer(id, team) {
        this.players[id] = new Player(id, team, Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
    }

    resetTeamCount() {
        this.teams.forEach((team) => {
            this.teamCount[team] = 0
        })
    }

    update(delta) {
        if(this.state == GAME_STATE.WAITING) {
            if(Object.keys(this.players).length >= 2) {
                this.scoreboard.resetScore()
                this.respawnPlayers()
                this.state = GAME_STATE.PLAYING
            }
        } 
        for(let i = this.shockwaves.length - 1; i >= 0; i--) {
            let shockwave = this.shockwaves[i]
            shockwave.update()
            if(shockwave.dead) {
                this.broadcast('shockwave-die', {id: shockwave.id})
                this.shockwaves.splice(i, 1)
            }
        }
        for(let id in this.players) {
            let player = this.players[id]
            player.update(delta)
            let killer = player.checkCollisions(this.shockwaves)
            if(killer) {
                this.scoreboard.playerKill(killer, id)
                player.dead = true
                this.teamCount[player.team] = this.teamCount[player.team] - 1
            }
        }

        if(this.state == GAME_STATE.PLAYING) {
            if(Object.keys(this.players).length < 2) {
                this.state = GAME_STATE.WAITING
            }
            this.checkRoundEnd()
        }
    }
    
    checkRoundEnd() {
        let shouldRespawn = false
        
        if(this.teamCount[1] == 0) {
            console.log("Team 2 wins!")
            this.scoreboard.roundWin(2)
            shouldRespawn = true
        }
        else if(this.teamCount[2] == 0) {
            console.log("Team 1 wins!")
            this.scoreboard.roundWin(1)
            shouldRespawn = true
        }
        if(shouldRespawn) {
            this.respawnPlayers()
        }
    }

    broadcast(message, data) {
        for(let id in this.socketList) {
            this.socketList[id].emit(message, data)
        }
    }
}


module.exports = Game