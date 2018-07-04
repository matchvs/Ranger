class Wolf extends egret.Sprite {
    private lastMovedY: number = 0;
    public row: number = 0;
    public time: number = 0;
    private animaTime: number = 1000 / GameData.FPS + GameData.BUFFER_TIME;

    private container: egret.DisplayObjectContainer;
    private sp: StarlingSwfMovieClip;

    public type: string;

    public state: number = 0;
    public constructor(container) {
        super();
        this.container = container;
        this.container.addChildAt(this, 0);
        this.visible = true;
        this.sp = StarlingSwfFactory.getInstance().makeMc("honglang");
        this.addChild(this.sp);
        this.state = AmimationState.ENABLE;
    }
    public init(row, name, type, num) {
        this.row = Number(row);
        this.name = name;
        this.time = num;
        this.x = 120 * row;
        this.y = 0;
        this.setBitmapByType(type);
        this.state = AmimationState.ENABLE;
        this.visible = true;
        this.lastMovedY = this.y;
    }

    public desotry(): void {
        this.container.removeChild(this);
        this.sp.dispose();
    }

    public over(): void {
        this.state = AmimationState.INTERMEDIATE;
        egret.Tween.get(this).to({ "alpha": 0.5 }, 500, egret.Ease.bounceInOut).call(function () {
            this.visible = false;
            this.alpha = 1.0;
            this.state = AmimationState.UNABLE;
        }.bind(this)).play();
    }
    private setBitmapByType(type): void {
        if (this.sp) {
            this.sp.dispose();
        }
        this.type = type;
        // console.log('wolf color: '+type  );
        this.sp = StarlingSwfFactory.getInstance().makeMc(type === GameData.p1 ? "honglang" : "lanlang");
        this.addChild(this.sp);
        this.sp.goToPlay("run");
    }
    public goDie() {
        this.state = AmimationState.INTERMEDIATE;
        this.sp.goToPlay("die");
        egret.Tween.get(this).to({ "x": this.x < 240 ? (-240 + this.x) : (240 + this.x), "y": -100 }, 1000).call(function () {
            // console.log(this.name +"@"+this.hashCode + "go die 2" + new Date().getUTCSeconds());
            this.visible = false;
            this.state = AmimationState.UNABLE;
        }.bind(this)).play();
    }
    public move(distance): void {
        if (this.state != AmimationState.ENABLE) {
            return;
        }
        this.lastMovedY = this.lastMovedY + distance;
        egret.Tween.get(this).to({ "y": this.lastMovedY }, this.animaTime).play();
    }
}