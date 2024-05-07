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

  let mousePosition = {x : mouseX, y : mouseY, z : 40 + sliderSunZ.value()}


  //Create new box
  let box = new Box(sliderXPos.value() + 20, sliderYPos.value(), sliderZPos.value(), sliderWidth.value(), sliderHeight.value(), sliderDepth.value());
  box.rotationX(currentAngleX);
  box.rotationY(currentAngleY);
  box.rotationZ(currentAngleZ);
  // box.rotationX(sliderAngleX.value() + 40);
  // box.rotationY(sliderAngleY.value() + 10);
  // box.rotationZ(sliderAngleZ.value() + 20);
  
  box.ajustLighting(mousePosition);
  box.draw();


  //Create Draw box two
  let boxTwo = new Box(-40, sliderYPos.value(), sliderZPos.value(), sliderWidth.value(), sliderHeight.value(), sliderDepth.value())
  boxTwo.rotationX(currentAngleY);
  boxTwo.rotationY(currentAngleZ);
  boxTwo.rotationZ(currentAngleX);

  boxTwo.setAllFacesColors([0, 255, 255]);
  boxTwo.setFaceColor("front", [255, 255, 255]);
  boxTwo.ajustLighting(mousePosition);
  boxTwo.draw();


  //Tetrahedron
  let tri = new Tetrahedron(-5, 0, 100, 20);
  tri.rotationX(currentAngleZ);
  tri.rotationY(currentAngleX);
  tri.rotationZ(currentAngleY);
  tri.ajustLighting(mousePosition);
  tri.draw();


  let triTwo = new Tetrahedron(-5, 20, 100, 10);
  triTwo.rotationX(currentAngleY);
  triTwo.rotationY(currentAngleZ);
  triTwo.rotationZ(currentAngleX);
  triTwo.ajustLighting(mousePosition);
  triTwo.draw();

  let prism = new Prism(0, -20, 100, 20, 10);
  prism.rotationX(currentAngleZ);
  prism.rotationY(currentAngleX);
  prism.rotationZ(-currentAngleY);
  prism.ajustLighting(mousePosition);
  prism.draw();
}


function drawRectFromPoints(p1, p2, p3, p4)
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

function drawTriangleFromArrayWith3DPoints(arr)
{
  //Depending on however many points is given, make them into triangle(s)
  if(arr.length == 3)
  {
    //Convert points to 2D
    const p1 = dotPlacementCalculator(arr[0].x, arr[0].y, arr[0].z);
    const p2 = dotPlacementCalculator(arr[1].x, arr[1].y, arr[1].z);
    const p3 = dotPlacementCalculator(arr[2].x, arr[2].y, arr[2].z);

    //Draw triangle
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

  } else if (arr.length == 4){
    //Convert points to 2D
    const p1 = dotPlacementCalculator(arr[0].x, arr[0].y, arr[0].z);
    const p2 = dotPlacementCalculator(arr[1].x, arr[1].y, arr[1].z);
    const p3 = dotPlacementCalculator(arr[2].x, arr[2].y, arr[2].z);
    const p4 = dotPlacementCalculator(arr[3].x, arr[3].y, arr[3].z);

    //Draw triangles (2 to create a square)
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y);

  } else {
    console.log("Arr has invalid length to create triangle");
  }
}

function calculateAveragePoint(p1, p2)
{
  const pAvg = {x : (p1.x+p2.x)/2, y : (p1.y+p2.y)/2, z : (p1.z+p2.z)/2};

  return pAvg;
}

function calculateAveragePointFromPoints(arr)
{
  let avgPoints = {x: 0, y: 0, z: 0};
  
  for(let points of arr)
  { 
    // console.log(points);
    avgPoints.x += points.x;
    avgPoints.y += points.y;
    avgPoints.z += points.z;
  }

  avgPoints.x /= arr.length;
  avgPoints.y /= arr.length;
  avgPoints.z /= arr.length;

  // console.log(avgPoints);
  return avgPoints;
}

function calculate3DVector(p1, p2)
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
