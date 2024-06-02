const canvasX = 1800;
const canvasY = 1000;

const camOffset = {x : canvasX/2, y: canvasY/2, z : -800};

let objects = [];
let sliderSunZ;

function setup()
{
  angleMode(DEGREES);
  createCanvas(canvasX, canvasY);

  sliderSunZ = createSlider(-100, 200, 150);
  sliderSunZ.position(10,10);

  for(let y = -100; y < 120; y += 40)
  {
    let poly = 3
    for(let x = -200; x < 220; x += 40)
    {
      objects.push(new Polygon(x, y, 200, poly, 10, 10));
      poly++;
    }
  }
}

function draw()
{
  background(220);

  //Being used for sun's position
  let mousePosition = {x : mouseX, y : mouseY, z : sliderSunZ.value()};

  // Preform actions on objects
  for(let object of objects)
  {
    object.rotationX(random(0.5, 2.5));
    object.rotationY(random(0.5, 2.5));
    object.rotationZ(random(0.5, 2.5));
    object.ajustLighting(mousePosition);
    object.draw();
  }
}