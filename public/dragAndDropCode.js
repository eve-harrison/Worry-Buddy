const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var container = document.querySelector(".text");

let backgroundImage = new Image();
backgroundImage.src = './img/ROOM.png'

let playerIdle = new Image();
playerIdle.src = './img/playerIdle.png'

let robotImage = new Image();
robotImage.src = './img/robotTeacher.png'

let frameDelay = 0

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

function animate() {
    requestAnimationFrame(animate)
    player.update()
}

function updateAnxietyScore() {
    let anxietyScore = 0

    const happyButton = document.getElementById("btn1")
    const dontCareButton = document.getElementById("btn2")
    const sadButton = document.getElementById("btn3")
    const worriedButton = document.getElementById("btn4")
    const scaredButton = document.getElementById("btn5")

    happyButton.addEventListener("click", () => {
        document.getElementById("anxietyLevel").innerHTML = anxietyScore - 1
    })

    dontCareButton.addEventListener("click", () => {
        document.getElementById("anxietyLevel").innerHTML = anxietyScore
    })

    sadButton.addEventListener("click", () => {
        document.getElementById("anxietyLevel").innerHTML = anxietyScore + 1
    })

    worriedButton.addEventListener("click", () => {
        document.getElementById("anxietyLevel").innerHTML = anxietyScore + 2
    })

    scaredButton.addEventListener("click", () => {
        document.getElementById("anxietyLevel").innerHTML = anxietyScore + 3
    })

}

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
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            button.classList.add('active');
            activeButton = button;
        });
    });

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
    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90,
    }, textLines = [
        { speed: speeds.slow, string: "Today is show and tell!" },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "Sam has to speak in front of the class. " },
        { speed: speeds.normal, string: "Click the emotion Sam is feeling." }
    ])

    player.updatePosition({ x: 750, y: 100 })

}

function moveToSceneFour() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("scene4").style.display = "none"
    document.getElementById("scene5").style.display = "block"
    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90,
    }, textLines = [
        { speed: speeds.slow, string: "Sam has a test today but they forgot to study." },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "How do you think Sam feels?" },
        { speed: speeds.normal, string: "Click the emotion Sam is feeling." }
    ])
}

function moveToSceneFive() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("scene5").style.display = "none"
    document.getElementById("mainGameButton").style.display = "block"


    document.getElementById("canvas").style.backgroundImage = "url(img/ROOM.png)"
    document.getElementById("div1").style.backgroundImage = "url(img/questionsBackground.png)"

    document.getElementById("canvas").style.width = "700px"
    document.getElementById("canvas").style.height = "550px"


    document.querySelectorAll('.emotionButton').forEach(function (button) {
        button.style.backgroundColor = "#6c656a"
        button.style.border = "none"
    });

    writeUpNewSituation(speeds = {
        pause: 500,
        slow: 120,
        normal: 90
    }, textLines = [
        { speed: speeds.slow, string: "Sam has to sleep alone tonight." },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "How do you think Sam feels?" },
        { speed: speeds.normal, string: "Click the emotion you think Sam is feeling." }
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