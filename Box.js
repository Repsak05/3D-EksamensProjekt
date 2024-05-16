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

  localRotationX(angle)
  {
    this.updateLocalAxes();
    this.localRotationAroundAxis(angle, this.xAxisLocal);
  }
  localRotationY(angle)
  {
    this.updateLocalAxes();
    this.localRotationAroundAxis(angle, this.yAxisLocal);
  }
  localRotationZ(angle)
  {
    this.updateLocalAxes();
    this.localRotationAroundAxis(angle, this.zAxisLocal);
  }

  localRotationAroundAxis(angle = 5, rotationalAxis = this.zAxisLocal)
  {
    // ! Preforms a rotation of the objcts local axis
    //Draw the axis as a refrence
    strokeWeight(10);
    const lineLen = 400;
    let lp1 = dotPlacementCalculator(this.xPos - lineLen/2 * rotationalAxis.x, this.yPos - lineLen/2 * rotationalAxis.y, this.zPos - lineLen/2 * rotationalAxis.z)
    let lp2 = dotPlacementCalculator(this.xPos + lineLen/2 * rotationalAxis.x, this.yPos + lineLen/2 * rotationalAxis.y, this.zPos + lineLen/2 * rotationalAxis.z)
    line(lp1.x, lp1.y, lp2.x, lp2.y);
    strokeWeight(1);

      
      // ? 2. Preform rotation for all given points
    for(let points in this.points3D)
    {
      const point = this.points3D[points];

      let vecToRotateAroundAxis = {
        x : point.x - this.xPos,
        y : point.y - this.yPos,
        z : point.z - this.zPos,
      }
            
      // ? 4. Rotate vector relative to z-axis

      let newVec = {
        x : vecToRotateAroundAxis.x * cos(angle) + (calculate3DCrossProduct(vecToRotateAroundAxis, rotationalAxis).x) * sin(angle) + rotationalAxis.x * (calculateDotProductOf3DVector(rotationalAxis, vecToRotateAroundAxis)) * (1 - cos(angle)),
        y : vecToRotateAroundAxis.y * cos(angle) + (calculate3DCrossProduct(vecToRotateAroundAxis, rotationalAxis).y) * sin(angle) + rotationalAxis.y * (calculateDotProductOf3DVector(rotationalAxis, vecToRotateAroundAxis)) * (1 - cos(angle)),
        z : vecToRotateAroundAxis.z * cos(angle) + (calculate3DCrossProduct(vecToRotateAroundAxis, rotationalAxis).z) * sin(angle) + rotationalAxis.z * (calculateDotProductOf3DVector(rotationalAxis, vecToRotateAroundAxis)) * (1 - cos(angle)),
      }

      //Un-relative the points (Calculate exact position)
      point.x = newVec.x + this.xPos;
      point.y = newVec.y + this.yPos;
      point.z = newVec.z + this.zPos;
    }
  }

  updateLocalAxes()
  {
    //! Some problems with calculation of the axes
    const frontFaceAveragePoint = calculateAveragePointFromPoints(this.facePoints["front"] || Object.values(this.facePoints)[0]);
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
     this.yAxisLocal = calculate3DUnitVector({x: newXRotated, y: newYRotated, z: newZRotated});
 
     //Create local y-axis
     this.xAxisLocal = calculate3DUnitVector(calculate3DCrossProduct(this.yAxisLocal, this.zAxisLocal)); 
  }
}

