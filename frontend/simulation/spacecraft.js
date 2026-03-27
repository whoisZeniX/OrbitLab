let spacecraft = {
    x:0,
    y:0,
    vx:0,
    vy:0,
    active:false,
    path:[]
}

const G_SUN = 0.05
const G_PLANET = 0.02

function launchSpacecraft(startX,startY,velocity,angle){

    const rad = angle * Math.PI / 180

    spacecraft.x = startX
    spacecraft.y = startY

    spacecraft.vx = velocity * Math.cos(rad)
    spacecraft.vy = velocity * Math.sin(rad)

    spacecraft.active = true
    spacecraft.path = []
}

function applyGravityFromBody(bodyX, bodyY, strength){

    const dx = bodyX - spacecraft.x
    const dy = bodyY - spacecraft.y

    const distance = Math.sqrt(dx*dx + dy*dy)

    if(distance < 5) return 

    const force = strength / (distance * distance)

    spacecraft.vx += force * dx
    spacecraft.vy += force * dy
}

function updateSpacecraft(centerX,centerY){

    if(!spacecraft.active) return

    applyGravityFromBody(centerX, centerY, G_SUN)

    planets.forEach(planet=>{

        const px = centerX + planet.orbitRadius*Math.cos(planet.angle)
        const py = centerY + planet.orbitRadius*Math.sin(planet.angle)

        applyGravityFromBody(px, py, G_PLANET)
    })

    spacecraft.x += spacecraft.vx
    spacecraft.y += spacecraft.vy

    spacecraft.path.push({
        x: spacecraft.x,
        y: spacecraft.y
    })

    if(spacecraft.path.length > 700){
        spacecraft.path.shift()
    }
}

function drawTrajectory(ctx){

    if(spacecraft.path.length < 2) return

    ctx.beginPath()
    ctx.moveTo(spacecraft.path[0].x, spacecraft.path[0].y)

    for(let i=1; i<spacecraft.path.length; i++){
        ctx.lineTo(spacecraft.path[i].x, spacecraft.path[i].y)
    }

    ctx.strokeStyle = "white"
    ctx.lineWidth = 1
    ctx.stroke()
}

function drawSpacecraft(ctx){

    if(!spacecraft.active) return

    drawTrajectory(ctx)

    ctx.beginPath()
    ctx.arc(spacecraft.x, spacecraft.y, 4, 0, Math.PI*2)
    ctx.fillStyle = "white"
    ctx.fill()
}