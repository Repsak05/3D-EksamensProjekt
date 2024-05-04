class Object3D{
    constructor(xPos, yPos, zPos, points3D)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
        this.centerPoint = {x : this.xPos, y : this.yPos, z : this.zPos};

        this.points3D = points3D;
    }

    rotationX(angle = 5)
    {
        this.calculateRotation(angle, "z", "y", this.points3D, this.centerPoint);
    }

    rotationY(angle = 5) //Rotate around y-axis
    {
      this.calculateRotation(angle, "x", "z", this.points3D, this.centerPoint);
    }
  
    rotationZ(angle = 5) //Rotate around z-axis
    {
      this.calculateRotation(angle, "x", "y", this.points3D, this.centerPoint)
    }


    //Private function
    calculateRotation(angleToRotate, hos = "x", mod = "y", pointsToRotate = this.points3D, rotateAroundReference = this.centerPoint, )
    {
      for(let key in pointsToRotate)
      {
        const point  = pointsToRotate[key];

        //Find dist from object's centrum to point
        const relativePointHos = point[hos] - rotateAroundReference[hos];
        const relativePointMod = point[mod] - rotateAroundReference[mod];

        //calculate current angle and new angle
        const currentAngle = atan2(relativePointMod, relativePointHos);
        const newAngle = currentAngle + angleToRotate;

        //Calculate new points and un-relative points
        const vectorLength = sqrt(relativePointHos * relativePointHos + relativePointMod * relativePointMod);
        point[hos] = rotateAroundReference[hos] + cos(newAngle) * vectorLength;
        point[mod] = rotateAroundReference[mod] + sin(newAngle) * vectorLength;
      }
    }

    calculateLightIntensity(sunPosition, boxCornerOne, boxOppositeCorner, boxCenter)
    {
        //Average of 2 diagonals on one face = centerPointOfFace
        const boxCenterFace = calculateAveragePoint(boxCornerOne, boxOppositeCorner);

        //Calculate the vectors
        const vecToSun = calculate3DVector(boxCenterFace, sunPosition);
        const vecPerpendicularOnBoxSide = calculate3DVector(boxCenter, boxCenterFace);

        //Remake to unitVectores, so that the distance to sun, doesnt matter
        const unitVecToSun = calculate3DUnitVector(vecToSun);
        const unitVecPerpendicularOnBoxSide = calculate3DUnitVector(vecPerpendicularOnBoxSide);

        //Intensity between: -1 and 1
        const sunIntensity = calculateDotProductOf3DVector(unitVecToSun, unitVecPerpendicularOnBoxSide);
        return sunIntensity;
    }
}