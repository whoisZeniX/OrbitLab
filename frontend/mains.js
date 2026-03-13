const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawBackground(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSun(){
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.fill();
}

function simulationLoop(){

    drawBackground();
    drawSun();

    if(typeof updatePlanets === "function"){
        updatePlanets();
        drawPlanets(ctx, centerX, centerY);
    }

    requestAnimationFrame(simulationLoop);
}

simulationLoop();