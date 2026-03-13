let port;
let reader;

let brightness = 0;

let branches = [];

class Branch{

constructor(x,y,len,angle){

this.x = x;
this.y = y;
this.len = len;
this.angle = angle;

}

draw(){

stroke(80,255,140);

let x2 = this.x + cos(this.angle)*this.len;
let y2 = this.y - sin(this.angle)*this.len;

line(this.x,this.y,x2,y2);

}

}

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

createCanvas(600,600);

document
.getElementById("connect")
.onclick = connectArduino;

}

function draw(){

background(5,10,8);

drawPlant();

}

function drawPlant(){

translate(width/2,height);

let growth = map(brightness,0,255,0,300);

strokeWeight(3);

line(0,0,0,-growth);

drawLeaves(0,-growth);

if(growth>120){

drawBranch(0,-growth,PI/4);

drawBranch(0,-growth,-PI/4);

}

}

function drawBranch(x,y,angle){

let len = 80;

let x2 = x + cos(angle)*len;

let y2 = y - sin(angle)*len;

line(x,y,x2,y2);

drawLeaves(x2,y2);

}

function drawLeaves(x,y){

noStroke();

fill(120,255,150);

ellipse(x+8,y,14,8);
ellipse(x-8,y,14,8);

}
