class Player {
    constructor(id, team) {
        this.id = id
        this.team = team
        this.size = 20
        this.drawSprite()
        this.renderShieldSprite()
        this.shield = false
        this.connectionHealth = 60
    }

    move(target, rotation) {
        this.sprite.position.set(...target.asArray())
        this.rotateSprite(rotation)
        this.shieldSprite.position.set(...target.asArray())
    }

    rotateSprite(theta) {
        theta = (theta + (Math.PI * 2))
        theta = theta % (Math.PI * 2)
        if(theta > 0 && theta < Math.PI / 4) {
            this.sprite.rotation = 0
        } else if(theta < 3 * Math.PI / 4) {
            this.sprite.rotation = Math.PI / 2
        } else if(theta < 5 * Math.PI / 4) {
            this.sprite.rotation = Math.PI 
        } else if(theta < 7 * Math.PI / 4) {
            this.sprite.rotation = 3 * Math.PI / 2
        } else {
            this.sprite.rotation = 0
        }
    }

    drawSprite() {
        let color = this.team == 1 ? 0xFF3300 : 0x0033FF
        this.sprite = new PIXI.Graphics()
            .lineStyle(4, color, 1)
            .beginFill(0x66CCFF)
            .drawPolygon([
                -this.size, this.size,             
                0, -this.size,  
                this.size, this.size             
            ])
            .endFill()
        
        this.sprite.pivot.set(0, 0)
        app.stage.addChild(this.sprite);
    }

    renderShieldSprite() {
        this.shieldSprite = new PIXI.Graphics()
            .beginFill(0x9966FF)
            .lineStyle(4, 0x9966FF, 1)
            .drawCircle(0, 0, 32)
            .endFill()

        this.shieldSprite.alpha = 0.3
    }

    toggleShield(active) {
        if(this.shield && !active) {
            this.shield = false
            app.stage.removeChild(this.shieldSprite)
        }
        if(!this.shield && active) {
            this.shield = true
            app.stage.addChild(this.shieldSprite)
        }
    }

    heartbeat() {
        this.connectionHealth = 60
    }
}