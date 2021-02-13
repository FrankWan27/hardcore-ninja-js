class Player {
    constructor(id) {
        this.id = id
        this.size = 20
        this.drawSprite()
        this.connectionHealth = 60
    }

    move(target) {
        this.sprite.position.set(...target.asArray())
    }

    drawSprite() {
        this.sprite = new PIXI.Graphics();
        this.sprite.lineStyle(4, 0xFF3300, 1);
        this.sprite.beginFill(0x66CCFF);
        this.sprite.drawRect(0, 0, this.size, this.size);
        this.sprite.endFill();
        this.sprite.pivot.set(this.size / 2, this.size / 2)
        app.stage.addChild(this.sprite);
    }

    heartbeat() {
        this.connectionHealth = 60
    }
}