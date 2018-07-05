class Login extends BaseScene implements eui.UIComponent {
	private that: any = this;
	private loading: Loading;
	public constructor() {
		super();
	}
	public menuAnimation: egret.tween.TweenGroup;

	protected onCreated() {
		super.onCreated();
		this.loading = Loading.create(this);

	}

	private mvsRegisterUserResponse(data): void {
		GameData.userId = data.id;
		GameData.token = data.token;
		GameData.userName = data.id;
		GameData.avatarUrl = data.avatar;
		let result = MvsManager.getInstance().login();
		console.log("login," + new Date());
	}



	private mvsLoginResponse(data): void {
		if (NetWorkUtil.checkStatsEeception(data.status)) {
			return;
		}
		if (data.status === 200) {
			console.log('response login  ok' + data + new Date());
			Toast.show("登录成功");
			Delay.run(function () {
				SceneManager.showScene(Lobby);
				this.loading.close();
			}.bind(this), 1500);
		} else {
			this.loading.close();
			Toast.show("登录失败,服务器拒绝");
			return;
		}
	}
	private mvsInitResponse(status: number): void {
		console.log('response init ok', status);
		this.registerUser();
	}
	public mvsErrorResponse(code, errMsg) {
		if (code === 400) {

		}
		else {
			console.info('[ERROR] mvsErrorResponse', arguments);
			this.loading.close();
			Toast.show("网络异常:code: " + code + ", msg:" + errMsg);
		}
	}

	public registerUser() {
		MvsManager.getInstance().registerUser();
	}
	public mvsBind() {
		MvsManager.response.registerUserResponse = this.mvsRegisterUserResponse.bind(this);
		MvsManager.response.loginResponse = this.mvsLoginResponse.bind(this);
		MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
	}
	public onClick(name: string, v: egret.DisplayObject) {
		if (name == "login") {

			this.mvsBind();
			MvsManager.getInstance().uninit();
			MvsManager.response.initResponse = this.mvsInitResponse.bind(this);
			MvsManager.getInstance().init();
			this.loading.show();

		} else if (name == "help") {

			// GameData.setType(-1);
			GameData.type = GameData.p1;
			GameData.initPlayer(GameData.type, GameData.userName, GameData.userId, GameData.avatarUrl);

			SceneManager.showScene(Game, { "isSingleModel": true, "isShowTip": true })
		}
		return true;
	}
}