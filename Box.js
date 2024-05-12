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
      //Define z-axis,
      this.zAxisLocal = calculate3DUnitVector(calculate3DVector(this.centerPoint, calculateAveragePointFromPoints(this.facePoints["front"])));

      //Calculate x-axis baised on roataion of local z-axis relative to global z-axis,
          //calculate how much i needs to get turned;
      let angleOne = acos((sqrt(this.zAxisLocal.x * this.zAxisLocal.x + this.zAxisLocal.z * this.zAxisLocal.z)) / (sqrt(this.zAxisLocal.x * this.zAxisLocal.x + this.zAxisLocal.y * this.zAxisLocal.y+ this.zAxisLocal.z * this.zAxisLocal.z)))
      let angleTwo = atan(this.zAxisLocal.z / (sqrt(this.zAxisLocal.x * this.zAxisLocal.x + this.zAxisLocal.z * this.zAxisLocal.z)))

          //Getting new points

          //Height transformation (x, y change);
      let currentHeightAngle = asin(this.zAxisLocal.y / (calculate3DVectorLength(this.zAxisLocal))); 

      this.newZAxisLocal = {x : 0, y : 0, z : 0}; //Remove this later;

      const newHeightAngle = currentHeightAngle + angleOne;


      this.newZAxisLocal.x = cos(newHeightAngle * calculate3DVectorLength(this.zAxisLocal));
      this.newZAxisLocal.y = sin(newHeightAngle * calculate3DVectorLength(this.zAxisLocal));

        //Other Axis transformation (x, z) <- angleTwo;
      let currentWidthAngle = atan(this.newZAxisLocal.x / this.zAxisLocal.z);
      const newWidthAngle = currentWidthAngle + angleTwo;
// 
      this.newZAxisLocal.z = cos(newWidthAngle);
      this.newZAxisLocal.x = sin(newWidthAngle);


      //y-axis = CrossProduct of z-axis and x-axis
      
      // ? 2. Calculate x-axis intersection with x-plane:

      // ? 3. Calculate current angle

      // ? 4. Calculate new points position
      console.log(this.zAxisLocal);
      console.log("len: " + calculate3DVectorLength(this.zAxisLocal));
      console.log("len: " + calculate3DVectorLength(this.newZAxisLocal));
      console.log("One:" + angleOne);
      console.log("Two: " + angleTwo);
      console.log("Height: " + currentHeightAngle);
      console.log(this.newZAxisLocal);
      console.log("------------------");
    }
  }