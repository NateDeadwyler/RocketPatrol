class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        
        //place tile sprite starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480,
        'starfield').setOrigin(0, 0)

        //place tile sprite planet
        this.planets = this.add.image(0, game.config.height/6,
        'planets').setOrigin(0, 0)
    
        // Green UI Background
        this.add.rectangle(0, borderUISize + borderPadding,
        game.config.width, borderUISize * 2,
        0x00FF00).setOrigin(0,0)

        // White Borders
        this.add.rectangle(0, 0, game.config.width,
        borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize,
        game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize,
        game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0,
        borderUISize, game.config.height,
        0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2,
        game.config.height - borderUISize - borderPadding,
        'rocket').setOrigin(0.5, 0)

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'ufo', 0, 75).setOrigin(0, 0).setScale(0.5)
        this.ship01.moveSpeed = this.ship01.moveSpeed + 2
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spacership', 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spacership', 0, 10).setOrigin(0, 0)
        
        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        
        //create off emitter
        this.emitter = this.add.particles(400, 200, 'spark', {
            lifespan: 300,
           quantity: 50,
            speed: { min: 10, max: 400 },
            scale: { start: .9, end: 0 },
            gravityY: 400,
            emitting: false
        });
            





        //initialize score
        this.p1Score = 0

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig)
       // game over flag
       this.gameOver = false
        // 60 sec clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        } , null, this)

        //display time remaining
        this.timeLeft = game.settings.gameTimer / 1000
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeftDisplay = this.add.text(game.config.width - borderUISize * 4 - borderPadding * 2, borderUISize + borderPadding * 2, this.timeLeft, timeConfig)

        
    }


    update() {
        //update time left
        this.timeLeft = Math.floor((this.clock.delay - this.clock.getElapsed()) / 1000)
        this.timeLeftDisplay.text = this.timeLeft
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
        }
        this.starfield.tilePositionX -= 4
        this.planets.x += .5
        if(this.planets.x >= game.config.width + this.planets.width/3) {
            this.planets.x = 0 - this.planets.width}
        if(!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        }
       

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)

            // add 3 seconds to the clock
            this.clock.delay += 1000

            //Turn on particle emitter
            this.emitter.setPosition(this.ship03.x + 30, this.ship03.y+30)

            this.emitter.start()
            // Wait 1 second then turn off emitter
            this.time.delayedCall(300, () => {
                this.emitter.stop()
            }, null, this)


        }

        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            this.clock.delay += 1000

            //Turn on particle emitter
            this.emitter.setPosition(this.ship02.x + 30, this.ship02.y+30)

            this.emitter.start()
            // Wait 1 second then turn off emitter
            this.time.delayedCall(300, () => {
                this.emitter.stop()
            }, null, this)

        }

        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            this.clock.delay += 1000

            //Turn on particle emitter
            this.emitter.setPosition(this.ship01.x + 30, this.ship01.y+30)

            this.emitter.start()
            // Wait 1 second then turn off emitter
            this.time.delayedCall(300, () => {
                this.emitter.stop()
            }, null, this)

            
        }
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
            } else {
                return false
            }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')
    }

    

    
}