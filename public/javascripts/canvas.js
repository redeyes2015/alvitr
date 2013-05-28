(function(window){
	var $ = window.jQuery;
	var document = window.document;

	var imageGetter = function(src){
		var deferred = $.Deferred(),
			img = new Image();

		img.onload = function(){
			deferred.resolve(img);
			deferred = img = null;
		};
		img.src = src;

		setTimeout(function(){
			console.log("WARN: getting image failed: " + src);
		}, 10000);

		return deferred.promise();
	};

	var BackgroundGetter = function(src) {
		return imageGetter(src);
	};

	var IconGetter = function(MID) {
		MID = '' + MID;

		if (MID.length < 2) {
			MID = '00' + MID;
		} else if (MID.length < 3) {
			MID = '0' + MID;
		}

		return imageGetter('/images/' + MID + 'i.png');
	};

	var getIconAndDraw = function(id, canvas_ctx, x, y, rate) {
		var d = $.Deferred();
		if (rate == null) {
			rate = 1;
		}
		IconGetter(id).then(function(img) {
			canvas_ctx.drawImage(img, x, y, img.width * rate, img.height * rate);
			console.log('icon #' + id, ' painted');
			d.resolve();
		});
		return d.promise();
	};

	function render(params, cb) {
		var w = 600;
		var h = 100;

		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			queue = [];

		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);

		BackgroundGetter('/images/ws.png').then(function(bg_img) {
			ctx.drawImage(bg_img, 0, 150, w, h, 0, 0, w, h);

			var lingrad = ctx.createLinearGradient(0, 0, 0, h);

			lingrad.addColorStop(0, "rgba(0, 0, 0, 1)");
			lingrad.addColorStop(0.15, "rgba(0, 0, 0, 0.2)");
			lingrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
			lingrad.addColorStop(0.85, "rgba(0, 0, 0, 0.2)");
			//if ('background' in params) {
			if(true) {
				lingrad.addColorStop(1, 'silver');
			}
			else {
				lingrad.addColorStop(1, "rgba(0, 0, 0, 1)");
			}

			ctx.fillStyle = lingrad;
			ctx.fillRect(0, 0, w, h);

			var horizontal_rad = ctx.createLinearGradient(0, 0, w, 0);
			horizontal_rad.addColorStop(0, "rgba(0, 0, 0, 1)");
			horizontal_rad.addColorStop(0.35, "rgba(0, 0, 0, 0.2)");
			horizontal_rad.addColorStop(0.65, "rgba(0, 0, 0, 0)");
			horizontal_rad.addColorStop(0.9, "rgba(0, 0, 0, 0.2)");
			horizontal_rad.addColorStop(1, "rgba(0, 0, 0, 1)");

			ctx.fillStyle = horizontal_rad;
			ctx.fillRect(0, 0, w, h);

			if ('name' in params) {
				ctx.fillStyle = '#fff';
				ctx.font = 'bold 35px Calibri';
				ctx.textBaseline = 'top';
				ctx.fillText(params.name, 120, 0);
			}

			if ('id' in params) {
				ctx.fillStyle = '#0186d1';
				ctx.font = 'bold 25px Calibri';
				ctx.textBaseline = 'top';
				ctx.fillText(params.id, w - 120, 0);
			}

			if ('rank' in params) {
				ctx.fillStyle = 'gold';
				ctx.font = 'bold 15px Calibri';
				ctx.textBaseline = 'top';
				ctx.fillText('Rank: ' + params.rank, w - 100, 50);
			}

			if ('friend' in params) {
				ctx.fillStyle = 'silver';
				ctx.font = 'bold 15px Calibri';
				ctx.textBaseline = 'top';
				ctx.fillText('Friends:' + params.friend, w - 100, 65);
			}

			if ('character' in params &&
			params.character !== '') {
				queue.push(getIconAndDraw(params.character, ctx, 0, 0, 1));
			}

			if ('leaders' in params) {
				if (Object.prototype.toString.call( params.leaders ) !== '[object Array]') {
					params.leaders = [params.leaders];
				}
				params.leaders.forEach(function(mid, index) {
					queue.push(getIconAndDraw(mid, ctx, 120 + index * 50, 50, 0.5));
				});
			}

			console.log('queue.length: ', queue.length);
			if (queue.length < 1) {
				console.log('no waiting');
				cb(canvas);
			}
			else {
				console.log('wait for fetching icons', queue.length);
				$.when.apply($, queue).then(function(){
					cb(canvas);
				});
			}
		});
	}

	function myparse(str){
		try {
			return JSON.parse(str);
		}
		catch (e) {
			console.log('JSON.parse failed: ' + String(str).slice(0, 20));
		}
		return {};
	}

	function generate(params){
		var d = $.Deferred();
		render(params, function(canvas){
			d.resolve(canvas);
		});
		return d.promise();
	}

	window.renderProfile = generate;

})(this)
