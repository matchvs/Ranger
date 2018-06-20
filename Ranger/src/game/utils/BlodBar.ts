class BlodBar extends egret.Sprite {
    private r: egret.Rectangle;
    private type: string;
    private blodBar: egret.Bitmap;
    private w: number = 0;
    constructor(type: string) {
        super();
        this.type = type;
        this.initView(type);
    }

    private initView(type: string): void {
        var barBg: egret.Bitmap
        var blodBar: egret.Bitmap

        if (type === "r") {
            barBg = ResourceUtils.createBitmapByName("rBlodBarBgImage");
            blodBar = ResourceUtils.createBitmapByName("rBlodBarImage");
        } else if (type === "b") {
            barBg = ResourceUtils.createBitmapByName("bBlodBarBgImage");
            blodBar = ResourceUtils.createBitmapByName("bBlodBarImage");
        }

        barBg.width *= Utils.wWidthScale();
        barBg.height *= Utils.wHeightScale();

        blodBar.width *= Utils.wWidthScale();
        blodBar.height *= Utils.wHeightScale();

        this.addChild(barBg);
        this.addChild(blodBar);

        this.blodBar = blodBar;

        blodBar.x = 32 * Utils.wXScale();
        blodBar.y = 7 * Utils.wYScale();

        /**
         * rectangle
         */
        this.w = blodBar.width;
        this.r = new egret.Rectangle();
        this.r.x = 0;
        this.r.y = 0;
        this.r.width = blodBar.width;
        this.r.height = blodBar.height;
        blodBar.mask = this.r;
    }

    public scaleBlodX(blood:any,max:any): void {

        this.r.x = -(this.w - this.w * (blood / max));
        this.blodBar.mask = this.r
    }
}
