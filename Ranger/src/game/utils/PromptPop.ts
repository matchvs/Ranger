class PromptPop extends egret.Sprite {
    public targetMc: StarlingSwfMovieClip;
    private isShow: Boolean = false;
    private isInto: Boolean = false;
    private isAway: Boolean = false;
    private isHide: Boolean = false;
    private stay: number = 0;
    private tX: number = 0;
    private tY: number = 0;
    private tw: egret.Tween;

    // 专门写成一个Config,易于辨别
    //提示窗体数据
    public config: Object = {
        "isHide": true,
        "stayTime": 800,
        "tx": 0,
        "ty": 0
    }
    constructor() {
        super();

    }
    public activate(tx: number = 0, ty: number = 0, configType: Object = null): void {
        //初始化字体,背景,缓动数据
        this.config["tx"] = tx;
        this.config["ty"] = ty;
        this.settings(configType);

        this.targetMc = StarlingSwfFactory.getInstance().makeMc("tip");
        this.addChild(this.targetMc);
        this.targetMc.x = this.tX;
        this.targetMc.y = this.tY;
        this.targetMc.visible = false;
    }


    public show(index: string, tweenType: Object = null): void {
        //trace(isHide);
        if (this.targetMc == null) return;

        if (index == null) {
            //            alert("请填入背景索引");
        }

        if (tweenType) {
            if (tweenType["isHide"] != null) this.isHide = tweenType["isHide"];
            if (tweenType["stayTime"] != null) this.stay = tweenType["stayTime"];
            if (tweenType["tx"] != null) this.tX = tweenType["tx"];
            if (tweenType["ty"] != null) this.tY = tweenType["ty"];
        }

        this.setMc(index);//设置背景
        //根据参数开始缓动
        this.tweenStar();
    }

    private tweenStar(): void {
        //        if (this.tw) this.tw.pause(this.tw);
        this.isInto = true;	//正在进入
        this.isShow = true;	//正在显示
        this.isAway = false;	//未消失

        this.targetMc.x = this.tX;
        this.targetMc.y = this.tY;
        this.targetMc.alpha = 1;
        this.targetMc.visible = true;
        this.tw = egret.Tween.get(this.targetMc).call(this.tweenStop, this);
        this.tw.to({ y: this.tY - 200, alpha: 1 }, 200);
    }

    private tweenStop(): void {
        this.isInto = false;	//进入结束

        if (this.isHide) {
            this.isAway = true;	//开始消失
            this.tw = egret.Tween.get(this.targetMc).call(this.tweenOver, this);
            this.tw.to({ alpha: 0, delay: 1, visible: false }, this.stay);
        }

        this.settings();//初始化缓动设置
    }
    private tweenOver(): void {
        this.isShow = false;	//显示结束
        this.isAway = false;	//消失结束
        //settings() ;
    }

    public hide(delay: number = 0): void {
        this.isHide = true;
        this.stay = delay;
        //if (!isInto && !isAway) {
        this.tweenStop();
        //}
    }

    public settings(configType: Object = null): void {
        if (configType != null) {
            for (var c in this.config) {
                this.config[c] = configType[c] != null ? configType[c] : this.config[c];
            }
        }
        // ???
        this.isHide = this.config["isHide"];
        this.stay = this.config["stayTime"];
        this.tX = this.config["tx"];
        this.tY = this.config["ty"];
    }

    private setMc(index: string): void {
        this.targetMc.goToPlay(index);
    }

    public get isSHOW(): Boolean {
        return this.isShow;
    }

    public get isINTO(): Boolean {
        return this.isInto;
    }

    public get isAWAY(): Boolean {
        return this.isAway;
    }

    public removeAll(): void {

    }
}
