const canvasX = 1000;
const canvasY = 1000;

//Following values should become a class - Encapsulation
let FOV = -800; //Distance from cam to actual Screen
let camOffset = {x : 400, y: 400, z : FOV};
const moveSpeed = 5;

let objects = [];


function setup()
{
  angleMode(DEGREES);
  createCanvas(canvasX, canvasY);

  //Intialize objects
  for(let x = -80; x < 120; x += 30)
  {
    for(let y = -80; y < 120; y += 40)
    {
      if(x < -20)
      {
        objects.push(new Box(x, y, 200, random(10,20), random(10,20), random(10,20)));

      } else if (x < 20){ 
        objects.push(new Tetrahedron(x, y, 200, random(10,40)));

      } else {
        objects.push(new Prism(x, y, 200, random(10,25), random(10,25), random(10,25)));
      }
    }
  }

}

function draw()
{
  background(220);

  //Being used for sun position
  let mousePosition = {x : mouseX, y : mouseY, z : 120}

  //Preform actions on objects
  for(let object of objects)
  {
    if(object.getType == "Box")
    {
      object.localRotationX(random(0.5, 2.5));
      object.localRotationY(random(0.5, 2.5));
      object.localRotationZ(random(0.5, 2.5));
    }else {
      object.rotationX(random(0.5, 2.5));
      object.rotationY(random(0.5, 2.5));
      object.rotationZ(random(0.5, 2.5));
    }
    
    object.ajustLighting(mousePosition);
    object.draw();
  }

  movecam();
}

//Other functions | Should be apart of the camera class
function movecam()
{
  if(keyCode == 87) //w
  {
    FOV -= moveSpeed;
  } 
  if(keyCode == 65) //a
  {
    camOffset.x += moveSpeed;
    
  }
  if(keyCode == 83) //s
  {
    FOV += moveSpeed;
    
  }
  if(keyCode == 68) //d
  {
    camOffset.x -= moveSpeed;
  }
  if(keyCode == 16) //Shift
  {
    camOffset.y -= moveSpeed;
  }
  if(keyCode == 32) //Shift
  {
    camOffset.y += moveSpeed;
  }

}
