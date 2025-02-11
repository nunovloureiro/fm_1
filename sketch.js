let mx;
let my;
let rx = 0;
let ry = 0;
let rz = 0;

let font;
let startText;
let menuText;
let TWstartText;
let TWmenuText;
let textHeight;

let go = 0;
let menu = 0;
let keyMenu = 0;
let scaleMenu = 0;
let wkPos;
let bkPos;
let keySize;
let wkeyVertOfset;
let bkeyVertOfset;
let keyVertDist;
let keyboardSW;

let teclasBrancas = [];
let teclasPretas = [];
let teclado = [];
let keyID;

let permissionGranted = false;
let requestButton = 0;


//document.addEventListener('touchstart', {});

function preload(){
  font = loadFont('tiny5.ttf');
}

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    angleMode(RADIANS);
    rectMode(CENTER);

    checkAppStart();


    textFont(font);
    textSize(window.innerWidth/5);
    textAlign(CENTER,CENTER);
    textHeight = window.innerWidth/10;
  
    //keyboard size according to display size
    scallingAndOrientation();

    initKeyboard();
    hitKey = teclasBrancas[0];
    hitKey.selected = 0; // Highlight the selected key
  
     TWstartText = textWidth('start');
     TWmenuText = textWidth('+');  
}

function draw() {

    gui();

    rx = rotationX / PI;
    ry = rotationY / PI;
    rz = rotationZ / PI;
    rotationValueLimiter();

    

    fill(255, 0, 0);
    rect(window.innerWidth / 4, window.innerHeight / 2, 5, 0 + rx * 100);

    // fill(0, 255, 0);
    // rect(window.innerWidth / 2, window.innerHeight / 2, 5, 0 + ry * 100);

    fill(0, 0, 255);
    rect(window.innerWidth - window.innerWidth / 4, window.innerHeight / 2, 5, 0 + rz * 100);

    mx = map(mouseX, 0, window.innerWidth, 0, 1);
    my = map(mouseY, 0, window.innerWidth, 0, 6);

    fill(0,0,255);
    textAlign(LEFT);
    textSize(20);
    text('cell.osc ++', 20, 40);
    text('rx= ' + rx, 20, 80);
    text('ry= ' + ry, 20, 100);
    text('rz= ' + rz, 20, 120);
    text('mx= ' + mx, 20, 140);
    text('my= ' + my, 20, 160);
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
    rz = max(rz, 0);
}

function scallingAndOrientation(){
    if (window.innerWidth <= window.innerHeight){
        keySize = window.innerHeight/20;
        keyboardSW = keySize/6;
        wkeyVertOfset = window.innerHeight/8;
        bkeyVertOfset = window.innerHeight/6;
        keyVertDist = 1.4 * keySize;
        wkPos = window.innerWidth/2 - keySize/1.5;
        bkPos = window.innerWidth/2 + keySize/1.5;
      } else {
        keySize = window.innerHeight/16;
        keyboardSW = keySize/6;
        wkeyVertOfset = window.innerHeight/8;
        bkeyVertOfset = window.innerHeight/6;
        keyVertDist = 1.4 * keySize;
        wkPos = window.innerWidth/2 - keySize/1.5;
        bkPos = window.innerWidth/2 + keySize/1.5;
      }
}

//different menu stages. defines text+position
function gui(){
  
    //startup screen
    if (go == 0 && menu == 0 && keyMenu == 0){
      background(0);
      fill(0,0,255);
      rectMode(CENTER);
      rect(window.innerWidth/2, window.innerHeight/2, TWstartText + window.innerWidth/70, window.innerWidth/5);
      fill(0);
      textAlign(CENTER,CENTER);
      textSize(window.innerWidth/5);
      text('start', window.innerWidth/2, window.innerHeight/2)
      
    } 
    // play screen
    if (go == 1 && menu == 0 && keyMenu == 0){
        background(0);
        fill(0,0,255);
        rectMode(CENTER);
        rect(window.innerWidth/2, window.innerHeight/2, window.innerWidth/5, window.innerWidth/5);
        fill(0);
        textAlign(CENTER,CENTER);
        textSize(window.innerWidth/5);
        text('+', window.innerWidth/2, window.innerHeight/2);

        sendMsgToWebPd("n_0_9", "0", [rx]); ///////RX parece ser o ID 17
        sendMsgToWebPd("n_0_10", "0", [rz]); ///////RZ parece ser o ID 18

    }
    
    //menu screen
    if (go == 1 && menu == 1 && keyMenu == 0){
      background(0,0,255);
      fill(0);
      textSize(window.innerWidth/5);
      textAlign(CENTER, CENTER);
      text('key', window.innerWidth/2, window.innerHeight/2 - window.innerHeight/8 - textHeight);
      text('scale', window.innerWidth/2, window.innerHeight/2);
      textSize(window.innerWidth/5);
      text('x', window.innerWidth/2, window.innerHeight/2 + window.innerHeight/8 + textHeight);
    }
    
    //key menu
    if (go == 1 && menu == 0 && keyMenu == 1){
      background(0,0,255);
      showKeyboard();
      
      noStroke();
      fill(0);
      textSize(window.innerWidth/5);
      textAlign(CENTER, CENTER);
      text('x', window.innerWidth/2, window.innerHeight - window.innerHeight/10);
    }
    
  }
  
