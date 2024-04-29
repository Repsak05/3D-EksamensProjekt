const canvasX = 700;
const canvasY = 700;

const FOV = -800; //Distance from cam to actual Screen
const camOffset = {x : 400, y: 400, z : FOV};

const rotSpeedX = .5;
const rotSpeedY = .7;
const rotSpeedZ = .11;

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

//Sun slider
let sliderSunZ;

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

  //Sun-Z
  sliderSunZ = createSlider(-100, 150, 10);
  sliderSunZ.position(10,100);

}

function draw()
{
  background(220);

  currentAngleX += rotSpeedX;
  currentAngleY += rotSpeedY;
  currentAngleZ += rotSpeedZ;


  //Create new box
  let box = new Box(sliderXPos.value(), sliderYPos.value(), sliderZPos.value(), sliderWidth.value(), sliderHeight.value(), sliderDepth.value());
  box.rotationX(currentAngleX);
  box.rotationY(currentAngleY);
  box.rotationZ(currentAngleZ);
  // box.rotationX(sliderAngleX.value() + 40);
  // box.rotationY(sliderAngleY.value() + 10);
  // box.rotationZ(sliderAngleZ.value() + 20);
  
  box.draw();
  box.ajustLighting({x : mouseX, y : mouseY, z : 40 + sliderSunZ.value()});
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

    text(this.zPos, 500, 80);

    this.faceColor = {
      front  : [0, 0, 255],
      back   : [255, 0, 0],
      right  : [0, 255, 0],
      left   : [255, 255, 0],
      top    : [0, 255, 255],
      bottom : [255, 0, 255],
    }
  

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
      front   : calculateAveragePoint(this.points3D.p1, this.points3D.p3).z - FOV,
      back   : calculateAveragePoint(this.points3D.p5, this.points3D.p7).z - FOV,
      right  : calculateAveragePoint(this.points3D.p2, this.points3D.p7).z - FOV,
      left   : calculateAveragePoint(this.points3D.p1, this.points3D.p8).z - FOV,
      top    : calculateAveragePoint(this.points3D.p5, this.points3D.p2).z - FOV,
      bottom : calculateAveragePoint(this.points3D.p8, this.points3D.p3).z - FOV,
    }

    // Sort the object based on the values in descending order (Surfaces furthest away)
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
        case "front":
          fill(this.faceColor.front);
          drawTriangle(this.points2D.p1,this.points2D.p2,this.points2D.p3);
          drawTriangle(this.points2D.p1,this.points2D.p3,this.points2D.p4);
          break;

        case "back":
          fill(this.faceColor.back);
          drawTriangle(this.points2D.p5,this.points2D.p6,this.points2D.p7);
          drawTriangle(this.points2D.p5,this.points2D.p7,this.points2D.p8);
          break;

        case "right":
          fill(this.faceColor.right);
          drawTriangle(this.points2D.p2,this.points2D.p6,this.points2D.p7);
          drawTriangle(this.points2D.p2,this.points2D.p7,this.points2D.p3);
          break;

        case "left":
          fill(this.faceColor.left);
          drawTriangle(this.points2D.p1,this.points2D.p5,this.points2D.p8);
          drawTriangle(this.points2D.p1,this.points2D.p8,this.points2D.p4);
          break;

        case "top":
          fill(this.faceColor.top);
          drawTriangle(this.points2D.p1,this.points2D.p5,this.points2D.p2);
          drawTriangle(this.points2D.p5,this.points2D.p2,this.points2D.p6);
          break;

        case "bottom":
          fill(this.faceColor.bottom);
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

  //Replace with function that makes all calculations (takes input: sunPosition, cubeCenter, & faceCenter)
  ajustLighting(sunPosition) //sunPosition includes .x , .y and .z value
  {
    //Add offset to sun-position:
    sunPosition = {x : (sunPosition.x - camOffset.x) / (abs(FOV) / sunPosition.z) , y : (sunPosition.y - camOffset.y) / (abs(FOV) / sunPosition.z), z : sunPosition.z};
    console.log("Sun z-value: " + sunPosition.z  + "\nThis z-pos: " + this.zPos + "\n| Dim: " + `${this.height}, ${this.width}, ${this.depth}`);
    
    //Draw circle as pointer to sun
    let circleSunPos = dotPlacementCalculator(sunPosition.x, sunPosition.y, sunPosition.z);
    circle(circleSunPos.x, circleSunPos.y, 100);

    const facesCentralPoint = { //Has x, y and z pos of center point
      front  : calculateAveragePoint(this.points3D.p1, this.points3D.p3),
      back   : calculateAveragePoint(this.points3D.p5, this.points3D.p7),
      right  : calculateAveragePoint(this.points3D.p2, this.points3D.p7),
      left   : calculateAveragePoint(this.points3D.p1, this.points3D.p8),
      top    : calculateAveragePoint(this.points3D.p5, this.points3D.p2),
      bottom : calculateAveragePoint(this.points3D.p8, this.points3D.p3),
    }

    const facesVecToSunAndCenter = { //Includes vector from center of the face to both the sun and the center
      front  : { sunVec : calculate3DVector(facesCentralPoint.front, sunPosition),  centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.front,)},
      back   : { sunVec : calculate3DVector(facesCentralPoint.back, sunPosition),   centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.back,)},
      right  : { sunVec : calculate3DVector(facesCentralPoint.right, sunPosition),  centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.right,)},
      left   : { sunVec : calculate3DVector(facesCentralPoint.left, sunPosition),   centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.left,)},
      top    : { sunVec : calculate3DVector(facesCentralPoint.top, sunPosition),    centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.top,)},
      bottom : { sunVec : calculate3DVector(facesCentralPoint.bottom, sunPosition), centerVec : calculate3DVector({x : this.xPos, y: this.yPos, z : this.zPos }, facesCentralPoint.bottom,)},
    }

    const faceIntensity = { //Intensity from 1 : -1  |  Dot product from vec1(faceCenter, sun) and vec2(cubeCenter, faceCenter)
      front  : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.front.sunVec),  calculate3DUnitVector(facesVecToSunAndCenter.front.centerVec)),
      back   : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.back.sunVec),   calculate3DUnitVector(facesVecToSunAndCenter.back.centerVec)),
      right  : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.right.sunVec),  calculate3DUnitVector(facesVecToSunAndCenter.right.centerVec)),
      left   : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.left.sunVec),   calculate3DUnitVector(facesVecToSunAndCenter.left.centerVec)),
      top    : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.top.sunVec),    calculate3DUnitVector(facesVecToSunAndCenter.top.centerVec)),
      bottom : calculateDotProductOf3DVector(calculate3DUnitVector(facesVecToSunAndCenter.bottom.sunVec), calculate3DUnitVector(facesVecToSunAndCenter.bottom.centerVec)),
    }

    //Multiple intensity into faceColor's
    for(let face in this.faceColor)
    {
      for(let i = 0; i < this.faceColor[face].length; i++)
      {
        this.faceColor[face][i] *= (faceIntensity[face] + 1) / 2; // (..+1)/2 because before, the inteval was from -1 to 1
      }
    }
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

function dotPlacementCalculator(x, y, z)
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

function calculate3DVector(p1,p2)
{
  return {x : p2.x - p1.x, y : p2.y - p1.y, z : p2.z - p1.z};
}

function calculate3DVectorLength(vec)
{
  return sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
}

function calculateDotProductOf3DVector(vec1, vec2)
{
  const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  
  return dotProduct;
}

function calculate3DUnitVector(vec)
{
  const vectorLength  = calculate3DVectorLength(vec);
  const unitVector = {x : vec.x / vectorLength, y : vec.y / vectorLength, z : vec.z / vectorLength};

  return unitVector;
}
