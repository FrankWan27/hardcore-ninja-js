const Player = require('./player')
const Shockwave = require('./shockwave')
const Scoreboard = require('./scoreboard')

const GAME_WIDTH = 1024
const GAME_HEIGHT = 768

class Game {
    constructor(socketList) {
        this.players = {}
        this.shockwaves = []
        this.socketList = socketList
        this.scoreboard = new Scoreboard()
    }

    addPlayer(id) {
        this.players[id] = new Player(id, Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
        this.scoreboard.addPlayer(id)
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

    addShockwave(player, x, y) {
        this.shockwaves.push(new Shockwave(player.position.x, player.position.y, x, y, player.id))
    }

    update() {
        for(let i = this.shockwaves.length - 1; i >= 0; i--) {
            let shockwave = this.shockwaves[i]
            shockwave.update()
            if(shockwave.dead) {
                this.announceShockwaveDead(shockwave)
                this.shockwaves.splice(i, 1)
            }
        }
        for(let id in this.players) {
            this.players[id].update()
            let killer = this.players[id].checkCollisions(this.shockwaves)
            if(killer) {
                this.scoreboard.playerKill(killer, id)
                this.players[id] = new Player(id, Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
            }
        }

    }

    announceShockwaveDead(shockwave) {
        for(let id in this.socketList) {
            let socket = this.socketList[id]
            socket.emit('shockwave-die', {id: shockwave.id})
        }
    }
}


module.exports = Game