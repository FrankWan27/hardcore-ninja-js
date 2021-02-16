//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader =  PIXI.Loader.shared,
    resources =  PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

//Init pixijs
let app = new Application({
    antialias: true,
    width: 1024,
    height: 768
})

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load nothing and run the `setup` function when it's done
loader
.add("./client/sprites/moveIndicator.json")
.add("./client/sprites/shockwave.json")
.add("./client/sprites/blink.json")
.add("./client/sprites/land.json")
.add("./client/sprites/skills.json")
.load(setup);

var players = {}
var shockwaves = {}

function setup() {
    app.ticker.add(delta => gameLoop(delta))
    app.renderer.backgroundColor = 0x795548
    cooldowns = new Cooldown()
}


function gameLoop(delta) {
    for(let id in players) {
        players[id].connectionHealth--
        if (players[id].connectionHealth < 0) {
            app.stage.removeChild(players[id].sprite)
            delete players[id]
        }
    }
    
    cooldowns.update()
}

class quickSprites {
    static moveIndicator(x, y) {
        let sprite = new PIXI.AnimatedSprite(resources["./client/sprites/moveIndicator.json"].spritesheet.animations["pixil-frame"])
        sprite.scale.set(0.5, 0.4)
        sprite.position.set(x, y)
        sprite.animationSpeed = 0.4
        sprite.loop = false
        sprite.alpha = 0.8
        sprite.play()
        app.stage.addChild(sprite)

        sprite.onComplete = () => {
            sprite.destroy()
        }
    }

    static blink(x, y) {
        let sprite = new PIXI.AnimatedSprite(resources["./client/sprites/blink.json"].spritesheet.animations["blink"])
        sprite.position.set(x, y)
        sprite.animationSpeed = 0.3
        sprite.loop = false
        sprite.alpha = 0.8
        sprite.play()
        app.stage.addChild(sprite)

        sprite.onComplete = () => {
            sprite.destroy()
        }
    }

    static land(x, y) {
        let sprite = new PIXI.AnimatedSprite(resources["./client/sprites/land.json"].spritesheet.animations["land"])
        sprite.position.set(x, y)
        sprite.anchor.set(0.5, 0.75)
        sprite.animationSpeed = 0.3
        sprite.loop = false
        sprite.alpha = 0.8
        sprite.play()
        app.stage.addChild(sprite)

        sprite.onComplete = () => {
            sprite.destroy()
        }      
    }
}