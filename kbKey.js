class kbKey {
    constructor(x, y, keySize, keyboardSW, w_b, keyID) {   //   w_b -> white or black key
      this.x = x;
      this.y = y;
      this.keySize = keySize;
      this.keySW = keyboardSW;
      this.keyID = keyID;
      this.w_b = w_b;
      //this.selected = keySelector;
      this.selected = 255;
      
    }
    
    show() {  
      strokeWeight(this.keySW);
      stroke(0);
      fill(0,0,this.selected);
      square(this.x, this.y,  this.keySize);
    }
    
    
    isClicked(){
      let offsetY = this.w_b === 1 ? this.keySize * 0.3 : 0; // Slightly shift detection for black keys
      return (mouseX > this.x - this.keySize / 2 &&
              mouseX < this.x + this.keySize / 2 &&
              mouseY > this.y - this.keySize / 2 &&
              mouseY < this.y + this.keySize / 2);
    }
  }