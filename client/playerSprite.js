class Player {
    constructor(id) {
        this.id = id
        this.size = 20
        this.drawSprite()
        this.renderShieldSprite()
        this.shield = false
        this.connectionHealth = 60
    }

    move(target) {
        this.sprite.position.set(...target.asArray())
        this.shieldSprite.position.set(...target.asArray())
    }

    drawSprite() {
        this.sprite = new PIXI.Graphics()
            .lineStyle(4, 0xFF3300, 1)
            .beginFill(0x66CCFF)
            .drawRect(0, 0, this.size, this.size)
            .endFill()
        
        this.sprite.pivot.set(this.size / 2, this.size / 2)
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