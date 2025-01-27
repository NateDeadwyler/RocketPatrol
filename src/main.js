//Nathan Deadwyler
//Rocket Patrol the Sequel to the Prequel of the Sequel of the Sequel
//Time taken ; ~ 3 hours
//points breakdown
    //5 points - mplement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
    //5 points - Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
    //5 points - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)
    //3 points - Parallax scrolling (3)
    //3 points - Display the time remaining (in seconds) on the screen (3)

let config = {
    type: Phaser.AUTO,
    width:640,
    height: 480,
    scene: [Menu, Play]
}
let game = new Phaser.Game(config)
// set UI Sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

