class RoomList extends egret.DisplayObjectContainer {
    private content: egret.Sprite;
    private roomId: string;
    private gameEnterView: GameEnterView;

    public constructor(view) {
        super();
        this.gameEnterView = view;
        this.initView();
    }

    private initView() {
        // scrollView.width起初为0
        // this.width = Const.SCENT_WIDTH;
        // this.height = 450;

        this.content = new egret.Sprite();

        let scrollView: egret.ScrollView = new egret.ScrollView();
        scrollView.horizontalScrollPolicy = "off"
        scrollView.verticalScrollPolicy = "on"
        scrollView.setContent(this.content);

        scrollView.width = Const.SCENT_WIDTH;
        scrollView.height = 450 * Utils.wHeightScale();

        this.addChild(scrollView);
    }

    // [{roomId: 1}, {roomId: 2}]
    public freshRoomItem(roomListArr: Array<any>) {
        this.removeRoomItem();

        for (let i = 0, l = roomListArr.length; i < l; i++) {
            let roomItemBmp: egret.Bitmap = ResourceUtils.createBitmapByName("bg_list_png");

            roomItemBmp.width *= Utils.wWidthScale();
            roomItemBmp.height *= Utils.wHeightScale();

            let roomItemSp = new egret.Sprite();
            roomItemSp.touchEnabled = true;
            roomItemSp.x = Const.SCENT_WIDTH / 2 - roomItemBmp.width / 2;
            roomItemSp.y = (100 + 10) * Utils.wYScale() * i;


            // 不能自定义属性???
            // roomItemSp.roomId = roomListArr[i].roomId;
            roomItemSp.name = roomListArr[i].roomID;
            roomItemSp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.roomItemClickHandler, this);

            roomItemSp.addChild(roomItemBmp);
            this.content.addChild(roomItemSp);



            let roomItemTxt = new egret.TextField();
            roomItemTxt.size = 18 * Utils.wYScale();
            roomItemTxt.textColor = 0xffffff;
            roomItemTxt.text = roomListArr[i].roomID + "";
            roomItemTxt.x = 22 * Utils.wXScale();
            roomItemTxt.y = roomItemBmp.height / 2 - roomItemTxt.height / 2;
            roomItemSp.addChild(roomItemTxt);
        }
    }

    public roomItemClickHandler(e: egret.TouchEvent) {
        if (GameData.isServerErrorCode1000) {
            return;
        }

        if (GameData.isQuickJoinBtnClick === true) {
            return;
        }
        if (GameData.isCreateRoomBtnClick === true) {
            return;
        }
        // if (GameData.isJoinRoomBtn1Click === true) {
        //     return;
        // }
        if (GameData.isJoinRoomBtn2Click === true) {
            return;
        }
        if (GameData.isRoomItemClick === true) {
            return;
        }
        GameData.isRoomItemClick = true;

        this.roomId = e.currentTarget.name;

        if (this.roomId === GameData.lastRoomId) {
            return;
        }

        this.joinRoom();
    }

    public joinRoom() {
        this.gameEnterView.joinRoom(this.roomId);
    }

    public removeRoomItem() {
        this.content.removeChildren();
    }
}
