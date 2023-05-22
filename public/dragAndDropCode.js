const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var container = document.querySelector(".text");

let backgroundImage = new Image();
backgroundImage.src = './img/ROOM.png'

let playerIdle = new Image();
playerIdle.src = './img/playerIdle.png'

let sceneFive = false

let robotImage2 = new Image();
robotImage2.src = './img/robotTurningAround.png'

let frameDelay = 0

let preGameAnxietyLevel = 0

const moveOnButton = document.getElementById("mainGameButton")
moveOnButton.addEventListener("click", () => {
    var anxietyScore = preGameAnxietyLevel;
    sessionStorage.setItem("anxietyScore", anxietyScore);
    console.log("anxiety score: " + anxietyScore)
})

const happyButton = document.getElementById("btn1")
const dontCareButton = document.getElementById("btn2")
const sadButton = document.getElementById("btn3")
const worriedButton = document.getElementById("btn4")
const scaredButton = document.getElementById("btn5")

let nextButtonClicked = false
let happyClicked = false
let dontCareClicked = false
let sadClicked = false
let worriedClicked = false
let scaredClicked = false

document.getElementById("scene2").disabled = true

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 650,
            y: 300
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 220
        this.height = 180
        this.image = playerIdle
        this.frames = 0

        this.updatePosition = function (newPosition) {
            c.clearRect(0, 0, canvas.width, canvas.height)
            this.position = newPosition
        }

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

        this.updatePosition = function (newPosition) {
            c.clearRect(0, 0, canvas.width, canvas.height)
            this.position = newPosition
        }
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

const robot = new Sprite({
    x: 390,
    y: 310,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 3
})

const robot2 = new Sprite({
    x: 330,
    y: 140,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 1
})

const robot3 = new Sprite({
    x: 780,
    y: 310,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 4
})

const robot4 = new Sprite({
    x: 150,
    y: 180,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 1
})

const robot5 = new Sprite({
    x: 720,
    y: 270,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 3
})

const robot6 = new Sprite({
    x: 450,
    y: 330,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 4
})

const robot7 = new Sprite({
    x: 150,
    y: 270,
    width: 200,
    height: 200,
    image: robotImage2,
    frames: 3
})

function writeUpNewSituation(speeds, textLines) {
    var characters = []
    textLines.forEach((line, index) => {
        if (index < textLines.length - 1) {
            line.string += " ";
        }
        line.string.split("").forEach((character) => {
            var span = document.createElement("span");
            span.textContent = character;
            container.appendChild(span);
            characters.push({
                span: span,
                isSpace: character === " " && !line.pause,
                delayAfter: line.speed,
                classes: line.classes || []
            });
        });
    });

    function revealOneCharacter(list) {
        var next = list.splice(0, 1)[0];
        next.span.classList.add("revealed");
        next.classes.forEach((c) => {
            next.span.classList.add(c);
        });
        var delay = next.isSpace && !next.pause ? 0 : next.delayAfter;

        if (list.length > 0) {
            setTimeout(function () {
                revealOneCharacter(list);
            }, delay);
        }
    }
    setTimeout(() => {
        revealOneCharacter(characters);
    }, 600)
}

let player = new Player()
let sprite1 = new Sprite({
    x: 600,
    y: 250,
    width: 150,
    height: 150,
    image: playerIdle,
    frames: 4
})

let sprites = []

function animate() {
    requestAnimationFrame(animate)
    player.update()
}

function updateAnxietyScore() {
    const nextButtons = document.querySelectorAll(".nextSceneButton")
    for (let i = 0; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener("click", () => {
            nextButtonClicked = true;
            checkClicks();
        });
    }
}

function checkClicks() {
    if (happyClicked && nextButtonClicked) {
        preGameAnxietyLevel -= 1
        happyClicked = false;
        nextButtonClicked = false;
    }
    if (sadClicked && nextButtonClicked) {
        preGameAnxietyLevel += 1
        sadClicked = false;
        nextButtonClicked = false;
    }
    if (worriedClicked && nextButtonClicked) {
        preGameAnxietyLevel += 2
        worriedClicked = false;
        nextButtonClicked = false;
    }
    if (scaredClicked && nextButtonClicked) {
        preGameAnxietyLevel += 3
        scaredClicked = false;
        nextButtonClicked = false;
    }
}


happyButton.addEventListener("click", () => {
    happyClicked = true;
    checkClicks();
})

dontCareButton.addEventListener("click", () => {
    dontCareClicked = true;
    checkClicks();
})

sadButton.addEventListener("click", () => {
    sadClicked = true;
    checkClicks();
})

worriedButton.addEventListener("click", () => {
    worriedClicked = true;
    checkClicks();
})

