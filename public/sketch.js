let socket = io();

let guiObjects = [];

function setup() {
  createCanvas(400, 800);
  noLoop();

  guiObjects.push(new TabBar(["a", "b", "c", "d"]));
  guiObjects.push(new PatternView(6, [5, 1, 3, 2]));
}

class TabBar {
  constructor(tabNames) {
    this.tabNames = tabNames;
    this.height = height/8;
    this.y = height-this.height;
  }

  render() {
    const { y, tabNames } = this;

    rect(0, y, width, height);

    const spacing = width/tabNames.length;
    for(let i=0; i<tabNames.length; i++){
      line(spacing*i, y, spacing*i, height);
      text(tabNames[i], spacing/2+spacing*i, y+this.height/2);
    }
  }

  isClicked(x, y){
    return isPointInRect(0, this.y, width, this.height, x, y);
  }
}

class PatternView {
  constructor(scaleLength, pattern) {
    this.scaleLength = scaleLength;
    this.pattern = pattern;
    this.height = 140;
    this.y = 0;
  }

  render() {
    const { y, scaleLength, pattern } = this;
    const spacing = width/pattern.length;
    for(let i=0; i<pattern.length; i++) {
      // step column
      rect(spacing*i, y, spacing, this.height);

      // step value
      const stepHeight = this.height/scaleLength;
      const stepY = y + stepHeight * pattern[i];
      rect(spacing*i, stepY, spacing, stepHeight);
    }
  }

  isClicked(x, y) {
    return isPointInRect(0, this.y, width, this.height, x, y);
  }
}

function draw() {
  background(220);

  for(let i=0; i<guiObjects.length; i++) {
    guiObjects[i].render();
  }
}

function mousePressed() {
  for(let i=0; i<guiObjects.length; i++) {
    const guiObject = guiObjects[i];
    if (guiObject.isClicked(mouseX, mouseY)) {
      console.log('click', guiObject);
      return;
    }
  }
}

function isPointInRect(rectX, rectY, rectWidth, rectHeight, x, y) {
  return x >= rectX && x <= rectX+rectWidth &&
    y >= rectY && y <= rectY+rectHeight;
}
