class ListViewImageItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	private labelDisplay: eui.Label;
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);

		instance.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e:egret.Event) {
			console.log('this.data: '+ JSON.stringify(this.data) );
			MvsManager.getInstance().joinRoom(this.data.label, GameData.userName);
		}, this);

	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}
	protected dataChanged(): void {
		this.labelDisplay.text = this.data.label;
		// console.log('[INFO] dataChanged:' + this.data.label);
	}
}