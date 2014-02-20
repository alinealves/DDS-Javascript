function vec2 (x,y) {
    if (x)
	this.x = x;
    else
	this.x = 0;
    
    if (y)
	this.y = y;
    else
	this.y = 0;
}

function Graph () {
    this.points = []; 

    this.interpolators = [];

    this.sdyb = 0;
    this.sdyo = 0;
    this.sdyb2 = 0;
    this.sdyo2 = 0;
    this.ay = 0;

    this.newPoint = false;

    this.gridSize = [10,10];

    this.pointsNumber = 20;

	this.lastPoint = 0;

	this.tx = 0;
	this.ty = 0;
	this.sx = 1;
	this.sy = 1;

	this.cx = 0;

	this.scrollLock = false;

	this.smallGridColor = "rgb(0,255,0)";
	this.bigGridColor 	= "rgb(0,0,255)";

	this.zooming = false;

	this.scroll = function (d) {
		this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.tx,(2*html5.canvas.width/(3*this.sx)-this.points[this.points.length-1].x)],
									  						   html5.hitch(function (data) {this.tx=data;},this))
		this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.tx,this.tx+d],
									  						   html5.hitch(function (data) {this.tx=data;},this))			
		if (this.points[this.points.length-1].x*this.sx+this.tx*this.sx < 2*html5.canvas.width/3) {
			this.scrollLock = false;
		} else {
			this.scrollLock = true;
		}

		this.lastPoint = 0;
	}

	this.scrollY = function (d) {
		this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.ty,(2*html5.canvas.width/(3*this.sy)-this.points[this.points.length-1].y)],
									  						   html5.hitch(function (data) {this.ty=data;},this))
		this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.ty,this.ty+d],
									  						   html5.hitch(function (data) {this.ty=data;},this))			
	}

	this.zoom = function (f) {
		this.zooming = true;

		if (this.interpolators[7])
			if (!this.interpolators[7].complete)
				return;

		this.interpolators[7] = new linearInterpolator([html5.t,html5.t+0.2],
									  						   [this.sx,this.sx+f],
									  						   html5.hitch(function (data) {this.sx=data;},this))

		this.interpolators[8] = new linearInterpolator([html5.t,html5.t+0.2],
									  						   [this.sy,this.sy+f],
									  						   html5.hitch(function (data) {this.sy=data;},this))
	
	    if (this.interpolators[7] && this.interpolators[7].complete == false)
			this.center(this.sx+f,this.sy+f);

		//this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
		//							  						   [this.tx,(2*html5.canvas.width/(3*this.sx*f)-this.points[this.points.length-1].x)],
		//							  						   html5.hitch(function (data) {this.tx=data;},this))
	}

	this.center = function (nsx,nsy) {
		this.tx = this.cx;
		this.tx = (2*html5.canvas.width/(3*nsx)-this.points[this.points.length-1].x);
		this.ty = (2*html5.canvas.height/(3*nsy));
		
		this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.2],
									  						   [this.tx,this.tx],
									  						   html5.hitch(function (data) {this.tx=data;},this))
		this.interpolators[6] = new linearInterpolator([html5.t,html5.t+0.2],
									  						   [this.ty,this.ty],
									  						   html5.hitch(function (data) {this.ty=data;},this))
		
		this.lastPoint -= 10;
		if (this.lastPoint < 0)
			this.lastPoint = 0;
	}

    this.draw = function () {
    // here is the centering code!
	if (this.interpolators[7])
		if (this.interpolators[7].complete)
			this.zooming = false;
	if (this.zooming)
		this.center(this.sx,this.sy);
    //if (this.interpolators[7] && this.interpolators[7].complete == false)
	var ctx = html5.context;
	ctx.save();
	ctx.translate (this.tx*this.sx,this.ty*this.sy);
	ctx.scale (1,-1);

	ctx.lineWidth = 0.5;

	var ay = this.calcAverage();
	var sdy = this.calcStdDeviation(ay);

	var sdyb = ay-sdy;
	var sdyo = ay+sdy;

	var sdyb2 = ay-sdy*2;
	var sdyo2 = ay+sdy*2;

	if (this.gridSize[0]*this.sx < 20) {
		this.gridSize[0] *= 10;
		this.gridSize[1] *= 10;
	}

	if (this.gridSize[0]*this.sx > 100) {
		this.gridSize[0] /= 10;
		this.gridSize[1] /= 10;
	}

	if (this.newPoint) {
		this.newPoint = false;
		this.interpolators[0] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.sdyb,sdyb],
									  						   html5.hitch(function (data) {this.sdyb=data;},this));
		this.interpolators[1] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.sdyo,sdyo],
									  						   html5.hitch(function (data) {this.sdyo=data;},this))
		this.interpolators[2] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.ay,ay],
									  						   html5.hitch(function (data) {this.ay=data;},this))
		this.interpolators[3] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.sdyb2,sdyb2],
									  						   html5.hitch(function (data) {this.sdyb2=data;},this));
		this.interpolators[4] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.sdyo2,sdyo2],
									  						   html5.hitch(function (data) {this.sdyo2=data;},this))
		if (!this.scrollLock)
				this.interpolators[5] = new linearInterpolator([html5.t,html5.t+0.5],
									  						   [this.tx,(2*html5.canvas.width/(3*this.sx)-this.points[this.points.length-1].x)],
									  						   html5.hitch(function (data) {this.tx=data;},this))
		//this.interpolators[6] = new linearInterpolator([html5.t,html5.t+0.5],
		//							  						   [this.ty,(2*html5.canvas.height/(3*this.sy))],
		//							  						   html5.hitch(function (data) {this.ty=data;},this))
	}

	ctx.strokeStyle = "rgba(0,0,255, 0.5)";
	ctx.beginPath();

	ctx.save();
	// Standard Deviation
	ctx.moveTo(-this.tx*this.sx, this.sdyb*this.sy);
	ctx.lineTo((html5.canvas.width-this.tx*this.sx), this.sdyb*this.sy);

	ctx.moveTo(-this.tx*this.sx, this.sdyo*this.sy);
	ctx.lineTo((html5.canvas.width-this.tx*this.sx), this.sdyo*this.sy);

	// 2 Standard Deviation
	ctx.moveTo(-this.tx*this.sx, this.sdyb2*this.sy);
	ctx.lineTo((html5.canvas.width-this.tx*this.sx), this.sdyb2*this.sy);

	ctx.moveTo(-this.tx*this.sx, this.sdyo2*this.sy);
	ctx.lineTo((html5.canvas.width-this.tx*this.sx), this.sdyo2*this.sy);

	ctx.stroke();
	ctx.restore();

	ctx.fillStyle = "rgba(255,128,0,0.2)";
	ctx.beginPath();

	// 2 Std. Devi. Rect
	ctx.rect (-this.tx*this.sx, this.sdyo2*this.sy,
		  html5.canvas.width, (this.sdyb2-this.sdyo2)*this.sy);

	ctx.fill();

	ctx.fillStyle = "rgba(0,255,0,0.2)";
	ctx.beginPath();

	// Std Devi. Rect
	ctx.rect (-this.tx*this.sx, this.sdyo*this.sy,
		  html5.canvas.width, (this.sdyb-this.sdyo)*this.sy);

	ctx.fill();

	ctx.fillStyle = "rgb(0,0,0)";

	this.drawGrid(this.gridSize[0],this.gridSize[1],true,this.smallGridColor);
	this.drawGrid(this.gridSize[0]*10,this.gridSize[1]*10,false,this.bigGridColor);

	var p;
	var sel=true;
	for (p=this.lastPoint;p<this.points.length;p++) {
		if ((this.points[p].x*this.sx+this.tx*this.sx > 0) && sel) {
			this.lastPoint = p;
			sel = false;
		}

		ctx.beginPath();
	    ctx.arc (this.points[p].x*this.sx,this.points[p].y*this.sy, 2, 0, 2*Math.PI, false);
		ctx.fill();
	}


	ctx.strokeStyle = "rgba(255,0,0, 0.6)";
	ctx.beginPath();
	
	// Average
	ctx.moveTo(-this.tx*this.sx, this.ay*this.sy);
	ctx.lineTo((html5.canvas.width-this.tx*this.sx),  this.ay*this.sy);
	ctx.lineWidth = 2;

	ctx.stroke();

	var i;
	for (i in this.interpolators)
		this.interpolators[i].interpolate(html5.t);
    
	ctx.restore();

	ctx.fillStyle = this.smallGridColor;
	// Draw scale of the grids
	ctx.save();
		ctx.translate(html5.canvas.width,html5.canvas.height);
		ctx.scale(1,1);
		ctx.fillText("X: "+this.gridSize[0],-100,-100);
	ctx.restore();
    }

    this.drawGrid = function (gx,gy,drawNumbers,color) {
		var ctx = html5.context;
		ctx.strokeStyle = color;
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.font = "normal 10px sans-serif";

		ctx.beginPath();

		// Y axis
		ctx.moveTo(0,this.ty*this.sy);
		ctx.lineTo(0,(-html5.canvas.height+this.ty*this.sy));

		var F = -this.tx*this.sx+this.tx*this.sx%(gx*this.sx);
		var E = -this.tx*this.sx+html5.canvas.width;

		while (F < E) {
			if (drawNumbers) {
				ctx.save();
					ctx.translate(F,this.ty*this.sy);
					ctx.scale(1,-1);
					ctx.fillText(""+Math.floor(F/this.sx),0,10);
				ctx.restore();
			}

			ctx.moveTo(F,this.ty*this.sy);			
			ctx.lineTo(F,(-html5.canvas.height+this.ty*this.sy));		
			F += gx*this.sx;
		}

		// X axis
		ctx.moveTo(-this.tx*this.sx,0);
		ctx.lineTo((html5.canvas.width-this.tx*this.sx),0);

		var F = -this.ty*this.sy+this.ty*this.sy%(gy*this.sy);
		var E = -this.ty*this.sy+html5.canvas.height;

		while (F < E) {
			if (drawNumbers) {
				ctx.save();			
					ctx.translate(-this.tx*this.sx,-F);
					ctx.scale(1,-1);
					if (this.zooming)
						ctx.fillText(""+Math.floor(-F/this.sy),5,10);
					else
						ctx.fillText(""+(-F/this.sy),5,10);
				ctx.restore();
			}

			ctx.moveTo(-this.tx*this.sx,-F);
			ctx.lineTo((html5.canvas.width-this.tx*this.sx),-F);
			F += gy*this.sy;
		}

		ctx.stroke();
		ctx.fillStyle = "rgb(0,255,0)"
    }

    this.calcAverage = function () {
		var l = this.pointsNumber;
		var p;
		var s=0;
		p=this.points.length-l;
		if (p < 0) {
			l += p;
			p = 0;
		}
		for (;p<this.points.length;p++) {
		    s += this.points[p].y;
		}
		
		return s/l;
    }

    // Av is the average
    this.calcStdDeviation = function (av) {
		var l = this.pointsNumber;
		var p;
		var s=0;
		p=this.points.length-l;
		if (p < 0) {
			l += p;
			p = 0;
		}
		for (;p<this.points.length;p++) {
		    s += Math.pow((this.points[p].y-av),2);
		}

		return Math.sqrt(s/(l-1));
    }

    this.addPoint = function (p) {
    	this.points.push(p);
    	this.newPoint = true;
    }
}
