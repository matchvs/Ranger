class ListViewImageItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	private labelDisplay: eui.Label;
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);

		instance.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.Event) {
			console.log('this.data: ' + JSON.stringify(this.data));
			if ("watch" == e.target.name) {
				
				try {
					MvsManager.getInstance().joinLiveRoom(this.data.label, GameData.userName);
					Toast.show("去观战");
				} catch (error) {
					Toast.show("error:"+error);
					Lobby.instance.mvsJoinLiveRoomResponse(null,null,null);
				}
			} else {
				MvsManager.getInstance().joinRoom(this.data.label, GameData.userName);
			}
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