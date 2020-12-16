const socket = io();

const globalMargin = 20;
const cornerRadius = 3;
const black = '#000000';
const darkGrey = '#121212';
const lightGrey = '#484848';
const white = '#FFFFFF';

let monospaceFont;

const guiObjects = [];

function preload() {
  monospaceFont = loadFont('FiraCode-Regular.ttf');
}

function setup() {
  createCanvas(400, 800);
  noLoop();

  guiObjects.push(new TabBar([{ name: 'A', active: true }, { name: 'B' }, { name: 'C' }, { name: 'G' }]));
  guiObjects.push(new PatternView(6, [5, 1, 3, 2]));
  guiObjects.push(new TransformationView(140, "pitch +2"));
  guiObjects.push(new TransformationView(240, "set pattern"));
}

class TabBar {
  constructor(tabs) {
    this.innerMargin = 13;
    this.fontSize = 28;
    this.height = this.fontSize + this.innerMargin*2;
    this.y = height-this.height;

    this.tabs = tabs;
  }

  render() {
    const { y, innerMargin, tabs } = this;

    // draw top line
    strokeWeight(1);
    stroke(white);
    line(0, y, width, y);

    // tab names
    const spacing = width/tabs.length;
    for(let i=0; i<tabs.length; i++) {
      if (tabs[i].active) {
        const circleDiameter = spacing/2-innerMargin/2;
        ellipseMode(CORNER);
        fill(white);
        circle(spacing*i+innerMargin/2+circleDiameter/2, y+innerMargin/2, circleDiameter);
      }

      textAlign(CENTER, TOP);
      textFont(monospaceFont);
      textSize(this.fontSize);
      noStroke();
      fill(tabs[i].active ? black : white);
      text(tabs[i].name, spacing/2+spacing*i, y+innerMargin);
    }
  }

  isClicked(x, y){
    return isPointInRect(0, this.y, width, this.height, x, y);
  }
}

class PatternView {
  constructor(scaleLength, pattern) {
    this.x = globalMargin;
    this.y = globalMargin;
    this.height = 140;
    this.width = width - globalMargin*2;
    this.innerMargin = 13;

    this.scaleLength = scaleLength;
    this.pattern = pattern;
  }

  render() {
    const { x, y, innerMargin, scaleLength, pattern } = this;

    const innerHeight = this.height-globalMargin-innerMargin;
    const spacing = (this.width+innerMargin)/pattern.length;
    const stepWidth = spacing-innerMargin;
    for(let i=0; i<pattern.length; i++) {
      // step column
      noStroke();
      fill(darkGrey);
      rect(x+spacing*i, y, stepWidth, innerHeight, cornerRadius);

      // step value
      const stepHeight = innerHeight/scaleLength;
      const stepY = y + stepHeight * pattern[i];
      noStroke();
      fill(lightGrey);
      rect(x+spacing*i, stepY, stepWidth, stepHeight, cornerRadius);
    }
  }

  isClicked(x, y) {
    return isPointInRect(this.x, this.y, this.width, this.height, x, y);
  }
}

class TransformationView {
  constructor(y, transformation) {
    this.x = globalMargin;
    this.y = y;
    this.width = width - globalMargin*2;
    this.fontSize = 31;
    this.innerMargin = 13;
    this.arrowLength = 20;
    this.height = this.fontSize + this.innerMargin*2 + this.arrowLength + this.innerMargin;

    this.transformation = transformation;
  }

  render() {
    const { x, y, arrowLength, innerMargin } = this

    const middleX = x+this.width/2;

    // draw arrow
    stroke(lightGrey);
    strokeWeight(5);
    line(middleX, y, x+this.width/2, y+arrowLength);

    fill(lightGrey);
    triangle(middleX, y+arrowLength, middleX-7, y+arrowLength/2, middleX+7, y+arrowLength/2);

    // draw background rectangle
    noStroke();
    fill(darkGrey);
    rect(x, y+arrowLength+innerMargin, this.width, this.fontSize + innerMargin*2, cornerRadius);

    // text
    textAlign(LEFT, TOP);
    textFont(monospaceFont);
    textSize(this.fontSize);
    noStroke();
    fill(white);
    text(this.transformation, x+innerMargin, y+arrowLength+innerMargin*2);
  }

  isClicked(x, y) {
    return isPointInRect(this.x, this.y, this.width, this.height, x, y);
  }
}

function draw() {
  background(black);

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
