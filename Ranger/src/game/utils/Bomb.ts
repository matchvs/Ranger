class Bomb extends egret.Sprite
{
    public speed:number = 0;
    public angle:number = 0;
    public lastX:number = 0;
    public lastY:number = 0;
    private sp:egret.Bitmap;
    constructor()
    {
        super();
        this.sp = ResourceUtils.createBitmapByName("bombImage");
        this.addChild(this.sp);
        this.sp.x = this.sp.width/2;
        this.sp.rotation = 90;
        this.speed = 30;
        egret.Ticker.getInstance().register(this.onFrame,this);
    }

    /**
     * 修改angle
     * 
     * @memberof Bomb
     */
    public move():void
    {
        this.rotation = Math.atan2(this.lastY-this.y,this.lastX-this.x)*180/Math.PI;
        this.angle = this.rotation;
    }

    private onFrame():void
    {
        if(!this.visible) return;

        this.x += this.speed*Math.cos(this.angle/180*Math.PI);
        this.y += this.speed*Math.sin(this.angle/180*Math.PI);

        // 斜边小的时候,就不显示了
        var n:number = Math.sqrt(Math.pow(this.x-this.lastX,2)+Math.pow(this.y-this.lastY,2));
        if(n<15)
        {
            //播放爆炸动画
            this.visible = false;
        }
    }
    public dispose():void
    {
        egret.Ticker.getInstance().unregister(this.onFrame,this);
        this.removeChildren();
        this.sp = null;
    }
}