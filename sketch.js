let mx;
let go = 0;

let i_rx = 0;
let rx = 0;

let i_ry = 0;
let ry = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    angleMode(RADIANS);
    rectMode(CENTER);

    checkAppStart();
}

function draw() {

    i_rx = map(rotationX, 0, HALF_PI, 0, 1, true);
    //rx = parseFloat(i_rx).toPrecision(2);

    i_ry = map(rotationY, 0, HALF_PI, 0, 4, true);
    //ry = parseFloat(i_ry).toPrecision(2);

    rotationValueLimiter();

    background(0);

    fill(255, 0, 0);
    rect(window.innerWidth / 4, window.innerHeight / 2, 5, 0 + rx * 100);

    //mx = map(mouseX, 0, window.innerWidth, 0, 1);
    //my = map(mouseY, 0, window.innerWidth, 0, 6);

    fill(0,0,255);
    textAlign(LEFT);
    textSize(20);
    text('220Hz sine.freq.vol ++', 20, 40);
    text('rx= ' + rx, 20, 80);
    text('yx= ' + ry, 20, 100);
    text('mx= ' + mx, 20, 120);
    text('my= ' + my, 20, 140);

    if (go == 1){
        //console.log("Sending value:", mx);
        sendMsgToWebPd("n_0_8", "0", [rx]);
        sendMsgToWebPd("n_0_9", "0", [ry]);

    }
}


function checkAppStart() {
    if (window.appStarted && go == 0) {
        console.log("App started, initializing sketch.js features.");
        go = 1;
        } else {
        setTimeout(checkAppStart, 100); // Check again in 100ms
    }
}


function rotationValueLimiter() {
    rx = max(rx, 0);
    ry = max(ry, 0);
    // rz = max(rz, 0);
}