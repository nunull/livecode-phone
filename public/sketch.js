var socket = io();



let guiObjects = [];




function setup() {
  createCanvas(400, 800);


  tabby = new TabBar(["a","b","c","d" ]);

  guiObjects.push(tabby);

  noLoop();




}




class TabBar{

  constructor(tabNames){
    this.tabNames = tabNames;
    this.height = height/8.
    this.y = height-this.height;
  }

  render(){

    const { y } = this;


    rect(0,y,width,height);

    for(let i=0; i<this.tabNames.length; i++){

      let spacing = width/this.tabNames.length;

      line(spacing*i,y,spacing*i,height);

      text(this.tabNames[i],spacing/2+spacing*i,y+this.height/2);

      }

  }

  isClicked(x,y){
    if(y>this.y){
      console.log("hello");
    }
  }

}




function draw() {
  background(220);

  tabby.render();

}

function mousePressed(){

  for(let i=0; i<guiObjects.length;i++){
    if(guiObjects[i].isClicked){
    guiObjects[i].isClicked(mouseX,mouseY);
    }
  }

}
