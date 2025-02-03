let bg = 0;

let i_rx = 0;
let rx = 0;
let ry = 0;
let rz = 0;

function setup() {
    createMetaTag();
    motionRequest();
    createCanvas(window.innerWidth, window.innerHeight);
    angleMode(RADIANS);
    rectMode(CENTER);
    
}

function draw() {

    i_rx = map(rotationX, 0, HALF_PI, 0, 1, false);
    rx = parseFloat(i_rx).toPrecision(2);
    
    i_ry = map(rotationY, 0, HALF_PI, 0, 1, false);
    ry = parseFloat(i_ry).toPrecision(2);
    
    i_rz = map(rotationZ, 0, HALF_PI, 0, 1, true);
    rz = parseFloat(i_rz).toPrecision(2);
  
    rotationValueLimiter();
  
    background(0);
    noStroke();
    
    fill(255, 0, 0);
    rect(window.innerWidth / 4, window.innerHeight / 2, 5, 0 + rx * 100);
  
    fill(0,255,0);
    //rect(window.innerWidth/2, window.innerHeight/2, 5, 0 + ry*100);
  
    fill(0,0,255);
    //rect(window.innerWidth-window.innerWidth/4, window.innerHeight/2, 5, 0 + rz*100);
    
    textAlign(LEFT);
    text('rx: ' + rx, 20, 40);
    text('ry: ' + ry, 20, 60);
    text('rz: ' + rz, 20, 80); 

    
    if (getAudioContext().state !== 'running') {
        textAlign(CENTER);
        fill(255, 255, 0);
        text('click to start audio', width / 2, height / 2);
    }

        // Dispatch the event with the latest values of rx, ry, rz
        const motionDataEvent = new CustomEvent('motionData', {
            detail: {
                rx: rx,
                ry: ry,
                rz: rz
            }
        });
        window.dispatchEvent(motionDataEvent);
}




function rotationValueLimiter() {
    rx = max(rx, 0);
    ry = max(ry, 0);
    rz = max(rz, 0);
}

function createMetaTag() {
    let meta = createElement('meta');
    meta.attribute('name', 'viewport');
    meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');

    let head = select('head');
    meta.parent(head);
}

function motionRequest() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    console.log("Device motion access granted");
                }
            })
            .catch(console.error);
    }
}

