class GamePlayView extends egret.Sprite {

    private thisContainer: egret.Bitmap;
    private ready: StarlingSwfMovieClip;
    private optionView: OptionView;
    private sp: egret.Sprite;
    private gameFightView: GameFightView;
    private prompt: Prompt;

    constructor() {
        super();
        this.mvsBind();
        this.sp = new egret.Sprite();
        this.sp.touchEnabled = true;
        this.addChild(this.sp);
        
    }

    public mvsBind() {
        MvsManager.response.leaveRoomResponse = this.mvsLeaveRoomResponse.bind(this);
        MvsManager.response.leaveRoomNotify = this.mvsLeaveRoomNotify.bind(this);
        MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
        MvsManager.response.networkStateNotify = this.mvsNetworkStateNotify.bind(this);
    }

    public mvsUnBind() {
        MvsManager.response.leaveRoomResponse = null;
        MvsManager.response.leaveRoomNotify = null;
        MvsManager.response.errorResponse = null;
        MvsManager.response.networkStateNotify = null;
    }

    public mvsErrorResponse(code: number, msg: string) {
        console.error('mvsErrorResponse', arguments);

        // GameData.isJoinRoom = false;
        // this.resetSomeGameData()

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

    public mvsNetworkStateNotify(notifyData) {
        let data = {
            userId: notifyData.userID,
            state: notifyData.state,
            roomId: notifyData.roomID,
            ownerId: notifyData.owner,
        };

        if (data.state === 1) {
            // if (GameData.isOwner) {
            this.showPrompt("有玩家掉线");

            // let cpProto = "";
            // this.mvsKickPlayer(data.userId, cpProto);
            // }

            // else {
            //     if (data.userId === data.ownerId) {
            //         this.showPrompt('房主掉线 自动离开房间');
            //         // this.roomView.leaveRoom();
            //     }
            //     else {
            //         this.showPrompt('有玩家掉线 自动踢掉');
            //     }
            // }
        }
    }

    public showPrompt(value) {
        this.prompt.alpha = 1;
        this.prompt.visible = true;
        this.prompt.setValue(value);

        egret.Tween.get(this.prompt).to({ "alpha": 0, "visible": false }, 2000)
    }

    // public showGame(index: number): void {
    public showGame(): void {
        // GameData.isGameStartClickOption = true;
        GameData.isGameStart = false;

        this.sp.removeChildren();

        /**
         * game fight
         */
        // var game1: GameFightOneView = new GameFightOneView();
        // this.sp.addChild(game1);
        // this.target = game1;
        // this.thisContainer = ResourceUtils.createBitmapByName("gameinfo_1_Image");
        // this.sp.addChild(this.thisContainer);

        this.gameFightView = new GameFightView();
        this.gameFightView.width = Const.SCENT_WIDTH;
        this.gameFightView.height = Const.SCENT_HEIGHT;
        this.sp.addChild(this.gameFightView);



        /**
         * option btn
         */
        var optionBtn: egret.Sprite = new egret.Sprite();
        var optionBmp: egret.Bitmap = ResourceUtils.createBitmapByName("optionBtnImage");
        optionBmp.width = 38 * Utils.wWidthScale();
        optionBmp.height = 38 * Utils.wHeightScale();

        optionBtn.addChild(optionBmp);
        optionBtn.touchEnabled = true;
        // optionBtn.width = this.stage.stageWidth/10 ;
        // optionBtn.height = this.stage.stageWidth/10;
        // optionBtn.x = this.stage.stageWidth * 0.90;
        // optionBtn.y = this.stage.stageHeight * 0.95;

        
        optionBtn.x = 431 * Utils.wXScale();
        optionBtn.y = 748 * Utils.wYScale();

        optionBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOptionView, this);
        this.addChild(optionBtn);


        /**
         * option view
         */
        this.optionView = new OptionView(Const.IN_PLAY_VIEW, this);
        this.addChild(this.optionView);
        this.optionView.visible = false;

        // this.sp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startHandler, this);

        /**
         * 倒计时
         */
        this.ready = StarlingSwfFactory.getInstance().makeMc("go");
        this.ready.x = Const.SCENT_WIDTH / 2;
        this.ready.y = Const.SCENT_HEIGHT / 2;
        this.addChild(this.ready);
        this.ready.goToPlay("1");
        SoundUtils.instance().playNum();

        this.ready.setCompleteAction(this.complete1, this);

        this.prompt = new Prompt();
        this.addChild(this.prompt);
        this.prompt.x = Const.SCENT_WIDTH / 2 - this.prompt.width / 2;
        this.prompt.y = Const.SCENT_HEIGHT / 2 - this.prompt.height / 2;

        this.prompt.visible = false;
    }

    private showOptionView(): void {
        // if (GameData.isGameStartClickOption) {
        this.optionView.visible = true;
        // GameData.isPause = true;
        // }
    }
    private complete1(): void {
        this.ready.goToPlay("2");
        SoundUtils.instance().playGo();
        egret.setTimeout(this.complete2.bind(this), this, 300);
    }
    private complete2(): void {
        // GameData.isGameStartClickOption = true;
        GameData.isGameStart = true;
        // GameData.isPause = false;
        SoundUtils.instance().playBg();
        // this.target.redGirl.run();
        this.removeChild(this.ready);
    }

    public leaveRoom() {
        // console.log("leaveRoom");
        // return;
        if (GameData.isLeaveRoomBtnClick) {
            return;
        }
        GameData.isLeaveRoomBtnClick = true;

        let cpProto = "";
        this.mvsLeaveRoom(cpProto);
    }

    public mvsLeaveRoom(cpProto) {
        setTimeout(() => {
            var result = MvsManager.getInstance().leaveRoom(cpProto);
            if (result === 0) {
                console.warn('sdk leaveRoom ok', result)
            } else {
                console.error('sdk leaveRoom error', result)
                return
            }
        }, 200);
    }

    public mvsLeaveRoomResponse(rsp) {

        let status = rsp.status
        if (status === 200) {
            console.warn('response leaveRoom ok', rsp);
        } else {
            console.error('response leaveRoom error', rsp);
            return;
        }

        this.resetSomeGameData();

        SoundUtils.instance().stopBg();
        this.mvsUnBind();
        this.gameFightView.mvsUnBind();
        this.gameFightView.dispose();
        GameSceneView._gameScene.enter();
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

        GameData.isGameStart = false;
        GameData.isGameOver = false;
        GameData.isWin = false;

        GameData.enemyNum = 0;

        GameData.profectNum = 0;
        GameData.langNum = 0;
    }

    public mvsLeaveRoomNotify(roomId, roomUserInfo) {
        // 暂无处理
        console.warn("notify leaveRoomNotify", roomId, roomUserInfo);
    }
}