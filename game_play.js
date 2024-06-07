// import Phaser from '../Phaser'

class GamePlay extends Phaser.Scene
{
    config = null;

    constructor()
    {
        super('Game Play');
        this.player = null;
        this.staticObj = null;
        this.emitter = null;
        this.ball  = null;
        this.config = GamePlay.config;
        this.platforms = null;
        this.coin = null;
        this.phaser_base_url = 'https://labs.phaser.io/';
        this.inFullscreen = false;
        this.isLeft = 0;
        this.cursors = null;
        this.div_style = {
            'border-radius': '0px 0px 0px 10px',
            'color': '#FFF',
            'background-color': 'rgba(0, 0, 0, 0.3)',
            'height': '25px',
            'font':'15px Calibri',
            'padding': '10px',
            'width': (this.config.width - 150) + 'px'
        };
        this.style = {
            'color': '#FFF',
            'height': '25px',
            'font':'15px Calibri'
        };

        this.player_size = {
            width: 45,
            height: 55
        }
        this.player_status = {
            jumping: false
        }
        
        this.player_data = {
            scoreMessage: '',
            score: 0,
            healthMessage: '',
            health: 100,
            livesLeftMessage: ''
        }
        
    }

    preload() {
    
        this.load.setBaseURL('');
        
        this.load.image('scene-sky', './assets/scene-sky.png');
        this.load.image('ball', './assets/ball.png');
        this.load.image('player', './assets/bowl.png');

        this.load.image('platform', this.phaser_base_url + 'assets/rope/pipe1.png');
        this.load.image('sky2', this.phaser_base_url + 'assets/skies/gradient2.png');

        // add coin sprite
        this.load.spritesheet('coin', 'https://labs.phaser.io/assets/sprites/coin.png', {
            frameWidth: 32, frameHegight: 32
        });
        
    }

    create() {

        var image = this.add.image(this.config.width/2, this.config.height/2, 'sky2');        
        image.setDisplaySize(this.config.width, this.config.height);

        this.cursors = this.input.keyboard.createCursorKeys();


        this.create_gun();   

        this.start_shooting_gun();   

        this.create_gui();

        this.animate_coin(5);

        this.create_dom();

        this.create_player();

        this.register_input_events();
        
        return;
        
    }
    
    update(time, delta)
    {
        if(time > 5000){
            this.player.body.velocity.x = 0;
        }

        if (this.cursors.right.isDown)
        {
            console.log('...RIGHT');
            this.player.body.velocity.x = 300;
        }
        else if (this.cursors.left.isDown)
        {
            console.log('...LEFT');
            this.player.body.velocity.x = -300;
        }
        
        /*
        if(this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-50);
            this.player.anims.play('left',true);
        }
        else if(this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(50);
            this.player.anims.play('right',true);
        }
        else if(this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-100);
        }
        else{
            this.player.body.setVelocityX(0);
            this.player.anims.play('left',false);
            this.player.anims.play('right',false);
        }

        // disable platform once off-scene
        
        if(this.platGroup != null)
        {            
            this.platGroup.children.iterate(function (child) {
                if((child.x + child.width) <= 0){
                    child.disableBody(true, true);
                    console.log('disabled...')
                }
            });
        }
        */

    }

