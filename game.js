const Player = require('./player')
const Shockwave = require('./shockwave')

class Game {
    constructor(socketList) {
        this.players = {}
        this.shockwaves = []
        this.socketList = socketList
    }

    addPlayer(id) {
        this.players[id] = new Player(id)
    }

    removePlayer(id) {
        delete this.players[id]
    }

    movePlayer(id, target) {
        this.players[id].moveTo(target)
    }

    addShockwave(player, x, y) {
        this.shockwaves.push(new Shockwave(player.position.x, player.position.y, x, y, player.id))
    }

    update() {
        for(let id in this.players) {
            this.players[id].update()
        }
        for(let i = this.shockwaves.length - 1; i >= 0; i--) {
            let shockwave = this.shockwaves[i]
            shockwave.update()
            if(shockwave.dead) {
                this.announceShockwaveDead(shockwave)
                this.shockwaves.splice(i, 1)
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