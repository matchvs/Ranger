class BackGroundView extends egret.Sprite {

    constructor() {
        super();
        this.initView();
    }
    // private initView(num: number): void {
    private initView(): void {
        var bg: egret.Bitmap;
        var leftWall: Hinder = new Hinder();
        var rightWall: Hinder = new Hinder();

        bg = ResourceUtils.createBitmapByName("fight1BgImage");
        // bg.width = Const.SCENT_WIDTH;
        // bg.height = Const.SCENT_HEIGHT;
        // bg.anchorOffsetX = bg.width / 2;
        // bg.anchorOffsetY = bg.height / 2;
        // bg.x = 0;
        // bg.y = 0;

        this.addChild(bg);
        leftWall.initView(1, 1);
        rightWall.initView(1, 2);

        // 定位
        this.addChild(rightWall);
        this.addChild(leftWall);
        rightWall.x = Const.SCENT_WIDTH - rightWall.width;
    }
}