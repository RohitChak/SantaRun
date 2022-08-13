const image1 = new Image();
image1.src = './img/platform.svg';
const image2 = new Image();
image2.src = './img/bg.png';
const sprite1 = new Image();
sprite1.src = './img/spriteSheet/idleRight.png';
const sprite2 = new Image();
sprite2.src = './img/spriteSheet/idleLeft.png';
const sprite3 = new Image();
sprite3.src = './img/spriteSheet/runRight.png';
const sprite4 = new Image();
sprite4.src = './img/spriteSheet/runLeft.png';
const sprite5 = new Image();
sprite5.src = './img/spriteSheet/jumpRight.png';
const sprite6 = new Image();
sprite6.src = './img/spriteSheet/jumpLeft.png';

const jumpSound = new Audio('./sound/jump.mp3');
const runSound = new Audio('./sound/run.mp3');

runSound.loop = true;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.01;
let flag = 0;
let lastKey = 'right';

class Player{
    constructor(){
        this.position = {
            x:100,
            y:200
        };
        this.velocity = {
            x:0,
            y:0
        };
        this.frames = 0;
        this.sprite = {
            idle: {
                right: sprite1,
                rightX: 184,
                left: sprite2,
                leftX: 396,
                crop: 354,
                framesNo: 15,
                width: 65.0736,
                height: 100
                
            },
            run: {
                right: sprite3,
                rightX: 165,
                left: sprite4,
                leftX: 325,
                crop: 445,
                framesNo: 10,
                width: 81.8016,
                height: 100
            },
            jump: {
                right: sprite5,
                rightX: 120,
                left: sprite6,
                leftX: 336,
                crop: 474,
                framesNo: 13,
                width: 81.1824,
                height: 100
            }
        };
        this.current = this.sprite.idle.right;
        this.cropWidth = this.sprite.idle.crop;
        this.cropHeight = 544;
        this.initialX = this.sprite.idle.rightX;
        this.initialY = 30;
        this.frameNo = this.sprite.idle.framesNo;
        this.width = this.sprite.idle.width;
        this.height = this.sprite.idle.height;
    }

    draw(){
        c.drawImage(this.current, (this.initialX + 934*this.frames), this.initialY, this.cropWidth, this.cropHeight, this.position.x, this.position.y, this.width, this.height);
    }

    update(){
        // if(this.current == this.sprite.jump.right || this.current == this.sprite.jump.left){
        //     flag++;
        //     if(flag%4==0 && this.frames <= this.frameNo) this.frames++;
            
        // }
        // else{
            flag++;
            if(flag%3==0) this.frames++;
            if(this.frames > this.frameNo) this.frames = 0;
        //}

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if ((this.position.y + this.height + this.velocity.y) <= canvas.height){
            this.velocity.y += gravity;
        }
        this.draw();
    }
}

class Platform{
    constructor(a,b,c,d){
        this.position = {
            x: a,
            y: b
        }
        this.width = c;
        this.height = d;
        //this.image = image;
    }

    draw(){
        c.drawImage(image1, this.position.x, this.position.y, this.width, this.height);
    }
}

class Background{
    constructor(a,b){
        this.position = {
            x: a,
            y: b
        }
        this.width = 1440;
        this.height = 576;
    }

    draw(){
        c.drawImage(image2, this.position.x, this.position.y, this.width, this.height);
    }
}

let player;
let platforms;
let bg;

const keys = {
    right: {pressed: false},
    left: {pressed: false}
};

let distanceCovered;

