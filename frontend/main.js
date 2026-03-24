const canvas = document.getElementById("spaceCanvas")
const ctx = canvas.getContext("2d")

const centerX = canvas.width/2
const centerY = canvas.height/2

let earthPosition = {x:0,y:0}

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

function drawPlanetsAndTrackEarth(){

planets.forEach(planet=>{

const x = centerX + planet.orbitRadius*Math.cos(planet.angle)
const y = centerY + planet.orbitRadius*Math.sin(planet.angle)

if(planet.name==="Earth"){
earthPosition.x=x
earthPosition.y=y    
}

ctx.beginPath()
ctx.arc(x,y,planet.radius,0,Math.PI*2)
ctx.fillStyle=planet.color
ctx.fill()

})

}

document.getElementById("launchBtn").onclick=function(){

const velocity=parseFloat(document.getElementById("velocity").value)
const angle=parseFloat(document.getElementById("angle").value)

launchSpacecraft(earthPosition.x,earthPosition.y,velocity,angle)

}

function simulationLoop(){

drawBackground()

drawSun()

updatePlanets()

drawPlanetsAndTrackEarth()

updateSpacecraft()

drawSpacecraft(ctx)

requestAnimationFrame(simulationLoop)

}

simulationLoop()