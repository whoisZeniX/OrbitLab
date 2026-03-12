const canvas = document.getElementById("spaceCanvas")
const ctx = canvas.getContext("2d");

function drawBackground(){

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.clientWidth,canvas.height);    
}

function drawSun(){

const sunX = canvas.width/2;
const sunY = canvas.height/2;

ctx.beginPath();
ctx.arc(sunX,sunY,25,0,Math.PI*2);
ctx.fillStyle = "yellow";
ctx.fill();

}

function renderScene(){

drawBackground();
drawSun();

}

renderScene();