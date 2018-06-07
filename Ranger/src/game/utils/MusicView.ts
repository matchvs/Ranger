class MusicView extends egret.Sprite {
    private spContainer: egret.Sprite;
    constructor() {
        super();

        this.initView();
    }

    private initView(): void {
        // mask
        var spMask: egret.Sprite = new egret.Sprite();
        this.addChild(spMask);

        var mask: egret.Bitmap = ResourceUtils.createBitmapByName("mask_png");
        spMask.addChild(mask);
        spMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchThis, this);

        // spContainer
        this.spContainer = new egret.Sprite();
        this.addChild(this.spContainer);
        var wd: number = Const.SCENT_WIDTH / 8;
        var hd: number = Const.SCENT_HEIGHT / 4;
        this.spContainer.x = wd;
        this.spContainer.y = hd;

        // music bg image
        var bg: egret.Bitmap = ResourceUtils.createBitmapByName("optionMusicBgImage");
        this.spContainer.addChild(bg);

        // close
        var close: egret.Sprite = new egret.Sprite();
        this.spContainer.addChild(close);
        var spclose: egret.Bitmap = ResourceUtils.createBitmapByName("option7Image");
        close.addChild(spclose);
        // note: 默认为false
        close.touchEnabled = true;

        close.x = this.spContainer.width - close.width * 0.7;
        close.y = -close.height * 0.4;
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePop, this);

        // soundBooBg背景音
        var soundBooBg: egret.Sprite = new egret.Sprite();
        this.spContainer.addChild(soundBooBg);

        this.spguanbg = ResourceUtils.createBitmapByName("option5Image");   // option5Image no
        soundBooBg.addChild(this.spguanbg);

        this.spkaibg = ResourceUtils.createBitmapByName("option6Image");    // option6Image yes
        soundBooBg.addChild(this.spkaibg);

        this.spguanbg.x = 0;
        this.spkaibg.x = 30;

        soundBooBg.x = 182;
        soundBooBg.y = 84;
        soundBooBg.touchEnabled = true;
        soundBooBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBgHandler, this);

        // soundBoo效果音
        var soundBoo: egret.Sprite = new egret.Sprite();
        this.spContainer.addChild(soundBoo);

        this.spguan = ResourceUtils.createBitmapByName("option5Image");
        soundBoo.addChild(this.spguan);

        this.spkai = ResourceUtils.createBitmapByName("option6Image");
        soundBoo.addChild(this.spkai);

        this.spguan.x = 0;
        this.spkai.x = 30;

        soundBoo.x = 182;
        soundBoo.y = 148;
        soundBoo.touchEnabled = true;
        soundBoo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickHandler, this);


        // 初始状态
        if (GameData.closeBgMusic) {
            this.spguanbg.visible = true;
            this.spkaibg.visible = false;
        } else {
            this.spguanbg.visible = false;
            this.spkaibg.visible = true;
        }

        if (GameData.closeMusic) {
            this.spguan.visible = true;
            this.spkai.visible = false;
        } else {
            this.spguan.visible = false;
            this.spkai.visible = true;
        }
    }
    private onTouchThis(e: egret.TouchEvent): void {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
    private spguanbg: egret.Bitmap;
    private spkaibg: egret.Bitmap;
    private spguan: egret.Bitmap;
    private spkai: egret.Bitmap;
    private clickHandler(e: egret.TouchEvent): void {
        if (!GameData.closeMusic) {
            this.spkai.visible = false;
            this.spguan.visible = true;
            GameData.closeMusic = true;
        } else {
            this.spkai.visible = true;
            this.spguan.visible = false;
            GameData.closeMusic = false;
        }
    }
    private clickBgHandler(e: egret.TouchEvent): void {
        if (!GameData.closeBgMusic) {
            this.spguanbg.visible = true;
            this.spkaibg.visible = false;
            GameData.closeBgMusic = true;
        } else {
            this.spguanbg.visible = false;
            this.spkaibg.visible = true;
            GameData.closeBgMusic = false;
        }
    }
    private closePop(e: egret.TouchEvent): void {
        // ??? 这个判断出于什么考虑
        if (this.parent)
            GameData.isClickBtn = false;
        this.visible = false;
    }
    public removeAll(): void {
        this.removeChildren();
    }
}
