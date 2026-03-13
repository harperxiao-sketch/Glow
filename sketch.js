let port;
let reader;

let brightness = 0;

let plantHeight = 0;
let targetGrowth = 0;

let stem = [];

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

targetGrowth = map(brightness,0,255,0,350);

}

}

}

function setup(){

createCanvas(700,700);

document
.getElementById("connect")
.onclick = connectArduino;

}

function draw(){

background(0);

translate(width/2,height);

drawGround();

growPlant();

drawPlant();

}

function drawGround(){

stroke(50);
line(-width,0,width,0);

}

function growPlant(){

if(plantHeight < targetGrowth){

plantHeight += 0.4;

if(frameCount % 8 === 0){

let xOffset = random(-5,5);

stem.push({

x:xOffset,
y:-plantHeight

});

}

}

}

function drawPlant(){

stroke(120,255,180);
strokeWeight(3);

noFill();

beginShape();

vertex(0,0);

for(let p of stem){

curveVertex(p.x,p.y);

}

endShape();

drawLeaves();

}

function drawLeaves(){

for(let i=10;i<stem.length;i+=20){

let p = stem[i];

let glow = map(brightness,0,255,80,200);

fill(120,255,180,glow);

noStroke();

ellipse(p.x+6,p.y,10,6);
ellipse(p.x-6,p.y,10,6);

}

}
