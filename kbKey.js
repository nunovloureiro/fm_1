class kbKey {
    constructor(p, x, y, keySize, keyboardSW, w_b, keyID) {   //   w_b -> white or black key
      this.p = p;
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
      this.p.strokeWeight(this.keySW);
      this.p.stroke(0);
      this.p.fill(0,0,this.selected);
      this.p.square(this.x, this.y,  this.keySize);
    }
    
    
    isClicked(){
      let offsetY = this.w_b === 1 ? this.keySize * 0.3 : 0; // Slightly shift detection for black keys
      return (p.mouseX > this.x - this.keySize / 2 &&
        this.p.mouseX < this.x + this.keySize / 2 &&
        this.p.mouseY > this.y - this.keySize / 2 &&
        this.p.mouseY < this.y + this.keySize / 2);
    }
  }