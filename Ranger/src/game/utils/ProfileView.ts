class ProfileView extends egret.Sprite {
    private bg: egret.Bitmap;
    private closeBtn: MyButtonForGame;
    private avatarBmp: egret.Bitmap;
    private allValue: egret.TextField;
    private winValue: egret.TextField;
    private dMask: egret.Bitmap;

    constructor(dMask) {
        super();

        this.dMask = dMask;

        this.initView();
        // this.
    }

    public initView() {
        this.bg = ResourceUtils.createBitmapByName("profileBg_png");
        this.bg.width *= Utils.wWidthScale();
        this.bg.height *= Utils.wHeightScale();
        this.addChild(this.bg);
        // this.bg.width = 420;
        // this.bg.height = 500;

        this.closeBtn = new MyButtonForGame("btn_close_png", "btn_close_png");
        this.closeBtn.width *= Utils.wWidthScale();
        this.closeBtn.height *= Utils.wHeightScale();
        this.addChild(this.closeBtn);
        this.closeBtn.x = this.bg.width - this.closeBtn.width / 2;
        this.closeBtn.y = - this.closeBtn.height / 2;
        this.closeBtn.setClick(this.hideProfileView.bind(this));

        this.loadAvatar();

        let userId = new egret.TextField();
        userId.text = "用户ID: " + Const.userId
        userId.textColor = 0x333333;
        userId.fontFamily = "Microsoft YaHei UI";
        userId.size = 18 * Utils.wYScale();
        userId.x = this.bg.width / 2 - userId.width / 2;
        userId.y = 165 * Utils.wYScale();
        this.addChild(userId);

        let userName = new egret.TextField();
        userName.text = "昵称: " + Const.userName;
        userName.textColor = 0x333333;
        userName.fontFamily = "Microsoft YaHei UI";
        userName.size = 18 * Utils.wYScale();
        userName.x = this.bg.width / 2 - userName.width / 2
        userName.y = userId.y + userId.height + 15 * Utils.wYScale();
        this.addChild(userName);

        // let modifyBtn = new MyButtonForGame("btn_modify_png", "btn_modify_png")
        // modifyBtn.x = this.bg.width / 2 - modifyBtn.width / 2;
        // modifyBtn.y = 241;
        // this.addChild(modifyBtn);
        // modifyBtn.setClick(function () { });

        let allNum = new egret.TextField();
        allNum.text = "游戏总局数";
        allNum.textColor = 0x333333;
        allNum.fontFamily = "Microsoft YaHei UI";
        allNum.size = 19 * Utils.wYScale();
        allNum.x = this.bg.width / 4 - allNum.width / 2;
        allNum.y = 370 * Utils.wYScale();
        this.addChild(allNum);

        let winNum = new egret.TextField();
        winNum.text = "胜利次数";
        winNum.textColor = 0x333333;
        winNum.fontFamily = "Microsoft YaHei UI";
        winNum.size = 19 * Utils.wYScale();
        winNum.x = this.bg.width / 4 * 3 - winNum.width / 2;
        winNum.y = 370 * Utils.wYScale();
        this.addChild(winNum);

        this.allValue = new egret.TextField();
        this.allValue.text = "100";
        this.allValue.textColor = 0xe86218;
        this.allValue.fontFamily = "Microsoft YaHei UI";
        this.allValue.size = 40 * Utils.wYScale();
        // this.allValue.bold = true;
        this.allValue.x = this.bg.width / 4 - this.allValue.width / 2;
        this.allValue.y = allNum.y + 30 * Utils.wYScale();
        this.addChild(this.allValue);

        this.winValue = new egret.TextField();
        this.winValue.text = "6";
        this.winValue.textColor = 0xe86218;
        this.winValue.fontFamily = "Microsoft YaHei UI";
        this.winValue.size = 40 * Utils.wYScale();
        // this.winValue.bold = true;
        this.winValue.x = this.bg.width / 4 * 3 - this.winValue.width / 2;
        this.winValue.y = winNum.y + 30 * Utils.wYScale();
        this.addChild(this.winValue);
    }

    private hideProfileView() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (this.dMask.visible === true && this.visible === true) {
            this.dMask.visible = false;
            this.visible = false;
            GameData.isShowProfileView = false;
        }

    }

    public setAllValue(value: string): void {
        this.allValue.text = value;
        this.allValue.x = this.bg.width / 4 - this.allValue.width / 2;
    }

    public setWinValue(value: string): void {
        this.winValue.text = value;
        this.winValue.x = this.bg.width / 4 * 3 - this.winValue.width / 2;
    }

    private loadAvatar() {
        // let imageLoader: egret.ImageLoader = new egret.ImageLoader();
        // let url = "";
        // imageLoader.crossOrigin = "anonymous";
        // imageLoader.addEventListener(egret.Event.COMPLETE, this.loadCompleteHandler, this);
        // imageLoader.load(url);

        this.loadCompleteHandler();
    }

    // private loadCompleteHandler(event: egret.Event): void {
    private loadCompleteHandler(): void {
        // let imageLoader = <egret.ImageLoader>event.currentTarget;
        // let texture = new egret.Texture();
        // texture._setBitmapData(imageLoader.data);

        // this.avatarBmp = new egret.Bitmap(texture);

        this.avatarBmp = ResourceUtils.createBitmapByName("avatar_png");
        this.avatarBmp.width = 100 * Utils.wWidthScale();
        this.avatarBmp.height = 100 * Utils.wHeightScale();
        this.avatarBmp.x = this.bg.width / 2 - this.avatarBmp.width / 2;
        this.avatarBmp.y = 40 * Utils.wYScale();

        this.addChild(this.avatarBmp);
    }
}