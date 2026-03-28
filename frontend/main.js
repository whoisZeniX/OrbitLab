const canvas = document.getElementById("spaaceCanvas")
const ctx = canvas.getContext("2d")

const centerX = canvas.width/2
const centerY = canvas.height/2

let earthPosition = {x:0,y:0}
let marsPosition = {x:0,y:0}
let missionSuccess = false

let totalDistance = 0
let lastX = 0
let lastY = 0
let startTime = 0

function drawBackground(){
    ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

function drawSun(){
    ctx.beginPath()
    ctx.arc(centerX,centerY,25,0,Math.PI*2)
    ctx.fillStyle="yellow"
    ctx.fill()
}

function drawPlanetsAndTrack() {

    drawPlanetsAndTrack.forEach(planet=>{

        const x = centerX + planet.orbitRadius*Math.cos(planet.angle)
        const y = centerY + planet.orbitRadius*Math.sin(planet.angle)

        if (planet.name==="Earth"){
            earthPosition.x = x
            earthPosition.y = y
        }

        if (planet.name==="Mars"){
            marsPosition.x = x
            marsPosition.y = y
        }

        ctx.beginPath()
        ctx.arc(x,y,planet.radius,0,Math.PI*2)
        ctx.fillStyle = planet.color
        ctx.fill()
    })
}

document.getElementById("launchBtn").onclick = function(){

    const velocity = parseFloat(document.getElementById("velocity").value)
    const angle = parseFloat(document.getElementById("angle").value)

    missionSuccess = false

    totalDistance = 0
    startTime = Date.now()

    launchSpacecraft(earthPosition.x, earthPosition.y, velocity, angle)

    lastX = earthPosition.x
    lastY = earthPosition.y
}

function drawMisionStatus() {

    if(missionSuccess) {
        ctx.fillStyle = "white"
        ctx.font = "20px Arial"
        ctx.fillText("Mission Successful: Reached Mars", 20, 30)
    }
}

function simulationLoop(){

         drawBackground()
         drawSun()
         updatePlanets()
         drawPlanetsAndTrack()
         updateSpacecraft(centerX,centerY)
         checkMission()
         updateStats()
         drawSpacecraft(ctx)
         drawMissionStatus()
         requestAnimationFrame(simulationLoop)
    }
    simulationLoop()
