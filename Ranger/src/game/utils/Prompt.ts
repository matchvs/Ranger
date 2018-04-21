class Prompt extends egret.Sprite {
    private bg: egret.Bitmap;
    private txt: egret.TextField;

    public constructor() {
        super();
        this.initView();
    }

    public initView() {

        this.bg = ResourceUtils.createBitmapByName('bg_list_png');
        this.bg.height /= 2;

        this.bg.width *= Utils.wWidthScale();
        this.bg.height *= Utils.wHeightScale();

        this.addChild(this.bg);

        this.txt = new egret.TextField();
        this.txt.text = "我是一个测试";
        this.txt.textColor = 0xFF0000;
        this.txt.fontFamily = "Microsoft YaHei UI";
        this.txt.bold = true;
        this.txt.size = 20 * Utils.wYScale();
        this.txt.x = this.bg.width / 2 - this.txt.width / 2;
        this.txt.y = this.bg.height / 2 - this.txt.height / 2;
        this.addChild(this.txt);
    }

    public setValue(value) {
        this.txt.text = value;
        this.txt.x = this.bg.width / 2 - this.txt.width / 2;
    }
}