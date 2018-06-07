class MyButtonForGame extends egret.Sprite {
    private bg: egret.Bitmap;
    private title: egret.Bitmap;
    private onClick: Function;
    private tw: egret.Tween;
    private sp: egret.Sprite;
    private noScaleX: number;
    private noScaleY: number;
    public constructor(bgName: string, titleName: string) {
        super();
        this.sp = new egret.Sprite();
        this.addChild(this.sp);
        this.bg = ResourceUtils.createBitmapByName(bgName);

        this.bg.width *= Utils.wWidthScale();
        this.bg.height *= Utils.wHeightScale();

        this.sp.addChild(this.bg);

        this.title = ResourceUtils.createBitmapByName(titleName);
        if (this.title.texture == null) {
            this.title.texture = RES.getRes(titleName);
        }

        this.title.width *= Utils.wWidthScale();
        this.title.height *= Utils.wHeightScale();

        this.title.x = (this.bg.width - this.title.width) >> 1;
        this.title.y = (this.bg.height - this.title.height) >> 1;
        this.sp.addChild(this.title);

        this.noScaleX = this.sp.x;
        this.noScaleY = this.sp.y;
    }

    public setClick(func: Function): void {

        this.touchEnabled = true;
        // TOUCH_TAP
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEvent, this);
        this.onClick = func;
    }

    private onClickEvent(): void {
        // 也是保存为'全局变量'的方法来使用
        if (GameData.isClickBtn) return;
        var scaleX: number = (this.sp.width - this.sp.width * 0.8) / 2;
        var scaleY: number = (this.sp.height - this.sp.height * 0.8) / 2;

        // 激活一个对象，对其添加 Tween 动画
        // http://edn.egret.com/cn/apidoc/index/name/egret.Tween
        this.tw = egret.Tween.get(this.sp);
        // get to to call
        this.tw.to({ "scaleX": 0.7, "scaleY": 0.7, "x": scaleX, "y": scaleY }, 40).to({ "scaleX": 1, "scaleY": 1, "x": this.noScaleX, "y": this.noScaleY }, 40).call(this.onClickHandler, this);
    }
    private onClickHandler(): void {
        this.onClick();
    }
}