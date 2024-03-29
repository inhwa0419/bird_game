var Game = {

    preload : function() {
       
        game.load.image('bird', './assets/images/yellowbird.png');
        game.load.image('pipe', './assets/images/thorn.png');
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('bg', './assets/images/bg.png');
  
    },

    create : function() {

        background = game.add.tileSprite(0,0,600,490, 'bg');  

        game.physics.startSystem(Phaser.Physics.ARCADE  );

        this.bird = game.add.sprite(100,245,'bird');

        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);  

        this.pipes = game.add.group();
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   

        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        this.bird.anchor.setTo(-0.2, 0.5);
        this.jumpSound = game.add.audio('jump'); 
    },

    update: function() {

        if(this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

    if (this.bird.angle < 20)
        this.bird.angle += 1; 

    game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this); 
    },
    jump: function(){
        if (this.bird.alive == false)
            return;  
        this.bird.body.velocity.y = -350;
        var animation = game.add.tween(this.bird);

        animation.to({angle: -20}, 100);

        animation.start();
        this.jumpSound.play();  
    },
    restartGame: function(){
        game.state.start('Menu');
    },
    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');

        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);
    
        pipe.body.velocity.x = -200; 
    
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);  
                this.score += 1;
                this.labelScore.text = this.score;  
    },
    hitPipe: function() {
        if (this.bird.alive == false)
            return;
    
        this.bird.alive = false;
    
        game.time.events.remove(this.timer);
    
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 

};