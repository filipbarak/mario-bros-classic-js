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
let platforms;
let pipes;

function preload() {
    /* blocks */

    this.load.image('icy-block', 'assets/icy-block.png');
    this.load.image('orange-block', 'assets/orange-block.png');

    /* spirtesheets */
    this.load.spritesheet('mario', 'assets/mario.png', { frameWidth: 29, frameHeight: 17 });
    this.load.spritesheet('blue-turtle', 'assets/blue-turtle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('main-turtle', 'assets/main-turtle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('projectile-green', 'assets/projectile-green.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('red-crab', 'assets/red-crab.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('red-turtle', 'assets/red-turtle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('blue-block', 'assets/blue-block.png', { frameWidth: 32, frameHeight: 15 });
    this.load.spritesheet('red-block', 'assets/red-block.png', { frameWidth: 32, frameHeight: 15 });
    this.load.spritesheet('pow-block', 'assets/pow-block.png', { frameWidth: 16, frameHeight: 16 });

    /* pipes */
    this.load.image('curved-pipe', 'assets/curved-pipe.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    createMario(this.physics, this.anims);
    createPlatforms(this.physics);
    createPipes(this.physics);

    this.physics.add.collider(mario, platforms);
}

function update () {
    setCursors(this.input.keyboard.createCursorKeys());
    this.physics.world.wrap(mario);
}

createMario = (physics, anims) => {
    mario = physics.add.sprite(280, 450, 'mario').setScale(2);
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

    anims.create({
        key: 'jump-left',
        frames: [ { key: 'mario', frame: 0} ],
        frameRate: 20,
    });

    anims.create({
        key: 'jump-right',
        frames: [ { key: 'mario', frame: 11} ],
        frameRate: 20,
    });
}

const setCursors = (cursors) => {

    /* Walking */
    if (!cursors.up.isDown &&  mario.body.touching.down) {
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
    }

    /* Jumping */
    if (cursors.up.isDown && mario.body.touching.down) {
        if (cursors.left.isDown) {
            mario.anims.play('jump-left', true);
            mario.setVelocityX(-160);
        } else {
            mario.anims.play('jump-right', true);
            mario.setVelocityX(160);
        }

        mario.setVelocityY(-300);
    }
}

const createPlatforms = (physics) => {
    platforms = physics.add.staticGroup();
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 17; j++) {
            const offset = i % 2 === 1 ? 16 : 24;
            platforms.create(j * 48 - offset, 600 - 15 * i - 15, 'red-block').setScale(2).refreshBody();
        }
    }

    for (let i = 0; i < 4; i++) {
        platforms.create(i * 64 + 32, 450, 'blue-block').setScale(2).refreshBody();
        platforms.create(576 + i*64, 450, 'blue-block').setScale(2).refreshBody();
    }

    platforms.create(400, 460, 'pow-block').setScale(2).refreshBody();
}

const createPipes = (physics) => {
    pipes = physics.add.staticGroup();
    pipes.create(0, 507, 'pipe').setScale(2).refreshBody();
    pipes.create(800, 507, 'pipe').setScale(2).refreshBody();
}