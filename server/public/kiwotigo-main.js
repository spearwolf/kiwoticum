(function(root){

	console.log('hello from kiwotigo :-)');

	function GetJson(url, fn) {
		var req = new XMLHttpRequest;
		req.open('GET', url, true);
		req.onload = function() {
			if (req.status >= 200 && req.status < 400){
				fn(JSON.parse(req.responseText));
			} else {
				console.log('ERROR', req);
			}
		}
		req.onerror = function(){
			console.log('ERROR', req);
		}
		req.send();
	}

	function CreateCanvas(width, height) {
		var canvas = document.createElement('canvas')
		  , ctx = canvas.getContext('2d')
		  ;
		canvas.width = width;
		canvas.height = height;
		document.getElementById('main').appendChild(canvas);
		var dpr = window.devicePixelRatio;
		if (typeof dpr === 'number') {
			canvas.style.width = Math.round(width/dpr) + 'px';
			canvas.style.height = Math.round(height/dpr) + 'px';
		}
		return ctx;
	}

	function ClearCanvas(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	function DrawPath(ctx, regions, pathName, stroke) {
		var i, path, j;
		for (i = 0; i < regions.length; i++) {
			path = regions[i][pathName];

			ctx.beginPath();
			ctx.moveTo(path[0].x, path[0].y);
			for (j = 1; j < path.length; j++) {
				ctx.lineTo(path[j].x, path[j].y);
			}
			ctx.closePath();

			ctx.fill();
			if (stroke) {
				ctx.stroke();
			}
		}
	}

	function DrawRegions(ctx, regions, drawBasePath) {
		//ctx.strokeStyle = '#000000';
		//ctx.fillStyle = '#d0f0ff';
		ctx.strokeStyle = "#333333"; //'#246';
        ctx.fillStyle = '#9BCB3C'; // '#88C425';
		ctx.lineWidth = window.devicePixelRatio||1;

		DrawPath(ctx, regions, 'fullPath', true);

		if (drawBasePath) {
			//ctx.fillStyle = '#c0e0ee';
			ctx.fillStyle = '#61A548'; //'#BEF202';

			DrawPath(ctx, regions, 'basePath');
		}
	}

	function DrawRegionsBase(ctx, data) {
		ctx.fillStyle = 'rgba(239, 246, 105, 0.5)';
		ctx.lineWidth = 1;

		var i, j, p0;
		for (i = 0; i < data.regions.length; i++) {
			cp = data.centerPoints[i];

			ctx.beginPath();
			ctx.arc(cp.x, cp.y, cp.iR, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.arc(cp.x, cp.y, cp.oR, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.stroke();
		}
	}

	function DrawRegionsConnections(ctx, data) {
        ctx.strokeStyle = "#CF3333"; // "rgba(255, 0, 128, 0.5)";
		ctx.lineWidth = 2 * (window.devicePixelRatio||1);

		var i, j, p0, p1;
		for (i = 0; i < data.neighbors.length; i++) {
			p0 = data.centerPoints[i];
			for (j = 0; j < data.neighbors[i].length; j++) {
				p1 = data.centerPoints[data.neighbors[i][j]];
				ctx.beginPath();
				ctx.moveTo(p0.x, p0.y);
				ctx.lineTo(p1.x, p1.y)
				ctx.closePath();
				ctx.stroke();
			}
		}
	}

	function DrawRegionIds(ctx, data) {
		ctx.font = 'normal 24px Verdana';
		ctx.shadowColor = "#000";
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowBlur = 2;
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#fffff0';

		for (var i = 0; i < data.centerPoints.length; i++) {
			ctx.fillText(i+'', data.centerPoints[i].x, data.centerPoints[i].y);
		}
	}

	GetJson('/api/v1/create', function(data){
		console.log('loaded data', data);

        var continent = data.continent;
		var ctx = CreateCanvas(continent.width, continent.height);

		console.log('canvas created', ctx.canvas);

		ClearCanvas(ctx);
		DrawRegions(ctx, continent.regions, false);
		DrawRegionsBase(ctx, continent);
		DrawRegionsConnections(ctx, continent);
		DrawRegionIds(ctx, continent);
	});

})(window);
