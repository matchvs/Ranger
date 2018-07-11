class StreakNum extends egret.Sprite {
    private showSorce: eui.Label;
    private conboW: number = 0;
    constructor() {
        super();
        this.initView();
    }

    private initView(): void {
        var combo: egret.Bitmap = ResourceUtils.createBitmapByName("combo_png");
        
        combo.width *= Utils.wWidthScale();
        combo.height *= Utils.wHeightScale();


        this.addChild(combo);
        this.conboW = combo.width;
        this.showSorce = new eui.Label();
        this.showSorce.textColor = 0xc2c2c2
        this.showSorce.bold = true
        this.showSorce.size = 40
        this.showSorce.x = this.conboW / 2 - this.showSorce.width / 2;
        this.showSorce.y = combo.height + 15 * Utils.wHeightScale();
        this.addChild(this.showSorce);
    }

    public setValue(sorce: number = 0): void {
        this.showSorce.x = this.conboW / 2 - this.showSorce.width / 2;
        this.showSorce.text = sorce + "";
    }
}