//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends egret.DisplayObjectContainer {

    public root: egret.DisplayObjectContainer;
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        // 扩展资源加载模块文件解析器
        // http://edn.egret.com/cn/article/index/id/551
        // RES.registerAnalyzer("starlingswf_sheet", starlingswf.StarlingSwfSheetAnalyzer);

        //https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor

        RES.processor.map("starlingswf_sheet", new starlingswf.StarlingSwfSheetAnalyzer());


    }
    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            context.onUpdate = () => {
                // console.log("update");
            }
        })
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            console.log('[INFO] [lifecycle] onPause');
            Main.restart();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            console.log('[INFO] [lifecycle] onResume');
        }

        this.runGame();

    }

    private loadTheme() {
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private loadingView: LoadingUI;
    private swfFrame: any;
    private _loadTimes: number = 0;



    private async runGame() {
        await this.loadResource();
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

        // RES.createGroup("initLoad", ["preload", "bgPic", "animation", "sound"]);
        RES.loadGroup("preload");
        console.log("Download Resource");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            console.log("LoadResource is Complete !");
            this.loadingView.onLoadComplete(this.onStartGame, this);
        }

        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        console.log("remove  loadingView");
        this.stage.removeChild(this.loadingView);
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private onResourceLoadError(e: RES.ResourceEvent): void {
        this._loadTimes++;

        if (this._loadTimes > 3) {
            Toast.show("网络异常，请重新进入游戏");
        }
        else {
            RES.loadGroup(e.groupName);
        }
    }


    private onStartGame(): void {
        LocalStore_Clear();
        SoundUtils.instance().initSound();
        this.loadTheme();

        Toast.initRes(this, "resource/loading/toast-bg.png");

        var rootView = new egret.Sprite();
        rootView.width = this.stage.width;
        rootView.height = this.stage.height;
        rootView.x = 0;
        rootView.y = 0;
        this.addChild(rootView);

        SceneManager.init(rootView);
        this.initAnimationData();

        NetWorkUtil.instance.addEventListener(this);
        try {
            var require = window["require"];
            var mta = require('library/mta_analysis.js')
            window["mta"] = mta;
            window["mta"].App.init({
                "appID": "500623547",
                "eventID": "500623822",
            });
            console.log('[INFO] success,init MTA');
        } catch (error) {
            console.warn('[WARN] fail ,init mta case:' + JSON.stringify(error));
        }
        this.createGameScene();
    }

    private initAnimationData(): void {
        var arr: Array<string> = ["promptPop", "honglang", "lanlang", "go", "xiaohongmao", "xiaolanmao"];
        for (var i: number = 0, len = arr.length; i < len; i++) {
            var key: string = arr[i];
            StarlingSwfFactory.getInstance().addSwf(key, RES.getRes(key + "_swf_json"), RES.getRes(key + "_json"));
        }
    }


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        SceneManager.showScene(Login);
        // SceneManager.showScene(Game);
    }

    public static restart() {
        while (SceneManager.back()) { };
        SceneManager.showScene(Login);
    }
    public onEvent(event: number) {
        Main.restart();
        // Toast.show("Server Exception,code:" + event);
    }
}
//wxbbc70b17d96358cb wx APPID