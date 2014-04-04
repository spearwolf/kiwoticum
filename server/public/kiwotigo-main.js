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
			canvas.style.width = (100/dpr) + '%';
			canvas.style.height = (100/dpr) + '%';
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

	function DrawRegions(ctx, regions) {
		//ctx.strokeStyle = '#000000';
		//ctx.fillStyle = '#d0f0ff';
		ctx.strokeStyle = '#000'; 
		ctx.fillStyle = '#88C425';
		ctx.lineWidth = 1;

		DrawPath(ctx, regions, 'fullPath', true);

		//ctx.fillStyle = '#c0e0ee';
		ctx.fillStyle = '#519548'; //'#BEF202';

		DrawPath(ctx, regions, 'basePath');
	}

	GetJson('/api/v1/create', function(data){
		console.log('loaded data', data);

		var ctx = CreateCanvas(data.width, data.height);
		console.log('canvas created', ctx.canvas);

		ClearCanvas(ctx);
		DrawRegions(ctx, data.regions);

		ctx.font = 'normal 24px Verdana';
		ctx.fillStyle = '#fffff0';
		for (var i = 0; i < data.centerPoints.length; i++) {
			ctx.fillText(i+'', data.centerPoints[i].x-12, data.centerPoints[i].y+12);
		}
	});

})(window);