    animate_coin(num_coins){

        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', {start:0, end: 6}),
            frameRate: 7,
            repeat: -1
        });

        // setup coin
        this.coins = [];
        for(var i=0; i<num_coins; i++){
            this.coins.push(this.add.sprite(this.config.width * 0.03 * (i + 1), this.config.height * 0.1, 'coin'));
        }

        this.coins.forEach(function(coin){            
            coin.anims.play('rotate',false);
        });        
    }

    create_player()
    {
        // setup player
        this.player = this.physics.add.image((this.config.width*0.5) - 50, 0, 'player');
        this.player.setBounce(0.2).setScale(0.3, 0.3);
        this.player.setCollideWorldBounds(true);
        
        this.physics.add.collider(this.player, this.balls);
        this.physics.add.overlap(this.player, this.balls, this.updateCollision, null, this); 

    }

    // handle collision
    updateCollision(player, ball){
        
        ball.disableBody(true, true);

        this.player_data.score += 1;
        this.player_data.scoreMessage.setText('SCORE: ' + this.player_data.score);
    }

    create_static_platforms()
    {
        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i< 6; i++)
        {
            var x_axis = this.config.width * Phaser.Math.FloatBetween(0, 1);
            var y_axis = 120 * i;
            var plat = this.platforms.create(x_axis, y_axis, 'platform').setScale(0.3, 0.5).refreshBody();
            
            plat.body.velocity.x = Phaser.Math.FloatBetween(-20, -120);
        }       
        
    }

    generate_rocks()
    {
        // add rocks
        this.rocks = this.physics.add.group({
            key: 'rock',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.rocks.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.body.velocity.x = -20;

        });
    }
    
    create_enemies()
    {
        
    }

    create_gui()
    {
        // create gui
        this.player_data.scoreMessage = this.add.text(30, 110, 'SCORE: 0', this.style);
        this.player_data.healthMessage = this.add.text(this.config.width - 200, 60, 'HEALTH: 100 %', this.style);
       
        this.player_data.livesLeftMessage = this.add.text(30, 20, 'LIVES', this.style);

    }

    create_dom()
    {
        var message = 'Player Message Throughfare';
        this.add.dom(150, 0, 'div', this.div_style, message).setOrigin(0,0);
    }


    // handle impact on health
    updateHealth(player, rock){
        
        rock.disableBody(true, true);

        this.player_data.health -= 1;
        this.player_data.healthMessage.setText('HEALTH: ' + this.player_data.health + ' %');
    }

    create_emitter()
    {
        var particles = this.add.particles('yellow');

        this.emitter = particles.createEmitter({
            speed: 300,
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD'
        });
    }
    

    // pointer down handling
    register_input_events()
    {
        // this.input.on('pointerdown', this.pointer_down_event, this);
    }

    ////// //////
    pointer_down_event()
    {
        let c_x = this.player.body.velocity.x;
        
        this.player.body.velocity.x = -20;
        var timer = this.time.delayedCall(1000, this.pointer_down_event_handler, [c_x], this);  // delay in ms
        
        this.scale.startFullscreen();
        if(this.inFullscreen){
            this.scale.startFullscreen();
            this.inFullscreen = true;
        }else{
            this.scale.stopFullscreen();
            this.inFullscreen = false;
        }
    }

    pointer_down_event_handler(c_x)
    {
        this.player.body.velocity.x = c_x;
    }
    ////////

    /// End of Week 2

    create_gun()
    {
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        var plat = this.platforms.create(this.config.width - 110, this.config.height * 0.3, 'platform').setOrigin(0).setScale(0.3, 0.5);    
    }

    start_shooting_gun()
    {
        // create balls group    
        this.balls = this.physics.add.group({
            immovable: false,
            allowGravity: true
        });

        let timer = this.time.addEvent({
            delay: Phaser.Math.FloatBetween(500, 2000),     // ms
            callback: this.shoot_gun,
            //args: [],
            callbackScope: this,
            loop: true
        });
    }

    shoot_gun()
    {
        var ball = this.balls.create(this.config.width - 110, this.config.height * 0.3 + 20, 'ball').setScale(0.5, 0.5); //.setOrigin(0);    

        ball.setBounce(0.9, 0.9)
        ball.body.velocity.x = -400;
        // ball.setCollideWorldBounds(true);
        this.physics.add.collider(ball, this.balls);

        // this.physics.add.overlap(this.player, ball, this.updateCollision, null, this); */
        this.time_destroy_ball(ball);
    }

    time_destroy_ball(ball)
    {        
        let timer = this.time.addEvent({
            delay: 5000,     // ms
            callback: this.destroy_ball,
            args: [ball],
            callbackScope: this,
            loop: true
        });
    }

    destroy_ball(ball){
        ball.disableBody(true, true);
    }

};

export default GamePlay;