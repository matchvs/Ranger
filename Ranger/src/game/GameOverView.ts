class GameOverView extends egret.Sprite {
    private thisContainer: egret.Sprite;
    private bg: egret.Bitmap;
    private iconWinOrLose: egret.Bitmap;
    private backHomeBtn: egret.Bitmap;
    private prompt: Prompt;

    constructor() {
        super();

        this.mvsBind();
        this.leaveRoom();

        this.initView();
    }

    public mvsBind() {
        MvsManager.response.leaveRoomResponse = this.mvsLeaveRoomResponse.bind(this);
        MvsManager.response.leaveRoomNotify = this.mvsLeaveRoomNotify.bind(this);
        MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
    }

    public mvsErrorResponse(code, msg) {
        console.error('errorResponse', arguments);

        if (code === 1000) {
            GameData.isServerErrorCode1000 = true;
            this.showPromptOfError("你已掉线 请刷新 重开");
        }
    }

    public showPromptOfError(value) {
        this.prompt.alpha = 1;
        this.prompt.visible = true;
        this.prompt.setValue(value);
    }

    public mvsUnBind() {
        MvsManager.response.leaveRoomResponse = null;
        MvsManager.response.leaveRoomNotify = null;
        MvsManager.response.errorResponse = null;
    }

    private initView(): void {
        this.thisContainer = new egret.Sprite();
        this.addChild(this.thisContainer);

        let goldValue: number = 0;
        let scoreValue = GameData.type == "r" ? GameData.players[0].score : GameData.players[1].score;


        if (GameData.players[0].score > GameData.players[1].score) {
            if (GameData.type == "r") {
                GameData.isWin = true;
                goldValue = 100;
            }
            else if (GameData.type == "b") {
                GameData.isWin = false;
                goldValue = 20;
            }
        }
        else if (GameData.players[0].score < GameData.players[1].score) {
            if (GameData.type == "r") {
                GameData.isWin = false;
                goldValue = 20;
            }
            else if (GameData.type == "b") {
                GameData.isWin = true;
                goldValue = 100;
            }
        } else {
            GameData.isWin = false;
            goldValue = 50;

        }

        GameData.allValue++;
        if (GameData.isWin) {
            SoundUtils.instance().playWin();
            GameData.winValue++;
        } else {
            SoundUtils.instance().playOver();
        }

        // let goldValue = Math.floor(scoreValue / 100);
        GameData.gold += goldValue;

        this.bg = ResourceUtils.createBitmapByName("overBgImage");
        this.bg.width = Utils.wWidthScale() * this.bg.width;
        this.bg.height = Utils.wHeightScale() * this.bg.height;

        this.thisContainer.addChild(this.bg);
        this.bg.x = Const.SCENT_WIDTH / 2 - this.bg.width / 2;
        this.bg.y = Const.SCENT_HEIGHT / 2 - this.bg.height / 2;

        if (GameData.isWin) {
            this.iconWinOrLose = ResourceUtils.createBitmapByName("icon_win_png");
        } else {
            this.iconWinOrLose = ResourceUtils.createBitmapByName("icon_lose_png");
        }
        this.iconWinOrLose.width = Utils.wWidthScale() * this.iconWinOrLose.width;
        this.iconWinOrLose.height = Utils.wHeightScale() * this.iconWinOrLose.height;

        this.iconWinOrLose.x = Const.SCENT_WIDTH / 2 - this.iconWinOrLose.width / 2;
        this.iconWinOrLose.y = this.bg.y + Utils.wYScale() * 209;
        this.thisContainer.addChild(this.iconWinOrLose);




        let scoreTxt = new egret.TextField();
        scoreTxt.text = "本局分数";
        scoreTxt.size = Utils.wYScale() * 20;
        scoreTxt.textColor = 0x333333;
        scoreTxt.fontFamily = "Microsoft YaHei UI";
        scoreTxt.x = Const.SCENT_WIDTH / 4 - scoreTxt.width / 2;
        scoreTxt.y = this.bg.y + Utils.wYScale() * 324;
        this.thisContainer.addChild(scoreTxt);



        let scoreValueTxt = new egret.TextField();
        scoreValueTxt.text = scoreValue + ""
        scoreValueTxt.size = Utils.wYScale() * 35;
        scoreValueTxt.textColor = 0xea6200;
        scoreValueTxt.fontFamily = "Microsoft YaHei UI";
        scoreValueTxt.x = Const.SCENT_WIDTH / 4 - scoreValueTxt.width / 2;
        scoreValueTxt.y = scoreTxt.y + scoreTxt.height + Utils.wYScale() * 15;
        this.thisContainer.addChild(scoreValueTxt);

        let goldTxt = new egret.TextField();
        goldTxt.text = "获得金币";
        goldTxt.size = Utils.wYScale() * 20;
        goldTxt.textColor = 0x333333;
        goldTxt.fontFamily = "Microsoft YaHei UI";
        goldTxt.x = Const.SCENT_WIDTH / 4 * 3 - goldTxt.width / 2;
        // goldTxt.y = this.bg.y + 324;
        goldTxt.y = scoreTxt.y;
        this.thisContainer.addChild(goldTxt);

        let goldValueTxt = new egret.TextField();
        goldValueTxt.text = goldValue + ""
        goldValueTxt.size = Utils.wYScale() * 35;
        goldValueTxt.textColor = 0xea6200;
        goldValueTxt.fontFamily = "Microsoft YaHei UI";
        goldValueTxt.x = Const.SCENT_WIDTH / 4 * 3 - goldValueTxt.width / 2;
        goldValueTxt.y = goldTxt.y + goldTxt.height + Utils.wYScale() * 15;
        this.thisContainer.addChild(goldValueTxt);

        let backHomeBtnSp = new egret.Sprite();
        this.thisContainer.addChild(backHomeBtnSp);
        this.backHomeBtn = ResourceUtils.createBitmapByName("btn_backToHome_png");

        this.backHomeBtn.width = Utils.wWidthScale() * this.backHomeBtn.width;
        this.backHomeBtn.height = Utils.wHeightScale() * this.backHomeBtn.height;

        this.backHomeBtn.touchEnabled = true;
        this.backHomeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toGameEnterView, this);
        this.backHomeBtn.x = Const.SCENT_WIDTH / 2 - this.backHomeBtn.width / 2
        this.backHomeBtn.y = this.bg.y + Utils.wYScale() * 489;
        backHomeBtnSp.addChild(this.backHomeBtn);

        this.prompt = new Prompt();
        this.addChild(this.prompt);
        this.prompt.x = Const.SCENT_WIDTH / 2 - this.prompt.width / 2;
        this.prompt.y = Const.SCENT_HEIGHT / 2 - this.prompt.height / 2;

        this.prompt.visible = false;
    }

    public toGameEnterView() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        this.dispose()

        // TODO清除工作
        GameSceneView._gameScene.enter();
    }

    // TODO: 各种status
    private dispose() {
        this.backHomeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.toGameEnterView, this);
        this.mvsUnBind();
        this.resetSomeGameData();
        this.removeAll();
    }

    private resetSomeGameData() {
        GameData.isQuickJoinBtnClick = false;
        GameData.isCreateRoomBtnClick = false;
        GameData.isJoinRoomBtn1Click = false;
        GameData.isJoinRoomBtn2Click = false;
        GameData.isRoomItemClick = false;
        GameData.isLeaveRoomBtnClick = false;
        GameData.isLeaveRoomBtn2Click = false;

        GameData.isShowProfileView = false;
        GameData.isShowJoinRoomView = false;

        GameData.isAddRobot = false;

        GameData.isOwner = false;
        GameData.ownerId = 0;
        GameData.lastRoomId = "";
        GameData.roomId = "";

        GameData.players = [];
        GameData.type = "";

        GameData.gameTime = 600;

        GameData.isInRoomView = false;
        // GameData.isInEnterView = false;

        GameData.createRoomStatus = 1;
        GameData.joinRandomRoomStatus = 1;
        GameData.joinRoomStatus = 1;
        GameData.leaveRoomStatus = 1;
        GameData.joinOverStatus = 1;
        GameData.logoutStatus = 1;
        GameData.getRoomListStatus = 1;
        GameData.kickPlayerStatus = 1;
        GameData.setFrameStatus = 1;

        GameData.isGameOver = false;
        GameData.isWin = false;

        GameData.enemyNum = 0;

        GameData.profectNum = 0;
        GameData.langNum = 0;
    }

    private leaveRoom() {
        GameData.leaveRoomStatus = 2;
        let cpProto = "";
        this.mvsLeaveRoom(cpProto);
    }

    private mvsLeaveRoom(cpProto) {
        let result = MvsManager.engine.leaveRoom(cpProto);
        if (result === 0) {
            GameData.leaveRoomStatus = 3;
            console.warn('sdk leaveRoom ok', result)
        } else {
            GameData.leaveRoomStatus = 4;
            console.error('sdk leaveRoom error', result);
            return;
        }
        GameData.leaveRoomStatus = 5;
    }

    public mvsLeaveRoomResponse(rsp) {
        if (rsp.status === 200) {
            GameData.leaveRoomStatus = 6;
            console.warn('response leaveRoom ok', rsp);
        } else {
            GameData.leaveRoomStatus = 7;
            console.error('response leaveRoom error', rsp)
            return
        }
    }

    public mvsLeaveRoomNotify() {
    }

    private removeAll(): void {
        this.removeChildren()
        if (this.parent) {
            this.parent.removeChild(this)
        }
    }
}