class Lobby extends BaseScene implements eui.UIComponent {
	public timerView: TimerView;
	private nickname;
	private avator;
	private roomList: eui.List;
	private room: eui.Group;
	private roomstate: eui.Group;
	private p1name: eui.Label;
	private sourceArr: any[] = [{ label: "1" }];
	private loopReqRoomListTimer;
	public constructor() {
		super();

	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected onHide() {
		this.timerView.stop();
		console.log("hide");
		this.mvsUnBind();
		if (!this.loopReqRoomListTimer) {
			clearInterval(this.loopReqRoomListTimer);
			this.loopReqRoomListTimer = null;
		}
	}



	public mvsBind() {
		MvsManager.response.joinRoomResponse = this.mvsJoinRoomResponse.bind(this);
		MvsManager.response.joinRoomNotify = this.mvsJoinRoomNotify.bind(this);
		MvsManager.response.leaveRoomNotify = this.mvsLeaveRoomNotify.bind(this);
		MvsManager.response.getRoomListExResponse = this.mvsGetRoomListResponse.bind(this);
	}

	public mvsUnBind() {
		MvsManager.response.joinRoomResponse = null;
		MvsManager.response.joinRoomNotify = null;
		MvsManager.response.joinOverResponse = null;
		MvsManager.response.getRoomListExResponse = null;
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.timerView = new TimerView(this.findChild("dialog_waitingmatch"),
			this.findChild("waigtingtime001"),
			this.findChild("waigtingtime010"),
			this.findChild("waigtingtime100"))
		this.nickname = this.findChild("nickname");
		this.nickname.text = GameData.userName;
		this.avator = this.findChild("avator");
		this.roomList = <eui.List>this.findChild("roomList");
		ListViewUtil.initListView(this.room, this.roomList, this.sourceArr, ListViewImageItem);

	}
	protected onShow() {
		this.mvsBind();
	}
	public joinRoomRandom() {
		console.log('[room join random]: ' + this.nickname.text);
		MvsManager.getInstance().joinRandomRoom(2, this.nickname.text);
	}
	public mvsJoinRoomNotify(userInfo): void {
		console.log('[room join notify]: ' + JSON.stringify(userInfo));

		GameData.setType(Number(userInfo.userId));
		GameData.initPlayer(GameData.type, GameData.userName, GameData.userId, GameData.avatarUrl);
		GameData.initPlayer(GameData.type === GameData.p1 ? GameData.p2 : GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
		this.startGame(false);
	}
	public mvsJoinRoomResponse(status, userInfoList, roomInfo): void {
		if (NetWorkUtil.checkStatsEeception(status)) {
			return;
		}
		console.log('[room join rsp]: ' + JSON.stringify(userInfoList));
		GameData.roomId = roomInfo.roomId || roomInfo.roomID;
		if (userInfoList && userInfoList.length > 0) {
			Toast.show("匹配成功,游戏开始");
			var userInfo = userInfoList[0];
			GameData.setType(Number(userInfo.userId));
			GameData.initPlayer(GameData.type, GameData.userName, GameData.userId, GameData.avatarUrl);
			GameData.initPlayer(GameData.type === GameData.p1 ? GameData.p2 : GameData.p1, GameData.userName, GameData.userId, userInfo.avatarUrl || GameData.avatarUrl);
			this.startGame(false);
			this.roomstate.visible = false;
		} else {
			if (this.roomstate.visible == true) {
				Toast.show("创建房间成功,等待其他玩家加入");
				this.p1name.text = GameData.userName;
			}
		}
	}

	public joinOver() {
		MvsManager.getInstance().joinOver("");
	}

	public startGame(isSingleModel) {
		this.joinOver();
		Toast.show("匹配成功，开始游戏");

		Delay.run(function () {
			this.timerView.stop();
			SceneManager.showScene(Game, { "isSingleModel": isSingleModel ? isSingleModel : false });
		}.bind(this), 500);

	}

	public mvsLeaveRoomNotify(leaveRoomInfo) {
		let lUserId = leaveRoomInfo.userId;
		Toast.show(lUserId + "离开了房间");
	}

	private loadAvatar(url: any) {
		let imageLoader: egret.ImageLoader = new egret.ImageLoader();
		imageLoader.crossOrigin = "anonymous";
		imageLoader.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) {
			let imageLoader = <egret.ImageLoader>event.currentTarget;
			let texture = new egret.Texture();
			texture._setBitmapData(imageLoader.data);
			this.avatarBmp = new egret.Bitmap(texture);
			this.avatarBmp.width = 100;
			this.avatarBmp.height = 100;
			this.avator.addChild(this.avatarBmp);
		}, this);
		imageLoader.load(url);
	}


	public getRoomList() {

		let result = MvsManager.getInstance().getRoomList(new MsRoomFilter(2, 0, 0, ""));

	}

	public mvsGetRoomListResponse(roomListExInfo) {
		ArrayUtil.clear(this.sourceArr);
		for (var i = 0; i < roomListExInfo.roomAttrs.length; i++) {

			this.sourceArr.push({ label: roomListExInfo.roomAttrs[i].roomID });
		}
		(<any>this.roomList.dataProvider).refresh();
	}

	public onClick(name: string, v: egret.DisplayObject) {
		let stack: any;

		var loopReqRoomListFunc = function () {
			this.getRoomList();
		}.bind(this);
		switch (name) {
			case "back":
				SceneManager.back();
				break;
			case "start":
				Toast.show("再等一人,自动开始");
				break;
			case "creatroom":
				stack = this.findChild("stack");
				stack.selectedIndex = 1;
				let createInfo = new MsCreateRoomInfo("roomName", 2, 0, 0, 1, "");
				let userProfile = GameData.userName;
				let result = MvsManager.getInstance().createRoom(createInfo, userProfile);
				if (result != 0) {
					Toast.show("已经创建了房间");
				}
				// this.room.visible = true;
				// if (!this.loopReqRoomListTimer) {
				// 	this.loopReqRoomListTimer = setInterval(loopReqRoomListFunc, 2000);
				// }
				this.roomstate.visible = true;
				break;
			case "joinroom":
				stack = this.findChild("stack");
				stack.selectedIndex = 1;
				this.getRoomList();
				this.room.visible = true;
				if (!this.loopReqRoomListTimer) {
					loopReqRoomListFunc();
					this.loopReqRoomListTimer = setInterval(loopReqRoomListFunc, 3000);
				}
				break;
			case "leave":
				stack = this.findChild("stack");
				stack.selectedIndex = 0;
				this.room.visible = false;
				this.roomstate.visible = false;
				MvsManager.getInstance().leaveRoom("");
				clearInterval(this.loopReqRoomListTimer);
				this.loopReqRoomListTimer = null;
				break;
			case "match":
				this.timerView.start();
				this.joinRoomRandom();
				break;
			case "cancelwaiting":
				this.timerView.stop();
				MvsManager.getInstance().leaveRoom("cancle");
				break;
		}
		return true;
	}

}