class BgView extends egret.Sprite {
    constructor() {
        super();
    }
    private bg1: BackGroundView;
    private bg2: BackGroundView;
    private bg1Height: number = 0;
    private bg2Height: number = 0;
    // public initView(num: number): void {
    public initView(): void {
        // 两张图拼接
        this.bg2 = new BackGroundView();
        this.addChild(this.bg2);

        this.bg1 = new BackGroundView();
        this.addChild(this.bg1);

        this.bg1Height = this.bg1.height;
        this.bg1.y = -this.bg1Height + Const.SCENT_HEIGHT;

        this.bg2Height = this.bg2.height;
        this.bg2.y = this.bg1.y - this.bg2Height;
    }

    public updata(): void {
        if (this.bg1.y >= Const.SCENT_HEIGHT) {
            this.bg1.y = this.bg2.y - this.bg1Height;
        }
        if (this.bg2.y >= Const.SCENT_HEIGHT) {
            this.bg2.y = this.bg1.y - this.bg2Height;
        }

        this.bg1.y += GameData.bgSpeed;
        this.bg2.y += GameData.bgSpeed;
    }

    public dispose(): void {
        this.removeChildren();
        this.bg1 = null;
        this.bg2 = null;
    }
}