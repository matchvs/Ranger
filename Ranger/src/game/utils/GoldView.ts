class GoldView extends egret.Sprite {
    // private uiSp: egret.Sprite;
    private goldValue: egret.TextField;

    constructor() {
        super();
        this.initView();
    }

    private initView() {
        let goldBg: egret.Bitmap = ResourceUtils.createBitmapByName("goldBg"); 
        let gold: egret.Bitmap = ResourceUtils.createBitmapByName("gold");

        goldBg.width *= Utils.wWidthScale();
        goldBg.height *= Utils.wHeightScale();

        gold.width *= Utils.wWidthScale();
        gold.height *= Utils.wHeightScale();

        gold.x = 10 * Utils.wYScale();
        gold.y = goldBg.height / 2 - gold.height / 2;

        this.addChild(goldBg);
        this.addChild(gold);

        this.goldValue = new egret.TextField();
        // Microsoft YaHei UI
        this.goldValue.size = 24 * Utils.wYScale();
        this.goldValue.textColor = 0xfecb38;
        this.goldValue.text = "0";
        this.goldValue.width = 120 * Utils.wWidthScale();
        this.goldValue.height = 32 * Utils.wHeightScale();
        // this.goldValue.bold = true;
        this.goldValue.x = 20 * Utils.wXScale();
        // this.goldValue.y = this._btn.y;
        this.goldValue.textAlign = "center";
        this.goldValue.verticalAlign = "middle";

        this.addChild(this.goldValue);
    }

    public setValue(value: string) {
        this.goldValue.text = value;
        
    }
}