function restart(){
    player = new Player();

    platforms = [new Platform(-20,525,500,50),new Platform(443,525,500,50),new Platform(906,525,500,50),new Platform(3100,525,500,50),new Platform(4030,525,500,50),new Platform(5000,525,500,50),new Platform(5463,525,500,50),new Platform(5926,525,500,50),new Platform(300,350,300,30), new Platform(550,200,300,30), new Platform(1200,430,300,30), new Platform(1600,450,300,30), new Platform(2000,430,300,30), new Platform(2400,400,300,30), new Platform(2900,437,300,30), new Platform(3500,410,300,30), new Platform(4000,400,300,30), new Platform(4600,486,300,30)];

    bg = [new Background(0,0),new Background(1440,0),new Background(2880,0),new Background(4320,0),new Background(5760,0)];

    distanceCovered = 0;
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    bg.forEach((backGround) => {
        backGround.draw();
    })

    platforms.forEach((platform) => {
        platform.draw();
    });
    player.update();

    if(keys.left.pressed && player.position.x > 100){
        if(player.velocity.x > -5)
            player.velocity.x -= 1;
        else
            player.velocity.x = -5;
    }
    else if(keys.right.pressed && player.position.x < 700){
        if(player.velocity.x < 5)
            player.velocity.x += 1;
        else
            player.velocity.x = 5;
    }
    else{
        player.velocity.x = 0;

        if(keys.right.pressed){
            bg.forEach((backGround) => {
                backGround.position.x -= 2;
            })

            platforms.forEach((platform) => {
                platform.position.x -= 5;
                distanceCovered += 0.5;
            })
        };
    }

    //Add winning condition

    //Lose condition
    if(player.position.y > canvas.height){
        restart();
    }

    //collisions
    platforms.forEach((platform) => {
        if((player.position.x + player.width) >= platform.position.x && player.position.x <= (platform.position.x + platform.width)){
            if((player.position.y + player.height + player.velocity.y) >= platform.position.y){
                if((player.position.y + player.height + player.velocity.y) <= platform.position.y + platform.height)
                player.velocity.y = 0;
            }
    
            // if((player.position.y + player.height + player.velocity.y) > platform.position.y && player.position.y < (platform.position.y + platform.height)){
            //     player.velocity.x = 0;
            // }
        }
    });

    if(player.velocity.y !== 0){
        runSound.pause();
        runSound.currentTime = 0;
    }
}

restart();
animate();

window.addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 65:
        case 37:
            console.log("left");
            keys.left.pressed = true;
            player.current = player.sprite.run.left;
            player.cropWidth = player.sprite.run.crop;
            player.cropHeight = 544;
            player.initialX = player.sprite.run.leftX;
            player.initialY = 30;
            player.frameNo = player.sprite.run.framesNo;
            player.width = player.sprite.run.width;
            player.height = player.sprite.run.height;
            lastKey = 'left';

            if(event.repeat) return;
            else{
                jumpSound.pause();
                jumpSound.currentTime = 0;
                runSound.pause();
                runSound.currentTime = 0;
                runSound.play();
            }
            break;
        case 68:
        case 39:
            console.log("right");
            keys.right.pressed = true;
            player.current = player.sprite.run.right;
            player.cropWidth = player.sprite.run.crop;
            player.cropHeight = 544;
            player.initialX = player.sprite.run.rightX;
            player.initialY = 30;
            player.frameNo = player.sprite.run.framesNo;
            player.width = player.sprite.run.width;
            player.height = player.sprite.run.height;
            lastKey = 'right';

            if(event.repeat) return;
            else{
                jumpSound.pause();
                jumpSound.currentTime = 0;
                runSound.pause();
                runSound.currentTime = 0;
                runSound.play();
            }
            break;
        case 87:
        case 38:
            console.log("up");
            // if((player.position.y + player.height) < canvas.height){return}
            // if(event.repeat){return};
            if(player.velocity.y === 0){
                player.velocity.y -= 20;
                jumpSound.currentTime = 0;
                jumpSound.play();
            }
            break;
        case 83:
        case 40:
            console.log("down");
            break;
    }
});
window.addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        case 65:
        case 37:
            keys.left.pressed = false;
            player.current = player.sprite.idle.left;
            player.cropWidth = player.sprite.idle.crop;
            player.cropHeight = 544;
            player.initialX = player.sprite.idle.leftX;
            player.initialY = 30;
            player.frameNo = player.sprite.idle.framesNo;
            player.width = player.sprite.idle.width;
            player.height = player.sprite.idle.height;

            runSound.pause();
            runSound.currentTime = 0;
            break;
        case 68:
        case 39:
            keys.right.pressed = false;
            player.current = player.sprite.idle.right;
            player.cropWidth = player.sprite.idle.crop;
            player.cropHeight = 544;
            player.initialX = player.sprite.idle.rightX;
            player.initialY = 30;
            player.frameNo = player.sprite.idle.framesNo;
            player.width = player.sprite.idle.width;
            player.height = player.sprite.idle.height;

            runSound.pause();
            runSound.currentTime = 0;
            break;
        case 87:
        case 38:
            break;
        case 83:
        case 40:
            break;
    }
});

// if(distanceCovered == 2000){
//     alert("you won");
//     player.velocity.x = 0;
// }