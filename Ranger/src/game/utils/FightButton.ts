class FightButton extends egret.Sprite {
    private button: StarlingSwfMovieClip;
    constructor() {
        super();
        this.initView();
    }

    private initView(): void {
        this.button = StarlingSwfFactory.getInstance().makeMc("bazi");
        this.addChild(this.button);
        this.button.gotoAndStop(0);
    }

    public goPlay(num: number): void {
        this.button.gotoAndStop(num);
    }
}