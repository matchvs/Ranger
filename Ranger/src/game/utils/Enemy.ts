class Enemy extends egret.Sprite {
    public row: number = 0;

    // r. 红
    // b. 蓝
    public type: string;
    public name: string = "";

    public over: Boolean = false;
    public guo: Boolean = false;
    public die: Boolean = false;

    public stopMove: Boolean = false;

    private sp: StarlingSwfMovieClip;

    constructor(type: number) {
        super()

        this.initView(type);
        // this.initView();
    }

    public initView(type): void {
        if (type === "r") {
            this.sp = StarlingSwfFactory.getInstance().makeMc("honglang");
        } else if (type === "b") {
            this.sp = StarlingSwfFactory.getInstance().makeMc("lanlang");
        }
        // this.sp = StarlingSwfFactory.getInstance().makeMc("lang");
        this.sp.goToPlay("run");
        // this.bold = 1;

        this.addChild(this.sp);
    }


    public goToStop(): void {
        this.sp.gotoAndStop(0);
    }

    public gotoDie(): void {
        this.sp.goToPlay("die");
    }

    public move(): void {
        if (this.stopMove) {
            this.goOut();
        }

        else {
            // 820
            if (this.y < 1000 * Utils.wYScale()) {
                // this.y += GameData.enemySpeed;
                var newY = this.y + GameData.enemySpeed * Utils.wYScale()
                egret.Tween.get(this).to({ "y": newY }, 100)
            }
            // 820
            else {
                this.y = 1000 * Utils.wYScale();
                this.over = true;
            }
            // else {
            //     this.y = 820;
            //     this.over = true;
            // }
        }

        // if (this.y < 820) {
        //     if (this.onjump) {
        //         this.y -= GameData.enemySpeed * 3;
        //         this.goToJjump();
        //         this.isStopHasClick = true;
        //         if (this.y <= 160) {
        //             this.sp.goToPlay("run");
        //             this.onjump = false;
        //             this.isStopHasClick = false;
        //             
        //         }
        //         return;
        //     }
        //     if (!this.stopMove) {
        //         this.y += GameData.enemySpeed;
        //     }
        // }
        // else {
        //     this.y = 820;
        //     this.over = true;
        // }
    }

    public goOut(): void {
        if (this.row === 0) {
            this.x -= 15 * Utils.wXScale();
            this.y -= 15 * Utils.wYScale();
            // var newX = this.x - 15
            // var newY = this.y - 15
            // egret.Tween.get(this).to({ "x": newX, "y": newY }, 10)
        }
        else if (this.row === 1) {
            this.x -= 15 * Utils.wXScale();
            this.y -= 20 * Utils.wYScale();
            // var newX = this.x - 15
            // var newY = this.y - 20
            // egret.Tween.get(this).to({ "x": newX, "y": newY }, 10)
        }
        else if (this.row === 2) {
            this.x += 15 * Utils.wXScale();
            this.y -= 20 * Utils.wYScale();
            // var newX = this.x + 15
            // var newY = this.y - 20
            // egret.Tween.get(this).to({ "x": newX, "y": newY }, 10)
        }
        else if (this.row === 3) {
            this.x += 15 * Utils.wXScale();
            this.y -= 15 * Utils.wYScale();
            // var newX = this.x + 15
            // var newY = this.y - 15
            // egret.Tween.get(this).to({ "x": newX, "y": newY }, 10)
        }
    }

    public dispose(): void {
        this.removeChildren();
    }
}