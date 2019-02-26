class Lobby extends BaseScene implements eui.UIComponent {
	public timerView: TimerView;
	private nickname;
	private avator: eui.Image;
	private roomList: eui.List;
	private room: eui.Group;
	private roomstate: eui.Group;
	private p1name: eui.Label;
	private isStart = false;
	// private sourceArr: any[] = [{ label: "1" }];
	private sourceArr: any[] = [];
	public static instance;
	private loopReqRoomListTimer;



	public stack: eui.ViewStack;
	public randomviewgroup: eui.Group;
	public match: eui.Button;
	public creatroom: eui.Button;
	public joinroom: eui.Button;
	public password: eui.TextInput;
	public btn_invite: eui.Image;
	public createviewgroup: eui.Group;
	public start: eui.Button;
	public leave: eui.Button;
	public back: eui.Button;
	public dialog_waitingmatch: eui.Group;
	public waigtingtime010: eui.Image;
	public waigtingtime100: eui.Image;
	public waigtingtime001: eui.Image;
	public cancelwaiting: eui.Button;
	public roomShortID: eui.TextInput;
	public joinRoomWithID: eui.Button;
	public invite: eui.Button;



	public constructor() {
		super();
		Lobby.instance = this;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}




	public mvsBind() {
		MvsManager.response.joinRoomResponse = this.mvsJoinRoomResponse.bind(this);
		MvsManager.response.joinWatchRoomResponse = this.mvsJoinLiveRoomResponse.bind(this);
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
		this.avator = <eui.Image>this.findChild("avator");
		this.roomList = <eui.List>this.findChild("roomList");
		ListViewUtil.initListView(this.room, this.roomList, this.sourceArr, ListViewImageItem);


		this.password.text = Math.floor((Math.random() * 1000000) + 1) + "";//生成随机短号


		try {
			getWxUserInfo(function (userinfo) {
				try {
					this.nickname.text = userinfo.nickName;
					this.loadAvatar(userinfo.avatarUrl);
					console.log("get wx.userinfo success ", JSON.stringify(userinfo));
					window["mta"].Event.stat("user", { 'auth': 'ok' });
				} catch (error) {
					console.warn('[WARN] fail,get wx.userinfo,' + JSON.stringify(error));
					window["mta"].Event.stat("user", { 'auth': ("exception:" + JSON.stringify(error)) });
				}
			}.bind(this));
		} catch (error) {
			console.log('[INFO] e' + error);
		}
		// getWxShareInfo(GameData.shareTicket, function (res) {
		// 	console.log('[INFO] getWxShareInfo res:' + JSON.stringify(res));
		// });
		this.isLuancherFromInvate();

	}
	private isLuancherFromInvate() {
		if (window["wx"]) {
			var options = getLaunchOptionsSync();
			if (options && JSON.stringify(options.query) != "{}") {
				// GameData.query = options.query;
				Toast.show("从微信邀请启动");
				SceneManager.showScene(Invite, options.query);
			}
			// console.log("GameData.query :" + GameData.query + " tosjon:" + JSON.stringify(GameData.query));
		}
	}

	private onWXShow = function (key, res) {
		SceneManager.showScene(Invite, res);
	}.bind(this);



	protected onShow() {
		this.mvsBind();
		NetWorkUtil.instance.addEventListener(this.onWXShow, "showFromInvite");
	}
	protected onHide() {
		this.timerView.stop();
		console.log("hide");
		this.mvsUnBind();
		if (this.loopReqRoomListTimer) {
			clearInterval(this.loopReqRoomListTimer);
			this.loopReqRoomListTimer = null;
		}
		NetWorkUtil.instance.removeEventListener(this.onWXShow, "showFromInvite");
	}

	public joinRoomRandom() {
		console.log('[room join random]: ' + this.nickname.text);
		MvsManager.getInstance().joinRandomRoom(GameData.MAX_PLAYER, this.nickname.text);
		setTimeout(function () {
			MvsManager.getInstance().leaveRoom("");
			Toast.show("开始单机游戏");
			Login.startSingleGame();
		}.bind(this), 3000);
	}
	public mvsJoinRoomNotify(userInfo): void {
		console.log('[room join notify]: ' + JSON.stringify(userInfo));
		GameData.setType(Number(userInfo.userId));
		GameData.initPlayer(GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
		GameData.initPlayer(GameData.p2, GameData.userName, GameData.userId, GameData.avatarUrl);
		this.startGame(false);
	}
	public mvsJoinRoomResponse(status, userInfoList, roomInfo): void {
		if (NetWorkUtil.checkStatsEeception(status)) {
			return;
		}
		console.log('[room join rsp]: ' + JSON.stringify(userInfoList));
		GameData.roomId = roomInfo.roomId || roomInfo.roomID;
		if (userInfoList && userInfoList.length > 0) {
			Toast.show("匹配成功");
			setTimeout(function () {
				var userInfo = userInfoList[0];
				//再前2个人之后进入房间的用户为观战者
				GameData.setType(userInfoList.length > 1 ? -1 : Number(userInfo.userId));
				GameData.initPlayer(GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
				GameData.initPlayer(GameData.p2, GameData.userName, GameData.userId, GameData.avatarUrl);
				this.startGame(false);
				this.roomstate.visible = false;
			}.bind(this), 1000)
		} else {
			if (this.roomstate.visible == true) {
				Toast.show("创建房间成功,等待其他玩家加入");
				this.p1name.text = GameData.userName;
			}
		}
	}
	public mvsJoinLiveRoomResponse(rsp: MVS.MsJoinWatchRoomRsp): void {
		var msg = "加入观战房间失败";
		if (rsp.status == 200) {
			msg = "加入观战房间成功";
			GameData.setType(-1);
			GameData.initPlayer(GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
			GameData.initPlayer(GameData.p2, GameData.userName, GameData.userId, GameData.avatarUrl);
			this.startGame(false, 1, true);
			this.roomstate.visible = false;
			MvsManager.getInstance().setLiveOffSet(-1);
		}
		Toast.show(msg + " errcode" + rsp.status);
	}
	public joinOver() {
		MvsManager.getInstance().joinOver("");
	}

	public startGame(isSingleModel, delay?: number, isLive?: boolean) {
		if (this.isStart) {
			return;
		}
		this.isStart = true;
		Delay.run(function () {
			this.timerView.stop();
			SceneManager.showScene(Game, { "isSingleModel": (isSingleModel ? isSingleModel : false), "isLive": (isLive ? isLive : false) });
			this.hideAllRoomView();
			this.joinOver();
			this.isStart = false;
		}.bind(this), delay ? delay : 300);
	}

	public mvsLeaveRoomNotify(leaveRoomInfo) {
		let lUserId = leaveRoomInfo.userId;
		Toast.show(lUserId + "离开了房间");
		NetWorkUtil.dispatchEvent(NetWorkUtil.LEAVE_ROOM_NOTIFY);
	}

	private loadAvatar(url: any) {
		let imageLoader: egret.ImageLoader = new egret.ImageLoader();
		imageLoader.crossOrigin = "anonymous";
		imageLoader.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) {
			let imageLoader = <egret.ImageLoader>event.currentTarget;
			let texture = new egret.Texture();
			texture._setBitmapData(imageLoader.data);
			this.avator.texture = texture;
			// this.avatarBmp = new egret.Bitmap(texture);
			// this.avatarBmp.width = 100;
			// this.avatarBmp.height = 100;
			// this.avator.addChild(this.avatarBmp);
		}, this);
		imageLoader.load(url);
	}


	public getRoomList() {

		let result = MvsManager.getInstance().getRoomList(new MsRoomFilter(8, 0, 1, ""));

	}

	public mvsGetRoomListResponse(roomListExInfo) {
		ArrayUtil.clear(this.sourceArr);
		for (var i = 0; i < roomListExInfo.roomAttrs.length; i++) {

			this.sourceArr.push({ label: roomListExInfo.roomAttrs[i].roomID });
		}
		(<any>this.roomList.dataProvider).refresh();
	}
	public hideAllRoomView() {
		var stack: any = this.findChild("stack");
		stack.selectedIndex = 0;
		this.room.visible = false;
		this.roomstate.visible = false;
		clearInterval(this.loopReqRoomListTimer);
		this.loopReqRoomListTimer = null;
	}
	public getPassWord(): string {
		return (this.roomShortID.text && this.roomShortID.text.length > 0) ? this.roomShortID.text : this.password.text;
	}
	public creatARoom() {
		var stack: any = this.findChild("stack");
		stack.selectedIndex = 1;
		let createInfo = new MsCreateRoomInfo("roomName", 8, 0, 1, 1, "");
		let userProfile = GameData.userName;
		let result = MvsManager.getInstance().createRoom(createInfo, userProfile, new MVS.MsWatchSet(100000, 4, 6000, false));
		if (result != 0) {
			Toast.show("已经创建了房间 " + createInfo.canWatch);
		} else {
			Toast.show("已经创建了房间 " + createInfo.canWatch);
		}
		this.roomstate.visible = true;

	}
	public joinRoomWithPassWord() {

		//var tags = [{title:"Matchvs"}]; //用户自定义
		var maxPlayer = 2;
		var mode = 0;
		var canwatch = 1;
		let userProfile = GameData.userName + "";

		var tags = { key: this.getPassWord() };
		var matchinfo = new MsMatchInfo(maxPlayer, mode, canwatch, tags);

		let result = MvsManager.getInstance().joinRoomWithProperties(matchinfo, userProfile);
		if (result != 0) {
			Toast.show("已经创建了房间 ");
		} else {
			Toast.show("创建房间成功 ");
			var stack: any = this.findChild("stack");
			stack.selectedIndex = 1;
			this.roomstate.visible = true;
		}
	}
	public onClick(name: string, v: egret.DisplayObject) {
		let stack: any;

		var loopReqRoomListFunc = function () {
			this.getRoomList();
		}.bind(this);
		switch (name) {
			case "back":
				SceneManager.back();
				MvsManager.getInstance().logout("");
				break;
			case "start":
				Toast.show("再等一人,自动开始");
				break;
			case "creatroom":
				this.creatARoom();
				break;
			case "joinRoomWithID":
				this.joinRoomWithPassWord();
				break;
			case "joinroom":
				stack = this.findChild("stack");
				stack.selectedIndex = 1;
				this.getRoomList();
				this.room.visible = true;
				if (this.loopReqRoomListTimer == null) {
					loopReqRoomListFunc();
					this.loopReqRoomListTimer = setInterval(loopReqRoomListFunc, 3000);
				}
				break;
			case "leave":
				this.hideAllRoomView();
				MvsManager.getInstance().leaveRoom("");
				break;
			case "match":
				this.timerView.start();
				this.joinRoomRandom();
				break;
			case "cancelwaiting":
				this.timerView.stop();
				MvsManager.getInstance().leaveRoom("cancle");
				break;
			case this.invite.name:
				together("等你来战斗" + this.getPassWord(), "password=" + this.getPassWord());
				break;
			case this.btn_invite.name:
				SceneManager.showScene(Invite);
				break;
		}
		return true;
	}

}