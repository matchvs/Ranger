class MyButton extends egret.Sprite {
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
        this.sp.addChild(this.bg);

        this.title = ResourceUtils.createBitmapByName(titleName);
        if (this.title.texture == null) {
            this.title.texture = RES.getRes(titleName);
        }
        this.title.x = (this.bg.width - this.title.width) >> 1;
        this.title.y = (this.bg.height - this.title.height) >> 1;
        this.sp.addChild(this.title);
        this.noScaleX = this.sp.x;
        this.noScaleY = this.sp.y;
    }

    public setClick(func: Function): void {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEvent, this);
        this.onClick = func;
    }

    private onClickEvent(): void {

        var scaleX: number = (this.sp.width - this.sp.width * 0.8) / 2;
        var scaleY: number = (this.sp.height - this.sp.height * 0.8) / 2;
        this.tw = egret.Tween.get(this.sp);
        this.tw.to({ "scaleX": 0.7, "scaleY": 0.7, "x": scaleX, "y": scaleY }, 40).to({ "scaleX": 1, "scaleY": 1, "x": this.noScaleX, "y": this.noScaleY }, 40);
        //
        //        var delay = 350;
        //        var tw:egret.Tween = egret.Tween.get(this, {onChange: this.moveFrame, onChangeObj: this});
        //        this.y = Consts.GAME_HEIGHT/2;
        //
        //        tw.to({"scaleX": 1, "scaleY":1,"alpha": 1}, delay);
        this.onClick();
    }

}