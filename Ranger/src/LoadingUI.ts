class LoadingUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }
    private textField: egret.TextField;

    private textField_power: egret.TextField;

    private bg: egret.Bitmap;

    private logo: egret.Bitmap;

    private uiContainer: egret.DisplayObjectContainer;

    private logoUrl = "resource/assets/loading_logo.png";

    private bgUrl = "resource/assets/loading_bg.jpg";

    private w: number;

    private h: number;

    private createView(): void {
        this.w = Const.SCENT_WIDTH;
        this.h = Const.SCENT_HEIGHT;

        this.textField = new egret.TextField();
        this.textField.y = 500;
        this.textField.textColor = 0x333333;
        this.textField.size = 23;
        this.textField.width = this.w;
        this.textField.height = 100;
        this.textField.fontFamily = "Black";
        this.textField.textAlign = "center";

        this.textField_power = new egret.TextField();
        this.textField_power.y = this.h * 0.9;
        this.textField_power.textColor = 0x333333;
        this.textField_power.width = this.w;
        this.textField_power.height = 100;
        this.textField_power.size = 20;
        this.textField_power.text = "Powered by Egret Engine";
        this.textField_power.fontFamily = "Black";
        this.textField_power.textAlign = "center";

        // 使用的URLLoader, 而不是ImageLoader 
        // http://developer.egret.com/cn/github/egret-docs/Engine2D/net/loadText/index.html
        // dataFormat值的设置
        // http://developer.egret.com/cn/apidoc/index/name/egret.URLLoader
        // 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象
        var urlLoader: egret.URLLoader = new egret.URLLoader();
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        urlLoader.load(new egret.URLRequest(this.logoUrl));

        var urlLoader: egret.URLLoader = new egret.URLLoader();
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        urlLoader.load(new egret.URLRequest(this.bgUrl));

        this.bg = new egret.Bitmap();
        this.logo = new egret.Bitmap();

        // DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点
        this.uiContainer = new egret.DisplayObjectContainer();
        this.addChild(this.uiContainer);

        this.addChild(this.logo);

        this.addChildAt(this.bg, 0);

        this.addChild(this.textField);

        this.addChild(this.textField_power);

    }
    private onComplete(e: egret.Event): void {
        // e.target
        var urlLoader: egret.URLLoader = <egret.URLLoader>e.target;
        var texture = urlLoader.data;
        if (urlLoader._request.url == this.bgUrl) {
            this.bg.texture = texture;
            this.bg.scaleX = this.w / 640;
            this.bg.scaleY = this.h / 960;
        }
        else if (urlLoader._request.url == this.logoUrl) {
            this.logo.texture = texture;
            this.logo.anchorOffsetX = this.logo.width * 0.5
            this.logo.anchorOffsetY = this.logo.height * 0.5;
            this.logo.x = this.w / 2;
            this.logo.y = this.h / 2 - 60;
            this.logo.scaleX = this.logo.scaleY = this.h / 960;

            this.textField.y = this.logo.y + 100;
        }

    }
    public setProgress(current, total): void {
        var num: number = Math.floor((current / total) * 100);
        this.textField.text = "游戏加载中…" + num + "%";
    }
    public onLoadComplete(callback: Function, thisObj): void {
        callback.call(thisObj);
    }
}
