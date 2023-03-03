const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const miniGamesMap = []
for (let i = 0; i < miniGameZoneData.length; i += 70) {
    miniGamesMap.push(miniGameZoneData.slice(i, i + 70))
}

const offset = {
    x: -550,
    y: -670
}

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const backgroundImage = new Image()
backgroundImage.src = './img/backgroundMap.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDownNew.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUpNew.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeftNew.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRightNew.png'

class Sprite {
    constructor({ position, speed, image, frames = { max: 1 }, sprites }) {
        this.position = position
        this.speed = speed
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,  // cropping
            0,   // cropping
            this.image.width / this.frames.max, // cropping
            this.image.height,    // cropping
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height)

        if (this.moving) {
            if (this.frames.max > 1) {
                this.frames.elapsed++
            }
            if (this.frames.elapsed % 10 === 0) {
                if (this.frames.val < this.frames.max - 1) this.frames.val++
                else this.frames.val = 0
            }
        }
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = "rgba(255, 0, 0, 0.5)"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const collisionBoundaries = []
const miniGameAreas = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2049)
            collisionBoundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

miniGamesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2049)
            miniGameAreas.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
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

const movables = [background, ...collisionBoundaries, foreground, ...miniGameAreas]

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
    miniGameAreas.forEach(miniGameArea => {
        miniGameArea.draw()
    })
    player.draw()
    foreground.draw()


    let moving = true
    player.moving = false
    if (buttons.up.keydown) {
        player.moving = true
        player.image = player.sprites.up
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
        player.image = player.sprites.down
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
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.y -= 3 })
    }
    if (buttons.left.keydown) {
        player.moving = true
        player.image = player.sprites.left
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
                moving = false
                break
            }

        }
        if (moving)
            movables.forEach((movable) => { movable.position.x += 3 })
    }
    if (buttons.right.keydown) {
        player.moving = true
        player.image = player.sprites.right
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
    e = e || window.event
    if (e.key === 'ArrowUp') {
        buttons.up.keydown = true
    }
    if (e.key === 'ArrowDown') {
        buttons.down.keydown = true
    }
    if (e.key === 'ArrowLeft') {
        buttons.left.keydown = true
    }
    if (e.key === 'ArrowRight') {
        buttons.right.keydown = true
    }
})

window.addEventListener('keyup', (e) => {
    e = e || window.event
    if (e.key === 'ArrowUp') {
        buttons.up.keydown = false
    }
    if (e.key === 'ArrowDown') {
        buttons.down.keydown = false
    }
    if (e.key === 'ArrowLeft') {
        buttons.left.keydown = false
    }
    if (e.key === 'ArrowRight') {
        buttons.right.keydown = false
    }
})
