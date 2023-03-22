const welcomePlayer = document.getElementById('welcomePlayerContainer')
const playButton = document.getElementById('playButton')

playButton.addEventListener('click', () => {
    welcomePlayer.style.display = 'none'
});

function holdSpaceBarForTimeLimit(timeLimitInSeconds, timerObject) {
    let isHoldingSpaceBar = false;
    let timerId = null;
    let remainingTime = timeLimitInSeconds * 1000;

    const timerElement = document.createElement('div');
    timerElement.style.fontSize = '28px';
    timerElement.style.position = 'absolute'
    timerElement.style.fontWeight = 'bolder'
    timerElement.style.backgroundColor = 'white'
    document.body.appendChild(timerElement);

    const handleKeyDown = (event) => {
        if (event.code === 'Space' && !isHoldingSpaceBar) {
            isHoldingSpaceBar = true;
            startTimer();
        }
    };

    const handleKeyUp = () => {
        isHoldingSpaceBar = false;
        clearTimeout(timerId);
        updateTimer();
    };

    const updateTimer = () => {
        const seconds = Math.floor(remainingTime / 1000);
        let message;
        if (remainingTime <= timeLimitInSeconds * 500) {
            message = 'Hold down the SPACE BAR and make sure to Breathe OUT ';
        } else {
            message = 'Hold down the SPACE BAR and Breathe IN ';
        }
        timerElement.textContent = `${message} for ${seconds} more second${seconds === 1 ? '' : 's'}`;
    };

    const startTimer = () => {
        const startTime = Date.now();
        timerId = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            remainingTime = Math.max(0, timeLimitInSeconds * 1000 - elapsedTime);
            if (remainingTime <= 0) {
                clearInterval(timerId);
                if (isHoldingSpaceBar) {
                    timerElement.textContent = 'Good job!';
                    timerElement.style.fontSize = '50px'
                    timerElement.style.color = 'green'
                    setTimeout(() => {
                        timerElement.style.display = 'none'
                        animate()
                    }, 500);
                }
            } else {
                updateTimer();
            }
        }, 10);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    updateTimer();
}


document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('popup-container').style.display = 'none';
    holdSpaceBarForTimeLimit(10, timer);
})

document.getElementById('popup-close-btn').addEventListener('click', () => {
    document.getElementById('tryAgainPopupContainer').style.display = 'none';
})


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1300
canvas.height = 576
const gravity = 0.5
let foodClickCount = 0
let selectedAnAnimalCount = 0
let frameDelay = 0
let scenarioOneAnimationId
let scenarioTwoAnimationId
let scenarioThreeAnimationId


let score = 0

let backgroundImage = new Image();
backgroundImage.src = './img/bestBackground.jpg'

let groundImage = new Image();
groundImage.src = './img/bigPlatform.png'

let hill = new Image();
hill.src = './img/greenHillOne.png'

let redBox = new Image();
redBox.src = './img/redBox.png'

let pinkBox = new Image();
pinkBox.src = './img/pinkBox.png'

let greenBox = new Image();
greenBox.src = './img/greenBox.png'

let single_flag = new Image();
single_flag.src = './img/flag1.png'

let timerImage = new Image();
timerImage.src = './img/timer.png'

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

