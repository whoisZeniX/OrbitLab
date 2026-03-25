let spacecraft = {
      x:0,
      y:0,
      vx:0,
      vy:0,
      active:false    
}

const g = 0.05

function launchSpacecraft(startX,startY,velocity,angle){

    const rad = angle * Math.PI / 180

    spacecraft.x = startX
    spacecraft.y = startY

    spacecraft.vx = velocity * Math.cos(rad)
    spacecraft.vy = velocity * Math.sin(rad)

    spacecraft.active = true
}

function applyGravity(centerX,centerY){

    const dx = centerX - spacecraft.x
    const dy = centerY - spacecraft.y

    const distance = Math.sqrt(dx*dx + dy*dy)

    const force = g / (distance * distance)

    const ax = force * dx
    const ay = force * dy

    spacecraft.vy += ax
    spacecraft.vy += ay
}

 function updateSpacecraft(centerX,centerY)
{
    if(!spacecraft.active) return

    applyGravity(centerX,centerY)

    spacecraft.x += spacecraft.vx
    spacecraft.y += spacecraft.vy
}

function drawSpacecraft(ctx) {

    if(!spacecraft.active) return

    ctx.beginPath()
    ctx.arc(spacecraft.x,spacecraft.y,4,0,Math.PI*2)
    ctx.fillStyle="white"
    ctx.fill()
}