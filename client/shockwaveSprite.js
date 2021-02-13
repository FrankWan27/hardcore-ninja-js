class Shockwave {
    constructor(id, position, theta) {
        this.id = id
        this.position = position
        this.theta = theta
        this.size = 5
        this.drawSprite()
        this.particles = []
        this.numParticles = 5 //number of particles generated per frame
        this.maxParticles = this.numParticles * 2
    }

    move(target) {
        while(this.particles.length > this.maxParticles) {
            let particle = this.particles.shift()
            app.stage.removeChild(particle)
        }
        
        for(let i = 0; i < this.numParticles; i++) {

            let particle = new PIXI.Graphics()
            particle.beginFill(0x40C4FF)
            particle.drawPolygon([
                2 * i + 0, 0,             
                2 * i + this.size , -this.size * (Math.random() * 8 + 6), //random height between 6 and 14        
                2 * i + this.size * 2, 0              
            ])
            particle.rotation = Math.random() - 0.5
            particle.endFill()
            particle.position.set(...target.asArray())
            app.stage.addChild(particle)
            this.particles.push(particle)
                        
        }
    }

    drawSprite() {
        this.sprite = new PIXI.AnimatedSprite(resources["client/sprites/shockwave.json"].spritesheet.animations["shockwave"])
        this.sprite.rotation = this.theta
        this.sprite.position.set(this.position.x, this.position.y)
        this.sprite.animationSpeed = 1
        this.sprite.loop = false
        this.sprite.play()
        app.stage.addChild(this.sprite)

        this.sprite.onComplete = () => {
            this.sprite.destroy()
        }
    }

    die() {
        this.particles.forEach((particle) => {
            app.stage.removeChild(particle)
        })
    }
}