let mysteryBoxes = []
let flags = []
let differentFoodTypes = []
let differentDrinkTypes = []
let scroll = 0

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
        this.frameDelay = 3;
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
        if (this.frameDelay <= 0) {
            this.frames++;
            this.frameDelay = 3;
        } else {
            this.frameDelay--;
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

let platforms = [new DrawObject({
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

let backgroundObjects = [new DrawObject({
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


let timer = new DrawObject({
    x: 3500,
    y: -30,
    image: timerImage,
    width: timerImage.width,
    height: timerImage.height
})

let scenarioBox_1 = new DrawObject({
    x: 2050,
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

mysteryBoxes.push(scenarioBox_1)
mysteryBoxes.push(scenarioBox_2)
mysteryBoxes.push(scenarioBox_3)
mysteryBoxes.push(audioBox)
mysteryBoxes.push(visualBox)
mysteryBoxes.push(timer)

let flag = new DrawObject({
    x: 9500,
    y: 95,
    image: single_flag,
    width: single_flag.width,
    height: single_flag.height
})

flags.push(flag)

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
        document.getElementById('tryAgainPopupContainer').style.display = 'block';
        player.position.y = 100
        player.position.x = player.position.x - 150
        if (player.position.y > canvas.height) {
            player.position.x = player.position.x - 50
        }
        if (player.position.y > canvas.height) {
            player.position.y = player.position.y + 100
        }
    }

    if (player.collidesWith(timer)) {
        document.getElementById('popup-container').style.display = 'block';
        cancelAnimationFrame(animationId)
        timer.position.x = -700
        timer.position.y = -700
    }

    if (player.collidesWith(scenarioBox_1)) {
        console.log("colliding with first scenario")
        scenarioBox_1.position.x = -200
        scenarioBox_1.position.y = -200
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
        scenarioBox_2.position.x = -200
        scenarioBox_2.position.y = -200
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
        scenarioBox_3.position.x = -200
        scenarioBox_3.position.y = -200
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
                        beginThirdScenario()
                        console.log("beginning third scenario")
                        gsap.to('#overlap', {
                            opacity: 0
                        })
                    }
                })
            }
        })
    } if (player.collidesWith(audioBox)) {
        console.log("colliding with audio game")
        audioBox.position.x = -200
        audioBox.position.y = -200
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
                        beginAudioGame()
                        gsap.to('#overlap', {
                            opacity: 0
                        })
                    }
                })

            }

        })
    } if (player.collidesWith(visualBox)) {
        console.log("colliding with visual game")
        visualBox.position.x = -200
        visualBox.position.y = -200
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
    } if (player.collidesWith(flag)) {
        cancelAnimationFrame(animationId)

        var winDiv = document.createElement("div");

        winDiv.style.position = "fixed";
        winDiv.style.top = "50%";
        winDiv.style.left = "50%";
        winDiv.style.transform = "translate(-50%, -50%)";
        winDiv.style.border = 'none'
        winDiv.style.padding = "20px";

        var header = document.createElement("h1");
        header.style.color = "black";
        header.style.fontSize = "7em";
        header.textContent = "You Win!";

        var scoreParagraph = document.createElement("p");
        scoreParagraph.style.fontSize = "5em";
        scoreParagraph.style.color = "black";
        scoreParagraph.textContent = "Your score: " + score;

        var playAgainButton = document.createElement("button");
        playAgainButton.textContent = "Play again";
        playAgainButton.style.backgroundColor = "green";
        playAgainButton.style.border = "none";
        playAgainButton.style.color = "white";
        playAgainButton.style.fontSize = "1.5em";
        playAgainButton.style.padding = "10px";
        playAgainButton.style.position = "absolute";
        playAgainButton.style.bottom = "10px";
        playAgainButton.style.right = "10px";

        playAgainButton.addEventListener('click', () => {
            window.location.href = './login'
        })

        winDiv.appendChild(header);
        winDiv.appendChild(scoreParagraph);
        winDiv.appendChild(playAgainButton);

        document.body.appendChild(winDiv);
    }
}

animate()

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

function preloadImages(imageUrls) {
    const promises = imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    });

    return Promise.all(promises);
}

var visualGameText = 'Focus on all of the red items you can see. Click them when you see them!';
var visualGameDiv = createTextDiv(visualGameText, '450px', '90px', '100px', '500px');
let vTB = []
vTB.push(visualGameDiv)

