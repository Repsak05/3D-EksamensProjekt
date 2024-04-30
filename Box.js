class Box{
    constructor(xPos, yPos, zPos, width, height, depth)
    {
      //Positions and dimensions
      this.xPos = xPos;
      this.yPos = yPos;
      this.zPos = zPos;
      this.width = width;
      this.height = height;
      this.depth = depth;
    
      //Colors of each of the faces on the Box
      this.faceColor = {
        front  : [0, 0, 255],
        back   : [255, 0, 0],
        right  : [0, 255, 0],
        left   : [255, 255, 0],
        top    : [0, 255, 255],
        bottom : [255, 0, 255],
      }
    
      //Each initial point in 3D space (Depending on position and dimensions) 
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
        //Convert 3D points to 2D points on the screen
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
  
      
      //Calculate the faceIntensity of each face of the box
      const boxCenterPos = {x : this.xPos, y : this.yPos, z : this.zPos }
  
      const faceIntensity = {
        front  : this.calculateLightIntensity(sunPosition, this.points3D.p1, this.points3D.p3, boxCenterPos),
        back   : this.calculateLightIntensity(sunPosition, this.points3D.p5, this.points3D.p7, boxCenterPos),
        right  : this.calculateLightIntensity(sunPosition, this.points3D.p2, this.points3D.p7, boxCenterPos),
        left   : this.calculateLightIntensity(sunPosition, this.points3D.p1, this.points3D.p8, boxCenterPos),
        top    : this.calculateLightIntensity(sunPosition, this.points3D.p5, this.points3D.p2, boxCenterPos),
        bottom : this.calculateLightIntensity(sunPosition, this.points3D.p8, this.points3D.p3, boxCenterPos),
      };
  
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

    setFaceColor(faceName, rbgValue)
    {
        if(this.faceColor[faceName])
        {
            this.faceColor[faceName] = rbgValue;

        } else {
            console.log("Invalid fceName: " + faceName);
        }
    }


    //Private functions:

    calculateLightIntensity(sunPosition, boxCornerOne, boxOppositeCorner, boxCenter)
    {
    //Average of 2 diagonals on one face = centerPointOfFace
    const boxCenterFace = calculateAveragePoint(boxCornerOne, boxOppositeCorner);

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