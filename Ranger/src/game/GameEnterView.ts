// TypeScript file

class GameEnterView extends egret.Sprite {
    private thisContainer: egret.Bitmap;
    private sp: egret.Sprite;
    private dMask: egret.Bitmap;
    private profileView: ProfileView;
    private joinRoomView: JoinRoomView;
    private randomMatchView: RandomMatchView;
    private roomView: RoomView;

    private backBtn: MyButtonForGame;
    private quickJoinBtnBtn: MyButtonForGame;
    private createRoomBtn: MyButtonForGame;
    private joinRoomBtn1: MyButtonForGame;
    private avatarPng: egret.Sprite;
    private roomList: RoomList;
    private prompt: Prompt;
    private avatarBmp : egret.Bitmap;
    constructor() {
        super();


        this.sp = new egret.Sprite();
        this.addChild(this.sp);
        this.initView();

        this.mvsBind()
        // setTimeout(() => {
        //     let cpProto = "";
        //     let result = MvsManager.engine.leaveRoom(cpProto);
        //     if (result === 0) {
        //         console.warn('leaveRoom ok', result)
        //     } else {
        //         console.error('leaveRoom error', result)
        //     }
        // }, 70000)

        GameData.isInEnterView = true;

        // getRoomList
        let timer = setInterval(() => {
            if (GameData.isServerErrorCode1000 === true) {
                clearInterval(timer);
                return;
            }

            if (GameData.isInRoomView === true) {
                return;
            }

            if (GameData.isInEnterView == false) {
                clearInterval(timer);
                return;
            }
            this.getRoomList();
        }, 2000)

    }

    // TODO: 注意异步回调的延迟问题
    public mvsBind() {
        MvsManager.response.joinRoomResponse = this.mvsJoinRoomResponse.bind(this);
        MvsManager.response.joinRoomNotify = this.mvsJoinRoomNotify.bind(this);
        MvsManager.response.joinOverResponse = this.mvsJoinOverResponse.bind(this);
        MvsManager.response.sendEventResponse = this.mvsSendEventResponse.bind(this);
        MvsManager.response.sendEventNotify = this.mvsSendEventNotify.bind(this);
        MvsManager.response.setFrameSyncResponse = this.mvsSetFrameSyncResponse.bind(this);
        MvsManager.response.createRoomResponse = this.mvsCreateRoomResponse.bind(this);
        MvsManager.response.leaveRoomResponse = this.mvsLeaveRoomResponse.bind(this);
        MvsManager.response.leaveRoomNotify = this.mvsLeaveRoomNotify.bind(this);
        MvsManager.response.kickPlayerResponse = this.mvsKickPlayerResponse.bind(this);
        MvsManager.response.kickPlayerNotify = this.mvsKickPlayerNotify.bind(this);
        MvsManager.response.getRoomListResponse = this.mvsGetRoomListResponse.bind(this);
        MvsManager.response.errorResponse = this.mvsErrorResponse.bind(this);
        MvsManager.response.networkStateNotify = this.mvsNetworkStateNotify.bind(this);
    }


    // TODO: 完善
    public mvsUnBind() {
        MvsManager.response.joinRoomResponse = null;
        MvsManager.response.joinRoomNotify = null;
        MvsManager.response.joinOverResponse = null;
        MvsManager.response.sendEventResponse = null;
        MvsManager.response.sendEventNotify = null;
        MvsManager.response.setFrameSyncResponse = null;
        MvsManager.response.createRoomResponse = null;
        MvsManager.response.leaveRoomResponse = null;
        MvsManager.response.leaveRoomNotify = null;
        MvsManager.response.kickPlayerResponse = null;
        MvsManager.response.kickPlayerNotify = null;
        MvsManager.response.getRoomListResponse = null;
        MvsManager.response.errorResponse = null;
        MvsManager.response.networkStateNotify = null;
    }

    public mvsNetworkStateNotify(notifyData) {
        console.log('mvsNetworkStateNotify', notifyData);

        let data = {
            userId: notifyData.userID,
            state: notifyData.state,
            roomId: notifyData.roomID,
            ownerId: notifyData.owner,
        };

        if (data.state === 1) {
            if (GameData.isOwner) {
                this.showPrompt("有玩家掉线 自动踢掉");

                let cpProto = "";
                this.mvsKickPlayer(data.userId, cpProto);
            }

            else {
                if (data.userId === data.ownerId) {
                    this.showPrompt('房主掉线 自动离开房间');
                    this.roomView.leaveRoom();
                }
                else {
                    this.showPrompt('有玩家掉线 自动踢掉');
                }
            }
        }
    }

    public showPrompt(value) {
        this.prompt.alpha = 1;
        this.prompt.visible = true;
        this.prompt.setValue(value);

        egret.Tween.get(this.prompt).to({ "alpha": 0, "visible": false }, 2000)
    }

