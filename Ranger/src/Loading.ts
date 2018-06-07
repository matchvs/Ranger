class Loading extends egret.Sprite {
    public constructor() {
        super();
        this.createView();
    }
    private textField: egret.TextField;
    private context: egret.DisplayObjectContainer;

    private textField_power: egret.TextField;


    private uiContainer: egret.DisplayObjectContainer;

    private logoUrl = "resource/assets/loading_logo.png";


    private w: number;

    private h: number;

    private createView(): void {
        this.w = Const.SCENT_WIDTH;
        this.h = Const.SCENT_HEIGHT;

        this.textField = new egret.TextField();
        this.textField.y = 500;
        this.textField.textColor = 0xCCCCCC;
        this.textField.size = 46;
        this.textField.width = this.w;
        this.textField.height = 100;
        this.textField.fontFamily = "Black";
        this.textField.textAlign = "center";
        this.textField.text = "加载中…";
		


        this.textField_power = new egret.TextField();
        this.textField_power.text = ".";
        this.textField_power.textColor = 0xCCCCCC;
        this.textField_power.size = 80;
        this.textField_power.fontFamily = "White";
        this.textField_power.textAlign = "center";
        this.textField_power.x= this.w * 0.5;
        this.textField_power.y = this.h * 0.8;
        egret.Tween.get(this.textField_power, { loop:true})
            .to({ rotation: 360 }, 800, egret.Ease.cubicIn).play();

        var bg: egret.Shape = new egret.Shape();

        bg.width = Const.SCENT_WIDTH ;
        bg.height = Const.SCENT_HEIGHT;
        bg.x = (Const.SCENT_WIDTH - bg.width) / 2;
        bg.y = (Const.SCENT_HEIGHT - bg.height) / 2;
        bg.graphics.beginFill(0x333333, 0.8);
        bg.graphics.drawRect(0, 0, this.w,this.h);
        bg.graphics.endFill();
        this.addChild(bg);


        this.addChild(this.textField);

        this.addChild(this.textField_power);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("touch loading");
        }, this);
    }

    public setProgress(current, total): void {
        var num: number = Math.floor((current / total) * 100);
        this.textField.text = "加载中…" + num + "%";
    }
    public static create(context: egret.DisplayObjectContainer): Loading {
        var loading: any = new Loading();
        loading.context = context;
        return loading;
    }
    public show() {
        this.context.addChild(this);
    }
    public close() {
        this.context.removeChild(this);
    }

}
