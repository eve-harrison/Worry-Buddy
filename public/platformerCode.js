const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1300
canvas.height = 576
const gravity = 0.5
var frameDelay = 0
let foodClickCount = 0

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

let playerIdleOtherWay = new Image();
playerIdleOtherWay.src = './img/playerIdleOtherWay.png'

let playerRunningRight = new Image();
playerRunningRight.src = './img/playerRunningRight.png'

let playerRunningLeft = new Image();
playerRunningLeft.src = './img/playerRunningLeft.png'

let playerJumping = new Image();
playerJumping.src = './img/playerJumpingRight.png'

let platforms = []
let backgroundObjects = []
let mysteryBoxes = []
let flags = []
let differentFoodTypes = []
let differentDrinkTypes = []

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
            this.position.x < object.position.x + object.width - 100 &&
            this.position.x + this.width - 100 > object.position.x &&
            this.position.y < object.position.y + object.height - 100 &&
            this.position.y + this.height > object.position.y
        );
    }

}

let player = new Player()

let originalPlayerPosition = {
    x: player.x,
    y: player.y
};


class DrawObject {
    constructor({ x, y, image, width, height, clickable }) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image;
        this.width = width || image.width;
        this.height = height || image.height;
        this.clickable = clickable || false;
        if (this.clickable) {
            this.registerClickListener()
        }
    }
    draw() {
        c.imageSmoothingEnabled = false
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    registerClickListener() {
        canvas.addEventListener('click', (event) => {
            const canvasBounds = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasBounds.left;
            const mouseY = event.clientY - canvasBounds.top;
            if (mouseX >= this.position.x && mouseX <= this.position.x + this.width && mouseY >= this.position.y && mouseY <= this.position.y + this.height) {
                this.move()
                foodClickCount++
            }
        });
    }
    move() {
        this.position.x = player.position.x + 200
        this.position.y = player.position.y + 130
        this.draw();
    }
}

let scenarioBox_1 = new DrawObject({
    x: 500,
    y: 80,
    image: pinkBox,
    width: pinkBox.width,
    height: pinkBox.height
})

let scenarioBox_2 = new DrawObject({
    x: 5300,
    y: 80,
    image: pinkBox,
    width: pinkBox.width,
    height: pinkBox.height
})

let scenarioBox_3 = new DrawObject({
    x: 7200,
    y: 80,
    image: pinkBox,
    width: pinkBox.width,
    height: pinkBox.height
})

let audioBox = new DrawObject({
    x: 8700,
    y: 80,
    image: redBox,
    width: redBox.width,
    height: redBox.height
})

let visualBox = new DrawObject({
    x: 6500,
    y: -40,
    image: greenBox,
    width: greenBox.width,
    height: greenBox.height
})

let flag = new DrawObject({
    x: 9500,
    y: 95,
    image: single_flag,
    width: single_flag.width,
    height: single_flag.height
})

function gameStart() {
    console.log("game start")
    player = new Player()

    if (minigame.initiated) return

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

    scenarioBox_1 = new DrawObject({
        x: 3500,
        y: 80,
        image: pinkBox,
        width: pinkBox.width,
        height: pinkBox.height
    })

    scenarioBox_2 = new DrawObject({
        x: 500,
        y: 80,
        image: pinkBox,
        width: pinkBox.width,
        height: pinkBox.height
    })

    scenarioBox_3 = new DrawObject({
        x: 7200,
        y: 80,
        image: pinkBox,
        width: pinkBox.width,
        height: pinkBox.height
    })

    audioBox = new DrawObject({
        x: 8700,
        y: 80,
        image: redBox,
        width: redBox.width,
        height: redBox.height
    })

    visualBox = new DrawObject({
        x: 6500,
        y: -40,
        image: greenBox,
        width: greenBox.width,
        height: greenBox.height
    })

    mysteryBoxes.push(scenarioBox_1)
    mysteryBoxes.push(scenarioBox_2)
    mysteryBoxes.push(scenarioBox_3)
    mysteryBoxes.push(audioBox)
    mysteryBoxes.push(visualBox)

    flag = new DrawObject({
        x: 9500,
        y: 95,
        image: single_flag,
        width: single_flag.width,
        height: single_flag.height
    })

    flags.push(flag)


    scroll = 0
}

