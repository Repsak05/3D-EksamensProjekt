const canvasX = 800;
const canvasY = 800

const FOV = -800; //Distance from cam to actual Screen
const camOffset = {x : 400, y: 400, z : FOV};

const rotSpeedX = 1.2;
const rotSpeedY = 2.1;
const rotSpeedZ = 3.7;

let currentAngleX = 0
let currentAngleY = 0
let currentAngleZ = 0

//Sliders to ajust box placement
let sliderXPos;
let sliderYPos;
let sliderZPos;

//Sliders box sizes
let sliderWidth;
let sliderHeight;
let sliderDepth;

//Sliders box Angels
let sliderAngleX;
let sliderAngleY;
let sliderAngleZ;

function setup()
{
  angleMode(DEGREES);
  createCanvas(canvasX, canvasY);

  //sliders; position
  sliderXPos = createSlider(-100, 100, 2);
  sliderXPos.position(10,10);

  sliderYPos = createSlider(-100, 100, 2);
  sliderYPos.position(10,30);

  sliderZPos = createSlider(10, 200, 140);
  sliderZPos.position(10,50);

  //Sliders; Sizes (width, height, depth)
  sliderWidth = createSlider(0, 100, 10);
  sliderWidth.position(140,10);

  sliderHeight = createSlider(0, 100, 20);
  sliderHeight.position(140,30);

  sliderDepth = createSlider(10, 100, 30);
  sliderDepth.position(140,50);

  //Sliders angels;
  sliderAngleX = createSlider(0,1080, 0);
  sliderAngleX.position(270,10);

  sliderAngleY = createSlider(0,1080, 0);
  sliderAngleY.position(270,30);

  sliderAngleZ = createSlider(0,1080, 0);
  sliderAngleZ.position(270,50);

}

