class Tetrahedron extends Object3D
{
    constructor(xPos, yPos, zPos, size)
    {
        //Create 3D points to give to constructor
        
        const points3D = {
            p1: {x: xPos,               y: yPos - Math.sqrt(2/3) * size / 3,    z: zPos + Math.sqrt(2/3) * size / 3},  // Top 
            p2: {x: xPos - size / 2,    y: yPos + Math.sqrt(2/3) * size / 6,    z: zPos - Math.sqrt(2/3) * size / 3},  // Front-left 
            p3: {x: xPos + size / 2,    y: yPos + Math.sqrt(2/3) * size / 6,    z: zPos - Math.sqrt(2/3) * size / 3},  // Front-right 
            p4: {x: xPos,               y: yPos + Math.sqrt(2/3) * size / 3,    z: zPos + Math.sqrt(2/3) * size / 3}   // Bottom 
        };

        //Points each creating a side
        const facePoints = {
            front: [points3D.p2, points3D.p1, points3D.p3],
            left: [points3D.p2, points3D.p1, points3D.p4],
            right: [points3D.p4, points3D.p1, points3D.p3],
            bottom: [points3D.p2, points3D.p3, points3D.p4],
        };
        
        //Face colors:
        const faceColor = {
            front  : [random(0, 255), random(0, 255), random(0, 255)],
            left   : [random(0, 255), random(0, 255), random(0, 255)],
            right  : [random(0, 255), random(0, 255), random(0, 255)],
            bottom : [random(0, 255), random(0, 255), random(0, 255)],
        }

        //Send parameters to parent-class (no .this)
        super(xPos, yPos, zPos, points3D, facePoints, faceColor, "Tetrahedron");

    }
}