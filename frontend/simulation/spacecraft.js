let spacecraft = {
    x:0,
    y:0,
    vx:0,
    vy:0,
    active:false,
    path:[]
}

const g = 0.05

function launchSpacecraft(startX,startY,velocity,angle){

    const rad = angle * Math.PI / 180

    spacecraft.x = startX
    spacecraft.y = startY

    spacecraft.vx = velocity * Math.cos(rad)
    spacecraft.vy = velocity * Math.sin(rad)

    spacecraft.active = true

    spacecraft.path = []
}

function applyGravity(centerX,centerY){

    const dx = centerX - spacecraft.x
    const dy = centerY - spacecraft.y

    const distance = Math.sqrt(dx*dx + dy*dy)

    const force = G / (distance * distance)

    const ax = force * dx
    const ay = force * dy 

    spacecraft.vx += ax
    spacecraft.vy += ay
}

function updateSpacecraft(centerX,centerY){

    if(!spacecraft.active) return 

    applyGravity(centerX,centerY)

    spacecraft.x += spacecraft.vx
    spacecraft.y += spacecraft.vy

     spacecraft.path.push({
        x: spacecraft.x,
        y: spacecraft.y
     })

     if(spacecraft.path.length >600){
        spacecraft.path.shift()
     }
}

function drawTrajectory(ctx) {

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
    ctx.fillStyle = "wjite"
    ctx.fill()
}