function mousePressed(){

      //play screen
    if (go == 0 && mouseX > window.innerWidth/2 - TWstartText/2 && mouseX < window.innerWidth/2 + TWstartText/2 && mouseY > window.innerHeight/2 - textHeight && mouseY < window.innerHeight/2 + textHeight){
        go = 1

        if (requestButton == 0){
          if (typeof(DeviceOrientationEvent) != 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function'){
            //iOS device
            DeviceOrientationEvent.requestPermission()
              .catch(() => {
                //show permission dialogue on the first time
                requestSensorPermissions();
              })
              .then(() => {
                //subsequent visits. permission already granted
                // permissionGranted = true;
              })
          }
          requestButton = 1;
        }
       }

      startApp(); //starts webPD audio app
      return;
      }
    
    //menu enter
      if (go == 1 && menu == 0 && keyMenu == 0 && mouseX > window.innerWidth/2 - window.innerWidth/10 && mouseX < window.innerWidth/2 + window.innerWidth/10 && mouseY > window.innerHeight/2 - textHeight && mouseY < window.innerHeight/2 + textHeight ){
        menu = 1;
        return;
      }
    
    //keyMenu enter
     if (go == 1 && menu == 1 && keyMenu == 0 && mouseX > window.innerWidth/2 - window.innerWidth/10 && mouseX < window.innerWidth/2 + window.innerWidth/10 && mouseY > window.innerHeight/2 - window.innerHeight/8 - textHeight && mouseY < window.innerHeight/2 - window.innerHeight/8 + textHeight){
        menu = 0;
        keyMenu = 1;
        return;
     }

    //menu exit to play screen
    if (go == 1 && menu == 1 && keyMenu == 0 && mouseX > window.innerWidth/2 - window.innerWidth/8 && mouseX < window.innerWidth/2 + window.innerWidth/8 && mouseY > window.innerHeight/2 + window.innerHeight/8 + textHeight/2 && mouseY < window.innerHeight/2 + window.innerHeight/8 + 2*textHeight){
        menu = 0;
        go = 1;
        keyMenu = 0;
     }

    //keyMenu Changes
    if (keyMenu == 1 && menu == 0){
        let newHitKey = null;
        // Check white keys
        for (let i = 0; i < teclasBrancas.length; i++) {
          if (teclasBrancas[i].isClicked()) {
            newHitKey = teclasBrancas[i];
            break;
          }
        }
        // Check black keys only if no white key was hit.
        if (!newHitKey) {
          for (let i = 0; i < teclasPretas.length; i++) {
            if(i == 2){
              continue;
            } else{
            if (teclasPretas[i].isClicked()) {
              newHitKey = teclasPretas[i];
              break;
              }
            }
          }
        }
      
      // Only update selection if a key was actually clicked.
      if (newHitKey) {
        // Unselect all keys.
        for (let i = 0; i < teclasBrancas.length; i++) {
          teclasBrancas[i].selected = 255;
        }
        for (let i = 0; i < teclasPretas.length; i++) {
            if(i == 2){
                continue;
            } else {
                teclasPretas[i].selected = 255;
              }
            }
        // Set new selected key
        hitKey = newHitKey;
        hitKey.selected = 0;
        console.log('Key pressed:', hitKey.w_b, hitKey.keyID);
        }
      
      
      //exit to play screen
      if(mouseX > window.innerWidth/2 - window.innerWidth/10 && mouseX < window.innerWidth/2 + window.innerWidth/10 && mouseY > window.innerHeight - 2 * window.innerHeight/10 && mouseY < window.innerHeight + 2 * window.innerHeight/10) {
        keyMenu = 0;
        menu = 0;
        go = 1;
      }
   }
  }

function initKeyboard(){
    for (let i = 0; i < 7; i++){
        teclasBrancas[i] = new kbKey(wkPos, wkeyVertOfset + i * keyVertDist, keySize, keyboardSW, 0, i);
      }
    for (let i = 0; i < 6; i++){
       if (i == 2){
       } else {
          teclasPretas[i] = new kbKey(bkPos, bkeyVertOfset + i * keyVertDist, keySize, keyboardSW, 1, i);
        }
      }
  }
  
  function showKeyboard() {
    background(0,0,255);
    rectMode(CENTER);
    strokeWeight(keyboardSW);
    stroke(0);
    fill(0,0,255);
    
    
    for (let i = 0; i < 7; i++){
        teclasBrancas[i].show();
    }
    
    for (let i = 0; i < 6; i++){
     if (i == 2){
      } else {
        teclasPretas[i].show();
       }
    }
  }

  function touchStarted() {
    mousePressed(); // Calls the same logic for touch
  }


  function requestSensorPermissions() {
    // Set up default promises that resolve to "granted" for browsers that don't need permission.
    let motionPromise = Promise.resolve('granted');
    let orientationPromise = Promise.resolve('granted');
  
    // Check and request permission for Device Motion (if needed)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      motionPromise = DeviceMotionEvent.requestPermission();
    }
  
    // Check and request permission for Device Orientation (if needed)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      orientationPromise = DeviceOrientationEvent.requestPermission();
    }
  
    // Request both permissions concurrently
    Promise.all([motionPromise, orientationPromise])
      .then(([motionPermission, orientationPermission]) => {
        if (motionPermission === 'granted' && orientationPermission === 'granted') {
          console.log("Both sensor permissions granted.");
  
          // Add event listeners for motion and orientation data.
          window.addEventListener('devicemotion', (event) => {
            console.log('Motion Data:', event);
            // You can use event.acceleration, event.rotationRate, etc.
          });
  
          window.addEventListener('deviceorientation', (event) => {
            console.log('Orientation Data:', event);
            // Use event.alpha, event.beta, and event.gamma as needed.
          });
        } else {
          console.error("Permission for one or both sensors was not granted.");
        }
      })
      .catch(error => {
        console.error("Error requesting sensor permissions:", error);
      });
  }