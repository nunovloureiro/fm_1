let mx;
let go = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    checkAppStart();
}

function draw() {
    background(255);
    mx = map(mouseX, 0, window.innerWidth, 0, 1);
    fill(0,0,255);
    textSize(30);
    text('mx= ' + mx, 60, 80);

    if (go == 1){
        console.log("Sending value:", mx);
        sendMsgToWebPd("n_0_8", "0", [mx]);
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