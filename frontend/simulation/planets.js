const planets = [

{
name:"Earth",
orbitRadius:200,
angle:0,
speed:0.01,
radius:8,
color:"blue"
},

{
name:"Mars",
orbitRadius:300,
angle:0,
speed:0.008,
radius:7,
color:"red"
}

];

function updatePlanets(){
    planets.forEach(planet=>{
        planet.angle += planet.speed;
    });
}

function drawPlanets(ctx, centerX, centerY){

    planets.forEach(planet=>{

        const x = centerX + planet.orbitRadius * Math.cos(planet.angle);
        const y = centerY + planet.orbitRadius * Math.sin(planet.angle);

        ctx.beginPath();
        ctx.arc(x,y,planet.radius,0,Math.PI*2);
        ctx.fillStyle = planet.color;
        ctx.fill();

    });

}