const minigame = {
    initiated: false
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

    flag.draw()

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
            flags.forEach((flag) => {
                flag.position.x -= player.speed
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
            flags.forEach((flag) => {
                flag.position.x += player.speed
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

    if (player.position.y > canvas.height) {
        console.log("YOU LOSE")
        gameStart()
    }

    if (player.collidesWith(scenarioBox_1)) {
        console.log("colliding with first scenario")
        scenarioBox_1.position.x = 0
        scenarioBox_1.position.y = 0
        originalPlayerPosition = {
            x: player.x,
            y: player.y
        }
        window.cancelAnimationFrame(animationId)
        minigame.initiated = true
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
                        beginFirstScenario()
                        console.log("beginning first scenario")
                        gsap.to('#overlap', {
                            opacity: 0
                        })
                    }
                })
            }
        })
    } if (player.collidesWith(scenarioBox_2)) {
        console.log("colliding with second scenario")
        scenarioBox_2.position.x = 0
        scenarioBox_2.position.y = 0
        originalPlayerPosition = {
            x: player.x,
            y: player.y
        }
        window.cancelAnimationFrame(animationId)
        minigame.initiated = true
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
                        beginSecondScenario()
                        console.log("beginning second scenario")
                        gsap.to('#overlap', {
                            opacity: 0
                        })
                    }
                })
            }
        })
    } if (player.collidesWith(scenarioBox_3)) {
        console.log("colliding with third scenario")
    } if (player.collidesWith(audioBox)) {
        console.log("colliding with audio game")
    } if (player.collidesWith(visualBox)) {
        console.log("colliding with visual game")
        visualBox.position.x = 0
        visualBox.position.y = 0
        originalPlayerPosition = {
            x: player.x,
            y: player.y
        }
        window.cancelAnimationFrame(animationId)
        minigame.initiated = true
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
                        beginVisualGame()
                        gsap.to('#overlap', {
                            opacity: 0
                        })
                    }
                })

            }

        })
    } if (player.collidesWith(flag)) {  // edge of the last hill when you jump off the big platform
        console.log("YOU WIN")
    }
}

animate()
gameStart()


function backToOriginalPosition() {
    gsap.to(player, {
        x: originalPlayerPosition.x,
        y: originalPlayerPosition.y,
        duration: 1
    });
}

const visualBackground = new Image();
visualBackground.src = './img/visualGameBackground.png'

const nextBackground = new DrawObject({
    x: -1, y: -1,
    image: visualBackground,
    width: 1300,
    height: 576
})

class Sprite {
    constructor({ x, y, width, height, image, frames }) {
        this.position = {
            x: x,
            y: y
        }
        this.width = width
        this.height = height
        this.image = image
        this.frames = frames
    }

