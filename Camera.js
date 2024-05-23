class Camera{
    constructor(xPos, yPos, zPos)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos; //FOV

        this.moveSpeed = 5;
    }

    movement()
    {
        function keyPressed() 
        {
            if(keyCode == 87) //w
            {
                this.zPos -= moveSpeed;
            } else if(keyCode == 83){ //s
                this.zPos += moveSpeed;
            }

            if(keyCode == 65) //a
            {
                this.xPos += moveSpeed;
            } else if (keyCode == 68){ //d
                this.xPos -= moveSpeed;
            }

            if(keyCode == 16) //Shift
            {
                this.yPos -= moveSpeed;
            } else if(keyCode == 32) { //Space
                this.yPos += moveSpeed;
            }
        }

        keyPressed();
    }

    renderObjectsInOrder(objects)
    {
        //Preform task that render objects in one correct order
            //Meaning that those closest to the cam gets rendered first

    }
}