const Vector = require("./vector")

class Shockwave {
    constructor(player, targetX, targetY) {
        this.position = Vector.of(player.position.x, player.position.y)
        this.target = Vector.of(targetX, targetY)
        this.speed = 24

        this.direction = Vector.sub(this.target, this.position).setMag(this.speed)
        if(this.direction.magSq() == 0) {
            this.direction = Vector.fromTheta(player.rotation -  Math.PI / 2).setMag(this.speed)
        }
        this.owner = player.id
        this.team = player.team
        this.lifespan = 20
        this.dead = false
        this.id = Math.random()
    }

    update() {
        this.position.add(this.direction)
        this.lifespan--
        if(this.lifespan < 0) {
            this.dead = true
        }
    }

}

module.exports = Shockwave