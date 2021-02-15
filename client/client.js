/// <reference path="../pixi.js.d.ts"/>

var mouseX = -1;
var mouseY = -1;
var myId = -1;

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
    
    new moveIndicator(mouseX, mouseY)

    e.preventDefault();
});

socket.on('update', (data) => {
    data.players.forEach((player) => {
        if(!(player.id in players)) {
            players[player.id] = new Player(player.id)
        }
        players[player.id].move(Vector.of(player.x, player.y))
        players[player.id].toggleShield(player.shield)
        players[player.id].heartbeat()
    })

    data.shockwaves.forEach((shockwave) => {
        if(!(shockwave.id in shockwaves)) {
            shockwaves[shockwave.id] = new Shockwave(shockwave.id, Vector.of(shockwave.x, shockwave.y), shockwave.theta)
        }
        else {        
            shockwaves[shockwave.id].move(Vector.of(shockwave.x, shockwave.y))
        }
    })
}) 

socket.on('id', (id) => {
    myId = id
})

socket.on('shockwave-die', (data) => {
    shockwaves[data.id].die()
    delete shockwaves[data.id]
})

document.onkeydown = function(event){
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
            new blinkSprite(players[myId].sprite.position.x, players[myId].sprite.position.y)
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
        if(cooldowns.isReady('r')) {
            cooldowns.usedSkill('r')
            socket.emit('key-press', {
                input:'r', 
                x: mouseX, 
                y: mouseY
            })
        }
    }
    if(event.key == 's') {
        socket.emit('key-press', {
            input:'s'
        })
    }
}