    public initView(): void {
        var bg: egret.Bitmap = ResourceUtils.createBitmapByName("roomBg");
        bg.width = Const.SCENT_WIDTH;
        bg.height = Const.SCENT_HEIGHT;
        this.addChild(bg);



        this.avatarPng = new egret.Sprite();
        this.avatarPng.touchEnabled = true;
        this.avatarPng.width = 65 * Utils.wWidthScale();
        this.avatarPng.height = 65 * Utils.wHeightScale();
        this.avatarPng.x = 20 * Utils.wXScale();
        this.avatarPng.y = 20 * Utils.wYScale();
        // this.avatarPng.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showProfileView, this);
        this.avatarPng.addEventListener(egret.TouchEvent.TOUCH_TAP, this.avatarClickHandler, this);
        this.addChild(this.avatarPng);

        this.avatarBmp = ResourceUtils.createBitmapByName("avatar_png");

        this.avatarBmp.width = 65 * Utils.wWidthScale();
        this.avatarBmp.height = 65 * Utils.wHeightScale();
        this.avatarPng.addChild(this.avatarBmp);


        var userNameTxt: egret.TextField = new egret.TextField();
        userNameTxt.size = 18 * Utils.wYScale();
        userNameTxt.textColor = 0xffffff;
        // userNameTxt.text = Const.userName;
        userNameTxt.text = "" + Const.userId;
        userNameTxt.x = 104 * Utils.wXScale();
        userNameTxt.y = 28 * Utils.wYScale();
        userNameTxt.verticalAlign = "middle";
        this.addChild(userNameTxt);
        var self:any = this;
        try {
            getWxUserInfo(function (userinfo) {
                console.log("get wx.userinfo success ", userinfo);
                userNameTxt.text = userinfo.nickName;
                self.loadAvatar(userinfo.avatarUrl);
            });
        } catch (error) {
            console.log("get wx.userinfo is fail"+error);
        }


        var bg = ResourceUtils.createBitmapByName("logo_png");
        bg.width = Const.SCENT_WIDTH * 0.7;
        bg.height = Const.SCENT_HEIGHT * 0.7;
        bg.x = Const.SCENT_WIDTH / 2;
        bg.y = Const.SCENT_HEIGHT / 2 - 100;
        bg.anchorOffsetX = bg.width / 2;
        bg.anchorOffsetY = bg.height / 2;
        this.addChild(bg);



        this.backBtn = new MyButtonForGame("btn_back_png", "btn_back_png");
        this.addChild(this.backBtn);
        this.backBtn.x = 16 * Utils.wXScale();
        this.backBtn.y = 96 * Utils.wYScale();
        this.backBtn.width = this.backBtn.width * 0.8;
        this.backBtn.height = this.backBtn.height * 0.8;
        this.backBtn.setClick(this.backToStartView.bind(this));



        let centerImageView: egret.Bitmap = ResourceUtils.createBitmapByName("goldBg");


        centerImageView.width *= Utils.wWidthScale();
        centerImageView.height *= Utils.wHeightScale();


        this.roomList = new RoomList(this);
        this.addChild(this.roomList);
        this.roomList.x = 0;
        // this.roomList.x = Const.SCENT_WIDTH / 2 - this.roomList.width / 2;
        this.roomList.y = 126 * Utils.wYScale();
        // this.roomList.addRoomItem([{ roomId: 1 }, { roomId: 2 }, { roomId: 3 }, { roomId: 4 }]);
        // this.roomList.addRoomItem([{ roomId: 1 }, { roomId: 2 }, { roomId: 3 }, { roomId: 4 }, { roomId: 5},{ roomId: 6}]);
        // this.roomList.addRoomItem([{ roomId: 1 }, { roomId: 2 }, { roomId: 3 }, { roomId: 4 }, { roomId: 5}, { roomId: 6}, { roomId: 7}, { roomId: 8}]);
        // this.roomList.createGird(50, 50, 9, 9);


        this.quickJoinBtnBtn = new MyButtonForGame("btn_joinRandomRoom_png", "btn_joinRandomRoom_png");
        this.addChild(this.quickJoinBtnBtn);
        this.quickJoinBtnBtn.x = Const.SCENT_WIDTH / 2 - this.quickJoinBtnBtn.width / 2;
        this.quickJoinBtnBtn.y = 612 * Utils.wYScale();
        this.quickJoinBtnBtn.setClick(this.quickJoinBtnBtnHandler.bind(this));

        this.createRoomBtn = new MyButtonForGame("btn_createRoom_png", "btn_createRoom_png");
        this.addChild(this.createRoomBtn);
        this.createRoomBtn.x = this.quickJoinBtnBtn.x;
        this.createRoomBtn.y = this.quickJoinBtnBtn.y + this.quickJoinBtnBtn.height + 20 * Utils.wYScale();
        this.createRoomBtn.setClick(this.createRoomBtnHandler.bind(this));

        this.joinRoomBtn1 = new MyButtonForGame("btn_joinRoom_png", "btn_joinRoom_png");
        this.addChild(this.joinRoomBtn1);
        this.joinRoomBtn1.x = this.quickJoinBtnBtn.x + this.quickJoinBtnBtn.width - this.joinRoomBtn1.width;
        this.joinRoomBtn1.y = this.createRoomBtn.y;
        this.joinRoomBtn1.setClick(this.joinRoomBtn1Handler.bind(this));

        // var startBtn: MyButtonForGame = new MyButtonForGame("startBtnImage", "startBtnImage");
        // this.addChild(startBtn);
        // startBtn.x = Const.SCENT_WIDTH / 2 - startBtn.width / 2;
        // startBtn.y = Const.SCENT_HEIGHT - startBtn.height - 30 - 80;
        // startBtn.setClick(this.JoinRandomRoom.bind(this));

        this.roomView = new RoomView(this);
        this.roomView.y = 130 * Utils.wYScale();
        this.addChild(this.roomView);
        this.roomView.visible = false;

        this.dMask = ResourceUtils.createBitmapByName("maskImage");
        this.dMask.width *= Utils.wWidthScale();
        this.dMask.height *= Utils.wHeightScale();
        this.addChild(this.dMask);
        this.dMask.visible = false;

        this.joinRoomView = new JoinRoomView(this.dMask, this);
        this.joinRoomView.visible = false;
        // this.joinRoomView.x = this.profileView.x;
        // this.joinRoomView.y = this.profileView.y;
        this.joinRoomView.x = Const.SCENT_WIDTH / 2 - this.joinRoomView.width / 2 + 12 * Utils.wXScale();
        this.joinRoomView.y = Const.SCENT_HEIGHT / 2 - this.joinRoomView.height / 2;
        this.addChild(this.joinRoomView);

        this.profileView = new ProfileView(this.dMask);
        this.profileView.setWinValue(GameData.winValue + "");
        this.profileView.setAllValue(GameData.allValue + "");
        this.profileView.visible = false;
        // this.profileView.width = 420;
        // this.profileView.height = 500;
        // this.profileView.x = Const.SCENT_WIDTH / 2 - this.profileView.width / 2 + 12;
        // this.profileView.y = Const.SCENT_HEIGHT / 2 - this.profileView.height / 2;
        this.profileView.x = this.joinRoomView.x;
        this.profileView.y = this.joinRoomView.y;
        this.addChild(this.profileView);

        this.randomMatchView = new RandomMatchView(this.dMask, this);
        this.randomMatchView.x = Const.SCENT_WIDTH / 2 - this.randomMatchView.width / 2;
        this.randomMatchView.y = Const.SCENT_HEIGHT / 2 - this.randomMatchView.height / 2;
        this.addChild(this.randomMatchView);
        this.randomMatchView.visible = false;
        // this.randomMatchView.tickTop();

        this.prompt = new Prompt();
        this.addChild(this.prompt);
        this.prompt.x = Const.SCENT_WIDTH / 2 - this.prompt.width / 2;
        this.prompt.y = Const.SCENT_HEIGHT / 2 - this.prompt.height / 2 + 50;

        this.prompt.visible = false;
    }

