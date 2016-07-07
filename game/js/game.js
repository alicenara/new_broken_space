// const Phaser = require('phaser.min.js')

const Alien = function (index, game, x, y) {
  // var x = game.world.randomX
  // var y = game.world.randomY

  this.game = game
  this.sprite = game.add.sprite(x, y, 'enemy', 'tank1')
  this.ripsprite = game.add.sprite(x, y, 'enemy', 'tank1')
  this.alive = true

  // this.shadow = game.add.sprite(x, y, 'enemy', 'shadow')
  // this.tank = game.add.sprite(x, y, 'enemy', 'tank1')
  // this.turret = game.add.sprite(x, y, 'enemy', 'turret')
  //
  // this.shadow.anchor.set(0.5)
  // this.tank.anchor.set(0.5)
  // this.turret.anchor.set(0.3, 0.5)
  //
  // this.tank.name = index.toString()
  // game.physics.enable(this.tank, Phaser.Physics.ARCADE)
  // this.tank.body.immovable = false
  // this.tank.body.collideWorldBounds = true
  // this.tank.body.bounce.setTo(1, 1)
  //
  // this.tank.angle = game.rnd.angle()
  //
  // game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity)
}

Alien.prototype.rip = function () {
  this.alive = false
  this.sprite = this.ripsprite
  return true
}

const Cop = function (index, game, x, y) {
  this.game = game
  this.sprite = game.add.sprite(x, y, 'enemy', 'tank1')
  this.alive = true
  // game.physics.enable(this.tank, Phaser.Physics.ARCADE)
}

Cop.prototype.rip = function () {
  this.alive = false
  this.sprite = this.ripsprite
  return true
}

const Crew = function (index, game, x, y) {
  this.game = game
  this.sprite = game.add.sprite(x, y, 'enemy', 'tank1')
  this.alive = true
  // game.physics.enable(this.tank, Phaser.Physics.ARCADE)
}

Crew.prototype.rip = function () {
  this.alive = false
  this.sprite = this.ripsprite
  return true
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'broken_space', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.stage.backgroundColor = '#000000'
  game.load.image('grid', 'assets/sprites/grid.png')
  game.load.image('room1', 'assets/sprites/room1.png')
  game.load.image('timeBar', 'assets/gui/timeBar.png')
  game.load.image('hud', 'assets/gui/hud.png')
  game.load.image('bg', 'assets/sprites/background.png')
  game.load.image('blood', 'assets/sprites/blood.png')
  game.load.image('alienBlood', 'assets/sprites/bloodAlien.png')
  game.load.spritesheet('crew', 'assets/sprites/nino1_spritesheet.png', 23, 40, 9)
  game.load.spritesheet('cop', 'assets/sprites/police_spritesheet.png', 23, 40, 9)
  game.load.spritesheet('alien', 'assets/sprites/alien.png', 27, 51, 3)
  game.load.bitmapFont('PixelFont', 'assets/font/font.png', 'assets/font/font.fnt')
}

// Grid variables
var grid
var gridInfo = []
var gridOffset = 50
var gridX = 10
var gridY = 8
var cellSize = 100

// Board variables
var board
var boardInfo
var maxCells = 30
var canUseCell = true
var turnNum  = 0
var clicked
var unitSelected = ""

// Camera and drag variables
var dragX = -1
var dragY = -1
var draggin = false
var cameraSpeed = 15

// GUI variables
var turnTime = 5000
var turnElapsedTime = 99999
var timeBar
var timeFill
var turnText
var copText
var alienText
var crewText
var hud
var pplCounter = 0
var copCounter = 0
var alienCounter = 0
var uiGroup

// Characters variables
var crew = []
var cops = []
var aliens = []
var roomSelected
var gameGroup
var bloodGroup
var aliensTimer = 5000

