const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let mario;

function preload() {
    /* blocks */

    this.load.image('blue-block', 'assets/blue-block.png');
    this.load.image('icy-block', 'assets/icy-block.png');
    this.load.image('orange-block', 'assets/orange-block.png');

    /* spirtesheets */
    this.load.spritesheet('mario', 'assets/mario.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('blue-turtle', 'assets/blue-turtle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('main-turtle', 'assets/main-turtle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('projectile-green', 'assets/projectile-green.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('red-crab', 'assets/red-crab.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('red-turtle', 'assets/red-turtle.png', { frameWidth: 32, frameHeight: 48 });

    /* pipes */
    this.load.image('curved-pipe', 'assets/curved-pipe.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    createMario(this.physics, this.anims);
}

function update () {
    setCursors(this.input.keyboard.createCursorKeys());
}

createMario = (physics, anims) => {
    mario = physics.add.sprite(100, 450, 'mario');
    mario.setCollideWorldBounds(true);
    mario.body.setGravityY(150)


    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('mario', {start: 1, end: 4}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'turn',
        frames: [ { key: 'mario', frame: 6 } ],
        frameRate: 20
    });

    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('mario', { start: 7, end: 10 }),
        frameRate: 10,
        repeat: -1
    });
}

setCursors = (cursors) => {
    if (cursors.left.isDown) {
        mario.setVelocityX(-160);
        mario.anims.play('left', true);
    }

    else if (cursors.right.isDown) {
        mario.setVelocityX(160);
        mario.anims.play('right', true);
    }

    else {
        mario.setVelocityX(0);
        mario.anims.play('turn');
    }

    if (cursors.up.isDown && mario.body.touching.down) {
        mario.setVelocityY(-500);
    }
}