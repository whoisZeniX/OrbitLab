let spacecraft = {
    x:0,
    y:0,
    vx:0,
    vy:0,
    active:false
}

function launchSpacecraft(startX,startY,velocity,angle){
    const rad = angle * Math.PI / 180

    spacecraft.x = startX
    spacecraft.y = startY
    spacecraft.vx = velocity * Math.cos(rad)
    spacecraft.vy = velocity * Math.sin(rad)

    spacecraft.active = True 
}

function updateSpacecraft(){

    if(!spacecraft.active) return

    spacecraft.x += spacecraft.vx
    spacecraft.y += spacecraft.vy
}

 function drawSpacecraft(ctx){

    if(!spacecraft.active) return 

    ctx.beginPath() 
    ctx.arc(spacecraft.x,spacecraft.y,4,0,Math.PI*2)
    ctx.fillStyle="white"
    ctx.fill()
 }