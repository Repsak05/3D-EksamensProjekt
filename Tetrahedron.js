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

        //Face colors:
        this.faceColor = {
            front  : [0, 0, 255],
            left   : [255, 0, 0],
            right  : [0, 255, 0],
            bottom : [255, 0, 255],
        }


        //Points each creating a side
        this.facePoints = {
            front: [this.points3D.p2, this.points3D.p1, this.points3D.p3],
            left: [this.points3D.p2, this.points3D.p1, this.points3D.p4],
            right: [this.points3D.p4, this.points3D.p1, this.points3D.p3],
            bottom: [this.points3D.p2, this.points3D.p3, this.points3D.p4],
        };
    }

    draw()
    {
        this.points2D = {
            p1 : dotPlacementCalculator(this.points3D.p1.x, this.points3D.p1.y, this.points3D.p1.z),
            p2 : dotPlacementCalculator(this.points3D.p2.x, this.points3D.p2.y, this.points3D.p2.z),
            p3 : dotPlacementCalculator(this.points3D.p3.x, this.points3D.p3.y, this.points3D.p3.z),
            p4 : dotPlacementCalculator(this.points3D.p4.x, this.points3D.p4.y, this.points3D.p4.z),
        }


        //TODO: Following code should be inserted in the parent class: Object3D 
        //Following bit of code will Render sides in order and give them color:
        let arrWithSideAndZIndex = [];

        for(let keys in this.facePoints)
        {
            //Get average point of the face
            const faceCorners = this.facePoints[keys];
            const averageFacePoint = calculateAveragePointFromPoints(faceCorners);

            //Insert their face-name and their z-index
            arrWithSideAndZIndex.push([keys, averageFacePoint.z]);
        }

        //Sort them by z-index
        arrWithSideAndZIndex.sort((a, b) => b[1] - a[1]);

        //Display each side in correct order.
        for(let sideAndZIndex of arrWithSideAndZIndex)
        {
           fill(this.faceColor[sideAndZIndex[0]]);
           drawTriangleFromArrayWith3DPoints(this.facePoints[sideAndZIndex[0]]);
        }
    }
}