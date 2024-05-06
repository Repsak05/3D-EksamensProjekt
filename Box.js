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
  }