function draw()
{
  background(220);
  
  currentAngleX += rotSpeedX;
  currentAngleY += rotSpeedY;
  currentAngleZ += rotSpeedZ;

  let box = new Box(sliderXPos.value(), sliderYPos.value(), sliderZPos.value(), sliderWidth.value(), sliderHeight.value(), sliderDepth.value());
  box.rotationX(currentAngleX);
  box.rotationY(currentAngleY);
  box.rotationZ(currentAngleZ);
  // box.rotationX(sliderAngleX.value());
  // box.rotationY(sliderAngleY.value());
  // box.rotationZ(sliderAngleZ.value());
  box.draw();
  box.showSurface();
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
      //Front points clockwise from top left
      p1 : dotPlacementCalculator(this.points3D.p1.x, this.points3D.p1.y, this.points3D.p1.z),
      p2 : dotPlacementCalculator(this.points3D.p2.x, this.points3D.p2.y, this.points3D.p2.z),
      p3 : dotPlacementCalculator(this.points3D.p3.x, this.points3D.p3.y, this.points3D.p3.z),
      p4 : dotPlacementCalculator(this.points3D.p4.x, this.points3D.p4.y, this.points3D.p4.z),
      
      //Back points clockwise from top left
      p5 : dotPlacementCalculator(this.points3D.p5.x, this.points3D.p5.y, this.points3D.p5.z),
      p6 : dotPlacementCalculator(this.points3D.p6.x, this.points3D.p6.y, this.points3D.p6.z),
      p7 : dotPlacementCalculator(this.points3D.p7.x, this.points3D.p7.y, this.points3D.p7.z),
      p8 : dotPlacementCalculator(this.points3D.p8.x, this.points3D.p8.y, this.points3D.p8.z),

    };

    //Draw box rects
    drawRectFromPoints(this.points2D.p1, this.points2D.p2, this.points2D.p3, this.points2D.p4); //Front
    drawRectFromPoints(this.points2D.p5, this.points2D.p6, this.points2D.p7, this.points2D.p8); //Back
    drawRectFromPoints(this.points2D.p2, this.points2D.p6, this.points2D.p7, this.points2D.p3); //Right
    drawRectFromPoints(this.points2D.p1, this.points2D.p5, this.points2D.p8, this.points2D.p4); //Left
    drawRectFromPoints(this.points2D.p1, this.points2D.p5, this.points2D.p6, this.points2D.p2); //Top
    drawRectFromPoints(this.points2D.p4, this.points2D.p8, this.points2D.p7, this.points2D.p3); //Bottom
    
    //Draw box center
    let centrum = dotPlacementCalculator(this.xPos, this.yPos, this.zPos);
    circle(centrum.x, centrum.y, 10);
  }

  showSurface()
  {
    //Draw all triangles and fill them with colors in correct order
    noStroke();
      
    const sideDiagonal = { // z-distance relative to camera
      font   : calculateAveragePoint(this.points3D.p1, this.points3D.p3).z - FOV,
      back   : calculateAveragePoint(this.points3D.p5, this.points3D.p7).z - FOV,
      right  : calculateAveragePoint(this.points3D.p2, this.points3D.p7).z - FOV,
      left   : calculateAveragePoint(this.points3D.p1, this.points3D.p8).z - FOV,
      top    : calculateAveragePoint(this.points3D.p5, this.points3D.p2).z - FOV,
      bottom : calculateAveragePoint(this.points3D.p8, this.points3D.p3).z - FOV,
    }

    // Sort the array based on the values in descending order
    let sortedSidesByDistance = [];

    for(let key in sideDiagonal)
    {
      sortedSidesByDistance.push([key, sideDiagonal[key]]);
    }
    sortedSidesByDistance.sort((a, b) => b[1] - a[1]);

    //Render in correct order
    for(let sideAndDist of sortedSidesByDistance)
    {
      switch(sideAndDist[0])
      {
        case "font":
          fill(0,0,255);
          drawTriangle(this.points2D.p1,this.points2D.p2,this.points2D.p3);
          drawTriangle(this.points2D.p1,this.points2D.p3,this.points2D.p4);
          break;

        case "back":
          fill(255,0,0);
          drawTriangle(this.points2D.p5,this.points2D.p6,this.points2D.p7);
          drawTriangle(this.points2D.p5,this.points2D.p7,this.points2D.p8);
          break;

        case "right":
          fill(0,255,0);
          drawTriangle(this.points2D.p2,this.points2D.p6,this.points2D.p7);
          drawTriangle(this.points2D.p2,this.points2D.p7,this.points2D.p3);
          break;

        case "left":
          fill(255,255,0);
          drawTriangle(this.points2D.p1,this.points2D.p5,this.points2D.p8);
          drawTriangle(this.points2D.p1,this.points2D.p8,this.points2D.p4);
          break;

        case "top":
          fill(0,255,255);
          drawTriangle(this.points2D.p1,this.points2D.p5,this.points2D.p2);
          drawTriangle(this.points2D.p5,this.points2D.p2,this.points2D.p6);
          break;

        case "bottom":
          fill(255,0,255);
          drawTriangle(this.points2D.p4,this.points2D.p8,this.points2D.p3);
          drawTriangle(this.points2D.p8,this.points2D.p7,this.points2D.p3);
          break;
          
        default:
          console.log("Side not found: " + sideAndDist[0]);
      }
    }
    //Reset values
    fill(0);
    stroke(0);
  }

  rotationX(angle = 5) //Rotate around x-axis
  {
    for(let points in this.points3D)
    {
      const point = this.points3D[points];

      //Find dist from object's centrum to point
      const relativePointY = point.y - this.yPos;
      const relativePointZ = point.z - this.zPos;

      //calculate current angle and new angle
      const currentAngle = atan2(relativePointY, relativePointZ);
      const newAngle = currentAngle + angle;

      //Calcualte new points
      const vecLength = sqrt(relativePointY * relativePointY + relativePointZ * relativePointZ);
      point.y = this.yPos + vecLength * sin(newAngle);
      point.z = this.zPos + vecLength * cos(newAngle);
    }
  }

  rotationY(angle = 5) //Rotate around y-axis
  {
    for(let points in this.points3D)
    {
      const point = this.points3D[points];

      //Find dist from object's centrum to point
      const relativePointX = point.x - this.xPos;
      const relativePointZ = point.z - this.zPos;

      //calculate current angle and new angle
      const currentAngle = atan2(relativePointZ, relativePointX);
      const newAngle = currentAngle + angle;

      //Calcualte new points
      const vecLength = sqrt(relativePointX * relativePointX + relativePointZ * relativePointZ);
      point.x = this.xPos + vecLength * cos(newAngle);
      point.z = this.zPos + vecLength * sin(newAngle);
    }
  }

  rotationZ(angle = 5) //Rotate around z-axis
  {
    for(let points in this.points3D)
    { 
      const point = this.points3D[points]; //point : {x : xVal, y : yVal, z : zVal}

      //Find dist from object's centrum to point
      const relativePointX = point.x - this.xPos;
      const relativePointY = point.y - this.yPos;

      //Find current angle and calc new
      const currentAngle = atan2(relativePointY, relativePointX);
      const newAngle = currentAngle + angle;
    
      //Calculate new points and un-relative points
      const vecLength = sqrt(relativePointX * relativePointX + relativePointY * relativePointY);
      point.x = this.xPos + vecLength * cos(newAngle);
      point.y = this.yPos + vecLength * sin(newAngle);
    }
  }
}

function drawRectFromPoints(p1,p2,p3,p4)
{
  //Might want to use planes instead of lines
  line(p1.x, p1.y, p2.x, p2.y);
  line(p2.x, p2.y, p3.x, p3.y);
  line(p3.x, p3.y, p4.x, p4.y);
  line(p4.x, p4.y, p1.x, p1.y);

  circle(p1.x,p1.y, 10);
  circle(p2.x,p2.y, 10);
  circle(p3.x,p3.y, 10);
  circle(p4.x,p4.y, 10);
}

function dotPlacementCalculator(x,y,z)
{
  //Make a 3D point apear in 2D space
  let x2D = (x * abs(FOV)) / z + camOffset.x;
  let y2D = (y * abs(FOV)) / z + camOffset.y;

  return {x : x2D, y : y2D};
}

function drawTriangle(p1, p2, p3)
{
  triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
}

function calculateAveragePoint(p1, p2)
{
  const pAvg = {x : (p1.x+p2.x)/2, y : (p1.y+p2.y)/2, z : (p1.z+p2.z)/2};

  return pAvg;
}
