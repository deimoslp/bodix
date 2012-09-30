
var width = 5;

 

function corridor(points){
	
	this.points = points;
	
	this.pointsL = new Array();
	this.pointsR = new Array();
	
    console.log("this.points[0] = " + this.points[0]);
    console.log("this.points[1] = " + this.points[1]);
	
	var line = computeLineCoefficients(points[0], points[1]);
	console.log("line = " + line);
	
	var ortho = computeOrthogonalLine(line, points[0]);
	console.log("ortho = " + ortho);

	this.pointsL[0] = computePointOnLine(ortho, points[0], - width);
	console.log("this.pointsL[0] = " + this.pointsL[0]);
	this.pointsR[0] = computePointOnLine(ortho, points[0], + width);
    
    var prevLineL = $.extend({}, line);
    prevLineL[2] = - (this.pointsL[0][0]*prevLineL[0] + this.pointsL[0][1]*prevLineL[1]);
    var prevLineR = $.extend({}, line);
    prevLineR[2] = - (this.pointsR[0][0]*prevLineR[0] + this.pointsR[0][1]*prevLineR[1]);
 
	
	for(var k=1; k<points.length-1; k++){

        console.log("[" + k + "]");
        
        // compute new points
		line = computeLineCoefficients(points[k], points[k+1]);
		console.log(" - line = " + line);
		ortho = computeOrthogonalLine(line, points[k]);
        console.log(" - ortho = " + ortho);
        var pL = computePointOnLine(ortho, points[k], - width);
		var pR = computePointOnLine(ortho, points[k], + width);
        console.log(" - pL = " + ortho);
        
        // compute lines
        var lineL = $.extend({}, line);
        lineL[2] = - (pL[0]*lineL[0] + pL[1]*lineL[1]);
        var lineR = $.extend({}, line);
        lineR[2] = - (pR[0]*lineR[0] + pR[1]*lineR[1]);
        
        // compute real points
        this.pointsL[k] = computeIntersection(prevLineL, lineL);
        this.pointsR[k] = computeIntersection(prevLineR, lineR);
        
        prevLineL = lineL;
        prevLineR = lineR;
        
	}
	
    line = computeLineCoefficients(points[points.length-1], points[points.length-2]);
    ortho = computeOrthogonalLine(line, points[points.length-1]);
    
	this.pointsL[points.length-1] = computePointOnLine(ortho, points[points.length-1], + width);
	this.pointsR[points.length-1] = computePointOnLine(ortho, points[points.length-1], - width);
}
  
  
corridor.prototype.draw = function(ctx){
    
	ctx.strokeStyle = "rgb(255, 200, 200)";
    
	ctx.lineWidth = width*2;
	drawPoints(ctx, this.points);
	
	ctx.strokeStyle = "rgb(255, 0, 0)";
	ctx.lineWidth = 1;
	drawPoints(ctx, this.pointsL);
	
    ctx.strokeStyle = "rgb(255, 0, 0)";
	ctx.lineWidth = 1;
	drawPoints(ctx, this.pointsR);
};

corridor.prototype.fillFlowGradient = function(ctx, p){
    ctx.beginPath();
	ctx.moveTo(p[0][0], p[0][1]);
	for(var k=1; k<p.length; k++){
		ctx.lineTo(p[k][0], p[k][1]);
	}
	ctx.stroke();
}

function drawPoints(ctx, p){
	ctx.beginPath();
	ctx.moveTo(p[0][0], p[0][1]);
	for(var k=1; k<p.length; k++){
		ctx.lineTo(p[k][0], p[k][1]);
	}
	ctx.stroke();
}

function computeLineCoefficients(p0, p1){
	var a, b, c;
	
	var dx = p1[0] - p0[0];
	var dy = p1[1] - p0[1];
	
	if(dx == 0){
		b = 0;
		a = dy>0?1:-1;
	}else{
		b = dx<0?1:-1;
		a = dx<0?-dy/dx:dy/dx;
	}
	
	c = - (p0[0]*a + p0[1]*b);
	
	return [a,b,c];
}

function computeOrthogonalLine(coefs, p){
	a = - coefs[1];
	b = coefs[0];
	c = - (p[0]*a + p[1]*b);
	
	return [a,b,c];
}

function computePointOnLine(coefs, p, d){
	var k = Math.sqrt(d*d/(coefs[0]*coefs[0]+coefs[1]*coefs[1]));
	var sign = d<0?-1:1;

	var newP = [p[0] - sign*k*coefs[1], p[1] + sign*k*coefs[0]];
	
	return newP;
}

function computeIntersection(coefs1, coefs2){
    var p = new Array(2);
    var divisor = coefs1[1]*coefs2[0] -  coefs2[1]*coefs1[0];
    p[1] = - (coefs1[2]*coefs2[0] - coefs2[2]*coefs1[0])/divisor;
    if(coefs1[0] != 0){
        p[0] = - (coefs1[1]*p[1] + coefs1[2]) / coefs1[0];
    }else{
        p[0] = - (coefs2[1]*p[1] + coefs2[2]) / coefs2[0];
    }
    
    return p; 
}