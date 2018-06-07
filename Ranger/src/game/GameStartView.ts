/**
 * Created by Administrator on 2014/10/9.
 */
class GameStartView extends egret.Sprite {
    private gameSoundPop: MusicView;
    private optionView: OptionView;
    private prompt: Prompt;
    private loading: Loading;

    constructor() {
        super();
        this.initView();

        this.mvsBind();
        Toast.initRes(this, "resource/assets/toast-bg.png");
        this.loading = Loading.create(this);
    }

    public mvsBind() {
        MvsManager.response.registerUserResponse = this.mvsRegisterUserResponse.bind(this);
        MvsManager.response.loginResponse = this.mvsLoginResponse.bind(this);
        MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
    }
    private mvsInitResponse(status: number): void {
        console.log('response init ok', status);
        this.registerUser();
    }
    public mvsErrorResponse(code, errMsg) {
        console.error('mvsErrorResponse', arguments);
        if (code === 1000) {
            GameData.isServerErrorCode1000 = true;
            this.showPromptOfError("你已掉线 请刷新 重开");
        }
        this.loading.close();
        Toast.show("请求失败,请重试");
    }

    public showPromptOfError(value) {
        this.prompt.visible = true;
        this.prompt.setValue(value);
    }

    public registerUser() {
        MvsManager.getInstance().registerUser();
    }


    private initView(): void {
        console.log("init GameStartView");
        var bg: egret.Bitmap = ResourceUtils.createBitmapByName("bgImage");
        bg.width = Const.SCENT_WIDTH;
        bg.height = Const.SCENT_HEIGHT;
        this.addChild(bg);

        var startBtn: MyButtonForGame = new MyButtonForGame("startBtnImage", "startBtnImage");

        this.addChild(startBtn);
        startBtn.x = Const.SCENT_WIDTH / 2 - startBtn.width / 2;
        startBtn.y = Const.SCENT_HEIGHT - startBtn.height - Utils.wYScale() * 50;
        startBtn.setClick(this.onStartGameHandler.bind(this));

        var music_btn: MyButtonForGame = new MyButtonForGame("musicBtnImage", "musicBtnImage");

        this.addChild(music_btn);
        music_btn.x = startBtn.x + startBtn.width + Utils.wXScale() * 10;
        music_btn.y = startBtn.y + Utils.wYScale() * 10;
        music_btn.setClick(this.showGameSoundHandler.bind(this));

        this.optionView = new OptionView(Const.IN_START_VIEW);
        this.addChild(this.optionView);
        this.optionView.visible = false;

        // prompt
        this.prompt = new Prompt();
        this.addChild(this.prompt);
        this.prompt.x = Const.SCENT_WIDTH / 2 - this.prompt.width / 2;
        this.prompt.y = Const.SCENT_HEIGHT / 2 - this.prompt.height / 2;

        this.prompt.visible = false;


        var footerView: egret.Bitmap = ResourceUtils.createBitmapByName("footer_text_white_png");
        footerView.x = Const.SCENT_WIDTH / 2 - footerView.width / 2;
        footerView.y = Const.SCENT_HEIGHT - footerView.height - 8;
        this.addChild(footerView);
    }

    private showGameSoundHandler(e: egret.TouchEvent): void {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        // this.gameSoundPop.visible = true;
        this.optionView.visible = true;
        // GameData.isClickBtn = true;
    }
    private showGameInfoHandler(e: egret.TouchEvent): void {
        this.removeAll();
    }

    private onStartGameHandler(): void {
        MvsManager.getInstance().uninit();
        MvsManager.response.initResponse = this.mvsInitResponse.bind(this);
        MvsManager.getInstance().init();
        this.loading.show();
    }

    private onLeaveGameHandler(): void {
        // TODO: leave game, 返回相应界面
        console.log("退出游戏");
    }

    private mvsRegisterUserResponse(data): void {
        Const.userId = data.id;
        Const.token = data.token;
        Const.userName = data.name;
        Const.avatarUrl = data.avatar;
        let result = MvsManager.getInstance().login();
        console.log("login," + new Date());

    }



    private mvsLoginResponse(data): void {
        if (data.status === 200) {
            console.log('response login  ok' + data + new Date());
            Toast.show("登录成功");
            Delay.run(function () {
                GameSceneView._gameScene.enter();
                this.removeAll();
            }.bind(this), 1500);
        } else {
            Toast.show("登录失败,服务器拒绝");
            return;
        }
        // {status: 200, roomID: "0"}
    }

    private removeAll(): void {
        this.removeChildren();
        // this.gameSoundPop = null;
    }
}