class Invite extends BaseScene implements eui.UIComponent {
	public i_p1: eui.Image;
	public i_p2: eui.Image;
	public i_vs: eui.Image;
	public btn_invite_friend: eui.Image;
	public btn_back: eui.Image;
	public t_p1: eui.Label;
	public t_p2: eui.Label;
	public t_tips: eui.Label;
	public password: eui.Label;

	private isStart: boolean = false;
	private isFromInvite: boolean = false;
	private timer_wait = 0;
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	public getPassWord(): string {
		return (this.password.text && this.password.text.length > 0) ? this.password.text : this.password.text;
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		this.password.text = Math.floor((Math.random() * 1000000) + 1) + "";//生成随机短号
		this.isLaunchFromInvite();

	}
	private isLaunchFromInvite() {
		var isFromShare = GameData.query;
		if (isFromShare && JSON.stringify(isFromShare) != "{}") {
			this.password.text = isFromShare ? GameData.query.password : this.password.text;
			this.isFromInvite = true;
			Toast.show("约战成功,正在进入房间:" + this.password.text);
		} else {
			console.log('[INFO] wx.share.query is null');
			GameData.query = {};
		}
		this.joinRoomWithPassWord();
	}

	public joinRoomWithPassWord() {
		var maxPlayer = 2;
		var mode = 0;
		var canwatch = 1;
		let userProfile = GameData.userName + "";

		var tags = { key: this.getPassWord() };
		var matchinfo = new MsMatchInfo(maxPlayer, mode, canwatch, tags);

		let result = MvsManager.getInstance().joinRoomWithProperties(matchinfo, userProfile);
		if (result != 0) {
			Toast.show("已经进入了房间,请先退出 ");
		}
	}
	public mvsBind() {
		MvsManager.response.joinRoomResponse = this.mvsJoinRoomResponse.bind(this);
		MvsManager.response.joinRoomNotify = this.mvsJoinRoomNotify.bind(this);
		MvsManager.response.leaveRoomNotify = this.mvsLeaveRoomNotify.bind(this);
	}

	public mvsUnBind() {
		MvsManager.response.joinRoomResponse = null;
		MvsManager.response.joinRoomNotify = null;
		MvsManager.response.joinOverResponse = null;
		MvsManager.response.getRoomListExResponse = null;
	}
	public mvsJoinRoomNotify(userInfo): void {
		console.log('[room join notify]: ' + JSON.stringify(userInfo));
		GameData.setType(Number(userInfo.userId));
		GameData.initPlayer(GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
		GameData.initPlayer(GameData.p2, GameData.userName, GameData.userId, GameData.avatarUrl);
		this.startGame(false);
	}
	public mvsLeaveRoomNotify(leaveRoomInfo) {
		let lUserId = leaveRoomInfo.userId;
		Toast.show(lUserId + "离开了房间");
		NetWorkUtil.dispatchEvent(NetWorkUtil.LEAVE_ROOM_NOTIFY);
	}
	public mvsJoinRoomResponse(status, userInfoList, roomInfo): void {
		if (NetWorkUtil.checkStatsEeception(status)) {
			return;
		}
		console.log('[room join rsp]: ' + JSON.stringify(userInfoList));
		GameData.roomId = roomInfo.roomId || roomInfo.roomID;
		if (userInfoList && userInfoList.length > 0) {
			var userInfo = userInfoList[0];
			//再前2个人之后进入房间的用户为观战者
			GameData.setType(userInfoList.length > 1 ? -1 : Number(userInfo.userId));
			GameData.initPlayer(GameData.p1, GameData.userName, GameData.userId, GameData.avatarUrl);
			GameData.initPlayer(GameData.p2, GameData.userName, GameData.userId, GameData.avatarUrl);
			this.t_p2.text = userInfo.userId == GameData.userId ? userInfoList[1].userId : userInfo.userId;
			this.startGame(false);
		} else if (userInfoList && userInfoList.length <= 0) {
			if (this.isFromInvite) {
				Toast.show("房间已经解散");
				SceneManager.back();
			} else {
				Toast.show("创建房间成功,去邀请好友");
				this.t_p1.text = GameData.userName;
			}
		}
	}

	public joinOver() {
		MvsManager.getInstance().joinOver("");
	}

	public startGame(isSingleModel, delay?: number, isLive?: boolean) {
		if (this.isStart) {
			return;
		}
		var delay1 = delay ? delay : 1000;
		Toast.show("匹配成功，" + (delay1 / 1000) + "秒后开始游戏");
		this.isStart = true;

		Delay.run(function () {

			SceneManager.back();
			SceneManager.showScene(Game, { "isSingleModel": (isSingleModel ? isSingleModel : false), "isLive": (isLive ? isLive : false) });
			this.joinOver();
			this.isStart = false;
		}.bind(this), delay1);
	}
	protected onHide() {
		this.timer_wait && clearInterval(this.timer_wait);
		GameData.query = {};
		this.mvsUnBind();

	}
	protected onShow() {
		this.mvsBind();
	}
	public onClick(name: string, v: egret.DisplayObject) {
		switch (v) {
			case this.btn_invite_friend:
				together("等你来战斗" + this.getPassWord(), "password=" + this.getPassWord());
				this.timer_wait && clearInterval(this.timer_wait);
				var t = 0;
				this.timer_wait = setInterval(function () {
					this.t_tips.text = "已经等待 " + (++t) + " s"
				}.bind(this), 1000);
				break;

			case this.btn_back:
				MvsManager.getInstance().leaveRoom("");
				SceneManager.back();
				break;
		}
	}

}