    public getRoomList() {
        // if (GameData.isJoinRandomRoom ||
        //     GameData.isJoinRoom ||
        //     GameData.isCreateRoom) {
        //     return
        // }

        if (GameData.getRoomListStatus === 2 || GameData.getRoomListStatus === 5) {
            console.warn('sdk getRoomListing or warting response');
            console.warn('GameData.getRoomListStatus', GameData.getRoomListStatus);
            return;
        }

        GameData.getRoomListStatus = 2;

        let filter = new MsRoomFilter(0, 0, 0, null);
        this.mvsGetRoomList(filter);
    }

    public mvsGetRoomList(filter) {
        let result = MvsManager.getInstance().getRoomList(filter);

        if (result === 0) {
            GameData.getRoomListStatus = 3;
            console.log('sdk getRoomList ok', result);
        } else {
            GameData.getRoomListStatus = 4;
            console.error('sdk getRoomList error', result);
            return;
        }

        GameData.getRoomListStatus = 5;
    }

    public mvsGetRoomListResponse(status, roomInfo) {
        // if (status == 200) {
        //     console.warn('mvsGetRoomListResponse ok', status);
        // } else {
        //     console.error('mvsGetRoomListResponse error', status)
        // }
        if (status === 200) {
            GameData.getRoomListStatus = 6;
            console.log('response getRoomList ok', status, roomInfo);
        } else {
            GameData.getRoomListStatus = 7;
            console.error('response getRoomList error', status, roomInfo);
            return;
        }

        if (GameData.isInRoomView === true) {
            return;
        }

        // 防止回调延迟,导致异常
        if (GameData.isGameStart === true) {
            return;
        }
        // TODO: 游戏界面也是
        // return


        // console.log("roomInfo", roomInfo);
        this.roomList.freshRoomItem(roomInfo);
    }

