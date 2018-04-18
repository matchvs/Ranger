class RandomMatchView extends egret.Sprite {
    private bg: egret.Bitmap;
    private backBtn: MyButtonForGame;
    private waitTime: SpecialNumber;
    private timer: any;
    private dMask: egret.Bitmap;
    private gameEnterView: GameEnterView;

    constructor(dMask, view) {
        super();
        this.dMask = dMask;
        this.gameEnterView = view;
        this.initView();
    }

    private initView() {
        this.bg = ResourceUtils.createBitmapByName("profileBg_png");
        this.bg.width /= 2;
        this.bg.height /= 3;
        this.addChild(this.bg);

        let txt = new egret.TextField();
        txt.text = "正在随机匹配";
        txt.size = 20;
        txt.textColor = 0x333333;
        txt.fontFamily = "Microsoft YaHei UI";
        txt.x = this.bg.width / 2 - txt.width / 2;
        txt.y = 30;
        this.addChild(txt);

        this.waitTime = new SpecialNumber("number-");
        this.addChild(this.waitTime);
        this.waitTime.setValue(0 + "");
        this.waitTime.x = this.bg.width / 2 - this.waitTime.width / 2;
        this.waitTime.y = 65;

        this.backBtn = new MyButtonForGame("btn_back_png", "btn_back_png");
        this.backBtn.x = this.bg.width / 2 - this.backBtn.width / 2;
        this.backBtn.y = 100;
        this.addChild(this.backBtn);
        this.backBtn.setClick(this.backBtnClickHandler.bind(this));
    }

    public tickTop() {
        let time = 1;
        this.timer = setInterval(() => {
            if (GameData.isServerErrorCode1000) {
                clearInterval(this.timer);
                return;
            }

            this.waitTime.setValue(time + "");
            this.waitTime.x = this.bg.width / 2 - this.waitTime.width / 2;
            time++;
        }, 1000)
    }

    public closeTickTop() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        clearInterval(this.timer);
        this.waitTime.setValue(0 + "");
    }

    // private hideRandomMatchView() {
    //     if (this.dMask.visible === true && this.visible === true) {
    //         this.dMask.visible = false;
    //         this.visible = false;
    //         GameData.isShowRandomMatchView = false;
    //     }
    // }

    private backBtnClickHandler() {
        if (GameData.isLeaveRoomBtn2Click) {
            return;
        }
        GameData.isLeaveRoomBtn2Click = true;

        this.gameEnterView.leaveRoom();
    }
}