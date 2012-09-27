
var width = 20;

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
	
	for(var k=1; k<points.length-1; k++){
		console.log("[" + k + "]");
		var line = computeLineCoefficients(points[k], points[k+1]);
		console.log("line = " + line);
		var ortho = computeOrthogonalLine(line, points[k]);
		this.pointsL[k] = computePointOnLine(ortho, points[k], - width);
		this.pointsR[k] = computePointOnLine(ortho, points[k], + width);
	}
	
	this.pointsL[points.length-1] = points[points.length-1];
	this.pointsR[points.length-1] = points[points.length-1];
}

corridor.prototype.draw = function(ctx){
	
	context.strokeStyle = "rgb(255, 200, 200)";
	context.lineWidth = width*2;
	drawPoints(ctx, this.points);
	
	context.strokeStyle = "rgb(255, 0, 0)";
	context.lineWidth = 1;
	drawPoints(ctx, this.pointsL);
	
	context.strokeStyle = "rgb(255, 0, 0)";
	context.lineWidth = 1;
	drawPoints(ctx, this.pointsR);
};

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
		a = dx<0?dy/dx:-dy/dx;
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