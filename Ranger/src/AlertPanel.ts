class AlertPanel extends egret.DisplayObjectContainer {
    private static _instance: AlertPanel;
    private _panelBg: egret.Shape;
    private _btn: egret.Shape;
    private _btnLabel: egret.TextField;
    private _msgTf: egret.TextField;

    public constructor() {
        super();

        // bug
        // this.once(egret.Event.ADDED, this.initView, this);

        this.initView();
    }


    private initView(): void {
        console.log('initView')
        this.initBG();
        this.initBtn();
        this.initTf();
        this.anchorOffsetX = this.width * 0.5;
        this.anchorOffsetY = this.height * 0.5;

        // bug
        // this.x = this.stage.stageWidth / 2;
        // this.y = this.stage.stageHeight / 2;

        this.x = Const.SCENT_WIDTH / 2;
        this.y = Const.SCENT_HEIGHT / 2;
    }

    private initBG(): void {
        this._panelBg = new egret.Shape();
        this._panelBg.graphics.lineStyle(1, 0x666666, 1);
        this._panelBg.graphics.beginFill(0xffffff, 0.9);
        this._panelBg.graphics.drawRect(0, 0, 300, 200);
        this._panelBg.graphics.endFill();
        this._panelBg.width = 300;
        this._panelBg.height = 200;
        this.addChild(this._panelBg);
    }

    private initBtn(): void {
        this._btn = new egret.Shape();
        this._btn.graphics.lineStyle(1, 0x666666, 1);
        this._btn.graphics.beginFill(0xffffff);
        this._btn.graphics.drawRect(0, 0, 80, 40);
        this._btn.graphics.endFill();
        this._btn.width = 80;
        this._btn.height = 40;
        this._btn.x = 110;
        this._btn.y = 140;
        this._btn.touchEnabled = true;
        this._btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBtn, this);
        this.addChild(this._btn);

        this._btnLabel = new egret.TextField();
        this._btnLabel.size = 20;
        this._btnLabel.textColor = 0x333333;
        this._btnLabel.text = "确定";
        this._btnLabel.width = 80;
        this._btnLabel.height = 40;
        this._btnLabel.bold = true;
        this._btnLabel.x = this._btn.x;
        this._btnLabel.y = this._btn.y;
        this._btnLabel.textAlign = "center";
        this._btnLabel.verticalAlign = "middle";
        this.addChild(this._btnLabel);

    }

    private initTf(): void {
        this._msgTf = new egret.TextField();
        this._msgTf.textAlign = "center";
        this._msgTf.verticalAlign = "middle";
        this._msgTf.width = 240;
        this._msgTf.height = 100;
        this._msgTf.x = 30;
        this._msgTf.y = 20;
        this._msgTf.textColor = 0x555555;
        this._msgTf.size = 25;
        this._msgTf.bold = true;
        this.addChild(this._msgTf);
    }

    public static i(): AlertPanel {
        if (!this._instance)
            this._instance = new AlertPanel();
        return this._instance;
    }

    public showErr(errMsg: string): void {
        this._msgTf.text = errMsg;
        egret.MainContext.instance.stage.addChild(this);
    }

    private onClickBtn(): void {
        if (egret.RuntimeType.WEB == egret.Capabilities.runtimeType)
            this.reloadPage();
        else
            this.hide();
    }

    private reloadPage(): void {
        location.reload();
    }

    public hide(): void {
        if (this.parent)
            this.parent.removeChild(this);
    }
}
