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
      
      //Send paramters to parent-calss (no .this)
      super(xPos, yPos, zPos, points3D);

      //Positions and dimensions
      this.xPos = xPos;
      this.yPos = yPos;
      this.zPos = zPos;
      this.centerPoint = {x : this.xPos, y : this.yPos, z : this.zPos};

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
  
    showSurface() //Gives faces colors and calculates when to render each face
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
    ajustLighting(sunPosition) //sunPosition includes .x , .y and .z position
    {
      //Add offset to sun-position: from 2D to 3D kinda
      sunPosition = {x : (sunPosition.x - camOffset.x) / (abs(FOV) / sunPosition.z) , y : (sunPosition.y - camOffset.y) / (abs(FOV) / sunPosition.z), z : sunPosition.z};
      // console.log("Sun z-value: " + sunPosition.z  + "\nThis z-pos: " + this.zPos + "\n| Dim: " + `${this.height}, ${this.width}, ${this.depth}`);
      
      //Draw circle as pointer to sun (Indication of sun placement)
      let circleSunPos = dotPlacementCalculator(sunPosition.x, sunPosition.y, sunPosition.z);
      circle(circleSunPos.x, circleSunPos.y, 100);
  
      
      //Calculate the faceIntensity of each face of the box  
      const faceIntensity = {
        front  : this.calculateLightIntensity(sunPosition, this.points3D.p1, this.points3D.p3, this.centerPoint),
        back   : this.calculateLightIntensity(sunPosition, this.points3D.p5, this.points3D.p7, this.centerPoint),
        right  : this.calculateLightIntensity(sunPosition, this.points3D.p2, this.points3D.p7, this.centerPoint),
        left   : this.calculateLightIntensity(sunPosition, this.points3D.p1, this.points3D.p8, this.centerPoint),
        top    : this.calculateLightIntensity(sunPosition, this.points3D.p5, this.points3D.p2, this.centerPoint),
        bottom : this.calculateLightIntensity(sunPosition, this.points3D.p8, this.points3D.p3, this.centerPoint),
      };
  
      //Multiple intensity into faceColor's
      for(let face in this.faceColor)
      {
        for(let i = 0; i < this.faceColor[face].length; i++)
        {
          this.faceColor[face][i] *= (faceIntensity[face] + 1) / 2; // (..+1)/2 because before, the inteval was from -1 to 1 | Now 0 to 1
        }
      }
    }


    localRotationX(angle)
    {
      //Create later
    }
    localRotationY(angle)
    {
      //Create later
    }
    localRotationZ(angle)
    {
      //Create later
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
  }