    public avatarClickHandler() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        this.showProfileView();
    }

    public showProfileView(): void {
        if (this.dMask.visible === false && this.profileView.visible === false) {
            this.dMask.visible = true;
            this.profileView.visible = true;
            GameData.isShowProfileView = true;
        }
    }

    public showRandomMatchView() {
        if (this.dMask.visible === false && this.randomMatchView.visible === false) {
            this.dMask.visible = true;
            this.randomMatchView.visible = true;
            GameData.isShowRandomMatchView = true;
        }
    }

    public hideRandomMatchView() {
        if (this.dMask.visible === true && this.randomMatchView.visible === true) {
            this.dMask.visible = false;
            this.randomMatchView.visible = false;
            GameData.isShowRandomMatchView = false;
        }
    }

    public joinRoomBtn1Handler() {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isShowProfileView === true) {
            return;
        }
        if (GameData.isShowJoinRoomView === true) {
            return;
        }
        console.log('joinRoomBtn1Handler');

        if (GameData.isQuickJoinBtnClick === true) {
            return;
        }
        if (GameData.isCreateRoomBtnClick === true) {
            return;
        }
        if (GameData.isRoomItemClick === true) {
            return;
        }
        if (GameData.isJoinRoomBtn1Click === true) {
            return;
        }
        GameData.isJoinRoomBtn1Click = true;
        // 可以让把这些逻辑直接放在组件中
        this.showJoinRoomView();
    }

    public showJoinRoomView(): void {
        if (this.dMask.visible === false && this.joinRoomView.visible === false) {
            this.dMask.visible = true
            this.joinRoomView.visible = true
            GameData.isShowJoinRoomView = true;
        }
    }

    // public hideProfileView(): void {
    //     if (this.dMask.visible === true && this.profileView.visible === true) {
    //         this.dMask.visible = false
    //         this.profileView.visible = false
    //     }
    // }

    public backToStartView(): void {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isShowProfileView === true) {
            return;
        }
        if (GameData.isShowJoinRoomView === true) {
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
        if (GameData.isJoinRoomBtn1Click === true) {
            return;
        }

        console.log('backToStartView');

        this.resetSomeGameData();
        GameData.isInEnterView = false;

        GameSceneView._gameScene.start();
        this.removeAll();
    }


    public quickJoinBtnBtnHandler(): void {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isShowProfileView === true) {
            return;
        }
        if (GameData.isShowJoinRoomView === true) {
            return;
        }

        console.log('quickJoinBtnBtnHandler');

        if (GameData.isCreateRoomBtnClick === true) {
            return;
        }

        if (GameData.isJoinRoomBtn1Click === true) {
            return;
        }

        if (GameData.isJoinRoomBtn2Click === true) {
            return;
        }

        if (GameData.isRoomItemClick === true) {
            return;
        }

        if (GameData.isQuickJoinBtnClick === true) {
            console.warn('quick join btn has be clicked, please wait response');
            return;
        }

        GameData.isQuickJoinBtnClick = true;

        if (GameData.joinRandomRoomStatus === 2 || GameData.joinRandomRoomStatus === 5) {
            console.warn('sdk joinRandomRooming or wait response');
            console.warn('GameData.joinRandomRoomStatus', GameData.joinRandomRoomStatus);
            return;
        }

        setTimeout(() => {
            GameData.joinRandomRoomStatus = 2;

            let maxPlayer = 2;
            let userProfile = Const.userName;
            this.mvsJoinRandomRoom(maxPlayer, userProfile);
        }, 200)
    }


    public mvsJoinRandomRoom(maxPlayer, userProfile) {

        let result = MvsManager.getInstance().joinRandomRoom(maxPlayer, userProfile);

        if (result === 0) {
            GameData.joinRandomRoomStatus = 3;
            console.log('sdk joinRandomRoom ok', result);
        } else {
            GameData.joinRandomRoomStatus = 4;
            console.warn('sdk joinRandomRoom error', result);
            return;
        }

        GameData.joinRandomRoomStatus = 5;
    }

    public createRoomBtnHandler(): void {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isShowProfileView === true) {
            return;
        }

        if (GameData.isQuickJoinBtnClick === true) {
            return;
        }

        if (GameData.isJoinRoomBtn1Click === true) {
            return;
        }

        if (GameData.isJoinRoomBtn2Click === true) {
            return;
        }

        if (GameData.isRoomItemClick === true) {
            return
        }

        if (GameData.isCreateRoomBtnClick === true) {
            console.warn('create room btn has be clicked, please wait response');
            return;
        }

        GameData.isCreateRoomBtnClick = true;

        if (GameData.createRoomStatus === 2 || GameData.createRoomStatus === 5) {
            console.warn('sdk createRooming or wait response');
            console.warn('GameData.createRoomStatus', GameData.createRoomStatus);
            return;
        }


        setTimeout(() => {
            GameData.createRoomStatus = 2;

            let createInfo = new MsCreateRoomInfo("roomName", 2, 0, 0, 0, "roomProperty");
            let userProfile = Const.userName
            this.mvsCreateRoom(createInfo, userProfile)
        }, 200);
    }

    public mvsCreateRoom(createInfo, userProfile): void {

        let result = MvsManager.getInstance().createRoom(createInfo, userProfile);
        if (result === 0) {
            GameData.createRoomStatus = 3;
            console.log('sdk createRoom ok', result);
        } else {
            GameData.createRoomStatus = 4;
            console.warn('sdk createRoom error', result);
            return;
        }

        GameData.createRoomStatus = 5;
    }

    public mvsCreateRoomResponse(rsp) {
        if (rsp.status === 200) {
            console.log('response createRoom ok', rsp);
            GameData.createRoomStatus = 6;
        } else {
            console.error('response createRoom error', rsp);
            GameData.createRoomStatus = 7;
            return;
        }

        if (GameData.isCreateRoomBtnClick == true) {
            GameData.isInRoomView = true;

            GameData.isOwner = true;
            GameData.roomId = rsp.roomId || rsp.roomID;
            GameData.ownerId = rsp.owner;

            GameData.players[0] = {
                userId: Const.userId,
                userName: Const.userName,
                type: "r",
                score: 0,
                blood: 5,
                isDie: false
            }
            GameData.type = "r";

            this.roomView.showAddRobotBtn();
            this.roomView.hideKickPlayerBtn();
            this.roomView.showStartGameBtn();
            this.roomView.setRoomIdTxt(1, GameData.roomId);
            this.roomView.setUserName(1, String(Const.userId));

            this.showRoomView();
        }
    }

    public showRoomView() {
        // if (this.profileView.visible) {

        // }
        if (this.roomView.visible == false) {

            this.backBtn.visible = false;
            this.quickJoinBtnBtn.visible = false;
            this.createRoomBtn.visible = false;
            this.joinRoomBtn1.visible = false;

            this.profileView.visible = false;
            this.joinRoomView.visible = false;
            this.dMask.visible = false;
            this.roomList.visible = false;

            this.roomView.visible = true
        }
    }

    public hideRoomView() {
        if (this.roomView.visible == true) {

            this.backBtn.visible = true;
            this.quickJoinBtnBtn.visible = true;
            this.createRoomBtn.visible = true;
            this.joinRoomBtn1.visible = true;

            this.profileView.visible = false;
            this.joinRoomView.visible = false;
            this.dMask.visible = false;
            this.roomList.visible = true;

            this.roomView.visible = false;
        }
    }

    // TODO 修改, 拆开
    public joinRoom(roomId): void {
        setTimeout(() => {
            GameData.joinRoomStatus = 2;
            let userProfile = "";
            this.mvsJoinRoom(roomId, userProfile);
        }, 200)
    }

    // public joinRoomByRoomItem(roomId): void {
    //     if (GameData.isJoin) {

    //     }
    // }

    public mvsJoinRoom(roomId, userProfile): void {
        // let roomId = roomId;

        let result = MvsManager.getInstance().joinRoom(roomId, userProfile);
        if (result === 0) {
            GameData.joinRoomStatus = 3;
            console.log('sdk joinRoom ok', result);
        } else {
            GameData.joinRoomStatus = 4;
            console.error('sdk joinRoom error', result);
            return;
        }

        GameData.joinRoomStatus = 5;
    }


    public mvsJoinRoomResponse(status, userInfoList, roomInfo): void {
        // console.log('joinRoomResponse', arguments);
        // 可以这里处理的理由,
        // 必须等待joinRandomRoom或joinRoom或createRoom回调以后,才会发送请求事件
        if (status === 200) {
            if (GameData.isQuickJoinBtnClick === true) {
                GameData.joinRandomRoomStatus = 6;
                console.log('response joinRandomRoom ok', status);
            }

            else if (GameData.isJoinRoomBtn2Click === true || GameData.isRoomItemClick === true) {
                GameData.joinRoomStatus = 6;
                console.log('response joinRoom ok', status);
            }
        }
        else {
            if (GameData.isQuickJoinBtnClick === true) {
                GameData.joinRandomRoomStatus = 7;
                console.error('response joinRandomRoom error', status);
            }

            else if (GameData.isJoinRoomBtn2Click === true || GameData.isRoomItemClick === true) {
                GameData.joinRoomStatus = 7;
                console.error('response joinRoom error', status);
            }
            return;
        }

        if (GameData.isQuickJoinBtnClick) {
            // 自己

            if (userInfoList.length === 0) {
                // GameData.isOwner = true;
                // GameData.roomId = rsp.roomId || rsp.roomID;
                // GameData.ownerId = rsp.owner;

                // me owner
                GameData.players[0] = {
                    userId: Const.userId,
                    userName: Const.userName,
                    type: "r",
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                GameData.type = "r";
                GameData.isOwner = true;
                GameData.roomId = roomInfo.roomId || roomInfo.roomID;
                GameData.ownerId = roomInfo.ownerId;

                this.showRandomMatchView();
                this.randomMatchView.tickTop();
            }

            else if (userInfoList.length === 1) {
                // other owner
                GameData.players[0] = {
                    userId: userInfoList[0].userId,
                    userName: userInfoList[0].userProfile,
                    type: "r",
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                // me
                GameData.players[1] = {
                    userId: Const.userId,
                    userName: Const.userName,
                    type: 'b',
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                GameData.roomId = roomInfo.roomId || roomInfo.roomID;
                GameData.ownerId = roomInfo.ownerId;
                GameData.type = "b";
                GameData.isOwner = false;
            }

            else {
                console.error('mvsJoinRoomResponse length error, userInfoList.length', userInfoList.length);
            }
        }

        else if (GameData.isJoinRoomBtn2Click === true || GameData.isRoomItemClick === true) {
            GameData.isInRoomView = true;

            if (userInfoList.length === 1) {
                GameData.players[0] = {
                    userId: userInfoList[0].userId,
                    userName: userInfoList[0].userProfile,
                    type: "r",
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                // me
                GameData.players[1] = {
                    userId: Const.userId,
                    userName: Const.userName,
                    type: 'b',
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                GameData.type = "b";
                GameData.isOwner = false;
                GameData.roomId = roomInfo.roomId || roomInfo.roomID;
                GameData.ownerId = roomInfo.ownerId;

                this.roomView.hideAddRobotBtn();
                this.roomView.hideKickPlayerBtn();
                this.roomView.hideStartGameBtn();
                this.roomView.setRoomIdTxt(1, GameData.roomId);
                this.roomView.setUserName(1, String(GameData.players[0].userId))
                this.roomView.setUserName(2, String(Const.userId))

                this.showRoomView();

            } else {
                console.error('mvsJoinRoomResponse length error, userInfoList.length', userInfoList.length);
            }
        }
        console.warn('mvsJoinRoomResponse GameData.players', GameData.players);
        console.warn("mvsJoinRoomResponse GameData.type", GameData.type);
    }

    public mvsJoinRoomNotify(userInfo): void {
        // console.log('joinRoomNotify', arguments)

        if (GameData.isQuickJoinBtnClick) {

            if (GameData.players.length === 1) {
                GameData.players[1] = {
                    userId: userInfo.userId,
                    userName: userInfo.userProfile,
                    type: 'b',
                    score: 0,
                    blood: 5,
                    isDie: false
                }
            }

            else {
                console.error('mvsJoinRoomNotify length error, GameData.players.length', GameData.players.length)
            }

            // == 2
            if (GameData.players.length >= 2) {
                if (GameData.isOwner) {

                    let cpProto = ""
                    let result = MvsManager.getInstance().joinOver(cpProto);
                    if (result === 0) {
                        console.warn('joinOver ok', result)
                    } else {
                        console.error('joinOver error', result);
                        return;
                    }
                }
            }
        }
        // 如果房间只是两人的时候,不需要GameData.isCreateRoomBtnClick
        else if (GameData.isCreateRoomBtnClick || GameData.isJoinRoomBtn2Click || GameData.isRoomItemClick) {
            if (GameData.players.length === 1) {
                GameData.players[1] = {
                    userId: userInfo.userId,
                    userName: userInfo.userProfile,
                    type: 'b',
                    score: 0,
                    blood: 5,
                    isDie: false
                }

                this.roomView.hideAddRobotBtn();
                this.roomView.showKickPlayerBtn();
                this.roomView.setUserName(2, String(GameData.players[1].userId));

                // setTimeout(() => {
                //     if (GameData.players.length === 2) {
                //         let cpProto = ""
                //         let result = MvsManager.getInstance().joinOver(cpProto);
                //         if (result === 0) {
                //             console.warn('joinOver ok', result)
                //         } else {
                //             console.error('joinOver error', result);
                //             return;
                //         }
                //     }
                // }, 3000)
            }

            else {
                console.error('mvsJoinRoomNotify length error, GameData.players.length', GameData.players.length)
            }
        }

        console.warn('mvsJoinRoomNotify GameData.players', GameData.players);
        console.warn("mvsJoinRoomNotify GameData.type", GameData.type);
    }

    public joinOver() {
        // if (GameData.isJoinOver == true) {
        //     return;
        // }
        // GameData.isJoinOver == true;
        GameData.joinOverStatus = 2;
        let cpProto = ""
        this.mvsJoinOver(cpProto);
    }

    public mvsJoinOver(cpProto) {
        let result = MvsManager.getInstance().joinOver(cpProto);
        if (result === 0) {
            GameData.joinOverStatus = 3;
            console.warn('sdk joinOver ok', result)
        } else {
            GameData.joinOverStatus = 4;
            console.error('sdk joinOver error', result);
            return;
        }

        GameData.joinOverStatus = 5;
    }

    public mvsSendEventResponse(rsp) {
        let status = rsp.status
        if (status == 200) {
            console.warn("mvsSendEventResponse ok", rsp);
        } else {
            console.error("mvsSendEventResponse error", rsp)
            return;
        }

        this.gameWillPlay();
    }

    public mvsSendEventNotify(rsp): void {
        var data = JSON.parse(rsp.cpProto);
        var event = data.event;
        if (event === Const.GAME_WILL_PLAY_EVENT) {
            this.gameWillPlay();
        } else {
            console.error("GameEnter mvsSendEventNotify", rsp)
        }
    }

    public mvsSetFrameSyncResponse(rsp) {
        // console.log('mvsSetFrameSyncResponse rsp', rsp)

        if (rsp.mStatus === 200) {
            GameData.setFrameStatus = 6;
            console.warn('mvsSetFrameSyncResponse ok', rsp)
        } else {
            GameData.setFrameStatus = 7;
            console.error('mvsSetFrameSyncResponse error', rsp)
            return;
        }

        if (GameData.isAddRobot === true) {
            this.gameWillPlay();
            return
        }

        setTimeout(() => {
            let data = JSON.stringify({
                event: Const.GAME_WILL_PLAY_EVENT
            })
            let result = MvsManager.getInstance().sendEvent(data);
            if (result.result === 0) {
                console.warn('sendEvent ok', result);
            } else {
                console.error('sendEvent error', result);
                return;
            }
        }, 200)
    }


    public gameWillPlayWithRobot() {
        // robot
        // this.gameWillPlay();


        this.joinOver();
    }

    public mvsJoinOverResponse(rsp) {

        if (rsp.status === 200) {
            GameData.joinOverStatus = 6;
            console.warn('response joinOverResponse ok', rsp)
        } else {
            GameData.joinOverStatus = 7;
            console.error('response joinOverResponse error', rsp)
            return
        }

        setTimeout(() => {
            if (GameData.setFrameStatus > 1) {
                return;
            }

            GameData.setFrameStatus = 2;

            var result = MvsManager.getInstance().setFrameSync(10);
            if (result === 0) {
                GameData.setFrameStatus = 3;
                console.warn('setFrameSync ok', result)
            } else {
                GameData.setFrameStatus = 4;
                console.error('setFrameSync error', result)
                return
            }
            GameData.setFrameStatus = 5;
        }, 200)
    }

    public gameWillPlay(): void {
        GameData.isInEnterView = false;
        // GameData.isAddRobot = false;

        GameData.lastRoomId = GameData.roomId;

        this.dispose();

        GameSceneView._gameScene.play();

        this.removeAll();
    }

    public dispose() {
        this.mvsUnBind();
    }

    public removeAll(): void {
        this.removeChildren();
        if (this.parent) {
            this.parent.removeChild(this)
        }
    }

    public kickPlayer(userId) {
        // setTimeout(() => {
        //     var result = MvsManager.getInstance().kickPlayer()
        //     if (result === 0) {
        //         console.warn('setFameSync ok', result)
        //     } else {
        //         console.error('setFameSync error', result)
        //         return
        //     }
        // }, 200)


        let cpProto = ""
        this.mvsKickPlayer(userId, cpProto);
    }

    public mvsKickPlayer(userId, cpProto) {
        setTimeout(() => {
            var result = MvsManager.getInstance().kickPlayer(userId, cpProto)
            if (result === 0) {
                console.warn('sdk kickPlayer ok', result)
            } else {
                console.error('sdk kickPlayer error', result)
                return
            }
        }, 200)
    }


    // 因为只有两人,而且只有房主可以踢人
    public mvsKickPlayerResponse(rsp) {
        let status = rsp.status
        if (status === 200) {
            console.warn('response kickPlayerResponse ok', rsp)
        } else {
            console.error('response kickPlayerResponse error', rsp)
            return
        }

        GameData.players.splice(1, 1);

        this.roomView.hideKickPlayerBtn();
        this.roomView.showAddRobotBtn();
        this.roomView.setUserName(2, "--");
    }

    public mvsKickPlayerNotify(data) {
        let kUserId = data.UserId || data.userId;
        let cpProto = data.cpProto;
        let sUserId = data.srcUserId;

        if (kUserId == Const.userId) {
            this.roomView.setRoomIdTxt(2);
            this.roomView.setUserName(3);

            // GameData.isOwner = false;
            // GameData.roomId = "";
            // GameData.ownerId = 0;

            // GameData.players = [];
            // GameData.type = "";

            // GameData.isCreateRoom = false;
            // GameData.isQuickJoinBtnClick = false;
            // GameData.isJoinRoom = false;

            this.resetSomeGameData();

            this.hideRoomView();
        }
    }

    public resetSomeGameData() {
        // TODO: 完善
        GameData.isQuickJoinBtnClick = false;
        GameData.isCreateRoomBtnClick = false;
        GameData.isJoinRoomBtn1Click = false;
        GameData.isJoinRoomBtn2Click = false;
        GameData.isRoomItemClick = false;
        GameData.isLeaveRoomBtnClick = false;
        GameData.isLeaveRoomBtn2Click = false;

        GameData.isShowProfileView = false;
        GameData.isShowJoinRoomView = false;

        GameData.isAddRobot = false;

        GameData.isOwner = false;
        GameData.ownerId = 0;
        GameData.lastRoomId = "";
        GameData.roomId = "";

        GameData.players = [];
        GameData.type = "";

        GameData.isInRoomView = false;
        // GameData.isInEnterView = false;

        GameData.createRoomStatus = 1;
        GameData.joinRandomRoomStatus = 1;
        GameData.joinRoomStatus = 1;
        GameData.leaveRoomStatus = 1;
        GameData.joinOverStatus = 1;
        GameData.logoutStatus = 1;
        GameData.getRoomListStatus = 1;
        GameData.kickPlayerStatus = 1;
        GameData.setFrameStatus = 1;

        GameData.isGameStart = false;
        GameData.isGameOver = false;
        GameData.isWin = false;
    }

    public leaveRoom() {
        let cpProto = "";
        this.mvsLeaveRoom(cpProto);
    }

    public mvsLeaveRoom(cpProto) {
        setTimeout(() => {
            var result = MvsManager.getInstance().leaveRoom(cpProto);
            if (result === 0) {
                console.warn('sdk leaveRoom ok', result)
            } else {
                console.error('sdk leaveRoom error', result)
                return
            }
        }, 200);
    }

    public mvsLeaveRoomResponse(rsp) {
        let status = rsp.status
        if (status === 200) {
            console.warn('response leaveRoom ok', rsp)
        } else {
            console.error('response leaveRoom  error', rsp)
            return
        }

        if (GameData.isQuickJoinBtnClick === true) {
            this.resetSomeGameData();

            this.randomMatchView.closeTickTop();
            this.hideRandomMatchView();

        }
        if (GameData.isJoinRoomBtn2Click === true || GameData.isCreateRoomBtnClick === true || GameData.isRoomItemClick === true) {

            this.roomView.setRoomIdTxt(2);
            this.roomView.setUserName(3);

            this.resetSomeGameData()

            this.hideRoomView();
        }
    }

    public mvsLeaveRoomNotify(leaveRoomInfo) {
        let lUserId = leaveRoomInfo.userId; // 离开者
        let ownerId = leaveRoomInfo.owner; // 新旧房主

        if (GameData.isQuickJoinBtnClick === true) {
            console.error('此时按照策划设计, 不应该有人离开房间');
            console.error('如果离开了, 是不合理的');
        }
        else if (GameData.isJoinRoomBtn2Click === true || GameData.isCreateRoomBtnClick === true || GameData.isRoomItemClick === true) {

            // 因为只有两个人
            // 离开的是房主,并且自己是新的房主
            if (lUserId == GameData.ownerId && ownerId == Const.userId) {
                GameData.players[0] = GameData.players[1];
                GameData.players[0].type = "r";
                GameData.players.splice(1, 1);

                GameData.type = "r";
                GameData.isOwner = true;
                // GameData.roomId = roomId;
                GameData.ownerId = ownerId;

                this.roomView.showStartGameBtn();
                this.roomView.showAddRobotBtn();
                this.roomView.setUserName(1, String(Const.userId));
                this.roomView.setUserName(2, "--");
            }
            // 离开的不是房主
            else if (lUserId != GameData.ownerId) {
                GameData.players.splice(1, 1);

                this.roomView.setUserName(2, "--");
            }

            this.roomView.hideKickPlayerBtn();
            this.roomView.showAddRobotBtn();
        }
    }

    private loadAvatar(url: any) {
        let imageLoader: egret.ImageLoader = new egret.ImageLoader();
        imageLoader.crossOrigin = "anonymous";
        imageLoader.addEventListener(egret.Event.COMPLETE, this.loadCompleteHandler, this);
        imageLoader.load(url);
    }

    private loadCompleteHandler(event: egret.Event): void {
        let imageLoader = <egret.ImageLoader>event.currentTarget;
        let texture = new egret.Texture();
        texture._setBitmapData(imageLoader.data);

        this.avatarBmp = new egret.Bitmap(texture);
        this.avatarBmp.width = 100;
        this.avatarBmp.height = 100;
        this.avatarPng.addChild(this.avatarBmp);

    }

    public mvsErrorResponse(code: number, msg: string) {
        console.error('mvsErrorResponse', arguments);

        GameData.joinRoomStatus = 1;
        // GameData.isJoinRoom = false;
        this.resetSomeGameData();

        if (code === 1000) {
            GameData.isServerErrorCode1000 = true;
            this.showPromptOfError("你已掉线 请刷新 重开");
        }

        else if (code === 404) {
            this.showPrompt("该房间不能加入");
        }

    }

    public showPromptOfError(value) {
        this.prompt.alpha = 1;
        this.prompt.visible = true;
        this.prompt.setValue(value);
    }
}