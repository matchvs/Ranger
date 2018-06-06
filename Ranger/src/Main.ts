class Main extends egret.DisplayObjectContainer {

    private loadingView: LoadingUI;
    private _scene: GameSceneView;
    private swfFrame: any;
    private _loadTimes: number = 0;
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        // 扩展资源加载模块文件解析器
        // http://edn.egret.com/cn/article/index/id/551
        RES.registerAnalyzer("starlingswf_sheet", starlingswf.StarlingSwfSheetAnalyzer);

        MvsManager.response.initResponse = this.mvsInitResponse.bind(this);
    }

    private onAddToStage(event: egret.Event) {
        // var title = "愤怒的小红帽";
        // var content = "是时候给灰狼哥来一发了! 要来么？不要掉队哟~";
        // var link = "http://static.egret-labs.org/h5game/62/v20/index.html";
        // var ico = "http://static.egret-labs.org/h5game/icons/10000062.jpg";

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private init() {
        if (GameData.initStatus === 6) {
            return;
        }

        if (GameData.initStatus === 2 || GameData.initStatus === 5) {
            console.warn('sdk initing or waiting response');
            console.warn('GameData.initStatus:', GameData.initStatus);
            return;
        }

        GameData.initStatus = 2;
        this.mvsInit();
    }

    private mvsInit() {
        let result: number = MvsManager.getInstance().init();
        if (result === 0) {
            GameData.initStatus = 3;
            console.log('sdk init ok', result);
        } else {
            GameData.initStatus = 4;
            console.error('sdk init error', result);
            return;
            // TODO: 修改showErr中的逻辑
            // AlertPanel.i().showErr("matchvs初始化失败");
        }
        GameData.initStatus = 5;
    }


    private async runGame() {
        await this.loadResource();
        LocalStore_Clear();
        Const.SCENT_WIDTH = this.stage.stageWidth;
        Const.SCENT_HEIGHT = this.stage.stageHeight;
        console.log(" ============== Screen Size:" + Const.SCENT_WIDTH + "," + Const.SCENT_HEIGHT);
        console.log(" ============== Display Size:" + this.stage.width + "," + this.stage.height);
        this.init();
        this.createGameScene();

    }

    private async loadResource() {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载配置文件并解析
        await RES.loadConfig("resource/default.res.json", "resource/");
        this.stage.removeChild(this.loadingView);
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);

        RES.createGroup("initLoad", ["preload", "bgPic", "animation", "sound"]);
        RES.loadGroup("initLoad");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "initLoad") {
            this.loadingView.onLoadComplete(this.onStartGame, this);
        }
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "initLoad") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private onResourceLoadError(e: RES.ResourceEvent): void {
        this._loadTimes++;

        if (this._loadTimes > 3) {
            AlertPanel.i().showErr("网络异常，请重新进入游戏");
        }
        else {
            RES.loadGroup(e.groupName);
        }
    }

    private mvsInitResponse(status: number): void {
        if (status === 200) {
            GameData.initStatus = 6;
            console.log('response init ok', status);
        } else {
            GameData.initStatus = 7;
            console.error('response init error', status);
        }
    }

    private onStartGame(): void {
        // this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);

        this.initAnimationData();
        this.createGameScene();
    }

    private initAnimationData(): void {
        var arr: Array<string> = ["redNu", "promptPop", "honglang", "lanlang", "go", "xiaohongmao", "xiaolanmao"];
        for (var i: number = 0, len = arr.length; i < len; i++) {
            var key: string = arr[i];
            StarlingSwfFactory.getInstance().addSwf(key, RES.getRes(key + "_swf"), RES.getRes(key));
        }
    }

    private createGameScene(): void {
        Const.GamePoxY = 0;
        GameData.curScene = 1;

        var maskRect: egret.Rectangle = new egret.Rectangle();
        maskRect.width = Const.SCENT_WIDTH;
        maskRect.height = Const.SCENT_HEIGHT;
        maskRect.y = Const.GamePoxY;

        SoundUtils.instance().initSound();

        this._scene = new GameSceneView();
        this._scene.y = Const.GamePoxY;
        this._scene.width = Const.SCENT_WIDTH;
        this._scene.height = Const.SCENT_HEIGHT;
        this._scene.mask = maskRect;
        this.addChild(this._scene);
    }
}