    draw() {
        c.imageSmoothingEnabled = false
        c.drawImage(this.image,
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
    }
}

function beginVisualGame() {
    nextBackground.draw()
    let score = 0;

    const redImages = [
        './img/visualGameImages/apple.png',
        './img/visualGameImages/cherry.png',
        // './img/visualGameImages/redLollipop.png',
        // './img/visualGameImages/strawberry.png',
        // './img/visualGameImages/redCircle.png'
    ];

    const notRedImages = [
        './img/visualGameImages/greenLollipop.png',
        './img/visualGameImages/purpleLollipop.png',
        // './img/visualGameImages/milk.png',
        // './img/visualGameImages/cheese.png',
        // './img/visualGameImages/greenCircle.png',
        // './img/visualGameImages/purpleCircle.png',
        // './img/visualGameImages/yellowCircle.png'
    ];

    function getRandomPosition(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function checkOverlap(element, otherElements) {
        const rect1 = element.getBoundingClientRect();
        for (let i = 0; i < otherElements.length; i++) {
            const rect2 = otherElements[i].getBoundingClientRect();
            if (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            ) {
                return true;
            }
        }
        return false;
    }

    const reds = [];
    const notReds = [];


    for (let i = 0; i < redImages.length; i++) {
        const red = document.createElement('img');
        red.setAttribute('class', 'clickable-image');
        red.setAttribute('src', redImages[i]);
        red.style.left = getRandomPosition(400, canvas.width - 300) + 'px';
        red.style.top = getRandomPosition(400, canvas.height - 300) + 'px';
        reds.push(red);
        document.body.appendChild(red);
    }

    for (let i = 0; i < notRedImages.length; i++) {
        const notRed = document.createElement('img');
        notRed.setAttribute('class', 'non-clickable-image');
        notRed.setAttribute('src', notRedImages[i]);
        notRed.style.left = getRandomPosition(400, canvas.width - 300) + 'px';
        notRed.style.top = getRandomPosition(400, canvas.height - 300) + 'px';
        notReds.push(notRed);
        document.body.appendChild(notRed);
    }

    reds.forEach(red => {
        while (checkOverlap(red, notReds)) {
            red.style.left = getRandomPosition(400, canvas.width - 300) + 'px';
            red.style.top = getRandomPosition(400, canvas.height - 300) + 'px';
        }
        red.addEventListener('click', () => {
            red.style.display = 'none';
            score++;
            console.log(score);
            if (score === redImages.length) {
                const nextButton = document.createElement('button');
                nextButton.setAttribute('class', 'next-button');
                nextButton.innerText = 'Finish';
                document.body.appendChild(nextButton);
                nextButton.addEventListener('click', () => {
                    gsap.to('#overlap', {
                        opacity: 1,
                        onComplete: () => {
                            nextButton.setAttribute('hidden', true);
                            notReds.forEach(notRed => {
                                notRed.setAttribute('hidden', true)
                            })
                            animate()
                            backToOriginalPosition()
                            gsap.to('#overlap', {
                                opacity: 0
                            })
                        }
                    })
                })
            }
        });
    });
}

const playerOne = new Sprite({
    x: 600,
    y: 250,
    width: 150,
    height: 150,
    image: playerIdle,
    frames: 4
})

let schoolRoomImage = new Image();
schoolRoomImage.src = './img/schoolRoom.png'

const schoolRoomBackground = new DrawObject({
    x: 310, y: -1,
    image: schoolRoomImage,
    width: 700,
    height: 576

})

const donutImage = new Image();
donutImage.src = './img/visualGameImages/donut.png'

const donut = new DrawObject({
    x: 900, y: 120,
    image: donutImage,
    width: 90,
    height: 90,
    clickable: true
})

const appleImage = new Image();
appleImage.src = './img/visualGameImages/apple.png'

const apple = new DrawObject({
    x: 500, y: 400,
    image: appleImage,
    width: 100,
    height: 100,
    clickable: true
})

const milkImage = new Image();
milkImage.src = './img/visualGameImages/milk.png'

const milk = new DrawObject({
    x: 350, y: 360,
    image: milkImage,
    width: 70,
    height: 90,
    clickable: true
})

const colaImage = new Image();
colaImage.src = './img/visualGameImages/cola.png'

const cola = new DrawObject({
    x: 470, y: 50,
    image: colaImage,
    width: 60,
    height: 70,
    clickable: true
})

const breadImage = new Image();
breadImage.src = './img/visualGameImages/bread.png'

const bread = new DrawObject({
    x: 540, y: 400,
    image: breadImage,
    width: 70,
    height: 70,
    clickable: true
})

const cupcakeImage = new Image();
cupcakeImage.src = './img/visualGameImages/cupcake.png'

const cupcake = new DrawObject({
    x: 850, y: 100,
    image: cupcakeImage,
    width: 100,
    height: 100,
    clickable: true
})

differentFoodTypes.push(bread)
differentFoodTypes.push(apple)
differentFoodTypes.push(cupcake)
differentFoodTypes.push(donut)
differentFoodTypes.push(milk)
differentFoodTypes.push(cola)

function createTextDiv(text, width, height, top, left) {
    var div = document.createElement('div');
    div.style.backgroundColor = 'white';
    div.style.width = width
    div.style.height = height
    div.textContent = text
    div.style.position = 'absolute'
    div.style.top = top
    div.style.left = left
    div.style.fontFamily = 'Courier New, monospace'
    div.style.fontWeight = 'bold'
    div.style.fontSize = '1.25vw'
    div.style.paddingTop = '30px'
    div.style.textAlign = 'center'
    return div;
}

var foodText = 'What food should Sam eat for lunch today? (Please choose 3 items)';
var foodDiv = createTextDiv(foodText, '250px', '100px', '530px', '630px');
let textBox = []
textBox.push(foodDiv)


function beginFirstScenario() {
    requestAnimationFrame(beginFirstScenario)
    schoolRoomBackground.draw()

    differentFoodTypes.forEach(food => {
        food.draw()
    })

    textBox.forEach(box => {
        document.body.appendChild(box);
    })

    playerOne.update()

    if (foodClickCount >= 3) {
        cancelAnimationFrame(beginFirstScenario)
        gsap.to('#overlap', {
            opacity: 1,
            onComplete: () => {
                foodDiv.setAttribute('hidden', true);
                animate()
                console.log("back to main screen")
                gsap.to('#overlap', {
                    opacity: 0
                })
            }
        })
    }

}

let bedroomImage = new Image();
bedroomImage.src = './img/ROOM.png'

const bedroomBackground = new DrawObject({
    x: 310, y: -1,
    image: bedroomImage,
    width: 700,
    height: 576

})

const playerTwo = new Sprite({
    x: 750,
    y: 250,
    width: 150,
    height: 150,
    image: playerIdle,
    frames: 4
})

var afterSchoolText = 'School is over and the weather is sunny! What should Sam do this evening? a.) Go for a walk b.) Go to sleep c.) Call a friend';
var afterSchoolDiv = createTextDiv(afterSchoolText, '450px', '150px', '130px', '600px');
let textBox2 = []
textBox2.push(afterSchoolDiv)

// document.querySelectorAll('.optionButton').forEach((button) => {
//     button.addEventListener('click', () => {
//         console.log("clicked")
//         let nextButton = document.createElement('button');
//         nextButton.setAttribute('class', 'next-button');
//         nextButton.innerText = 'Finish';
//         document.body.appendChild(nextButton);
//         nextButton.addEventListener('click', () => {
//             gsap.to('#overlap', {
//                 opacity: 1,
//                 onComplete: () => {
//                     nextButton.setAttribute('hidden', true);
//                     animate()
//                     backToOriginalPosition()
//                     gsap.to('#overlap', {
//                         opacity: 0
//                     })
//                 }
//             })
//         })
//     })
// })

// function createButton(text, top, left) {
//     var button = document.createElement('button');
//     button.setAttribute('class', 'optionButton');
//     button.style.width = '120px'
//     button.style.height = '100px'
//     button.textContent = text
//     button.style.position = 'absolute'
//     button.style.top = top
//     button.style.left = left
//     button.style.fontFamily = 'Courier New, monospace'
//     button.style.fontWeight = 'bold'
//     button.style.fontSize = '1.1vw'
//     button.style.cursor = 'pointer'
//     return button
// }

// var walkButton = createButton(' Walk ', '570px', '630px')
// var sleepButton = createButton(' Sleep ', '570px', '750px')
// var friendButton = createButton(' Call a friend ', '570px', '870px')

// let buttonArray = []
// buttonArray.push(walkButton)
// buttonArray.push(sleepButton)
// buttonArray.push(friendButton)

function beginSecondScenario() {
    requestAnimationFrame(beginSecondScenario)
    bedroomBackground.draw()

    // buttonArray.forEach(button => {
    //     document.body.appendChild(button);
    // })

    textBox2.forEach(box => {
        document.body.appendChild(box);
    })

    playerTwo.update()
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