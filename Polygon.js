class Polygon extends Object3D
{
    constructor(xPos, yPos, zPos, numberOfPoints, length, height)
    {
        const totalAngle = 360;
        const angleBetween = 360 / numberOfPoints;

        //Calculate 2D polygon placement of point
        let points = [];
        if(numberOfPoints > 0)
        {
            const startingAngleDir = {x: 0, y: 1};
            const startingAngle = atan(startingAngleDir.y / startingAngleDir.x)

            for(let angle = 0; angle < totalAngle; angle += angleBetween)
            {
                const pointPosition = {x : cos(startingAngle + angle) * length, y : sin(startingAngle + angle) * length}
                points.push(pointPosition);
            }
        }

        //Calculate each 3D points with depth
        let points3D = [];
        let pointNumber = 0;

        for(let face of [height, -height])
        {
            for(let point of points)
            {
                pointNumber++;
                points3D["p" + pointNumber] = {x : xPos + point.x, y : yPos + point.y, z : zPos + face};
            }
        }

        //Calculate relation between points that creates a face
        let facePoints = [];

        facePoints["f"] = Object.values(points3D).slice(0, Math.floor(Object.entries(points3D).length / 2));
        facePoints["b"] = Object.values(points3D).slice(Math.floor(Object.entries(points3D).length / 2));
        
        for(let i = 0; i < Math.ceil(Object.entries(points3D).length) / 2; i++)
        {
            //FRONT 
            const val1 = points3D[Object.keys(points3D)[i]];
            const val2 = points3D[Object.keys(points3D)[(i + 1) % (Object.entries(points3D).length / 2)]];
            
            //BACK
            const val3 = points3D[Object.keys(points3D)[i + Object.entries(points3D).length / 2]];
            const val4 = points3D[Object.keys(points3D)[(i + 1) % (Object.entries(points3D).length / 2) + Object.entries(points3D).length/2]];
            
            facePoints["s" + (i+1)] = [val1, val2, val4, val3];
        }
            
        //Give each face a Color:
        let faceColor = [];
        for(let keys in facePoints)
        {
            faceColor[keys] = [random(0, 255), random(0, 255), random(0, 255)];
        }
               
        super(xPos, yPos, zPos, points3D, facePoints, faceColor, "Polygon");
    }
}