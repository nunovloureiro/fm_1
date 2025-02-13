// This fixed it, preferably this would be hidden away though
document.addEventListener('touchstart', {});

// document.addEventListener('touchstart', handleTouchStart);

// handleTouchStart = function(event) {
//   // Your code here to handle the touch start event
//   console.log('Touch started!', event);
// }

let mySketch = function(p) {

let p.kbKey = kbKey;

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

let go = 1;
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

let permissionGranted = 0;
let requestButton = 0;
let androidStop = 0;

let iOSpermissions = 0;

let tstartX;
let tendX;

let tstartY;
let tendY;



// let initTouch = 0;

// let iosSensorPermissionRequested = false;




p.preload = function(){
  font = p.loadFont('tiny5.ttf');
}

p.setup = function() {

    console.log("sketch enter setup");
    p.createCanvas(p.windowWidth,p.windowHeight);
    p.frameRate(15);
    p.angleMode(p.RADIANS);
    p.rectMode(p.CENTER);

    //p.background(0);

    p.textFont(font);
    p.textSize(p.windowWidth/5);
    p.textAlign(p.CENTER,p.CENTER);
    textHeight = p.windowWidth/10;

  
    //keyboard size according to display size
    p.scallingAndOrientation();

    p.initKeyboard();
    hitKey = teclasBrancas[0];
    hitKey.selected = 0; // Highlight the selected key
  
     TWstartText = p.textWidth('start');
     TWmenuText = p.textWidth('+');  
}

p.draw = function() {

    p.gui();

    rx = p.rotationX / p.PI;
    ry = p.rotationY / p.PI;
    rz = p.rotationZ / p.PI;
    p.rotationValueLimiter();

    p.fill(255, 0, 0);
    p.rect(p.windowWidth / 4, p.windowHeight / 2, 5, 0 + rx * 100);

    // fill(0, 255, 0);
    // rect(window.innerWidth / 2, window.innerHeight / 2, 5, 0 + ry * 100);

    p.fill(0, 0, 255);
    p.rect(p.windowWidth - p.windowWidth / 4, p.windowHeight / 2, 5, 0 + rz * 100);

    mx = p.map(p.mouseX, 0, p.windowWidth, 0, 1);
    my = p.map(p.mouseY, 0, p.windowWidth, 0, 6);

    p.fill(0,0,255);
    p.textAlign(p.LEFT);
    p.textSize(20);
    p.text('cell.osc ++', 20, 40);
    p.text('rx= ' + rx, 20, 80);
    p.text('ry= ' + ry, 20, 100);
    p.text('rz= ' + rz, 20, 120);
    p.text('mx= ' + mx, 20, 140);
    p.text('my= ' + my, 20, 160);
}

// function checkAppStart() {
//   console.log("enter checkAppStart function");
//     if (window.appStarted) {
//         console.log("App started, initializing sketch.js features.");
//         go = 1;
//         console.log("go", go);
//         } else {
//         console.log("checkAppStart nopeeeee")
//         setTimeout(checkAppStart, 100); // Check again in 100ms
//     }
// }

p.rotationValueLimiter = function() {
    rx = p.max(rx, 0);
    ry = p.max(ry, 0);
    rz = p.max(rz, 0);
}

p.scallingAndOrientation = function(){
    if (p.windowWidth <= p.windowHeight){
        keySize = p.windowHeight/20;
        keyboardSW = keySize/6;
        wkeyVertOfset = p.windowHeight/8;
        bkeyVertOfset = p.windowHeight/6;
        keyVertDist = 1.4 * keySize;
        wkPos = p.windowWidth/2 - keySize/1.5;
        bkPos = p.windowWidth/2 + keySize/1.5;
      } else {
        keySize = p.windowHeight/16;
        keyboardSW = keySize/6;
        wkeyVertOfset = p.windowHeight/8;
        bkeyVertOfset = p.windowHeight/6;
        keyVertDist = 1.4 * keySize;
        wkPos = p.windowWidth/2 - keySize/1.5;
        bkPos = p.windowWidth/2 + keySize/1.5;
      }
}

//different menu stages. defines text+position
p.gui = function(){
  
    //startup screen
    if (go == 0 && menu == 0 && keyMenu == 0){
      p.background(0);
      p.fill(0,0,255);
      p.rectMode(p.CENTER);
      p.rect(p.windowWidth/2, p.windowHeight/2, TWstartText + p.windowWidth/70, p.windowWidth/5);
      p.fill(0);
      p.textAlign(p.CENTER,p.CENTER);
      p.textSize(p.windowWidth/5);
      p.text('start', p.windowWidth/2, p.windowHeight/2)
      
    } 
    // play screen
    if (go == 1 && menu == 0 && keyMenu == 0){
      p.background(0);
      p.fill(0,0,255);
      p.rectMode(p.CENTER);
      p.rect(p.windowWidth/2, p.windowHeight/2, p.windowWidth/5, p.windowWidth/5);
      p.fill(0);
      p.textAlign(p.CENTER,p.CENTER);
      p.textSize(p.windowWidth/5);
      p.text('+', p.windowWidth/2, p.windowHeight/2);

        //console.log(webpdNode);
        //console.log(webpdNode.engine);

        // if (webpdNode){
        sendMsgToWebPd("n_0_9", "0", [rx]); 
        sendMsgToWebPd("n_0_10", "0", [rz]);
    // }
    }
    
    //menu screen
    if (go == 1 && menu == 1 && keyMenu == 0){
      p.background(0,0,255);
      p.fill(0);
      p.textSize(p.windowWidth/5);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('key', p.windowWidth/2, p.windowHeight/2 - p.windowHeight/8 - textHeight);
      p.text('scale', p.windowWidth/2, p.windowHeight/2);
      p.textSize(p.windowWidth/5);
      p.text('x', p.windowWidth/2, p.windowHeight/2 + p.windowHeight/8 + textHeight);
    }
    
    //key menu
    if (go == 1 && menu == 0 && keyMenu == 1){
      p.background(0,0,255);
      p.showKeyboard();
      
      p.noStroke();
      p.fill(0);
      p.textSize(p.windowWidth/5);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('x', p.windowWidth/2, p.windowHeight - p.windowHeight/10);
    }
    
  }
  
p.mousePressed = function (){

    console.log('mX', p.mouseX, 'mY', p.mouseY);

    //play screen  && requestButton == 1
      // if (go == 0 && mouseX > window.innerWidth/2 - TWstartText/2 && mouseX < window.innerWidth/2 + TWstartText/2 && mouseY > window.innerHeight/2 - textHeight && mouseY < window.innerHeight/2 + textHeight){
      //   if (iOSpermissions === 0){
      //     startApp(); //starts webPD audio app
      //     checkAppStart();
      //     console.log('WebPD started supostamente');
      //     return;
      //   } else if (iOSpermissions === 1){
      //       requestMotionSensorPermission();
      //       if (permissionGranted === 1){
      //         startApp(); //starts webPD audio app
      //         checkAppStart();
      //         console.log('WebPD started supostamente');
      //         return;
      //       } else {
      //         fill(255,0,0);
      //       }
      //   }
      // }
    
    //menu enter
      if (go == 1 && menu == 0 && keyMenu == 0 && p.mouseX > p.windowWidth/2 - p.windowWidth/10 && p.mouseX < p.windowWidth/2 + p.windowWidth/10 && p.mouseY > p.windowHeight/2 - textHeight && p.mouseY < p.windowHeight/2 + textHeight){
        menu = 1;
        return;
      }
    
    //keyMenu enter
     if (go == 1 && menu == 1 && keyMenu == 0 && p.mouseX > p.windowWidth/2 - p.windowWidth/10 && p.mouseX < p.windowWidth/2 + p.windowWidth/10 && p.mouseY > p.windowHeight/2 - p.windowHeight/8 - textHeight && p.mouseY < p.windowHeight/2 - p.windowHeight/8 + textHeight){
        menu = 0;
        keyMenu = 1;
        return;
     }

    //menu exit to play screen
    if (go == 1 && menu == 1 && keyMenu == 0 && p.mouseX > p.windowWidth/2 - p.windowWidth/8 && p.mouseX < p.windowWidth/2 + p.windowWidth/8 && p.mouseY > p.windowHeight/2 + p.windowHeight/8 + textHeight/2 && p.mouseY < p.windowHeight/2 + p.windowHeight/8 + 2*textHeight){
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
      if(p.mouseX > p.windowWidth/2 - p.windowWidth/10 && p.mouseX < p.windowWidth/2 + p.windowWidth/10 && p.mouseY > p.windowHeight - 2 * p.windowHeight/10 && p.mouseY < p.windowHeight + 2 * p.windowHeight/10) {
        keyMenu = 0;
        menu = 0;
        go = 1;
      }
   }
  }


  p.initKeyboard = function(){
    for (let i = 0; i < 7; i++){
        teclasBrancas[i] = new p.kbKey(p, wkPos, wkeyVertOfset + i * keyVertDist, keySize, keyboardSW, 0, i);
      }
    for (let i = 0; i < 6; i++){
       if (i == 2){
       } else {
          teclasPretas[i] = new p.kbKey(p, bkPos, bkeyVertOfset + i * keyVertDist, keySize, keyboardSW, 1, i);
        }
      }
  }
  
p.showKeyboard = function() {
  p.background(0,0,255);
  p.rectMode(p.CENTER);
  p.strokeWeight(keyboardSW);
  p.stroke(0);
  p.fill(0,0,255);
    
    
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


//function touch.Started() {

    // if (inittouch. == 0){
    //    startApp();
    //    inittouch. = 1;
    // }
  //On the very first touch., request iOS motion sensor permission
  // if (!iosSensorPermissionRequested) {
  //   iosSensorPermissionRequested = true;
    // requestMotionSensorPermission();
  //}

  // Continue with your normal touch. behavior
  //touch.Pressed();
//}


  // function isiOSdevice(){
  //   // Check if the device is running iOS
  //   const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  //   if (!isiOS) {
  //     console.log("Not an iOS device. No sensor permission needed.");
  //     iOSpermissions = 0;
  //     return;
  //   }
  //   else {
  //     console.log("iOS device. Sensor permission needed.");
  //     iOSpermissions = 1;
  //   }
  // }


  // function requestMotionSensorPermission() {
    
  //   // For iOS 13+ where permission is required
  //   if (typeof DeviceMotionEvent !== "undefined" &&
  //       typeof DeviceMotionEvent.requestPermission === "function") {
  //     DeviceMotionEvent.requestPermission()
  //       .then(response => {
  //         if (response === "granted") {
  //           console.log("Motion sensor permission granted!");
            
  //           // Attach a listener if you want to process sensor data
  //           window.addEventListener("devicemotion", (event) => {
  //             // Process sensor data here if needed
  //             console.log("Acceleration:", event.acceleration);
  //             console.log("Acceleration including gravity:", event.accelerationIncludingGravity);
  //             console.log("Rotation rate:", event.rotationRate);
  //             permissionGranted = 1;
  //           });
  //         } else {
  //           console.error("Motion sensor permission denied.");
  //           permissionGranted = 0;
  //         }
  //       })
  //       .catch(error => {
  //         console.error("Error requesting motion sensor permission:", error);
  //         permissionGranted = 0;
  //       });
  //   } else {
  //     // Fallback for devices or browsers that don't require a permission prompt
  //     console.log("DeviceMotionEvent.requestPermission is not available.");
  //     window.addEventListener("devicemotion", (event) => {
  //       console.log("Motion event:", event);
  //     });
  //   }
  // }


  p.kbKey = class {
    constructor(p, x, y, keySize, keyboardSW, w_b, keyID) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.keySize = keySize;
      this.keySW = keyboardSW;
      this.keyID = keyID;
      this.w_b = w_b;
      this.selected = 255;
    }

    show() {  
      this.p.strokeWeight(this.keySW);
      this.p.stroke(0);
      this.p.fill(0, 0, this.selected);
      this.p.square(this.x, this.y, this.keySize);
    }

    isClicked() {
      return (
        this.p.mouseX > this.x - this.keySize / 2 &&
        this.p.mouseX < this.x + this.keySize / 2 &&
        this.p.mouseY > this.y - this.keySize / 2 &&
        this.p.mouseY < this.y + this.keySize / 2
      );
    }
  };

}  

  new p5(mySketch);