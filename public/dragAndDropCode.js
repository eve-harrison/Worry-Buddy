const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let backgroundImage = new Image();
backgroundImage.src = './img/ROOM.png'

let playerIdle = new Image();
playerIdle.src = './img/playerIdle.png'

let frameDelay = 0

document.getElementById("next").disabled = true

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

var container = document.querySelector(".text");
var speeds = {
    pause: 500,
    slow: 120,
    normal: 90,
};
var textLines = [
    { speed: speeds.slow, string: "Sam has to sleep alone tonight." },
    { speed: speeds.pause, string: "", pause: true },
    { speed: speeds.normal, string: "How do you think Sam feels?" },
    { speed: speeds.normal, string: "Click the emotion you think Sam is feeling." }
];
var characters = [];

function writeUpNewSituation() {
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
    document.getElementById("next").disabled = false;
    const happyButton = document.getElementById("btn1")
    const sadButton = document.getElementById("btn3")
    const worriedButton = document.getElementById("btn4")
    const scaredButton = document.getElementById("btn5")

    happyButton.addEventListener("click", () => {
        anxietyScore = anxietyScore
        console.log("Anxiety level = " + anxietyScore)
    })

    sadButton.addEventListener("click", () => {
        anxietyScore += 1
        console.log("Anxiety level = " + anxietyScore)
    })

    worriedButton.addEventListener("click", () => {
        anxietyScore += 2
        console.log("Anxiety level = " + anxietyScore)
    })

    scaredButton.addEventListener("click", () => {
        anxietyScore += 3
        console.log("Anxiety level = " + anxietyScore)
    })

}

function moveToNextScene() {
    document.getElementById("situationText").innerText = ""
    document.getElementById("canvas").style.backgroundImage = "url(img/smallPlatform.png)"
    document.getElementById("div1").style.backgroundImage = "url(img/smallPlatform.png)"
    var newSituation = [
        { speed: speeds.slow, string: "AHHHHH" },
        { speed: speeds.pause, string: "", pause: true },
        { speed: speeds.normal, string: "How do you think Sam feels?" },
        { speed: speeds.normal, string: "Click the emotion you think Sam is feeling." }
    ];
    writeUpNewSituation(newSituation)
}

writeUpNewSituation()
animate()