function create () {
  // Physics
  game.physics.startSystem(Phaser.Physics.ARCADE)

  //  Game world: offset of grid and how much cells multiplied with its size
  game.world.setBounds(0, 0, (gridOffset * 2) + gridX * cellSize, (gridOffset * 2) + gridY * cellSize)

  // Camera to the world center
  game.camera.x = (((gridOffset * 2) + gridX * cellSize) / 2) - (game.width / 2)
  game.camera.y = (((gridOffset * 2) + gridY * cellSize) / 2) - (game.height / 2)

  // Background
  game.add.tileSprite(0, 0, (gridOffset * 2) + gridX * cellSize, (gridOffset * 2) + gridY * cellSize, 'bg')

  // Create the grid
  grid = game.add.group()
  grid.createMultiple(gridX * gridY, 'grid', null, true)
  grid.align(gridX, -1, 1, 1)
  grid.x = grid.y = gridOffset
  // for(var i = 0; i < gridX; i++){
  //   gridInfo[i] = []
  //   for(var j = 0; j < gridY; j++){
  //     var cell = grid.create(gridOffset + i * cellSize, gridOffset + j * cellSize, "grid");
  //
  //     // Add event listeners to every grid cell
  //     // cell.inputEnabled = true;
  //     // cell.events.onInputOver.add(this.cellOver, this);
  //     // cell.events.onInputOut.add(this.cellOut, this);
  //     // cell.events.onInputDown.add(this.cellClick, this);
  //     cell.tint = 0xf2f2f2;
  //     gridInfo[i][j] = cell;
  //   }
  // }

    // //  Our tiled scrolling background
    // land = game.add.tileSprite(0, 0, 800, 600, 'earth')
    // land.fixedToCamera = true

    //  The base of our tank
    // tank = game.add.sprite(0, 0, 'tank', 'tank1')
    // tank.anchor.setTo(0.5, 0.5)
    // tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true)
    //
    // //  This will force it to decelerate and limit its speed
    // game.physics.enable(tank, Phaser.Physics.ARCADE)
    // tank.body.drag.set(0.2)
    // tank.body.maxVelocity.setTo(400, 400)
    // tank.body.collideWorldBounds = true
    //
    // //  Finally the turret that we place on-top of the tank body
    // turret = game.add.sprite(0, 0, 'tank', 'turret')
    // turret.anchor.setTo(0.3, 0.5)
    //
    // //  The enemies bullet group
    // enemyBullets = game.add.group()
    // enemyBullets.enableBody = true
    // enemyBullets.physicsBodyType = Phaser.Physics.ARCADE
    // enemyBullets.createMultiple(100, 'bullet')
    //
    // enemyBullets.setAll('anchor.x', 0.5)
    // enemyBullets.setAll('anchor.y', 0.5)
    // enemyBullets.setAll('outOfBoundsKill', true)
    // enemyBullets.setAll('checkWorldBounds', true)
    //
    // //  Create some baddies to waste :)
    // enemies = []
    //
    // enemiesTotal = 20
    // enemiesAlive = 20
    //
    // for (var i = 0; i < enemiesTotal;  i++)
    // {
    //     enemies.push(new EnemyTank(i, game, tank, enemyBullets))
    // }
    //
    // //  A shadow below our tank
    // shadow = game.add.sprite(0, 0, 'tank', 'shadow')
    // shadow.anchor.setTo(0.5, 0.5)
    //
    // //  Our bullet group
    // bullets = game.add.group()
    // bullets.enableBody = true
    // bullets.physicsBodyType = Phaser.Physics.ARCADE
    // bullets.createMultiple(30, 'bullet', 0, false)
    // bullets.setAll('anchor.x', 0.5)
    // bullets.setAll('anchor.y', 0.5)
    // bullets.setAll('outOfBoundsKill', true)
    // bullets.setAll('checkWorldBounds', true)
    //
    // //  Explosion pool
    // explosions = game.add.group()
    //
    // for (var i = 0 ; i < 10 ; i++)
    // {
    //     var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false)
    //     explosionAnimation.anchor.setTo(0.5, 0.5)
    //     explosionAnimation.animations.add('kaboom')
    // }
    //
    // tank.bringToTop()
    // turret.bringToTop()
    //
    // logo = game.add.sprite(0, 200, 'logo')
    // logo.fixedToCamera = true
    //
    // game.input.onDown.add(removeLogo, this)
    //
    // game.camera.follow(tank)
    // game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300)
    // game.camera.focusOnXY(0, 0)
    //
    // cursors = game.input.keyboard.createCursorKeys()
}

// function removeLogo () {
//
//     game.input.onDown.remove(removeLogo, this)
//     logo.kill()
//
// }

function update () {

    // game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this)
    //
    // enemiesAlive = 0
    //
    // for (var i = 0 ; i < enemies.length ; i++)
    // {
    //     if (enemies[i].alive)
    //     {
    //         enemiesAlive++
    //         game.physics.arcade.collide(tank, enemies[i].tank)
    //         game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this)
    //         enemies[i].update()
    //     }
    // }
    //
    // if (cursors.left.isDown)
    // {
    //     tank.angle -= 4
    // }
    // else if (cursors.right.isDown)
    // {
    //     tank.angle += 4
    // }
    //
    // if (cursors.up.isDown)
    // {
    //     //  The speed we'll travel at
    //     currentSpeed = 300
    // }
    // else
    // {
    //     if (currentSpeed > 0)
    //     {
    //         currentSpeed -= 4
    //     }
    // }
    //
    // if (currentSpeed > 0)
    // {
    //     game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity)
    // }
    //
    // land.tilePosition.x = -game.camera.x
    // land.tilePosition.y = -game.camera.y
    //
    // //  Position all the parts and align rotations
    // shadow.x = tank.x
    // shadow.y = tank.y
    // shadow.rotation = tank.rotation
    //
    // turret.x = tank.x
    // turret.y = tank.y
    //
    // turret.rotation = game.physics.arcade.angleToPointer(turret)
    //
    // if (game.input.activePointer.isDown)
    // {
    //     //  Boom!
    //     fire()
    // }

}

// function bulletHitPlayer (tank, bullet) {
//
//     bullet.kill()
//
// }
//
// function bulletHitEnemy (tank, bullet) {
//
//     bullet.kill()
//
//     var destroyed = enemies[tank.name].damage()
//
//     if (destroyed)
//     {
//         var explosionAnimation = explosions.getFirstExists(false)
//         explosionAnimation.reset(tank.x, tank.y)
//         explosionAnimation.play('kaboom', 30, false, true)
//     }
//
// }
//
// function fire () {
//
//     if (game.time.now > nextFire && bullets.countDead() > 0)
//     {
//         nextFire = game.time.now + fireRate
//
//         var bullet = bullets.getFirstExists(false)
//
//         bullet.reset(turret.x, turret.y)
//
//         bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500)
//     }
//
// }

function render () {
  // // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32)
  // game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32)
}
