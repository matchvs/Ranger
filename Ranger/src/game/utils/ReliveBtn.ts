class ReliveBtn extends MyButtonForGame {
    private label: egret.TextField;
    constructor() {
        super("btn_relive_png", "btn_relive_png");

        this.initView();
    }

    private initView(): void {
        this.label = new egret.TextField();
        this.addChild(this.label);
        // label.width = 400;
        // label.height = 400;
        this.label.text = "复活10金币";
        this.label.size = 25;
        this.label.textColor = 0xffffff;
        this.label.fontFamily = "Microsoft YaHei UI";
        this.label.textAlign = egret.HorizontalAlign.CENTER;
        this.label.verticalAlign = egret.VerticalAlign.MIDDLE;
        // //设置描边属性
        this.label.strokeColor = 0x92521e;
        this.label.stroke = 2;

        this.label.x = this.width / 2 - this.label.width / 2;
        this.label.y = this.height / 2 - this.label.height / 2 - 5;
    }

    public setValue(value) {
        this.label.text = value + "";
        this.label.x = this.width / 2 - this.label.width / 2;
    }
}