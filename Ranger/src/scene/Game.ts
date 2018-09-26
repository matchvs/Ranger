class Game extends BaseScene implements eui.UIComponent {
    private wolfsRed: Array<Wolf> = [];
    private wolfsBlue: Array<Wolf> = [];

    private speed = GameData.enemySpeed;
    private mBgAutoScorller: BgAutoScorller;//背景滚动器
    private gold: eui.Label;//背景滚动器
    private layerFight: egret.DisplayObjectContainer;
    private tipsController: Tips = new Tips();//提示节目
    private isShowTip: boolean = false;//是否显示提示界面
    private isSingleModel: boolean = false;//是否单机模式
    private isPause = false;//游戏暂停
    private logic: GameLogic;//游戏战斗逻辑
    private timer;
    public constructor() {
        super();
    }
    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected onCreated(): void {
        console.log("================onCreated==============");
        this.layerFight = <egret.DisplayObjectContainer>this.findChild("fight");
        this.mBgAutoScorller = new BgAutoScorller(this.findChild("bg0"), this.findChild("bg1"));
        this.gold = <eui.Label>this.findChild("gold");

        egret.Ticker.getInstance().register(this.onUpdate, this);
        this.logic = new GameLogic(this);

        // 显示分数
        this.gold.text = GameData.gold + "";

        if (this.isShowTip) {
            this.tipsController.show(this, ["tips", "step1", "step2", "step3", "step4"]);
            this.isPause = true;
        } else {
            if (this.isSingleModel === true) {
                this.startSingleGame();
            } else {
                this.startNetGame();
            }
        }
    }

    //在线网络游戏模式
    public startNetGame(): void {
        MvsManager.getInstance().setFrameSync(GameData.FPS);
        MvsManager.response.frameUpdate = function (data: MsFrameData) {
            this.logic.handlerAllGameEvent(data);
        }.bind(this);
        var time = 0;
        this.timer = setInterval(function () {
            time++;
            if (GameData.type === GameData.p1) {
                this.logic.updateGame(time);
            }
        }.bind(this), 1000 / GameData.FPS);
        SoundUtils.instance().playBg();

    }
    protected startSingleGame(): void {
        var time = 0;
        this.timer = setInterval(function () {
            time++;
            this.logic.updateGame(time);
        }.bind(this), 1000 / GameData.FPS);
        SoundUtils.instance().playBg();
    }

    public stopGame(): void {
        this.timer && clearInterval(this.timer);
    }
    protected onUpdate(): void {
        if (this.isPause) {
            return;
        }
        this.mBgAutoScorller.update();
        this.logic.checkGameEvent();

    }
    private onEvent(event) {
        // NetWorkUtil.instance.removeEventListener(this.onEvent);
        this.finish();
    }
    protected onShow(par) {
        console.log('Game onShow')
        this.isSingleModel = (par && par.isSingleModel) ? par.isSingleModel : false;
        this.isShowTip = (par && par.isShowTip) ? par.isShowTip : false;
        // console.log("onshow,par:" + par);
        NetWorkUtil.instance.addEventListener(this.onEvent.bind(this), NetWorkUtil.LEAVE_ROOM_NOTIFY);
    }
    protected onHide() {
        console.log('Game onHide')
        // NetWorkUtil.instance.removeEventListener(this.onEvent.bind(this));
        NetWorkUtil.instance.removeEventListener(NetWorkUtil.LEAVE_ROOM_NOTIFY);
        this.stopGame()
    }
    protected onDestory() {
        super.onDestory()
        this.stopGame()
    }

    public finish() {
        if (this.isSingleModel) {
            this.stopGame();
        } else {
            this.stopGame();
            MvsManager.getInstance().leaveRoom("");
        }
        SoundUtils.instance().stopBg();
        SceneManager.back();

        console.log('finish')

        SceneManager.showScene(GameOver, GameData.getPlayer(GameData.type));
    }
    public onClick(name: string, v: egret.DisplayObject) {
        let stack: any;
        switch (name) {
            case "relive":
                if (GameData.gold >= GameData.Gold4Relive) {
                    GameData.gold -= GameData.Gold4Relive;
                    this.gold.text = GameData.gold + "";
                    v.visible = false;
                    this.logic.sendReliveEvent(GameData.type)
                    Toast.show("满血复活");
                } else {
                    Toast.show("金币不足,难以复活");
                }
                break;
            case "btnfight0":
            case "btnfight1":
            case "btnfight2":
            case "btnfight3":
            case "btnfight0bg":
            case "btnfight1bg":
            case "btnfight2bg":
            case "btnfight3bg":
                if (!GameData.isWatcher()) {
                    if (GameData.getMePlayer().isDie === false) {
                        this.logic.playFireAnimation(this.logic.getMe(), v);
                        this.logic.colliderCheck(v);
                    } else {
                        Toast.show("请先复活");
                    }
                }

                break;
            case "tips":
                if (this.tipsController.nextStep()) {
                    this.isPause = false;
                    this.startSingleGame();
                };
                break;
            case "back":
                this.stopGame()

                GameData.getPlayer(GameData.type).isHalfLeave = true;
                // GameData.getPlayer(GameData.type).score = -1;

                this.finish();
                break;
        }
        return true;
    }

}