async function beginVisualGame() {
    nextBackground.draw()
    let score = 0;

    vTB.forEach(TB => {
        document.body.appendChild(TB);
    });

    const redImages = [
        './img/visualGameImages/apple.png',
        './img/visualGameImages/cherry.png',
        './img/visualGameImages/redLollipop.png',
        './img/visualGameImages/strawberry.png',
        './img/visualGameImages/redCircle.png'
    ];

    const notRedImages = [
        './img/visualGameImages/greenLollipop.png',
        './img/visualGameImages/purpleLollipop.png',
        './img/visualGameImages/milk.png',
        './img/visualGameImages/cheese.png',
        './img/visualGameImages/greenCircle.png',
        './img/visualGameImages/purpleCircle.png',
        './img/visualGameImages/yellowCircle.png'
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

    await preloadImages([...redImages, ...notRedImages]);

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
                            visualGameDiv.setAttribute('hidden', true)
                            animate()
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

var foodText = 'What food should Sam eat for lunch today? Click three items!';
var foodDiv = createTextDiv(foodText, '250px', '100px', '460px', '780px');
let textBox = []
textBox.push(foodDiv)

function beginFirstScenario() {
    scenarioOneAnimationId = requestAnimationFrame(beginFirstScenario);
    schoolRoomBackground.draw();

    differentFoodTypes.forEach(food => {
        food.draw();
    });

    textBox.forEach(box => {
        document.body.appendChild(box);
    });

    playerOne.update();

    if (foodClickCount >= 3) {
        cancelAnimationFrame(scenarioOneAnimationId);
        gsap.to('#overlap', {
            opacity: 1,
            onComplete: () => {
                foodDiv.setAttribute('hidden', true);
                gsap.to('#overlap', {
                    opacity: 0,
                    onComplete: () => {
                        animate()
                    }
                });
            }
        });
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
    frames: 1
})

var afterSchoolText = 'School is over and the weather is sunny! What should Sam do this evening? a.) Go for a walk b.) Go to sleep c.) Call a friend';
var afterSchoolDiv = createTextDiv(afterSchoolText, '450px', '150px', '130px', '600px');
let textBox2 = []
textBox2.push(afterSchoolDiv)

document.querySelectorAll('.optionButton').forEach((button) => {
    button.addEventListener('click', () => {
        let nextButton = document.createElement('button');
        nextButton.setAttribute('class', 'next-button');
        nextButton.innerText = 'Finish';
        document.body.appendChild(nextButton);
        nextButton.addEventListener('click', () => {
            cancelAnimationFrame(scenarioTwoAnimationId)
            gsap.to('#overlap', {
                opacity: 1,
                onComplete: () => {
                    cancelAnimationFrame(beginSecondScenario)
                    nextButton.setAttribute('hidden', true);
                    document.querySelectorAll('.optionButton').forEach((button) => {
                        button.setAttribute('hidden', true)
                    })
                    textBox2.forEach(box => {
                        box.setAttribute('hidden', true)
                    })
                    document.getElementById('optionBar').style.display = 'none'
                    animate()
                    gsap.to('#overlap', {
                        opacity: 0
                    })
                }
            })
        })
    })
})

function beginSecondScenario() {
    scenarioTwoAnimationId = requestAnimationFrame(beginSecondScenario);
    bedroomBackground.draw()

    document.getElementById('optionBar').style.display = 'block'

    textBox2.forEach(box => {
        document.body.appendChild(box);
    })

    playerTwo.update()
}

let classroomImage = new Image();
classroomImage.src = './img/classroom.png'

let robotImage2 = new Image();
robotImage2.src = './img/robotTurningAround.png'

const classroom = new DrawObject({
    x: 310, y: -1,
    image: classroomImage,
    width: 700,
    height: 576

})

const playerThree = new Sprite({
    x: 780,
    y: 120,
    width: 150,
    height: 150,
    image: playerIdle,
    frames: 3
})

const robot = new Sprite({
    x: 390,
    y: 310,
    width: 150,
    height: 150,
    image: robotImage2,
    frames: 3
})

const robot2 = new Sprite({
    x: 330,
    y: 140,
    width: 150,
    height: 150,
    image: robotImage2,
    frames: 1
})

const robot3 = new Sprite({
    x: 780,
    y: 310,
    width: 150,
    height: 150,
    image: robotImage2,
    frames: 4
})

var inSchoolText = 'Sam just arrived at school! What should they do first?';
var inSchoolDiv = createTextDiv(inSchoolText, '450px', '70px', '90px', '600px');
let textBox3 = []
textBox3.push(inSchoolDiv)

document.querySelectorAll('.schoolOptionButton').forEach((button) => {
    button.addEventListener('click', () => {
        let nextButton = document.createElement('button');
        nextButton.setAttribute('class', 'next-button');
        nextButton.innerText = 'Finish';
        document.body.appendChild(nextButton);
        nextButton.addEventListener('click', () => {
            cancelAnimationFrame(scenarioThreeAnimationId)
            gsap.to('#overlap', {
                opacity: 1,
                onComplete: () => {
                    cancelAnimationFrame(beginSecondScenario)
                    nextButton.setAttribute('hidden', true);
                    document.querySelectorAll('.schoolOptionButton').forEach((button) => {
                        button.setAttribute('hidden', true)
                    })
                    textBox3.forEach(box => {
                        box.setAttribute('hidden', true)
                    })
                    document.getElementById('schoolOptionBar').style.display = 'none'
                    animate()
                    gsap.to('#overlap', {
                        opacity: 0
                    })
                }
            })
        })
    })
})

function beginThirdScenario() {
    scenarioThreeAnimationId = requestAnimationFrame(beginThirdScenario);
    classroom.draw()

    document.getElementById('schoolOptionBar').style.display = 'block'

    textBox3.forEach(box => {
        document.body.appendChild(box);
    })

    robot.draw()
    robot2.draw()
    robot3.draw()
    playerThree.draw()
}

document.getElementById('noButton').addEventListener('click', () => {
    document.getElementById('animalButtonsDiv').style.display = 'block'
    document.getElementById('animal-container').style.display = 'block'
    document.getElementById('confirmSelection').style.display = 'none'
    document.getElementById('selectedAnimal').style.display = 'none'
})

document.getElementById('yesButton').addEventListener('click', () => {
    document.getElementById('animalButtonsDiv').style.display = 'block'
    document.getElementById('animal-container').style.display = 'block'
    document.getElementById('confirmSelection').style.display = 'none'
    document.getElementById('selectedAnimal').style.display = 'none'

    beginAudioGame()

    selectedAnAnimalCount++

    if (selectedAnAnimalCount >= 3) {
        gsap.to('#overlap', {
            opacity: 1,
            onComplete: () => {
                document.getElementById('animalButtonsDiv').style.display = 'none'
                document.getElementById('animal-container').style.display = 'none'
                document.getElementById('confirmSelection').style.display = 'none'
                document.getElementById('selectedAnimal').style.display = 'none'
                document.getElementById('audioGameDiv').style.display = 'none'
                animate()
                gsap.to('#overlap', {
                    opacity: 0
                })
            }
        })
    }
    console.log("THIS IS WHERE YOU WILL LOG THE SCORE EVENTUALLY")
})

function beginAudioGame() {
    console.log("beginning audio game")

    document.getElementById('audioGameDiv').style.display = 'block'

    const audio1 = new Audio('./img/audioGameData/catAudio.mp3');
    const audio2 = new Audio('./img/audioGameData/frogAudio.mp3');
    const audio3 = new Audio('./img/audioGameData/cowAudio.mp3');

    const catButton = document.getElementById('catButton');
    const frogButton = document.getElementById('frogButton');
    const cowButton = document.getElementById('cowButton');

    const cat = document.getElementById('cat');
    const cow = document.getElementById('cow');
    const frog = document.getElementById('frog');
    const pig = document.getElementById('pig');
    const fox = document.getElementById('fox');
    const chicken = document.getElementById('chicken');

    const animalContainer = document.getElementById('animal-container');
    let selectedAnimal = null;
    let isAnimalSelected = false;

    catButton.addEventListener('click', function () {
        audio1.play();
        animalContainer.style.display = 'block';
    });

    frogButton.addEventListener('click', function () {
        audio2.play();
        animalContainer.style.display = 'block';
    });

    cowButton.addEventListener('click', function () {
        audio3.play();
        animalContainer.style.display = 'block';
    });

    cat.addEventListener('click', function () {
        selectedAnimal = 'cat';
        isAnimalSelected = true;
    });

    cow.addEventListener('click', function () {
        selectedAnimal = 'cow';
        isAnimalSelected = true;
    });

    frog.addEventListener('click', function () {
        selectedAnimal = 'frog';
        isAnimalSelected = true;
    });

    fox.addEventListener('click', function () {
        selectedAnimal = 'fox';
        isAnimalSelected = true;
    });

    pig.addEventListener('click', function () {
        selectedAnimal = 'pig';
        isAnimalSelected = true;
    });

    chicken.addEventListener('click', function () {
        selectedAnimal = 'chicken';
        isAnimalSelected = true;
    });

    function checkAnimalSelection() {
        if (isAnimalSelected) {
            console.log('Selected animal:', selectedAnimal);
            selectedAnimal = null;
            isAnimalSelected = false;
            animalContainer.style.display = 'none';
        }
    }

    animalContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'IMG') {
            document.getElementById('animalButtonsDiv').style.display = 'none'
            document.getElementById('confirmSelection').style.display = 'block'
            document.getElementById('selectedAnimal').style.display = 'block'
            document.getElementById('selectedAnimal').innerHTML = 'You selected : ' + selectedAnimal
            checkAnimalSelection();
        }
    })
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