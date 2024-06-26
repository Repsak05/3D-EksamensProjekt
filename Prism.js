class Prism extends Object3D
{
    constructor(xPos, yPos, zPos, height, width, depth = width)
    {
        
        const points3D = {
            //Top middle; clickwise
            p1 : { x: xPos,             y: yPos + height / 2, z: zPos + depth / 2 },
            p2 : { x: xPos + width / 2, y: yPos + height / 2, z: zPos - depth / 2 },
            p3 : { x: xPos - width / 2, y: yPos + height / 2, z: zPos - depth / 2 },

            //Bottom middle; Clockwise
            p4 : { x: xPos,             y: yPos - height / 2, z: zPos + depth / 2 },
            p5 : { x: xPos + width / 2, y: yPos - height / 2, z: zPos - depth / 2 },
            p6 : { x: xPos - width / 2, y: yPos - height / 2, z: zPos - depth / 2 }
        };
        
        const facePoints = {
            top     : [points3D.p1, points3D.p2, points3D.p3],
            bottom  : [points3D.p4, points3D.p5, points3D.p6],
            right   : [points3D.p1, points3D.p2, points3D.p5, points3D.p4],
            left    : [points3D.p1, points3D.p3, points3D.p6, points3D.p4],
            front    : [points3D.p3, points3D.p2, points3D.p5, points3D.p6],
        };
        
        const faceColor = {
            top     : [random(0, 255), random(0, 255), random(0, 255)],
            bottom  : [random(0, 255), random(0, 255), random(0, 255)],
            right   : [random(0, 255), random(0, 255), random(0, 255)],
            left    : [random(0, 255), random(0, 255), random(0, 255)],
            front   : [random(0, 255), random(0, 255), random(0, 255)],
        };
        
        super(xPos, yPos, zPos, points3D, facePoints, faceColor, "Prism");
    }
}