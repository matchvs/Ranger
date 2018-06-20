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

    }

    private onAddToStage(event: egret.Event) {
        this.runGame().catch(e => {
            console.log(e);
        })
    }



    private async runGame() {
        await this.loadResource();
        LocalStore_Clear();
        Const.SCENT_WIDTH = this.stage.stageWidth;
        Const.SCENT_HEIGHT = this.stage.stageHeight;
        console.log(" ============== Screen Size:" + Const.SCENT_WIDTH + "," + Const.SCENT_HEIGHT);
        console.log(" ============== Display Size:" + this.stage.width + "," + this.stage.height);
        this.createGameScene();

    }

    private async loadResource() {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载配置文件并解析
        await RES.loadConfig("resource/default.res.json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        console.log("Read Config is Complete");
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);

        RES.createGroup("initLoad", ["preload", "bgPic", "animation", "sound"]);
        RES.loadGroup("initLoad");
        console.log("Download Resource");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "initLoad") {
            this.loadingView.onLoadComplete(this.onStartGame, this);
        }

        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        console.log("remove  loadingView");
        this.stage.removeChild(this.loadingView);
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


    private onStartGame(): void {

        this.initAnimationData();
        // this.createGameScene();
        this.addChild(new GameFightView());
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