const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
const gravity = 0.5

let backgroundImage = new Image();
backgroundImage.src = './img/bestBackground.jpg'

let groundImage = new Image();
groundImage.src = './img/bigPlatform.png'

let hill = new Image();
hill.src = './img/greenHillOne.png'

let smallPlatform = new Image();
smallPlatform.src = './img/bigPlatform.png'

let characterLeft = new Image();
characterLeft.src = './img/playerLeft.png'

let characterRight = new Image();
characterRight.src = './img/playerRight.png'

let characterUp = new Image();
characterUp.src = './img/playerUp.png'

let characterDown = new Image();
characterDown.src = './img/playerDown.png'


class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150
        this.image = characterRight
    }

    draw() {

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        // else this.velocity.y = 0
    }

}

class Platform {
    constructor({ x, y, image }) {
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

class BackgroundObject {
    constructor({ x, y, image }) {
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

let player = new Player()

let platforms = [new Platform({
    x: -1, y: 400,
    image: groundImage
}), new Platform({
    x: groundImage.width - 30, y: 400,
    image: groundImage
}), new Platform({
    x: 2 * groundImage.width + 100, y: 400,
    image: groundImage
})]

let backgroundObjects = [new BackgroundObject({
    x: -1, y: -1,
    image: backgroundImage
}), new BackgroundObject({
    x: -1, y: -1,
    image: hill
})]

let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scroll = 0

function gameStart() {
    player = new Player()

    backgroundImage = new Image();
    backgroundImage.src = './img/bestBackground.jpg'

    groundImage = new Image();
    groundImage.src = './img/bigPlatform.png'

    smallPlatform = new Image();
    smallPlatform.src = './img/bigPlatform.png'

    hill = new Image();
    hill.src = './img/greenHillOne.png'

    characterLeft = new Image();
    characterLeft.src = './img/playerLeft.png'

    characterRight = new Image();
    characterRight.src = './img/playerRight.png'

    characterUp = new Image();
    characterUp.src = './img/playerUp.png'

    characterDown = new Image();
    characterDown.src = './img/playerDown.png'

    platforms = [new Platform({
        x: 5 * groundImage.width + 300, y: 300,
        image: smallPlatform
    }), new Platform({
        x: -1, y: 450,
        image: groundImage
    }), new Platform({
        x: groundImage.width - 30, y: 450,
        image: groundImage
    }), new Platform({
        x: 2 * groundImage.width + 100, y: 450,
        image: groundImage
    }), new Platform({
        x: 3 * groundImage.width + 100, y: 450,
        image: groundImage
    }), new Platform({
        x: 4 * groundImage.width + 100, y: 450,
        image: groundImage
    })]

    backgroundObjects = [new BackgroundObject({
        x: -1, y: -1,
        image: backgroundImage
    }), new BackgroundObject({
        x: -1, y: -1,
        image: hill
    })]

    scroll = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    backgroundObjects.forEach(randomOject => {
        randomOject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
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

        } else if (keys.left.pressed && scroll > 0) {
            scroll += player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            backgroundObjects.forEach((randomOject) => {
                randomOject.position.x += player.speed * 0.66
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

    if (scroll > 2000) {
        console.log("YOU WIN")
    }

    if (player.position.y > canvas.height) {
        console.log("YOU LOSE")
        gameStart()
    }

}

gameStart();
animate();

window.addEventListener('keydown', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
        player.velocity.y -= 10
    }
    if (e.key === 'ArrowLeft') {
        keys.left.pressed = true
    }
    if (e.key === 'ArrowRight') {
        keys.right.pressed = true
    }
})

window.addEventListener('keyup', (e) => {
    e = e || window.event;
    if (e.key === 'ArrowLeft') {
        keys.left.pressed = false
    }
    if (e.key === 'ArrowRight') {
        keys.right.pressed = false
    }
})