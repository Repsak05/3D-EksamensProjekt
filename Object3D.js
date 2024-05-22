class Object3D
{
  constructor(xPos, yPos, zPos, points3D, facePoints, faceColor, type)
  {
      this.type = type //Public variable

      //Private variables
      this.xPos = xPos;
      this.yPos = yPos;
      this.zPos = zPos;
      this.centerPoint = {x : this.xPos, y : this.yPos, z : this.zPos};

      this.points3D = points3D;
      this.facePoints = facePoints;
      this.faceColor = faceColor; //Starting colors


      //Create copy of faceColor (These are the current shown colors)
      this.faceCurrentColor = {};
      for (let face in this.faceColor) 
      {
        this.faceCurrentColor[face] = [...this.faceColor[face]];
      }
  }


  //Public functions
  draw()
  {
    //Draw box rects in correct order
    let arrWithSideAndZIndex = [];

    for(let keys in this.facePoints)
    {
        //Get average point of the face
        const faceCorners = this.facePoints[keys];
        const averageFacePoint = calculateAveragePointFromPoints(faceCorners);

        //Insert their face-name and their z-index
        arrWithSideAndZIndex.push([keys, averageFacePoint.z]);
    }

    //Sort them by z-index
    arrWithSideAndZIndex.sort((a, b) => b[1] - a[1]);

    //Display each side in correct order.
    for(let sideAndZIndex of arrWithSideAndZIndex)
    {
        fill(this.faceCurrentColor[sideAndZIndex[0]]);
        drawTriangleFromArrayWith3DPoints(this.facePoints[sideAndZIndex[0]]);
    }
  }

  rotationX(angle = 5) //Rotate around x-axis
  {
      this.calculateRotation(angle, "z", "y", this.points3D, this.centerPoint);
  }

  rotationY(angle = 5) //Rotate around y-axis
  {
    this.calculateRotation(angle, "x", "z", this.points3D, this.centerPoint);
  }

  rotationZ(angle = 5) //Rotate around z-axis
  {
    this.calculateRotation(angle, "x", "y", this.points3D, this.centerPoint)
  }

  ajustLighting(sunPosition)
  {
    //Get suns 3D position
    sunPosition = {x : (sunPosition.x - camOffset.x) / (abs(FOV) / sunPosition.z) , y : (sunPosition.y - camOffset.y) / (abs(FOV) / sunPosition.z), z : sunPosition.z};
    let circleSunPos = dotPlacementCalculator(sunPosition.x, sunPosition.y, sunPosition.z);
    
    fill(0);
    circle(circleSunPos.x, circleSunPos.y, 100);

    //Multiply lightsintensity into faceColors
    for(let face in this.faceColor)
    {
      for(let i = 0; i < this.faceColor[face].length; i++)
      {
        this.faceCurrentColor[face][i] = this.faceColor[face][i] * (this.calculateLightIntensity(sunPosition, this.centerPoint, face) + 1) / 2; // (..+1)/2 because before, the inteval was from -1 to 1 | Now 0 to 1
      }
    }
  }
  
  setFaceColor(faceName, rgbValue)
  {
    if(this.faceColor[faceName])
    {
        this.faceColor[faceName] = rgbValue;

    } else {
        console.log("Invalid faceName: " + faceName);
    }
  }
    
  setAllFacesColors(rgbValue)
  {
    for(let key in this.faceColor)
    {
      this.faceColor[key] = rgbValue.slice();
    }
  }

  //Private function
  calculateRotation(angleToRotate, hos = "x", mod = "y", pointsToRotate = this.points3D, rotateAroundReference = this.centerPoint, )
  {
    for(let key in pointsToRotate)
    {
      const point  = pointsToRotate[key];

      //Find dist from object's centrum to point
      const relativePointHos = point[hos] - rotateAroundReference[hos];
      const relativePointMod = point[mod] - rotateAroundReference[mod];

      //calculate current angle and new angle
      const currentAngle = atan2(relativePointMod, relativePointHos);
      const newAngle = currentAngle + angleToRotate;

      //Calculate new points and un-relative points
      const vectorLength = sqrt(relativePointHos * relativePointHos + relativePointMod * relativePointMod);
      point[hos] = rotateAroundReference[hos] + cos(newAngle) * vectorLength;
      point[mod] = rotateAroundReference[mod] + sin(newAngle) * vectorLength;
    }
  }

  calculateLightIntensity(sunPosition, boxCenter, faceName)
  { 
    //Get average point of corners = centerPointOfFace
    const boxCenterFace = calculateAveragePointFromPoints(this.facePoints[faceName]);

    //Calculate the vectors
    const vecToSun = calculate3DVector(boxCenterFace, sunPosition);
    const vecPerpendicularOnBoxSide = calculate3DVector(boxCenter, boxCenterFace);

    //Remake to unitVectores, so that the distance to sun, doesnt matter
    const unitVecToSun = calculate3DUnitVector(vecToSun);
    const unitVecPerpendicularOnBoxSide = calculate3DUnitVector(vecPerpendicularOnBoxSide);

    //Intensity between: -1 and 1
    const sunIntensity = calculateDotProductOf3DVector(unitVecToSun, unitVecPerpendicularOnBoxSide);
    return sunIntensity;
  }
}