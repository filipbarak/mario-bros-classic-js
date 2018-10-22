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
let sidePlatforms;
let floor;
let powBlock;
let pipes;
let isFacingLeft;


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
    console.log(this, 'GAME');

    this.physics.add.collider(mario, floor);
    this.physics.add.collider(mario, platforms, hitPlatform, null, this);
    this.physics.add.collider(mario, powBlock);
}

function update () {
    setCursors(this.input.keyboard.createCursorKeys());
    this.physics.world.wrap(mario);
}

createMario = (physics, anims) => {
    mario = physics.add.sprite(280, 450, 'mario').setScale(2);
    mario.body.setGravityY(200);

    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('mario', {start: 1, end: 4}),
        frameRate: 10,
        repeat: -1
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

    anims.create({
        key: 'facing-left',
        frames: [ { key: 'mario', frame: 5 } ],
        frameRate: 20,
    });

    anims.create({
        key: 'facing-right',
        frames: [ { key: 'mario', frame: 6 } ],
        frameRate: 20,
    });

    console.log(mario, 'Mario');
}

const setCursors = (cursors) => {
    if (cursors.left.isDown) {
        isFacingLeft = true;
        mario.setVelocityX(-160);
        if (mario.body.touching.down) {
            mario.anims.play('left', true);
        } else {
            mario.anims.play('jump-left', true);
        }
    }

    else if (cursors.right.isDown) {
        isFacingLeft = false;
        mario.setVelocityX(160);
        if (mario.body.touching.down) {
            mario.anims.play('right', true);
        } else {
            mario.anims.play('jump-right', true);
        }
    }

    else {
        mario.setVelocityX(0);
        isFacingLeft ? mario.anims.play('facing-left') : mario.anims.play('facing-right');
    }

    /* Jumping */
    if (cursors.up.isDown && mario.body.touching.down) {
        mario.setVelocityY(-300);
    }
}

const createPlatforms = (physics) => {
    floor = physics.add.staticGroup();
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 17; j++) {
            const offset = i % 2 === 1 ? 16 : 24;
            floor.create(j * 48 - offset, 600 - 15 * i - 15, 'red-block').setScale(2).refreshBody();
        }
    }

    platforms = physics.add.staticGroup();

    for (let i = 0; i < 4; i++) {
        platforms.create(i * 64 + 32, 450, 'blue-block').setScale(2).refreshBody();
        platforms.create(576 + i*64, 450, 'blue-block').setScale(2).refreshBody();
    }

    console.log(platforms.getChildren(), 'CHILDREN')

    powBlock = physics.add.staticGroup();

    powBlock.create(400, 460, 'pow-block').setScale(2).refreshBody();
}

const createPipes = (physics) => {
    pipes = physics.add.staticGroup();
    pipes.create(0, 507, 'pipe').setScale(2).refreshBody();
    pipes.create(800, 507, 'pipe').setScale(2).refreshBody();
}

const hitPlatform = function() {
    const {x, y} = mario.getBounds();    
    const localPlatforms = platforms.getChildren();
    const offsetY = Math.round(y - 19);
    localPlatforms.forEach(platform => {
        console.log(platform);
        if (offsetY == platform.y) {
            console.log('bot')
        }
    });
    // platforms.children.forEach(platform => {
    //     if (mario.y == platform.y) {
    //         console.log('Hit!');
    //     }
    // });
}