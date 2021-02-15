class Cooldown {
    
    constructor() {
        //base cooldowns
        this.base = [2000, 4000, 2000, 5000]
        this.reset()

        this.textures = PIXI.Loader.shared.resources["./client/sprites/skills.json"].textures;
        this.sprites = []
        this.drawSprite()
        this.dims = []
        this.masks = []
        
        for(let id = 0; id < this.timers.length; id++) {
            let dim = new PIXI.Graphics().beginFill(0x000000, 0.5).drawRect(0, 0, 59, 59).endFill()
            dim.pivot.set(29, 29)
            dim.position.set(this.sprites[id].position.x, this.sprites[id].position.y)
            let mask = new PIXI.Graphics()
            mask.rotation = - Math.PI / 2
            mask.position.set(this.sprites[id].position.x, this.sprites[id].position.y)

            dim.mask = mask
            app.stage.addChild(mask)
            app.stage.addChild(dim)
            this.masks.push(mask)
            this.dims.push(dim)
        }
    }

    reset() {
        this.timers = [0, 0, 0, 0]
    }

    isReady(skill) {
        switch(skill) { 
            case 'q':
                return this.timers[0] <= 0
            case 'w':
                return this.timers[1] <= 0
            case 'e':
                return this.timers[2] <= 0
            case 'r':
                return this.timers[3] <= 0
            default:
                return false
        }
    }

    usedSkill(skill) {
        let id = -1
        switch(skill) { 
            case 'q':
                id = 0
                break
            case 'w':
                id = 1
                break
            case 'e':
                id = 2
                break
            case 'r':
                id = 3
                break
            default:
                return
        }
        this.timers[id] = this.base[id]
    }

    update() {
        for(let i = 0; i < this.timers.length; i++) {
            if(this.timers[i] > 0) {
                this.timers[i] -= app.ticker.elapsedMS
                this.drawCooldown(i)
            } else {
                this.masks[i].clear()
            }
            //update sprites?
        }

    }

    drawSprite() {
        this.sprites.push(new Sprite(this.textures["q.png"]))
        this.sprites.push(new Sprite(this.textures["w.png"]))
        this.sprites.push(new Sprite(this.textures["e.png"]))
        this.sprites.push(new Sprite(this.textures["r.png"]))
        
        let x = 400
        this.sprites.forEach((sprite) => {
            sprite.position.set(x, 700)
            x += 70
            app.stage.addChild(sprite)
        })
        
    }

    drawCooldown(id) {
        this.masks[id].clear()
        var radius = 40
        var degrees = 360 * (1 - this.timers[id] / this.base[id])
        
        this.masks[id].beginFill()
        this.masks[id].lineStyle(2, 0xFFFFFF)
        this.masks[id].moveTo(0,0)
        this.masks[id].lineTo(radius, 0);
        this.masks[id].moveTo(0,0)
        this.masks[id].lineTo(radius * Math.cos(degrees * Math.PI/180), radius * Math.sin(degrees * Math.PI/180));
        
        this.masks[id].arc(0, 0, radius, degrees * Math.PI/180, Math.PI*2, false);
        this.masks[id].endFill()
    }
}