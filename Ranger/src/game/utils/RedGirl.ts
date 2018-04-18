class RedGirl extends egret.Sprite {

    private girl: StarlingSwfMovieClip;
    constructor(type: string) {
        super();

        this.initView(type);
    }

    private initView(type: string): void {
        if (type === 'r') {
            this.girl = StarlingSwfFactory.getInstance().makeMc("xiaohongmao");
        } else if (type === 'b') {
            this.girl = StarlingSwfFactory.getInstance().makeMc("xiaolanmao");
        }

        this.addChild(this.girl);
        this.girl.gotoAndStop(0);
    }
    public run(): void {
        this.girl.goToPlay("1");
    }
    public gotoDie(): void {
        this.girl.goToPlay("2");
    }

    public gotoWin(): void {
        this.girl.goToPlay("3");
    }

    public dispose(): void {
        this.removeChildren();
    }
}