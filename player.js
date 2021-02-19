const Vector = require('./vector')

const BLINK_RANGE = 400
const HITBOX = 25

class Player {
    constructor(id, x, y) {
        this.id = id
        this.position = new Vector(x, y)
        this.rotation = 0
        this.target = this.position.clone()
        this.speed = 5
        this.shield = false
        this.shieldDuration = 0
    }

    moveTo(target) {
        this.target = target.clone()
    }

    blinkTo(target) {
        let desiredBlink = Vector.sub(target, this.position)
        this.position.add(desiredBlink.limit(BLINK_RANGE))
        this.rotation = desiredBlink.heading() + Math.PI / 2
        this.target = this.position.clone()
    }

    applyShield() {
        this.shield = true
        this.shieldDuration = 700
    }

    update(delta) {
        this.shield = this.shieldDuration > 0
        this.shieldDuration -= delta
        let direction = Vector.sub(this.target, this.position).limit(this.speed)
        if(direction.magSq() > 0) {
            this.rotation = direction.heading() + Math.PI / 2
        }
        this.position.add(direction)
    }

    checkCollisions(shockwaves) {
        let killer = 0
        shockwaves.forEach((shockwave) => {
            if(this.checkCollision(shockwave)) {
                killer = shockwave.owner
                return shockwave.owner
            }
        })
        return killer
    }

    checkCollision(shockwave) {
        if(shockwave.owner == this.id) {
            return false
        }
        if(Vector.sub(shockwave.position, this.position).magSq() < HITBOX ** 2) {
            return !this.shield
        }
        return false
    }
}

module.exports = Player