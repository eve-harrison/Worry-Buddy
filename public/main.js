const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

class Border {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }
    draw() {
        context.fillStyle = "rgba(255, 0, 0, 0.0)";
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const collisionBoundaries = [];
const offset = {
    x: -785, y: -650
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2049)
            collisionBoundaries.push(
                new Border({
                    position: {
                        x: j * Border.width + offset.x,
                        y: i * Border.height + offset.y
                    }
                })
            )
    })
})

// console.log(collisionBoundaries)

const img = new Image()
img.src = './img/NoWorryTown.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

class Sprite {
    constructor({ position, speed, image, frames = { max: 1 } }, sprites) {
        this.position = position
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            // console.log(this.width)
            // console.log(this.height)
        }

        this.moving = false
        this.sprites = sprites

    }

    draw() {
        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )

        if (!this.moving) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x, y: offset.y
    },
    image: img
})

const foreground = new Sprite({
    position: {
        x: offset.x, y: offset.y
    },
    image: foregroundImage
})

const buttons = {
    up: {
        keydown: false
    },
    right: {
        keydown: false
    },
    down: {
        keydown: false
    },
    left: {
        keydown: false
    }
}


const movables = [background, ...collisionBoundaries, foreground]

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    collisionBoundaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.moving = false
    if (buttons.up.keydown) {
        player.moving = true
        for (let i = 0; i < collisionBoundaries.length; i++) {
            const boundary = collisionBoundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })) {
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.y += 3 })
    }
    if (buttons.down.keydown) {
        player.moving = true
        for (let i = 0; i < collisionBoundaries.length; i++) {
            const boundary = collisionBoundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })) {
                //  console.log('colliding')
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.y -= 3 })
    }
    if (buttons.left.keydown) {
        player.moving = true
        for (let i = 0; i < collisionBoundaries.length; i++) {
            const boundary = collisionBoundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                // console.log('colliding')
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.x += 3 })
    }
    if (buttons.right.keydown) {
        player.moving = true
        for (let i = 0; i < collisionBoundaries.length; i++) {
            const boundary = collisionBoundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                //  console.log('colliding')
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.x -= 3 })
    }
}
animate()

window.addEventListener('keydown', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
        buttons.up.keydown = true;
    }
    if (e.key === 'ArrowDown') {
        buttons.down.keydown = true;
    }
    if (e.key === 'ArrowLeft') {
        buttons.left.keydown = true;
    }
    if (e.key === 'ArrowRight') {
        buttons.right.keydown = true;
    }
})

window.addEventListener('keyup', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
        buttons.up.keydown = false;
    }
    if (e.key === 'ArrowDown') {
        buttons.down.keydown = false;
    }
    if (e.key === 'ArrowLeft') {
        buttons.left.keydown = false;
    }
    if (e.key === 'ArrowRight') {
        buttons.right.keydown = false;
    }
})


