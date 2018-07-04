class Enemy extends BaseScene implements eui.UIComponent {
	public constructor() {
		super();
	}
	private sp: StarlingSwfMovieClip;
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
		this.sp = StarlingSwfFactory.getInstance().makeMc("honglang");

	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public onClick(name: string, v: egret.DisplayObject) {
		console.log("No Handler for  click " + name);
		this.sp.goToPlay("run");
		this.addChild(this.sp);
	}
}