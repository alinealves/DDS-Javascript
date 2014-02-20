function linearInterpolator (x,y,cb) {
	if (x === undefined)
		this.x = [];
	else
		this.x = x;

	if (y === undefined)
		this.y = [];
	else
		this.y = y;

	this.cb = cb;

	this.complete = false;

	this.interpolate = function (x) {
		this.complete = true;

		if (x <= this.x[0]) {
			this.cb(this.y[0]);
			return;
		}
		else if (x > this.x[1]) {
			this.cb(this.y[1]);
			return;
		}
	
		this.complete = false;

		this.cb(this.y[0]+(this.y[1]-this.y[0])*(x-this.x[0])/(this.x[1]-this.x[0]));
	}
}