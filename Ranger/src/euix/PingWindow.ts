class PingWindow {
	private v ;
	public toggle() {
		this.v.visible = !this.v.visible;
	}

	private width: number = 720;
	private hight: number = 720;
	private pings = [0];
	private padding = 40;
	private uint = 20;
	public init(w, h) {
		w && (this.width = w)
		h && (this.hight = h)
		var v = new eui.Group();
		v.width = w;
		v.height = h;
		this.v = v;
		// v.setContentSize(1280, 720);

		var shp: egret.Shape = new egret.Shape();
		shp.x = 40;
		shp.y = 40;
		v.addChild(shp);


		shp.graphics.lineStyle(4, 0xaa1111);
		shp.graphics.moveTo(0, 0)
		shp.graphics.lineTo(0, h);
		shp.graphics.moveTo(0, 0)
		shp.graphics.lineTo(w, 0);

		for (var i = 0; i * this.uint < h; i++) {
			shp.graphics.lineStyle(1, 0x333333);
			shp.graphics.moveTo(0, i * this.uint);
			shp.graphics.lineTo(w, i * this.uint);

			var label: egret.TextField = new egret.TextField();
			label.text = (i == 0) ? "ms" : (i * this.uint + "");
			label.size = 14;
			label.x = 5;
			label.y = 40 + i * this.uint;

			v.addChild(label);
		}

		var table: egret.Shape = new egret.Shape();
		var startTime = new Date().getTime();
		table.graphics.lineStyle(2, 0x11aa11);
		table.graphics.moveTo(0, 0);
		table.x = 40;
		table.y = 40;
		v.addChild(table);
		setInterval(function () {
			var ping = this.pings[0];
			table.graphics.clear();
			table.graphics.lineStyle(4, 0x11aa11);
			table.graphics.moveTo(0, this.pings[0]);
			for (var i = 0; i < this.pings.length; i++) {
				var ping = this.pings[i];
				if (ping > this.padding * 10) {
					table.graphics.lineStyle(4, 0xaa1111);
					table.graphics.lineTo(i * this.padding, ping);
					table.graphics.lineStyle(4, 0x11aa11);
				} else {
					table.graphics.lineTo(i * this.padding, ping);
				}
			}
		}.bind(this), 100);
		return v;
	}
	public update(ping: number) {
		console.log('[INFO] ping:'+ping);
		this.pings.unshift(ping);
		while (this.pings.length > (this.width / this.padding)) {
			this.pings.pop();
		}
	}
}