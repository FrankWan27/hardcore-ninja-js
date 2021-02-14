const Vector = require("./vector")

class Shockwave {
    constructor(startX, startY, targetX, targetY, owner) {
        this.position = Vector.of(startX, startY)
        this.target = Vector.of(targetX, targetY)
        this.speed = 24
        this.direction = Vector.sub(this.target, this.position).setMag(this.speed)
        this.owner = owner
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