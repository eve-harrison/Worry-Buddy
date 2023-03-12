const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1300
canvas.height = 576
const gravity = 0.5
var frameDelay = 0

let backgroundImage = new Image();
backgroundImage.src = './img/bestBackground.jpg'

let groundImage = new Image();
groundImage.src = './img/bigPlatform.png'

let hill = new Image();
hill.src = './img/greenHillOne.png'

let tallPlatform = new Image();
tallPlatform.src = './img/smallPlatform.png'

let redBox = new Image();
redBox.src = './img/redBox.png'

let pinkBox = new Image();
pinkBox.src = './img/pinkBox.png'

let greenBox = new Image();
greenBox.src = './img/greenBox.png'

let single_flag = new Image();
single_flag.src = './img/flag1.png'

let playerIdle = new Image();
playerIdle.src = './img/playerIdle.png'

let playerRunningRight = new Image();
playerRunningRight.src = './img/playerRunningRight.png'

let playerRunningLeft = new Image();
playerRunningLeft.src = './img/playerRunningLeft.png'

let playerJumping = new Image();
playerJumping.src = './img/playerJumpingRight.png'

let platforms = []
let backgroundObjects = []
let mysteryBoxes = []

let keys = {
    up: {
        pressed: false
    },
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scroll = 0

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 600,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 140
        this.height = 140
        this.image = playerIdle
        this.frames = 0
        this.sprites = {
            stand: playerIdle,
            run: {
                right: playerRunningRight,
                left: playerRunningLeft
            },
            jump: playerJumping
        }

        this.currentSprite = this.sprites.stand
    }

    draw() {
        c.imageSmoothingEnabled = false
        c.drawImage(this.currentSprite,
            32 * this.frames,
            0,
            32,
            32,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        if (frameDelay == 3) {
            this.frames++
            frameDelay = 0
        } else {
            frameDelay++;
        }

        if (this.frames > 4) this.frames = 0
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }

    collidesWith(object) {
        return (
            this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height - 100 &&
            this.position.y + this.height > object.position.y
        );
    }

}

let player = new Player()


class DrawObject {
    constructor({ x, y, image, width, height }) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function gameStart() {
    console.log("game start")
    player = new Player()

    platforms = [new DrawObject({
        x: -1, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: groundImage.width - 38, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (2 * groundImage.width) - 70, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (3 * groundImage.width) + 150, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (4 * groundImage.width) + 500, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (5 * groundImage.width) + 450, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (6 * groundImage.width) + 450, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (7 * groundImage.width) + 750, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (8 * groundImage.width) + 750, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (9 * groundImage.width) + 750, y: 250,
        image: groundImage
    }),

    new DrawObject({
        x: (10 * groundImage.width) + 750, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (11 * groundImage.width) + 900, y: 250,
        image: groundImage
    }),

    new DrawObject({
        x: (12 * groundImage.width) + 1200, y: 450,
        image: groundImage
    }),

    new DrawObject({
        x: (13 * groundImage.width) + 1200, y: 450,
        image: groundImage
    })]


    backgroundObjects = [new DrawObject({
        x: -1, y: -1,
        image: backgroundImage
    }),

    new DrawObject({
        x: -1, y: -1,
        image: hill
    }),

    new DrawObject({
        x: (4 * groundImage.width) + 30, y: 20,
        image: hill
    }),

    new DrawObject({
        x: (6 * groundImage.width) + 30, y: 10,
        image: hill
    }),

    new DrawObject({
        x: (9 * groundImage.width) + 30, y: 10,
        image: hill
    })]


    mysteryBoxes = [new DrawObject({
        x: 900, y: 80,
        // x: 3000, y: 80,
        image: pinkBox
    }),

    new DrawObject({
        x: 5300, y: 80,
        image: redBox
    }),

    new DrawObject({
        x: 6500, y: -40,
        image: greenBox
    }),

    new DrawObject({
        x: 7200, y: 80,
        image: pinkBox
    }),

    new DrawObject({
        x: 8700, y: 80,
        image: redBox
    }),
    new DrawObject({
        x: 9500, y: 95,
        image: single_flag
    })]

    scroll = 0
}


function animate() {
    const animationId = requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    backgroundObjects.forEach(randomOject => {
        randomOject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })

    mysteryBoxes.forEach(mysteryBox => {
        mysteryBox.draw()
    })

    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100)
        || keys.left.pressed && scroll === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scroll -= player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            backgroundObjects.forEach((randomOject) => {
                randomOject.position.x -= player.speed * 0.66
            })
            mysteryBoxes.forEach((mysteryBox) => {
                mysteryBox.position.x -= player.speed
            })

        } else if (keys.left.pressed && scroll > 0) {
            scroll += player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            backgroundObjects.forEach((randomOject) => {
                randomOject.position.x += player.speed * 0.66
            })
            mysteryBoxes.forEach((mysteryBox) => {
                mysteryBox.position.x += player.speed
            })
        }
    }

    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }

    })

    if (scroll < -9500) {  // edge of the last hill when you jump off the big platform
        console.log("YOU WIN")
    }

    if (player.position.y > canvas.height) {
        console.log("YOU LOSE")
        gameStart()
    }

    for (let i = 0; i < mysteryBoxes.length; i++) {
        if (player.collidesWith(mysteryBoxes[i])) {
            console.log("colliding")
            window.cancelAnimationFrame(animationId)
            gsap.to('#overlap', {
                opacity: 1,
                repeat: 2,
                yoyo: true,
                duration: 0.4,
                onComplete() {
                    gsap.to('#overlap', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            animateNewScene()
                            gsap.to('#overlap', {
                                opacity: 0
                            })
                        }
                    })

                }

            })
        }
    }
}

animate()
gameStart()

let schoolRoom = new Image();
schoolRoom.src = './img/schoolBackground.png'

const schoolBackground = new DrawObject({
    x: -1, y: -1,
    image: schoolRoom
})

function animateNewScene() {
    window.requestAnimationFrame(animateNewScene)
    console.log("new scene started")

    schoolBackground.draw()


}

window.addEventListener('keydown', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
        player.velocity.y -= 10
        player.currentSprite = player.sprites.jump
        keys.up.pressed = true
    }
    else if (e.key === 'ArrowLeft') {
        player.currentSprite = player.sprites.run.left
        keys.left.pressed = true
    }
    else if (e.key === 'ArrowRight') {
        player.currentSprite = player.sprites.run.right
        keys.right.pressed = true
    }
})

window.addEventListener('keyup', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowLeft') {
        keys.left.pressed = false
        player.currentSprite = player.sprites.stand
    }
    if (e.key === 'ArrowRight') {
        keys.right.pressed = false
        player.currentSprite = player.sprites.stand
    }
    if (e.key === 'ArrowUp') {
        keys.up.pressed = false
    }

})