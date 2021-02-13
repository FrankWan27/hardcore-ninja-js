/// <reference path="../pixi.js.d.ts"/>

var mouseX = -1;
var mouseY = -1;

var socket = io() 

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

socket.on('shockwave-die', (data) => {
    shockwaves[data.id].die()
    delete shockwaves[data.id]
})

document.onkeydown = function(event){
    if(event.key === "q")	
        socket.emit('key-press', {
            input:'q', 
            x: mouseX, 
            y: mouseY
        });
    if(event.key === "w")	
        socket.emit('key-press', {
            input:'w', 
            x: mouseX, 
            y: mouseY
        });
    if(event.key === "e")	
        socket.emit('key-press', {
            input:'e', 
            x: mouseX, 
            y: mouseY
        });
    if(event.key === "r")	
        socket.emit('key-press', {
            input:'r', 
            x: mouseX, 
            y: mouseY
        });
    if(event.key == "s") 
        socket.emit('key-press', {
            input:'s'
        })
}