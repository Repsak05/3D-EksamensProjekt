class Box extends Object3D
{
  constructor(xPos, yPos, zPos, width, height, depth)
  {
    //Each initial point in 3D space (Depending on position and dimensions) 
    const points3D = {
        //Front points clockwise from top left
      p1 : {x : xPos - width / 2, y : yPos - height / 2, z : zPos - depth / 2},
      p2 : {x : xPos + width / 2, y : yPos - height / 2, z : zPos - depth / 2},
      p3 : {x : xPos + width / 2, y : yPos + height / 2, z : zPos - depth / 2},
      p4 : {x : xPos - width / 2, y : yPos + height / 2, z : zPos - depth / 2},

        //Back points clockwise from top left
      p5 : {x : xPos - width / 2, y : yPos - height / 2, z : zPos + depth / 2},
      p6 : {x : xPos + width / 2, y : yPos - height / 2, z : zPos + depth / 2},
      p7 : {x : xPos + width / 2, y : yPos + height / 2, z : zPos + depth / 2},
      p8 : {x : xPos - width / 2, y : yPos + height / 2, z : zPos + depth / 2},
    };

    //The corners of each face
    const facePoints = {
      front  : [points3D.p1, points3D.p2, points3D.p3, points3D.p4],
      back   : [points3D.p5, points3D.p6, points3D.p7, points3D.p8],
      right  : [points3D.p2, points3D.p6, points3D.p7, points3D.p3],
      left   : [points3D.p1, points3D.p5, points3D.p8, points3D.p4],
      top    : [points3D.p1, points3D.p5, points3D.p6, points3D.p2],
      bottom : [points3D.p4, points3D.p8, points3D.p7, points3D.p3],
    }
    
    //Colors of each face of the box
    const faceColor = {
      front  : [0, 0, 255],
      back   : [255, 0, 0],
      right  : [0, 255, 0],
      left   : [255, 255, 0],
      top    : [0, 255, 255],
      bottom : [255, 0, 255],
    }
    
    //Send paramters to parent-calss (no .this)
    super(xPos, yPos, zPos, points3D, facePoints, faceColor);
  }

  localRotationZ(angle = 5)
  {
    // ! Preforms a rotation of the objcts local axis

    // ? 1. Calculate local-axises direction (unitVectors):
    // Define local z-axis
    const frontFaceAveragePoint = calculateAveragePointFromPoints(this.facePoints["front"]);
    this.zAxisLocal = calculate3DUnitVector(calculate3DVector(this.centerPoint, frontFaceAveragePoint));

    // Calculate 2 angle between local z-axis and global z-axis
    let angleOne = acos(Math.abs(this.zAxisLocal.z  / 1)); //Changes: z, x
    let angleTwo = atan2(this.zAxisLocal.y, this.zAxisLocal.x); //Changes: y, x

    // Rotate the global x-axis by angles to get local x-axis
    let newX = cos(angleTwo) * 1;
    let newY = sin(angleTwo) * 1;
    let newZ = 0; 

    // Rotate local x-axis by angleOne around the y-axis
    let newXRotated = newX * cos(angleOne);
    let newYRotated = newY;
    let newZRotated = newX * sin(angleOne);

    //Axis Unit vector 
    this.xAxisLocal = calculate3DUnitVector({x: newXRotated, y: newYRotated, z: newZRotated});

    //Create local y-axis
    this.yAxisLocal = calculate3DUnitVector(calculate3DCrossProduct(this.xAxisLocal, this.zAxisLocal)); 
    

    strokeWeight(10);
    const lineLen = 200;
    let lp1 = dotPlacementCalculator(this.xPos - lineLen/2 * this.zAxisLocal.x, this.yPos - lineLen/2 * this.zAxisLocal.y, this.zPos - lineLen/2 * this.zAxisLocal.z)
    let lp2 = dotPlacementCalculator(this.xPos + lineLen/2 * this.zAxisLocal.x, this.yPos + lineLen/2 * this.zAxisLocal.y, this.zPos + lineLen/2 * this.zAxisLocal.z)
    line(lp1.x, lp1.y, lp2.x, lp2.y);
    strokeWeight(1);

      
      // ? 2. Calculate x-axis intersection with x-plane:
        // ! Do for all points:
    for(let points in this.points3D)
    {
      console.log(points);
      const point = this.points3D[points]; // == t

      //Find center of the face:
        //Find n - to find centerPoint
      const n = (
        - this.zAxisLocal.x * (this.xPos - point.x)    
        - this.zAxisLocal.y * (this.yPos - point.y)   
        - this.zAxisLocal.z * (this.zPos - point.z))
        /(this.zAxisLocal.x * this.zAxisLocal.x + this.zAxisLocal.y * this.zAxisLocal.y + this.zAxisLocal.z * this.zAxisLocal.z)
      
        //Actual Face Average Point:
      const avgFacePoint = {
        x : this.xPos + n * this.zAxisLocal.x, 
        y : this.yPos + n * this.zAxisLocal.y, 
        z : this.zPos + n * this.zAxisLocal.z
      };

      this.avgFacePoint = avgFacePoint; //___remove this later
      
      //Find point to create rightAngled triangle
      const n2 =  //yAxisLocal SHOULD NOT BE USED: IT SHOULD BE xAxisLocal (THOUGH ITS DIR IR CURRENTLY WRONG)
        ( - this.yAxisLocal.x * (point.x - avgFacePoint.x)
        - this.yAxisLocal.y * (point.y - avgFacePoint.y)
        - this.yAxisLocal.z * (point.z - avgFacePoint.z))
        /(this.yAxisLocal.x * this.yAxisLocal.x + this.yAxisLocal.y * this.yAxisLocal.y + this.yAxisLocal.z * this.yAxisLocal.z)
        

        let rightAngledPoint = {
        x : point.x + n2 * this.yAxisLocal.x,
        y : point.y + n2 * this.yAxisLocal.y,
        z : point.z + n2 * this.yAxisLocal.z,
      };

      const relP1 = { //Point B in notes
        x : point.x - this.xPos,
        y : point.y - this.yPos,
        z : point.z - this.zPos,
      }
      
      const relAnglePoint = { //Point A in notes
        x : rightAngledPoint.x - this.xPos,
        y :  rightAngledPoint.y - this.yPos,
        z : rightAngledPoint.z - this.zPos,
      }
      
      const relAvgPoint = { //Point C in notes
        x : avgFacePoint.x - this.xPos,
        y : avgFacePoint.y - this.yPos,
        z : avgFacePoint.z - this.zPos,
      }

       
      // ? 3. Calculate current angle
        let vecCA = {
          x : relAnglePoint.x - relAvgPoint.x,
        y : relAnglePoint.y - relAvgPoint.y,
        z : relAnglePoint.z - relAvgPoint.z,
      }
      let vecCB = {
        x : relP1.x - relAvgPoint.x,
        y : relP1.y - relAvgPoint.y,
        z : relP1.z - relAvgPoint.z,
      }
      
      let currentAngle = acos(calculateDotProductOf3DVector(vecCA, vecCB)/(calculate3DVectorLength(vecCA) * calculate3DVectorLength(vecCB)));
      
      
      // ? 4. Rotate vector relative to z-axis
      let newAngle = currentAngle + angle;

      let newVec = {
        x : vecCB.x * cos(newAngle) + (calculate3DCrossProduct(vecCB, this.zAxisLocal).x) * sin(newAngle) + this.zAxisLocal.x * (calculateDotProductOf3DVector(this.zAxisLocal, vecCB)) * (1 - cos(newAngle)),
        y : vecCB.y * cos(newAngle) + (calculate3DCrossProduct(vecCB, this.zAxisLocal).y) * sin(newAngle) + this.zAxisLocal.y * (calculateDotProductOf3DVector(this.zAxisLocal, vecCB)) * (1 - cos(newAngle)),
        z : vecCB.z * cos(newAngle) + (calculate3DCrossProduct(vecCB, this.zAxisLocal).z) * sin(newAngle) + this.zAxisLocal.z * (calculateDotProductOf3DVector(this.zAxisLocal, vecCB)) * (1 - cos(newAngle)),
      }

      //Un-relative the points
      point.x = newVec.x + avgFacePoint.x;
      point.y = newVec.y + avgFacePoint.y;
      point.z = newVec.z + avgFacePoint.z;
    }
  }

  calculateN(Linepoint, lineVec, planePoint, planeVec)
  {
    const n2 =  //yAxisLocal SHOULD NOT BE USED: IT SHOULD BE xAxisLocal (THOUGH ITS DIR IR CURRENTLY WRONG)
        ( - planeVec.x * (Linepoint.x - planePoint.x)
        - planeVec.y * (Linepoint.y - planePoint.y)
        - planeVec.z * (Linepoint.z - planePoint.z))
        /(planeVec.x * planeVec.x + planeVec.y * planeVec.y + planeVec.z * planeVec.z)

    return n2;
  }

}

