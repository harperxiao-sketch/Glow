let brightness = 0;

let port;
let reader;

let fireflies = [];

let wind = 0;

let flowers = [];

async function connectArduino(){

port = await navigator.serial.requestPort();

await port.open({ baudRate:9600 });

const decoder = new TextDecoderStream();

port.readable.pipeTo(decoder.writable);

reader = decoder.readable.getReader();

readSerial();

}

async function readSerial(){

while(true){

const { value, done } = await reader.read();

if(done) break;

let val = parseInt(value);

if(!isNaN(val)){

brightness = val;

}

}

}

function setup(){

createCanvas(800,700);

document
.getElementById("connect")
.onclick = connectArduino;

}

function draw(){

drawEnvironment();

wind = sin(frameCount * 0.02) * 0.3;

translate(width/2,height);

let growth = map(brightness,0,255,60,350);

drawBranch(0,0,growth,-PI/2,7);

drawFireflies();

}

function drawEnvironment(){

let night = map(brightness,0,255,10,50);

for(let y=0;y<height;y++){

let inter = map(y,0,height,0,1);

let c = lerpColor(color(10,night,20),color(0,0,0),inter);

stroke(c);

line(0,y,width,y);

}

}

function drawBranch(x,y,len,angle,depth){

if(depth==0) return;

stroke(80,255,140);

strokeWeight(depth);

let sway = wind * depth;

let x2 = x + cos(angle+sway)*len;

let y2 = y + sin(angle+sway)*len;

line(x,y,x2,y2);

if(depth<4){

spawnFirefly(x2,y2);

spawnFlower(x2,y2);

}

drawBranch(x2,y2,len*0.7,angle+PI/5,depth-1);

drawBranch(x2,y2,len*0.7,angle-PI/5,depth-1);

}

function spawnFirefly(x,y){

if(random()<0.02){

fireflies.push({

x:x,
y:y,
vx:random(-0.5,0.5),
vy:random(-1,-0.2),
life:255

});

}

}

function drawFireflies(){

noStroke();

for(let i=fireflies.length-1;i>=0;i--){

let f = fireflies[i];

fill(150,255,200,f.life);

ellipse(f.x,f.y,5);

f.x += f.vx;

f.y += f.vy;

f.life -= 3;

if(f.life<=0){

fireflies.splice(i,1);

}

}

}

function spawnFlower(x,y){

if(random()<0.005){

flowers.push({

x:x,
y:y,
size:random(5,10)

});

}

}

function drawFlowers(){

for(let f of flowers){

fill(255,120,200);

ellipse(f.x,f.y,f.size);

}

}
