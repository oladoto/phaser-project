
import GamePlay from './game_play.js';

var game;

window.onload = function() {
    let width = 1280;
    let height = 720;

    let config = {
        type: Phaser.AUTO,
        width: width,
        height: height, 
        backgroundColor: '#4488aa',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug: true
            }
        },        
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'phaser-example',
            autoCenter: Phaser.Scale.FIT,
            width: width,
            height: 720
        },
        scene: [ GamePlay ]
    };

    GamePlay.config = config;
    game = new Phaser.Game(config);
    window.focus();
}
