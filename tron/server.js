const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { Game } = require('./src/Game.js')

const game = new Game()
var god = null
setInterval(game.tick.bind(game), 150)

app.use(express.static('tron/dist'))
app.get('/', function (req, res) {
  res.sendfile('./dist/index.html')
})

app.get('/test', function (req, res) {
  res.send('testerino')
})

io.on('connection', function (socket) {
  console.log(`${socket.id} connected`)
  if (god == null) {
    game.god = socket
    god = socket
    socket.emit('godmode')
  } else {
    game.onPlayerJoin(socket)
  }

  socket.on('changeDir', function (dir) {
    game.onChangeDir(socket, dir)
  })

  socket.on('disconnect', function () {
    console.log(`${socket.id} disconnected`)
    if (socket === god) god = null
    game.onPlayerLeave(socket)
  })
  socket.on('startGaem', function () {
    game.sendStarting()
    setTimeout(() => { game.isGameStarted = true }, 3000)
  })

  socket.on('game:ping', () => socket.emit('game:pong', Date.now()))
})

const PORT = process.env.PORT || 3000
http.listen(PORT, function () {
  console.log(`listening on *:${PORT}`)
})