scaredButton.addEventListener("click", () => {
    scaredClicked = true;
    checkClicks();
})

function enableNextButton() {
    updateAnxietyScore()
    document.getElementById("scene2").disabled = false
    document.getElementById("scene3").disabled = false
    document.getElementById("scene4").disabled = false
    document.getElementById("scene5").disabled = false
}

function moveToSceneTwo() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("canvas").style.backgroundImage = "url(img/schoolRoom.png)"
    document.getElementById("div1").style.backgroundImage = "url(img/classroomWall.png)"

    document.getElementById("canvas").style.width = "590px"
    document.getElementById("div1").style.width = "400px"

    document.getElementById("scene2").style.display = "none"
    document.getElementById("scene3").style.display = "block"

    document.querySelectorAll('.emotionButton').forEach(function (button) {
        button.style.backgroundColor = "#a5958c"
        button.style.border = "none"
    });

    const buttons = document.querySelectorAll('.emotionButton');
    let activeButton = null;
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (activeButton !== button) {
                if (activeButton) {
                    activeButton.style.backgroundColor = 'a5958c';
                }
                button.style.backgroundColor = 'rgb(200, 255, 0)';
                activeButton = button;
            }
        });
    });


    var pos = { x: 610, y: 250 }
    player.updatePosition(pos)
    player.draw()

    robot.draw()
    robot2.draw()
    robot3.draw()
    robot4.draw()

    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90,
    }, textLines = [
        { speed: speeds.slow, string: "School can be crowded sometimes. " },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "Sam has to go to crowded places all the time. " },
        { speed: speeds.normal, string: "How do crowded places make YOU feel?" }
    ])

}

function moveToSceneThree() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("canvas").style.backgroundImage = "url(img/classroom.png)"

    document.getElementById("scene3").style.display = "none"
    document.getElementById("scene4").style.display = "block"


    document.querySelectorAll('.emotionButton').forEach(function (button) {
        button.style.backgroundColor = "#a5958c"
        button.style.border = "none"
    });

    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90,
    }, textLines = [
        { speed: speeds.slow, string: "Today is show and tell!" },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "Sam has to speak in front of the class. " },
        { speed: speeds.normal, string: "How do YOU feel when you have to speak in front of others?" }
    ])

    var pos = { x: 700, y: 100 }
    player.updatePosition(pos)
    player.draw()

    robot5.draw()
    robot6.draw()
    robot7.draw()

}

function moveToSceneFour() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("scene4").style.display = "none"
    document.getElementById("scene5").style.display = "block"


    document.querySelectorAll('.emotionButton').forEach(function (button) {
        button.style.backgroundColor = "#a5958c"
        button.style.border = "none"
    });

    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90,
    }, textLines = [
        { speed: speeds.slow, string: "Sam has a test today but she forgot to study. She might do badly on this test. " },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "How would YOU feel if you were Sam?" },
        { speed: speeds.normal, string: "Click the emotion that you would feel." }
    ])
}


function moveToSceneFive() {
    sceneFive = true
    document.getElementById("situationText").innerText = ""
    document.getElementById("scene5").style.display = "none"
    document.getElementById("mainGameButton").style.display = "block"


    document.getElementById("canvas").style.backgroundImage = "url(img/ROOM.png)"
    document.getElementById("div1").style.backgroundImage = "url(img/questionsBackground.png)"

    document.getElementById("canvas").style.width = "700px"
    document.getElementById("canvas").style.height = "550px"

    document.querySelectorAll('.emotionButton').forEach(function (button) {
        button.style.backgroundColor = "#6c656a";
        button.style.border = "none"
    });

    const buttons = document.querySelectorAll('.emotionButton');
    let activeButton = null;
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (activeButton !== button) {
                if (activeButton) {
                    activeButton.style.backgroundColor = "#6c656a";
                }
                button.style.backgroundColor = 'rgb(200, 255, 0)';
                activeButton = button;
            }
        });
    });

    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90
    }, textLines = [
        { speed: speeds.slow, string: "Sam has to sleep alone tonight." },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "How do you feel when YOU have to sleep by yourself?" },
        { speed: speeds.normal, string: "Click the emotion you would feel. " }
    ])

    player.updatePosition({ x: 650, y: 300 })
}

writeUpNewSituation(speeds = {
    pause: 500,
    slow: 120,
    normal: 90,
}, textLines = [
    { speed: speeds.slow, string: "Time to wake up and go to school! " },
    { speed: speeds.pause, string: "", pause: true },
    { speed: speeds.normal, string: "Sam gets ready for school everyday. " },
    { speed: speeds.normal, string: "How does going to school make YOU feel?" }
])

animate()