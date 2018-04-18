class RoomView extends egret.Sprite {
    private roomIdTxt: egret.TextField;
    private roomItem1Sp: egret.Sprite;
    private roomItem2Sp: egret.Sprite;
    private userName1Txt: egret.TextField;
    private userName2Txt: egret.TextField;

    private gameEnterView: GameEnterView;
    private userName1TxtBaseHeight: number;
    private userName2TxtBaseHeight: number;

    private kickPlayerBtn: MyButtonForGame;
    private addRobotBtn: MyButtonForGame;
    private startGameBtn: MyButtonForGame;

    constructor(view) {
        super();

        this.gameEnterView = view;

        this.initView();
    }

    public initView() {
        this.width = Const.SCENT_WIDTH;
        this.height = Const.SCENT_HEIGHT - 130;

        this.roomIdTxt = new egret.TextField();
        this.roomIdTxt.text = "房间ID: 0";
        this.roomIdTxt.x = this.width / 2 - this.roomIdTxt.width / 2;
        this.roomIdTxt.y = 2;
        this.roomIdTxt.textColor = 0x89512b;
        this.roomIdTxt.fontFamily = "Microsoft YaHei UI";
        this.roomIdTxt.size = 19;
        this.addChild(this.roomIdTxt);




        /**
         * room item 1
         */
        this.roomItem1Sp = new egret.Sprite();
        // this.roomItem1Sp.width = 420;
        // this.roomItem1Sp.height = 100;
        this.addChild(this.roomItem1Sp);

        let roomItem1Bg: egret.Bitmap = ResourceUtils.createBitmapByName("roomBg_png");
        roomItem1Bg.width = 420;
        roomItem1Bg.height = 100;
        roomItem1Bg.x = this.width / 2 - roomItem1Bg.width / 2;
        roomItem1Bg.y = this.roomIdTxt.y + this.roomIdTxt.height + 20;
        this.roomItem1Sp.addChild(roomItem1Bg);


        this.userName1Txt = new egret.TextField();
        this.userName1Txt.text = "--";
        this.userName1Txt.size = 20;
        this.userName1Txt.textColor = 0xffffff;
        this.userName1Txt.x = roomItem1Bg.x + 25;

        this.userName1TxtBaseHeight = roomItem1Bg.y + roomItem1Bg.height / 2;
        this.userName1Txt.y = this.userName1TxtBaseHeight - this.userName1Txt.height / 2;
        this.roomItem1Sp.addChild(this.userName1Txt);

        let ownerTxt = new egret.TextField();
        ownerTxt.text = "房主";
        ownerTxt.size = 20;
        ownerTxt.textColor = 0x2ad23f;
        ownerTxt.fontFamily = "Microsoft YaHei UI";
        ownerTxt.bold = true;
        ownerTxt.x = roomItem1Bg.x + roomItem1Bg.width - 60 - ownerTxt.width / 2;
        ownerTxt.y = roomItem1Bg.y + roomItem1Bg.height / 2 - ownerTxt.height / 2;
        this.roomItem1Sp.addChild(ownerTxt);


        /**
         * room item 2
         */
        this.roomItem2Sp = new egret.Sprite();
        this.addChild(this.roomItem2Sp);

        let roomItem2Bg: egret.Bitmap = ResourceUtils.createBitmapByName("roomBg_png");
        roomItem2Bg.width = roomItem1Bg.width;
        roomItem2Bg.height = roomItem1Bg.height;
        roomItem2Bg.x = roomItem1Bg.x;
        roomItem2Bg.y = roomItem1Bg.y + roomItem1Bg.height + 10;
        this.roomItem2Sp.addChild(roomItem2Bg);

        this.userName2Txt = new egret.TextField();
        this.userName2Txt.text = "--";
        this.userName2Txt.size = 20;
        this.userName2Txt.textColor = 0xffffff;
        this.userName2Txt.x = this.userName1Txt.x;

        this.userName2TxtBaseHeight = roomItem2Bg.y + roomItem2Bg.height / 2;
        this.userName2Txt.y = this.userName2TxtBaseHeight - this.userName2Txt.height / 2;
        this.roomItem2Sp.addChild(this.userName2Txt);

        this.kickPlayerBtn = new MyButtonForGame("btn_kickPlayer_png", "btn_kickPlayer_png");
        // let ownerTxt = new egret.TextField();
        // ownerTxt.text = "房主";
        // ownerTxt.size = 20;
        // ownerTxt.textColor = 0x2ad23f;
        // ownerTxt.fontFamily = "Microsoft YaHei UI";
        // ownerTxt.bold = true;
        this.kickPlayerBtn.x = roomItem2Bg.x + roomItem2Bg.width - 60 - this.kickPlayerBtn.width / 2;
        this.kickPlayerBtn.y = roomItem2Bg.y + roomItem2Bg.height / 2 - this.kickPlayerBtn.height / 2;
        this.roomItem2Sp.addChild(this.kickPlayerBtn);
        this.kickPlayerBtn.setClick(this.kickPlayer.bind(this));
        this.kickPlayerBtn.visible = false;

        this.addRobotBtn = new MyButtonForGame("btn_addRobot_png", "btn_addRobot_png");
        this.addRobotBtn.x = this.kickPlayerBtn.x - this.addRobotBtn.width + this.kickPlayerBtn.width;
        this.addRobotBtn.y = this.kickPlayerBtn.y;
        this.roomItem2Sp.addChild(this.addRobotBtn);
        this.addRobotBtn.setClick(this.addRobot.bind(this));

        // btn_startGame_png
        this.startGameBtn = new MyButtonForGame("btn_startGame_png", "btn_startGame_png");
        this.startGameBtn.x = this.width / 2 - this.startGameBtn.width / 2;
        this.startGameBtn.y = this.height - 200 - this.startGameBtn.height / 2;
        this.addChild(this.startGameBtn);
        this.startGameBtn.setClick(this.startGame.bind(this));

        let leaveRoomBtn = new MyButtonForGame("btn_leaveRoom_png", "btn_leaveRoom_png");
        leaveRoomBtn.x = this.width / 2 - leaveRoomBtn.width / 2;
        leaveRoomBtn.y = this.height - 60 - leaveRoomBtn.height;
        this.addChild(leaveRoomBtn);
        leaveRoomBtn.setClick(this.leaveRoom.bind(this));
    }

    public kickPlayer() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isOwner === false) {
            return
        }
        let userId = Number(this.userName2Txt.text);
        this.gameEnterView.kickPlayer(userId);
    }

    public setRoomIdTxt(i, value?: string) {
        if (i == 1) {
            this.roomIdTxt.text = "房间ID: " + value;
            this.roomIdTxt.x = this.width / 2 - this.roomIdTxt.width / 2;
        } else if (i == 2) {
            this.roomIdTxt.text = "";
            this.roomIdTxt.x = this.width / 2 - this.roomIdTxt.width / 2;
        }
    }

    public setUserName(i, value?: string) {
        if (i == 1) {
            this.userName1Txt.text = value
            // bug
            // this.userName1Txt.size = 20;
            this.userName1Txt.y = this.userName1TxtBaseHeight - this.userName1Txt.height / 2;
        }
        else if (i == 2) {
            this.userName2Txt.text = value;
            // bug
            this.userName2Txt.y = this.userName2TxtBaseHeight - this.userName2Txt.height / 2;
        }
        else if (i == 3) {
            this.userName1Txt.text = "--";
            this.userName2Txt.text = "--";
            // bug
            this.userName1Txt.y = this.userName1TxtBaseHeight - this.userName1Txt.height / 2;
            this.userName2Txt.y = this.userName2TxtBaseHeight - this.userName2Txt.height / 2;
        }
    }

    public leaveRoom() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isLeaveRoomBtnClick) {
            return;
        }
        GameData.isLeaveRoomBtnClick = true;

        this.gameEnterView.leaveRoom();
    }

    public startGame() {
        if (GameData.isServerErrorCode1000) {
            return;
        }
        // if (GameData.players.length < 2) {
        //     return
        // }

        if (GameData.joinOverStatus >= 2) {
            return;
        }

        if (GameData.setFrameStatus >= 2) {
            return;
        }

        if (!GameData.isOwner) {
            return;
        }

        if (GameData.isAddRobot === true) {
            if (GameData.players.length == 2) {
                this.gameEnterView.gameWillPlayWithRobot();
            }
        }
        else {
            if (GameData.players.length == 2) {
                this.gameEnterView.joinOver();
            }
        }
    }

    public addRobot() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        GameData.isAddRobot = true;


        // robot
        GameData.players[1] = {
            userId: 0,
            userName: "robot",
            type: 'b',
            score: 0,
            blood: 5,
            isDie: false
        }

        this.setUserName(2, "Hi, i am robot");

        this.gameEnterView.joinOver();
    }

    public showKickPlayerBtn() {
        this.kickPlayerBtn.visible = true;
    }

    public hideKickPlayerBtn() {
        this.kickPlayerBtn.visible = false;
    }

    public showAddRobotBtn() {
        this.addRobotBtn.visible = true;
    }

    public hideAddRobotBtn() {
        this.addRobotBtn.visible = false;
    }

    public showStartGameBtn() {
        this.startGameBtn.visible = true;
    }

    public hideStartGameBtn() {
        this.startGameBtn.visible = false;
    }
}