/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var flowHalfWidth = 10;

function flow(points){
    this.points = points;
    
    // build constant witdh flow
    this.pointsL = new Array(points.length);
    this.pointsR = new Array(points.length);
    
    this.pointsL[0] = computeAdjacentPointL(points[0], points[1]);
    
    

    for(var k=1; k<this.points.length-1; k++){
        var adjacentL = computeAdjacentPointL(points[k], points[k+1]);
        
        // TO REDO
        var coefs1 = coefsDroite(points[k-1], points[k]);
        coefs1[1] = this.pointsL[k-1][1] - this.pointsL[k-1][0]*coefs1[0];
        console.log("* coefs1 = " + coefs1);
        
        var coefs2 = coefsDroite(points[k], points[k+1]);
        coefs2[1] = adjacentL[1] - adjacentL[0]*coefs2[0];
        console.log("* coefs2 = " + coefs2);
        
        var newPoint = new Array();
        newPoint[0]    = - (coefs2[1] - coefs1[1]) / (coefs2[0] - coefs1[0]);
        newPoint[1]    = newPoint[0] * coefs1[0] + coefs1[1];
        
        console.log("newPoint = " + newPoint);
        
        this.pointsL[k] = newPoint;
    }
    this.pointsL[this.points.length -1] = this.points[this.points.length-1]
}

function coefsDroite(p0, p1){
    var a = (p1[1] - p0[1])/(p1[0]-p0[0]);
    var b = p0[1] - a*p0[0];
    
    return [a,b];
}

function computeAdjacentPointL(p0, p1){
    return [p0[0] + flowHalfWidth*cos(p0, p1), p0[1] + flowHalfWidth*sin(p0, p1)];
}

function computeAdjacentPointR(p0, p1){
    return [p0[0] - flowHalfWidth*cos(p0, p1), p0[1] - flowHalfWidth*sin(p0, p1)];
}

function sin(p0, p1){
    return - (p1[0] - p0[0]) / Math.sqrt(d2(p0, p1));
}

function cos(p0, p1){
    return (p1[1] - p0[1]) / Math.sqrt(d2(p0, p1));
}

function d2(p0, p1){
    return (p1[1]-p0[1])*(p1[1]-p0[1]) + (p1[0]-p0[0])*(p1[0]-p0[0]);
}

flow.prototype = {
    draw : function (canvasCtx){
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(255,0,0)";
        this.drawPoints(canvasCtx, this.pointsL);
        
        canvasCtx.strokeStyle = "rgb(255,200,200)";
        canvasCtx.lineWidth = flowHalfWidth*2;
        this.drawPoints(canvasCtx, this.points);
    //    this.drawPoints(this.pointsR);
    },
    
    drawPoints : function(canvasCtx, points){
        canvasCtx.beginPath();
        canvasCtx.moveTo(points[0][0], points[0][1]);
        for(var k=1; k<points.length; k++){
            canvasCtx.lineTo(points[k][0],points[k][1]);
        }
        canvasCtx.stroke();
    }
    
}