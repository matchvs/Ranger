/**
 * Created by Administrator on 2014/10/9.
 */
class GameStartView extends egret.Sprite {
    private gameSoundPop: MusicView;
    private optionView: OptionView;
    private prompt: Prompt;

    constructor() {
        super();
        this.initView();

        this.mvsBind();

        if (Const.userId === 0) {
            this.registerUser();
        } else {
            // 不需要重复登陆
            // this.login();
        }
    }

    public mvsBind() {
        MvsManager.response.registerUserResponse = this.mvsRegisterUserResponse.bind(this);
        MvsManager.response.loginResponse = this.mvsLoginResponse.bind(this);
        MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
    }

    public mvsErrorResponse(code, errMsg) {
        console.error('mvsErrorResponse', arguments);
        if (code === 1000) {
            GameData.isServerErrorCode1000 = true;
            this.showPromptOfError("你已掉线 请刷新 重开");
        }
    }

    public showPromptOfError(value) {
        this.prompt.visible = true;
        this.prompt.setValue(value);
    }

    public registerUser() {
        if (GameData.registerStatus === 2 || GameData.registerStatus === 5) {
            console.warn('sdk registering or waiting response');
            console.warn('GameData.registerStatus', GameData.registerStatus);
            return;
        }

        GameData.registerStatus = 2;
        this.mvsRegisterUser();
    }

    mvsRegisterUser() {
        let result = MvsManager.getInstance().registerUser();
        if (result === 0) {
            GameData.registerStatus = 3;
            console.log('sdk registerUser ok', result);
        } else {
            GameData.registerStatus = 4;
            console.error('sdk registerUser error', result);
            return;
        }

        GameData.registerStatus = 5;
    }

    private initView(): void {
        var bg: egret.Bitmap = ResourceUtils.createBitmapByName("bgImage");
        bg.width = Const.SCENT_WIDTH;
        bg.height = Const.SCENT_HEIGHT;
        this.addChild(bg);

        var startBtn: MyButtonForGame = new MyButtonForGame("startBtnImage", "startBtnImage");

        this.addChild(startBtn);
        startBtn.x = Const.SCENT_WIDTH / 2 - startBtn.width / 2;
        startBtn.y = Const.SCENT_HEIGHT - startBtn.height - Utils.wYScale() * 30;
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
        // var gameInfo: GameInfoView = new GameInfoView();
        // this.addChild(gameInfo);
    }

    private onStartGameHandler(): void {
        if (GameData.isServerErrorCode1000) {
            return;
        }
        // if (GameData.loginStatus === 2 || GameData.loginStatus === 5) {
        //     // AlertPanel.i().
        //     console.warn('please wait matchvs init');
        //     return
        // }
        // else if (GameData.loginStatus === 6) {
        //     // GameSceneView._gameScene.play();
        //     GameSceneView._gameScene.enter();
        //     this.removeAll();
        // }
        // else {
        //     console.error('matchvs 登录状态异常');
        //     console.error('GameData.loginStatus', GameData.loginStatus);
        // }

        if (GameData.loginStatus === 1) {
            console.error('还未开始登录');
        }
        else if (GameData.loginStatus === 2 || GameData.loginStatus === 5) {
            console.warn('please wait matchvs init');
            console.warn('GameData.loginStatus', GameData.loginStatus);
        }
        else if (GameData.loginStatus === 3) {

        }
        else if (GameData.loginStatus === 4 || GameData.loginStatus === 7) {
            console.error('登录失败');
            console.error('GameData.loginStatus', GameData.loginStatus);
        }
        else if (GameData.loginStatus === 6) {
            GameSceneView._gameScene.enter();
            this.removeAll();
        }
    }

    private onLeaveGameHandler(): void {
        // TODO: leave game, 返回相应界面
        console.log("退出游戏");
    }

    private mvsRegisterUserResponse(data): void {
        // test:
        // if (data.status === 0) {
        if (data) {
            GameData.registerStatus = 6;
            console.log('response register user ok', data);
        } else {
            GameData.registerStatus = 7;
            console.error('response register user error', data);
            return;
        }

        Const.userId = data.id;
        Const.token = data.token;
        Const.userName = data.name;
        Const.avatarUrl = data.avatar;

        this.login();
    }

    private login() {
        if (GameData.loginStatus === 2 || GameData.loginStatus === 5) {
            console.warn('sdk logining or waiting response');
            console.warn('GameData.loginStatus', GameData.loginStatus);
            return;
        }

        GameData.loginStatus = 2;

        this.mvsLogin();
    }

    private mvsLogin() {
        let result = MvsManager.getInstance().login();
        if (result === 0) {
            GameData.loginStatus = 3;
            console.log('sdk login ok', result);
        } else {
            GameData.loginStatus = 4;
            console.error('sdk login error', result);
            return;
        }

        GameData.loginStatus = 5;
    }

    private mvsLoginResponse(data): void {
        if (data.status === 200) {
            GameData.loginStatus = 6;
            console.log('response login  ok', data);
        } else {
            GameData.loginStatus = 7;
            console.error('response login error', data);
            return;
        }
        // {status: 200, roomID: "0"}
    }

    private removeAll(): void {
        this.removeChildren();
        // this.gameSoundPop = null;
    }
}