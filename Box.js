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
    


    //Round to show easier
    this.xAxisLocal.x = round(this.xAxisLocal.x,2);
    this.xAxisLocal.y = round(this.xAxisLocal.y,2);
    this.xAxisLocal.z = round(this.xAxisLocal.z,2);

    this.yAxisLocal.x = round(this.yAxisLocal.x,2);
    this.yAxisLocal.y = round(this.yAxisLocal.y,2);
    this.yAxisLocal.z = round(this.yAxisLocal.z,2);

    this.zAxisLocal.x = round(this.zAxisLocal.x,2);
    this.zAxisLocal.y = round(this.zAxisLocal.y,2);
    this.zAxisLocal.z = round(this.zAxisLocal.z,2);

    // Log results for debugging
    console.log("X: ", this.xAxisLocal);
    console.log("Y: ", this.yAxisLocal);
    console.log("Z: ", this.zAxisLocal);
    console.log("------------------");
    console.log(calculate3DVectorLength(this.xAxisLocal))
    console.log(calculate3DVectorLength(this.yAxisLocal))
    console.log(calculate3DVectorLength(this.zAxisLocal))

    console.log("Should be 0?");
    console.log(calculateDotProductOf3DVector(this.xAxisLocal, this.yAxisLocal));
    console.log(calculateDotProductOf3DVector(this.xAxisLocal, this.zAxisLocal));
    console.log(calculateDotProductOf3DVector(this.yAxisLocal, this.zAxisLocal));

      
      // ? 2. Calculate x-axis intersection with x-plane:
        // ! Do for all points:

    const testPoints = ["p1", "p5"];
    for(let points of testPoints)
    {
      const point = this.points3D[points]; // == t

      //Find center of the face:
        //Find n - to find centerPoint
      const n = (
        - this.zAxisLocal.x * (this.xPos - point.x)    
        - this.zAxisLocal.y * (this.yPos - point.y)   
        - this.zAxisLocal.z * (this.zPos - point.z))
        /(this.zAxisLocal.x * this.zAxisLocal.x + this.zAxisLocal.y * this.zAxisLocal.y + this.zAxisLocal.z * this.zAxisLocal.z)
      
        //Actual Face Average Point:
      let avgFacePoint = {
        x : this.xPos + n * this.zAxisLocal.x, 
        y : this.yPos + n * this.zAxisLocal.y, 
        z : this.zPos + n * this.zAxisLocal.z
      };

      //Find point to create rightAngled triangle
      const n2 = 
        ( - this.xAxisLocal.x * (point.x - avgFacePoint.x)
        - this.xAxisLocal.y * (point.y - avgFacePoint.y)
        - this.xAxisLocal.z * (point.z - avgFacePoint.z))
        /(this.xAxisLocal.x * this.xAxisLocal.x + this.xAxisLocal.y * this.xAxisLocal.y + this.xAxisLocal.z * this.xAxisLocal.z)


      let rightAngledPoint = {
        x : point.x + n2 * this.xAxisLocal.x,
        y : point.y + n2 * this.xAxisLocal.y,
        z : point.z + n2 * this.xAxisLocal.z,
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
      console.log(
        "------------------\n Point : ", 
        relP1,  
        "\nAngled : ",
        relAnglePoint,
        "\nAvg : ",
        relAvgPoint,
        " \n---------------")
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
      let newAngle = currentAngle + angle;

      console.log(currentAngle);

      // ? 4. Calculate new points position


    }
        //Calculate plane
          //Vec : this.xAxisLocal (maybe not this)
          //Point : frontFaceAveragePoint
        //Intersection
          //p1 : faceFront[pointNum]
          //p1 * n = intersection (isolate n)


  }

}