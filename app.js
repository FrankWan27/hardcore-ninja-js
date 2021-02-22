const express = require('express')
const app = express()
const serv = require('http').Server(app)
const io = require('socket.io')(serv,{})
const Game = require('./game')
const Vector = require('./vector')

const TICKRATE = 1000/64 //64 ticks per second
const socketList = {}
var blinkSprites = []
const game = new Game(socketList)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html')
})

app.use('/client', express.static(__dirname + '/client'))
app.use('/favicon.ico', express.static('favicon.ico'))

serv.listen(process.env.PORT || 2000)
console.log("Server started")

io.sockets.on('connection', (socket) => {
	socket.id = Math.random()
	socketList[socket.id] = socket
	game.addPlayer(socket.id)

	console.log('client#' + socket.id + ' connected')

	socket.emit("id", socket.id)

	socket.on('disconnect', () => {
		console.log('client#' + socket.id + ' disconnected')
		delete socketList[socket.id]
		game.removePlayer(socket.id)
	})

	socket.on('right-click', (data) => {
		game.movePlayer(socket.id, Vector.of(data.x, data.y))
	})

	socket.on('key-press', (data) => {
		let player = game.players[socket.id]
		if(data.input === "q") {
			console.log('shield')
			game.shieldPlayer(socket.id)
		}
		if(data.input === "w") {
			let oldX = game.players[socket.id].position.x
			let oldY = game.players[socket.id].position.y
			game.blinkPlayer(socket.id, Vector.of(data.x, data.y))
			blinkSprites.push({
				x: oldX,
				y: oldY,
				x2: game.players[socket.id].position.x,
				y2: game.players[socket.id].position.y
			})
		}
		if(data.input === "e") {
			game.addShockwave(player, data.x, data.y)
		}
		if(data.input === "s") {
			game.movePlayer(socket.id, player.position)
		}
	})
})

setInterval(() => {
	//calculate players
	game.update(TICKRATE)

	//player info
	var pack = {}
	pack.players = []

	for(let id in socketList) {

		let player = game.players[id]
		pack.players.push({
			dead: player.dead,
			id: id,
			team: game.players[id].team,
			x: player.position.x,
			y: player.position.y,
			rotation: player.rotation,
			shield: player.shield
		}) 
	}

	//shockwaves
	pack.shockwaves = []
	game.shockwaves.forEach((shockwave) => {
		pack.shockwaves.push({
			id: shockwave.id,
			x: shockwave.position.x,
			y: shockwave.position.y,
			theta: shockwave.direction.heading() + Math.PI / 2
		})
	})

	//blinks
	pack.blinks = blinkSprites

	for(let id in socketList) {
		let socket = socketList[id]
		socket.emit('update', pack)
	}

	blinkSprites = []
}, TICKRATE) 