class Bomb extends egret.Sprite {
    public speed: number = 0;
    public angle: number = 0;
    public lastX: number = 0;
    public lastY: number = 0;
    private sp: egret.Bitmap;
    constructor() {
        super();
        this.sp = ResourceUtils.createBitmapByName("bomb_png");
        this.sp.width *= 1;
        this.sp.height *= 1;
        this.addChild(this.sp);
        this.sp.x = this.sp.width / 2;
        this.sp.rotation = 90;
        this.speed = 30;
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2
    }

    /**
     * 修改angle
     * 
     * @memberof Bomb
     */
    public fire(src: egret.DisplayObject, dst: egret.DisplayObject): void {
        this.visible = true
        this.x = src.x + src.width / 2;
        this.y = src.y + src.height / 2;
        this.lastX = dst.x+dst.width/2;
        this.lastY = dst.y+dst.width/2;
        egret.Tween.get(this).to({ "x": this.lastX, "y": this.lastY }, 100).call(function () {
            this.visible = false;
        }.bind(this)).play();
        this.rotation = Math.atan2(this.lastY - this.y, this.lastX - this.x) * 180 / Math.PI;
        this.angle = this.rotation;
    }

}