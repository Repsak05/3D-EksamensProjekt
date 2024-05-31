class Polygon extends Object3D
{
    constructor(xPos, yPos, zPos, numberOfPoints, length, height)
    {
        let totalAngle = 360;
        let angleBetween = 360 / numberOfPoints;

        let points = [];

        if(numberOfPoints > 0)
        {
            const startingAngleDir = {x: 0, y: 1};
            const val1 = convertToPolær(startingAngleDir.x, startingAngleDir.y);
            for(let angle = 0; angle < totalAngle; angle += angleBetween)
            {
                const val = convertToCartesian(val1.angle + angle, length);
                points.push(val);
            }
        }

        //Calculate each points
        let points3D = [];

        const fb = [height, -height];
        let pointNumber = 0;

        for(let face of fb)
        {
            for(let point of points)
            {
                pointNumber++;
                points3D["p" + pointNumber] = {x : xPos + point.x, y : yPos + point.y, z : zPos + face};
            }
        }

        //Calculate relation between points that create a face
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
                
                facePoints["s" + (i+1)] = [val1, val2, val3, val4];
            }
            
            //Give each face a Color:
            let faceColor = [];
            for(let keys in facePoints)
                {
                    faceColor[keys] = [random(0, 255), random(0, 255), random(0, 255)];
                }
               
        console.log(points3D);
        console.log(facePoints);
        console.log(faceColor);

        super(xPos, yPos, zPos, points3D, facePoints, faceColor, "Polygon");
    }
}