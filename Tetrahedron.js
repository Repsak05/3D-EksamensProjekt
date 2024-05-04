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
        
        //Send parameters to parent-class (no .this)
        super(xPos, yPos, zPos, points3D);
        
        //Set dimensions
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
        this.centerPosition = {x : this.xPos, y : this.yPos, z : this.zPos};

        //Wdith, height, depth
        this.size = size;
        
        //Get 3D points
        this.points3D = points3D;
    }



    draw()
    {
        this.points2D = {
            p1 : dotPlacementCalculator(this.points3D.p1.x, this.points3D.p1.y, this.points3D.p1.z),
            p2 : dotPlacementCalculator(this.points3D.p2.x, this.points3D.p2.y, this.points3D.p2.z),
            p3 : dotPlacementCalculator(this.points3D.p3.x, this.points3D.p3.y, this.points3D.p3.z),
            p4 : dotPlacementCalculator(this.points3D.p4.x, this.points3D.p4.y, this.points3D.p4.z),
        }

        fill(0, 255 ,0);
        drawTriangle(this.points2D.p2, this.points2D.p3, this.points2D.p4); // Bottom
        fill(255, 255 ,0);
        drawTriangle(this.points2D.p2, this.points2D.p1, this.points2D.p4); //Back-left
        fill(0, 255 ,255);
        drawTriangle(this.points2D.p4, this.points2D.p1, this.points2D.p3); //Back-right
        fill(255, 0 ,255);
        drawTriangle(this.points2D.p2, this.points2D.p1, this.points2D.p3); //Front
    }
}