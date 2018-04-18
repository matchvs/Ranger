class JoinRoomView extends egret.Sprite {
    private bg: egret.Bitmap;
    private closeBtn: MyButtonForGame;
    private avatarBmp: egret.Bitmap;
    private allValue: egret.TextField;
    private winValue: egret.TextField;
    private dMask: egret.Bitmap;
    private roomId: string;
    private gameEnterView: GameEnterView;
    private roomIdInput: egret.TextField;
    private patt: RegExp;

    constructor(dMask, view) {
        super();
        this.patt = /[^0-9]/;
        this.dMask = dMask;
        this.gameEnterView = view;
        this.initView();
    }

    public initView() {
        this.bg = ResourceUtils.createBitmapByName("profileBg_png");
        this.addChild(this.bg);

        this.closeBtn = new MyButtonForGame("btn_close_png", "btn_close_png");
        this.addChild(this.closeBtn);
        this.closeBtn.x = this.bg.width - this.closeBtn.width / 2;
        this.closeBtn.y = - this.closeBtn.height / 2;
        this.closeBtn.setClick(this.closeBtnHandler.bind(this));

        let roomIdTxt = new egret.TextField();
        roomIdTxt.text = "输入房间ID";
        roomIdTxt.textColor = 0x333333;
        roomIdTxt.fontFamily = "Microsoft YaHei UI";
        roomIdTxt.size = 18
        roomIdTxt.x = this.bg.width / 2 - roomIdTxt.width / 2;
        roomIdTxt.y = 46;
        this.addChild(roomIdTxt);

        // let 
        let roomIdInputBg = ResourceUtils.createBitmapByName("inputBg_png")
        roomIdInputBg.width = 360;
        roomIdInputBg.height = 48;
        roomIdInputBg.x = this.bg.width / 2 - roomIdInputBg.width / 2;
        roomIdInputBg.y = 89;
        this.addChild(roomIdInputBg);

        this.roomId = "";

        this.roomIdInput = new egret.TextField();
        this.roomIdInput.type = egret.TextFieldType.INPUT;
        this.roomIdInput.size = 18;
        this.roomIdInput.textColor = 0x000000;
        this.roomIdInput.fontFamily = "Microsoft YaHei UI";
        this.roomIdInput.width = roomIdInputBg.width - 30;
        this.roomIdInput.height = roomIdInputBg.height;
        this.roomIdInput.x = roomIdInputBg.x + 15;
        this.roomIdInput.y = roomIdInputBg.y + roomIdInputBg.height / 2 - this.roomIdInput.height / 2;
        this.roomIdInput.verticalAlign = "middle";
        this.roomIdInput.addEventListener(egret.Event.CHANGE, () => {
            this.roomId = this.roomIdInput.text;
        }, this);
        this.addChild(this.roomIdInput);

        let joinRoomBtn = new MyButtonForGame("btn_joinRoom2_png", "btn_joinRoom2_png");
        joinRoomBtn.x = this.bg.width / 2 - joinRoomBtn.width / 2
        joinRoomBtn.y = 165
        this.addChild(joinRoomBtn);
        joinRoomBtn.setClick(this.joinRoom.bind(this));
    }

    private closeBtnHandler() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        GameData.isJoinRoomBtn1Click = false;
        GameData.isJoinRoomBtn2Click = false;

        this.hideJoinRoomView();
    }

    private hideJoinRoomView() {
        if (this.dMask.visible === true && this.visible === true) {
            this.dMask.visible = false;
            this.visible = false;
            GameData.isShowJoinRoomView = false;
        }
    }

    private joinRoom() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isQuickJoinBtnClick === true) {
            return;
        }
        if (GameData.isCreateRoomBtnClick === true) {
            return;
        }
        if (GameData.isRoomItemClick === true) {
            return;
        }

        if (this.patt.test(this.roomId) || this.roomId === "") {
            this.gameEnterView.showPrompt('请输入正确的房间号');
            return;
        }

        if (GameData.isJoinRoomBtn2Click === true) {
            return;
        }

        GameData.isJoinRoomBtn2Click = true;

        this.gameEnterView.joinRoom(this.roomId);
        this.roomIdInput.text = "";
        this.roomId = "";
    }
}