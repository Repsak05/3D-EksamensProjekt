const FOV = 200; //Distance from cam to actual Screen
const camOffset = {x : 200, y: 200};

let box;

function setup() {
  createCanvas(400, 400);
  box = new Box(20, 1, 50, 20, 25, 20);
}

function draw() {
  background(220);
  box.draw();
}

class Box{
  constructor(xPos, yPos, zPos, width, height, depth)
  {
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.points3D = {
      //Front points clockwise from top left
      p1 : {x : this.xPos - this.width / 2, y : this.yPos - this.height / 2, z : this.zPos - this.depth / 2},
      p2 : {x : this.xPos + this.width / 2, y : this.yPos - this.height / 2, z : this.zPos - this.depth / 2},
      p3 : {x : this.xPos + this.width / 2, y : this.yPos + this.height / 2, z : this.zPos - this.depth / 2},
      p4 : {x : this.xPos - this.width / 2, y : this.yPos + this.height / 2, z : this.zPos - this.depth / 2},

      //Back points clockwise from top left
      p5 : {x : this.xPos - this.width / 2, y : this.yPos - this.height / 2, z : this.zPos + this.depth / 2},
      p6 : {x : this.xPos + this.width / 2, y : this.yPos - this.height / 2, z : this.zPos + this.depth / 2},
      p7 : {x : this.xPos + this.width / 2, y : this.yPos + this.height / 2, z : this.zPos + this.depth / 2},
      p8 : {x : this.xPos - this.width / 2, y : this.yPos + this.height / 2, z : this.zPos + this.depth / 2},
    };
  }

  draw()
  {
    this.points2D = {
      p1 : dotPlacementCalculator(this.points3D.p1.x, this.points3D.p1.y, this.points3D.p1.z),
      p2 : dotPlacementCalculator(this.points3D.p2.x, this.points3D.p2.y, this.points3D.p2.z),
      p3 : dotPlacementCalculator(this.points3D.p3.x, this.points3D.p3.y, this.points3D.p3.z),
      p4 : dotPlacementCalculator(this.points3D.p4.x, this.points3D.p4.y, this.points3D.p4.z),
      p5 : dotPlacementCalculator(this.points3D.p5.x, this.points3D.p5.y, this.points3D.p5.z),
      p6 : dotPlacementCalculator(this.points3D.p6.x, this.points3D.p6.y, this.points3D.p6.z),
      p7 : dotPlacementCalculator(this.points3D.p7.x, this.points3D.p7.y, this.points3D.p7.z),
      p8 : dotPlacementCalculator(this.points3D.p8.x, this.points3D.p8.y, this.points3D.p8.z),

    };

    drawRectFromPoints(this.points2D.p1, this.points2D.p2, this.points2D.p3, this.points2D.p4); //Front
    drawRectFromPoints(this.points2D.p5, this.points2D.p6, this.points2D.p7, this.points2D.p8); //Back
    drawRectFromPoints(this.points2D.p2, this.points2D.p6, this.points2D.p7, this.points2D.p3); //Right
    drawRectFromPoints(this.points2D.p1, this.points2D.p5, this.points2D.p8, this.points2D.p4); //Left
    drawRectFromPoints(this.points2D.p1, this.points2D.p5, this.points2D.p6, this.points2D.p2); //Top
    drawRectFromPoints(this.points2D.p4, this.points2D.p8, this.points2D.p7, this.points2D.p3); //Bottom
  }
}

function drawRectFromPoints(p1,p2,p3,p4)
{
  line(p1.x, p1.y, p2.x, p2.y);
  line(p2.x, p2.y, p3.x, p3.y);
  line(p3.x, p3.y, p4.x, p4.y);
  line(p4.x, p4.y, p1.x, p1.y);
}


function dotPlacementCalculator(x,y,z)
{
  let x2D = (x*FOV) / z + camOffset.x;
  let y2D = (y*FOV) / z + camOffset.y;

  return {x : x2D, y : y2D};
}