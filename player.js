const Vector = require('./vector')

class Player {
    constructor(id) {
        this.id = id
        this.position = new Vector()
        this.target = new Vector()
        this.speed = 5
    }

    moveTo(target) {
        this.target = target.clone()
    }

    update() {
        let direction = Vector.sub(this.target, this.position).limit(this.speed)
        this.position.add(direction)
    }
}

module.exports = Player