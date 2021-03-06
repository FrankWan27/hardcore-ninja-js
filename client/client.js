/// <reference path="../pixi.js.d.ts"/>

var mouseX = -1;
var mouseY = -1;
var myId = -1;
var amDead = false

var socket = io() 
var cooldowns

document.onmousemove = function(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

document.addEventListener('contextmenu', (e) => {
    socket.emit('right-click', {
        x: mouseX,
        y: mouseY
    })
    
    quickSprites.moveIndicator(mouseX, mouseY)

    e.preventDefault();
});

socket.on('update', (data) => {
    data.players.forEach((player) => {
        if(!(player.id in players)) {
            players[player.id] = new Player(player.id, player.team)
        }
        players[player.id].move(Vector.of(player.x, player.y), player.rotation)
        players[player.id].toggleShield(player.shield)
        players[player.id].heartbeat()
        if(player.id == myId) {
            if(player.dead) {
                amDead = true
            } else {
                amDead = false
            }
        }
    })

    data.shockwaves.forEach((shockwave) => {
        if(!(shockwave.id in shockwaves)) {
            shockwaves[shockwave.id] = new Shockwave(shockwave.id, Vector.of(shockwave.x, shockwave.y), shockwave.theta)
        }
        else {        
            shockwaves[shockwave.id].move(Vector.of(shockwave.x, shockwave.y))
        }
    })

    data.blinks.forEach((blink) => {
        quickSprites.blink(blink.x, blink.y)
        quickSprites.land(blink.x2, blink.y2)
    })
}) 

socket.on('update-kd', (data) => {
    console.log(data)
})

socket.on('update-roundscore', (data) => {
    for(let team in data) {
        console.log('Team ' + team + ': ' + data[team])
    }
})


socket.on('id', (id) => {
    myId = id
})

socket.on('shockwave-die', (data) => {
    shockwaves[data.id].die()
    delete shockwaves[data.id]
})

document.onkeydown = function(event){
    if(amDead) {
        return
    }
    if(event.key === 'q') {	
        if(cooldowns.isReady('q')) {
            cooldowns.usedSkill('q')
            socket.emit('key-press', {
                input:'q', 
                x: mouseX, 
                y: mouseY
            })
        }
    }
    if(event.key === 'w') {
        if(cooldowns.isReady('w')) {
            cooldowns.usedSkill('w')
            socket.emit('key-press', {
                input:'w', 
                x: mouseX, 
                y: mouseY
            })
        }
    }
    if(event.key === 'e') {
        if(cooldowns.isReady('e')) {
            cooldowns.usedSkill('e')
            socket.emit('key-press', {
                input:'e', 
                x: mouseX, 
                y: mouseY
            })
        }
    }
    if(event.key === 'r') {
        let id = mouseOnTarget(mouseX, mouseY)
        if(id) {
            if(cooldowns.isReady('r')) {
                cooldowns.usedSkill('r')
                socket.emit('key-press', {
                    input:'r', 
                    target: id
                })
            }
        }
    }
    if(event.key == 's') {
        socket.emit('key-press', {
            input:'s'
        })
    }
}

function mouseOnTarget(x, y) {
    for(let id in players) {
        if(id == myId) {
            continue
        }
        let playerVec = new Vector(players[id].sprite.position.x, players[id].sprite.position.y)
        let mouseVec = new Vector(x, y)
        
        if(Vector.sub(playerVec, mouseVec).magSq() < 25 ** 2) { //hitbox = 25 
            return id
        }
    }
    return null
}