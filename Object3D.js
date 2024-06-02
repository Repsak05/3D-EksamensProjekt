class Object3D
{
  constructor(xPos, yPos, zPos, points3D, facePoints, faceColor, type)
  {
    //Private variables
    this.type = type
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
    //Only draw faces that can be seen
    for(let keys in this.facePoints)
    {

      const camPosition = {x : 0, y : 0, z : 1}; //Should change depending on movement

      //Get average point of the face
      const averageFacePoint = this.calculateAveragePointFromPoints(this.facePoints[keys]);
      
      //Reference vector -> Not perfect
      const vecAvgToCenter = this.calculate3DVector(averageFacePoint, this.centerPoint); //Vec from avg -> center: Not perfect
      let perpendicularOnFace = this.calculate3DVectorPerpendicularToFace(this.facePoints[keys], vecAvgToCenter); //Perfect

      const vecCamToAvg = this.calculate3DVector(camPosition, averageFacePoint); //

      //Determine wether the face should be displayed:
      if(this.calculateDotProductOf3DVector(perpendicularOnFace, vecCamToAvg) > 0)
      {
        fill(this.faceCurrentColor[keys]);
        this.drawTriangleFromArrayWith3DPoints(this.facePoints[keys]);
      }
    } 
  }

  rotationX(angle) //Rotate around x-axis
  {
      this.calculateRotation(angle, "z", "y", this.points3D, this.centerPoint);
  }

  rotationY(angle) //Rotate around y-axis
  {
    this.calculateRotation(angle, "x", "z", this.points3D, this.centerPoint);
  }

  rotationZ(angle) //Rotate around z-axis
  {
    this.calculateRotation(angle, "x", "y", this.points3D, this.centerPoint)
  }

  ajustLighting(sunPosition)
  {
    //Get sun's 3D position
    sunPosition = {x : (sunPosition.x - camOffset.x) / (abs(camOffset.z) / sunPosition.z) , y : (sunPosition.y - camOffset.y) / (abs(camOffset.z) / sunPosition.z), z : sunPosition.z};
    let circleSunPos = this.dotPlacementCalculator(sunPosition.x, sunPosition.y, sunPosition.z);
    
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

  getType()
  {
    return this.type;
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
    const boxCenterFace = this.calculateAveragePointFromPoints(this.facePoints[faceName]);

    //Calculate the vectors
    const vecToSun = this.calculate3DVector(boxCenterFace, sunPosition);

    const vecAlmostPerpendicularOnBoxSide = this.calculate3DVector(boxCenter, boxCenterFace);
    const vecPerpendicularOnBoxSide = this.calculate3DVectorPerpendicularToFace(this.facePoints[faceName], vecAlmostPerpendicularOnBoxSide, true);

    //Remake to unitVectores, so that the distance to sun, doesnt matter
    const unitVecToSun = this.calculate3DUnitVector(vecToSun);
    const unitVecPerpendicularOnBoxSide = this.calculate3DUnitVector(vecPerpendicularOnBoxSide);

    //Intensity between: -1 and 1
    const sunIntensity = this.calculateDotProductOf3DVector(unitVecToSun, unitVecPerpendicularOnBoxSide);
    return sunIntensity;
  }

  //Private Math Functions:
  dotPlacementCalculator(x, y, z)
  {
    //Make a 3D point apear in 2D space
    let x2D = (x * abs(camOffset.z)) / z + camOffset.x;
    let y2D = (y * abs(camOffset.z)) / z + camOffset.y;

    return {x : x2D, y : y2D};
  }

  drawTriangleFromArrayWith3DPoints(arr)
  {
    //Depending on however many points is given, make them into triangle(s)
    if(arr.length == 3)
    {
      //Convert points to 2D
      const p1 = this.dotPlacementCalculator(arr[0].x, arr[0].y, arr[0].z);
      const p2 = this.dotPlacementCalculator(arr[1].x, arr[1].y, arr[1].z);
      const p3 = this.dotPlacementCalculator(arr[2].x, arr[2].y, arr[2].z);

      //Draw triangle
      triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    } else if (arr.length == 4){
      //Convert points to 2D
      const p1 = this.dotPlacementCalculator(arr[0].x, arr[0].y, arr[0].z);
      const p2 = this.dotPlacementCalculator(arr[1].x, arr[1].y, arr[1].z);
      const p3 = this.dotPlacementCalculator(arr[2].x, arr[2].y, arr[2].z);
      const p4 = this.dotPlacementCalculator(arr[3].x, arr[3].y, arr[3].z);

      //Draw triangles (2 to create a square)
      triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y);

    } else if (arr.length > 4){

      const p1 = this.dotPlacementCalculator(arr[0].x, arr[0].y, arr[0].z);

      for(let i = 1; i < arr.length; i++)
      {

        const p2 = this.dotPlacementCalculator(arr[i].x, arr[i].y, arr[i].z);
        const p3 = this.dotPlacementCalculator(arr[(i+1)%(arr.length)].x, arr[(i+1)%(arr.length)].y, arr[(i+1)%(arr.length)].z);

        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      }

    }else {
      console.log("Arr has invalid length to create triangle");
    }
  }

  calculateAveragePointFromPoints(arr)
  {
    let avgPoints = {x: 0, y: 0, z: 0};
    
    for(let points of arr)
    { 
      avgPoints.x += points.x;
      avgPoints.y += points.y;
      avgPoints.z += points.z;
    }

    avgPoints.x /= arr.length;
    avgPoints.y /= arr.length;
    avgPoints.z /= arr.length;

    return avgPoints;
  }

  calculate3DVector(p1, p2)
  {
    return {x : p2.x - p1.x, y : p2.y - p1.y, z : p2.z - p1.z};
  }

  calculate3DVectorLength(vec)
  {
    return sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
  }

  calculateDotProductOf3DVector(vec1, vec2)
  {
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    
    return dotProduct;
  }

  calculate3DUnitVector(vec)
  {
    const vectorLength  = this.calculate3DVectorLength(vec);
    const unitVector = {x : vec.x / vectorLength, y : vec.y / vectorLength, z : vec.z / vectorLength};

    return unitVector;
  }

  calculate3DCrossProduct(vec1, vec2) 
  {
    const x = vec1.y * vec2.z - vec1.z * vec2.y;
    const y = vec1.z * vec2.x - vec1.x * vec2.z;
    const z = vec1.x * vec2.y - vec1.y * vec2.x;
    return { x: x, y: y, z: z };
  }

  calculate3DVectorPerpendicularToFace(facePoints, vecToCenter, dirToCenter = true)
  {
    if(facePoints.length >= 3)
    {
      const v1 = this.calculate3DVector(facePoints[0], facePoints[1]);
      const v2 = this.calculate3DVector(facePoints[2], facePoints[1]);
      const cross = this.calculate3DCrossProduct(v1, v2);

      const fakeDir = dirToCenter ? vecToCenter : {x : vecToCenter.x * -1, y: vecToCenter.y * -1, z : vecToCenter.z * -1};

      if(this.calculateDotProductOf3DVector(cross, fakeDir) < 0)
      {
        cross.x *= -1;
        cross.y *= -1;
        cross.z *= -1;
      }

      return cross;
    }
  }
}