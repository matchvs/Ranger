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


// class RoomList extends egret.DisplayObjectContainer {
//     // private content: egret.Shape;
//     private content: egret.Sprite;
//     public constructor() {

//         super();
//         // this.once(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
//         this.onAddToStage();

//     }
//     private onAddToStage() {
//         //创建内容，边长为50 * 50 的格子 9 * 9个。
//         // var content:egret.Shape = this.createGird(50,50,9,9);
//         // this.content = this.createGird(50,50,9,9);
//         // this.content = new egret.Shape();
//         this.content = new egret.Sprite();

//         //创建ScrollView
//         var myscrollView: egret.ScrollView = new egret.ScrollView();
//         myscrollView.setContent(this.content);

//         myscrollView.width = 200;
//         myscrollView.height = 300;
//         // myscrollView.x = this.stage.stageWidth / 2;
//         // myscrollView.x = Const.SCENT_WIDTH / 2;
//         // myscrollView.y = this.stage.stageHeight / 2;
//         // myscrollView.y = Const.SCENT_HEIGHT / 2;
//         // myscrollView.anchorOffsetX = myscrollView.width / 2;
//         // myscrollView.anchorOffsetY = myscrollView.height / 2;
//         this.addChild(myscrollView);
//         //背景图，用来展现ScrollView 的边界
//         var background: egret.Shape = new egret.Shape();
//         // background.graphics.lineStyle(1, 0x1102cc)
//         // background.graphics.drawRect(0, 0, 200, 300);
//         // background.graphics.endFill();
//         // background.x = Const.SCENT_WIDTH / 2;
//         // background.y = Const.SCENT_HEIGHT / 2;
//         // background.anchorOffsetX = background.width / 2;
//         // background.anchorOffsetY = background.height / 2;
//         // this.addChild(background);

//         // this.createGird(50, 50, 9, 9);
//     }
//     //创建格子函数，根据输入的宽和高来创建一个 row * line的格子图。并返回Shape对象。
//     // private createGird(w:number,h:number,row:number,line:number):egret.Shape {
//     public createGird(w: number, h: number, row: number, line: number) {

//         // var shape:egret.Shape = new egret.Shape();
//         for (var i = 0; i < row; i++) {
//             // for (var j = 0; j < line; j++) {
//             //     if ((j + row * i) % 2 === 0) {
//             //         this.content.graphics.beginFill(0xF9C20B);
//             //         this.content.graphics.drawRect(j * w, i * h, w, h);
//             //         this.content.graphics.endFill();
//             //     }
//             //     else {
//             //         this.content.graphics.beginFill(0x2A9FFF);
//             //         this.content.graphics.drawRect(j * w, i * h, w, h);
//             //         this.content.graphics.endFill();
//             //    }

//             let roomItemBmp: egret.Bitmap = ResourceUtils.createBitmapByName("bg_list_png");
//             roomItemBmp.x = 0;
//             roomItemBmp.y = (100 + 10) * i;
//             roomItemBmp.width = 200;
//             roomItemBmp.height = 100;
//             this.content.addChild(roomItemBmp);
//             // }
//         }
//         // return shape;
//     }

// }