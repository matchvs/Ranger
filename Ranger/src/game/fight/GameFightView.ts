class GameFightView extends egret.Sprite {

    public shanBoo: Boolean = false;
    // public redGirl: RedGirl;
    public dmask: egret.Bitmap;
    public bg: BgView;
    public enemySp: egret.Sprite;
    public bombSp: egret.Sprite;
    public uiSp: egret.Sprite;

    public shan: egret.Bitmap;

    // test 
    public reliveBtn: ReliveBtn;
    public reliveTime: number = 0; // 复活的次数

    // redGirl 
    public redGirl1: RedGirl;
    public redGirl2: RedGirl;

    // arrow
    public arrow: egret.Bitmap;

    // blodBar
    public blodBar1: BlodBar;
    public blodBar2: BlodBar;

    // enemy time
    public timeBoo: number = 0;
    public timeBooRobot: number = 0;

    //保存所有敌人的数组,二维数组
    public allEnemyArr: Array<Array<Enemy>> = [[], [], [], []];

    // fight button
    public fightButtonArr: Array<FightButton> = [];
    public isFire: Boolean = false;
    public btnY: number = 0;
    public widthPoint: number = 0;

    // prompt pop
    public popArr: Array<PromptPop> = [];

    // combo
    public streakWin: number = 0;
    public streakWinNum: StreakNum;

    // bomb
    public bombArr: Array<Bomb> = [];

    // score
    public score1: SpecialNumber;
    public score2: SpecialNumber;

    // goldView
    public goldView: GoldView;

    // gameTime
    public gameTime: SpecialNumber;

    public time: number;
    public fightButtonBaseY: number;

    constructor() {
        super();

        if (GameData.type === "r") {
            this.timeBoo = 0;
        } else if (GameData.type === "b") {
            this.timeBoo = -30;
        }

        if (GameData.isAddRobot === true) {
            this.timeBooRobot = -30 * Utils.wYScale();
        }



        this.initView();
        this.initLayer();
        this.initBomb();

        // this.tickTock();
        egret.Ticker.getInstance().register(this.onFrameHandler, this);


        if (GameData.isAddRobot) {
            this.robotAuto();
        }

        this.mvsBind();
    }

    private robotAuto() {
        // setTimeout(()=> {

        // }, 3000)
    }

    public mvsBind() {
        MvsManager.response.frameUpdate = this.mvsFrameUpdate.bind(this);
        MvsManager.response.sendFrameEventResponse = function (rsp) {
            if (rsp.mStatus === 200) {

            } else {
                console.error('response sendFrameEvent', arguments);
            }
        }
        // MvsManager.response.errorResponse = function () {
        //     console.error('errorResponse', arguments);
        // }
    }

    public mvsUnBind() {
        MvsManager.response.frameUpdate = null;
        MvsManager.response.sendFrameEventResponse = null;
        // MvsManager.response.errorResponse = null;
    }

    public initView(): void {
        this.bg = new BgView();
        this.addChild(this.bg);
        this.bg.initView();
    }

    public initLayer(): void {
        // this.dmask = ResourceUtils.createBitmapByName("mask_png");
        // this.addChild(this.dmask);
        // this.dmask.visible = false; // ???


        /**
         * enemy sp
         */
        this.enemySp = new egret.Sprite();
        this.addChild(this.enemySp);

        /**
         * ui sp
         */
        this.uiSp = new egret.Sprite();
        this.addChild(this.uiSp);

        /**
         * 弓箭
         */
        this.bombSp = new egret.Sprite();
        this.addChild(this.bombSp);

        /**
         * shan
         */
        this.shan = ResourceUtils.createBitmapByName("shanImage");
        this.shan.width = Const.SCENT_WIDTH;
        this.shan.height = Const.SCENT_HEIGHT;
        this.addChild(this.shan);
        this.shan.visible = false;

        /**
         * relive button
         */
        // test
        // this.reliveBtn = new MyButtonForGame("btn_relive_png", "btn_relive_png");
        this.reliveBtn = new ReliveBtn();
        this.addChild(this.reliveBtn);
        this.reliveBtn.x = Const.SCENT_WIDTH / 2 - this.reliveBtn.width / 2;
        this.reliveBtn.y = Const.SCENT_HEIGHT / 2 - this.reliveBtn.height / 2;
        this.reliveBtn.visible = false;
        this.reliveBtn.setClick(this.onReliveBtnHandler.bind(this));

        /**
         * redGirl1
         */
        this.redGirl1 = new RedGirl('r');

        this.redGirl1.scaleX = 1 * Utils.wXScale();
        this.redGirl1.scaleY = 1 * Utils.wYScale();

        this.redGirl1.x = Const.SCENT_WIDTH / 2 - 60 * Utils.wXScale();
        this.redGirl1.y = Const.SCENT_HEIGHT - 50 * Utils.wYScale();
        this.addChild(this.redGirl1);

        /**
         * redGirl2
         */
        this.redGirl2 = new RedGirl('b');

        this.redGirl2.scaleX = 1 * Utils.wXScale();
        this.redGirl2.scaleY = 1 * Utils.wYScale();

        this.redGirl2.x = Const.SCENT_WIDTH / 2 + 60 * Utils.wXScale();
        this.redGirl2.y = Const.SCENT_HEIGHT - 50 * Utils.wYScale();
        this.addChild(this.redGirl2);

        /**
         * arrow 标识是自己
         */
        this.arrow = ResourceUtils.createBitmapByName("arrow_png");
        this.arrow.width = this.arrow.width / 2 * Utils.wWidthScale();
        this.arrow.height = this.arrow.height / 2 * Utils.wHeightScale();
        if (GameData.type === "r") {
            this.arrow.x = 163 * Utils.wXScale();
        } else if (GameData.type === "b") {
            this.arrow.x = 284 * Utils.wXScale();
        }
        this.arrow.y = 630 * Utils.wYScale();
        this.addChild(this.arrow);



        /**
         * 4 button and button handler
         */
        var i: number = 0;
        var n: number = 4;
        for (; i < n; i++) {
            var fightButton: FightButton = new FightButton();
            fightButton.scaleX = 1 * Utils.wXScale();
            fightButton.scaleY = 1 * Utils.wYScale();
            fightButton.touchEnabled = true;

            // 因为是add listener, 不能主动添加参数
            fightButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);

            this.uiSp.addChild(fightButton);
            fightButton.x = (i * (fightButton.width + 14) + 10) * Utils.wXScale();
            fightButton.y = 500 * Utils.wYScale();

            this.fightButtonBaseY = 500 * Utils.wYScale();

            fightButton.name = i + "";
            // this.widthPoint 半
            this.widthPoint = fightButton.width / 2;
            this.btnY = fightButton.y + this.widthPoint * 2;
            this.fightButtonArr.push(fightButton);
        }

        /**
         * blood bar
         */

        this.blodBar1 = new BlodBar("r");
        this.uiSp.addChild(this.blodBar1);
        this.blodBar1.x = 11 * Utils.wXScale();
        this.blodBar1.y = 53 * Utils.wYScale();

        this.blodBar2 = new BlodBar("b");
        this.uiSp.addChild(this.blodBar2);
        this.blodBar2.x = 302 * Utils.wXScale();
        this.blodBar2.y = 53 * Utils.wYScale();

        /**
         * 倒计时
         */
        this.gameTime = new SpecialNumber("number-0");
        this.uiSp.addChild(this.gameTime);
        this.gameTime.setValue(60 + "");
        this.gameTime.x = Const.SCENT_WIDTH / 2 - this.gameTime.width / 2;
        this.gameTime.y = 40 * Utils.wYScale();

        /**
         * 分数
         */

        this.score1 = new SpecialNumber("number-")
        this.uiSp.addChild(this.score1)
        this.score1.setValue(0 + "")
        this.score1.x = this.blodBar1.x + this.blodBar1.width / 2 - this.score1.width / 2
        this.score1.y = 19 * Utils.wYScale();

        this.score2 = new SpecialNumber("number-")
        this.uiSp.addChild(this.score2)
        this.score2.setValue(0 + "")
        this.score2.x = this.blodBar2.x + this.blodBar2.width / 2 - this.score2.width / 2
        this.score2.y = 19 * Utils.wYScale();


        /**
         * 金币
         */
        this.goldView = new GoldView();
        this.uiSp.addChild(this.goldView);
        this.goldView.x = 15 * Utils.wXScale();
        this.goldView.y = 754 * Utils.wYScale();
        this.goldView.setValue(GameData.gold + "");

        /**
         * combo
         */
        this.streakWinNum = new StreakNum();
        this.streakWinNum.x = Const.SCENT_WIDTH / 2 - this.streakWinNum.width / 2;
        this.streakWinNum.y = 125 * Utils.wYScale();;
        this.addChild(this.streakWinNum);
        this.streakWinNum.visible = false;

        /**
         * prompt pop
         */
        i = 0;
        n = 10;
        var prom: PromptPop;
        for (; i < n; i++) {
            prom = new PromptPop();
            prom.activate(Const.SCENT_WIDTH / 2 - 100 * Utils.wXScale(), Const.SCENT_HEIGHT - 300 * Utils.wYScale(), prom.config);
            this.addChild(prom);
            this.popArr.push(prom);
        }

        // this.time

        let ua = window.navigator.userAgent.toLowerCase();
        if (ua) {
            let microStr = "" + ua.match(/MicroMessenger/i);
            if (microStr == "null") {
                this.time = 1500;
            } else if (microStr == "micromessenger") {
                this.time = (Const.SCENT_HEIGHT - this.fightButtonBaseY) / GameData.enemySpeed * Utils.wYScale() * 100;
            }
        } else {
            this.time = 1500;
        }

    }

    public initBomb(): void {
        var i: number = 0;
        var n: number = 10;
        var bomb: Bomb;
        for (; i < n; i++) {
            bomb = new Bomb();
            this.bombSp.addChild(bomb);
            bomb.visible = false;
            this.bombArr.push(bomb);
        }
    }

    public popProm(str: string = ""): void {
        var i: number = 0;
        var n: number = this.popArr.length; // 10

        // 
        for (; i < n; i++) {
            if (this.popArr[i].targetMc.visible == false) {
                this.popArr[i].show(str);
                break;
            }
        }
    }

    // type r b
    public willInitEnemy() {
        var e = Enemy.create();
        let data = JSON.stringify({
            event: Const.WILL_INIT_ENEMY_EVENT,
            name: e.name
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            this.mvsFrameUpdate(data);
            // console.error('sendFrameEvent WILL_INIT_ENEMY_EVENT error', result);
        }

        // for test
        // this.initEnemy(JSON.parse(data))
    }

    public willInitEnemyByRobot() {
        let type = 'b';
        let row = Math.floor(Math.random() * 4);
        let num = GameData.enemyNum;

        let name = type + "_" + row + "_" + num;

        let data = JSON.stringify({
            event: Const.WILL_INIT_ENEMY_EVENT,
            name: name
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            console.error('sendFrameEvent WILL_INIT_ENEMY_EVENT error', result)
        }

        if (Math.random() > 0.6) {
            if (GameData.players[1].isDie) {
                return
            }

            setTimeout(() => {
                this.hitOver({
                    name: name,
                    type: 'b',
                    index: row,
                    rank: 1,
                    score: 30
                });
            }, this.time);
        }
    }

    /**
     * 生成一个敌人
     */
    public initEnemy(data) {
        let name = data.name;
        let nameArr = name.split("_");
        let [type, row, num] = [...nameArr]
        
        var enemy: Enemy = new Enemy(type);
        enemy.scaleX = 1 * Utils.wXScale();
        enemy.scaleY = 1 * Utils.wYScale();
        this.enemySp.addChild(enemy);

        let row_n = Number(row);
        enemy.row = row_n;
        enemy.x = this.fightButtonArr[row_n].x + this.widthPoint;
        enemy.y = 0;
        enemy.type = type;
        enemy.name = name;
        enemy.id = num;
        // console.log("initEnemy [" + name + "] (x" + enemy.x + " y:" + enemy.y + " wh:" + enemy.width + "," + enemy.height);

        this.allEnemyArr[row].push(enemy);
    }
    public enemiesMoveOrStop() {
        for (var i = 0; i < this.allEnemyArr.length; i++) {
            this.enemyMoveOrStop(this.allEnemyArr[i]);
        }
    }

    public enemyMoveOrStop(arr: Array<Enemy>): void {
        if (arr.length == 0) { return }

        let i: number = arr.length;
        let n: number = 0;

        for (; i > n; i--) {
            // move
            if ((<Enemy>arr[i - 1]).over === false) {
                arr[i - 1].move();
            }

            // x
            if ((<Enemy>arr[i - 1]).x < -(<Enemy>arr[i - 1]).width ||
                (<Enemy>arr[i - 1]).x > (<Enemy>arr[i - 1]).width / 2 + Const.SCENT_WIDTH) {
                    console.log("over "+(<Enemy>arr[i - 1]).x);
                (<Enemy>arr[i - 1]).over = true;
            }

            // over
            if ((<Enemy>arr[i - 1]).over === true) {
                (<Enemy>arr[i - 1]).dispose();
                this.enemySp.removeChild((<Enemy>arr[i - 1]));
                arr.splice(i - 1, 1);

                if (arr.length == 0) { return }
                // if (arr[i - 1] == null || arr[i - 1] == undefined) continue;
            }
            else {
                // guo
                if ((<Enemy>arr[i - 1]).guo === false) {
                    if ((<Enemy>arr[i - 1]).y > this.btnY + this.widthPoint / 2) {
                        // (<Enemy>arr[i - 1]).guo = true;

                        let name = arr[i - 1].name;
                        let row = arr[i - 1].row;
                        let type = arr[i - 1].type;
                        // console.error("---------")
                        // console.log("send")
                        // console.error("name", name)
                        // console.error("row", row)
                        // console.error("guo", arr[i - 1].guo)
                        // console.error("---------")

                        this.missFun(name, type, row);
                    }
                }
            }
        }

    }

    public mvsFrameUpdate(data) {

        this.gameTime.setValue(Math.floor(GameData.gameTime / 10) + "");
        this.gameTime.x = Const.SCENT_WIDTH / 2 - this.gameTime.width / 2;

        GameData.gameTime--;
        // console.log('GameData.gameTime', GameData.gameTime)

        let items = data.frameItems ? data.frameItems : [{ "cpProto": data }];
        for (let i = 0; i < items.length; i++) {
            let jsonItems = JSON.parse(items[i].cpProto);
            let event = jsonItems.event;

            if (event === Const.WILL_INIT_ENEMY_EVENT) {
                this.initEnemy(jsonItems);
            }

            // 扣血
            if (event === Const.MISS_FUN_EVENT) {
                this.missOver(jsonItems);
            }

            if (event === Const.ACC_HIT_FUN_EVENT) {
                this.accHitOver(jsonItems);
            }

            // 加分去怪
            if (event === Const.HIT_FUN_EVENT) {
                this.hitOver(jsonItems)
            }

            if (event === Const.RELIVE_EVENT) {
                this.changeBlood(jsonItems, Const.RELIVE_ACTION);
            }


        }

       
    }


    /**
     * fight btn click
     */
    public onBegin(e: egret.TouchEvent): void {
        e.preventDefault();
        GameData.players.forEach(function (item) {
            if (GameData.type === "r" && item.isDie && item.isDie === true) {
                return;
            }
        });


        this.fire(this.redGirl1, e.currentTarget);
        this.colliderCheck(e.currentTarget);
        (<FightButton>e.currentTarget).goPlay();
        // console.log("onbegin   1!!");

    }

    /**
     * 碰撞检测
     * @src 触发碰撞检查的源头
     */
    private colliderCheck(src: egret.DisplayObject): void {
        let enemyOnOneRoad: Array<any> = this.allEnemyArr[Number(src.name)];
        for (var i = 0; i < enemyOnOneRoad.length; i++) {
            var e:Enemy = enemyOnOneRoad[i];
            if (src.hitTestPoint(e.x, e.y + e.height / 3)) {
                console.error(" hit!! s:" + src.x + "," + src.y + "  d:" + e.x + "," + e.y);
                this.boardcastColliderEvent(e.name, 30, 1);
                break;//one tap one check
            }

        }
    }
    /**
     *  die
     *  stopMove
     *  over
     */
    private bTitTest(b: egret.DisplayObject, e: Enemy, arr: Array<any> = [], index: number): void {

        //碰撞检测
        let eY: number = e.y;
        let bY: number = b.y - this.widthPoint / 2;
        // b.y - this.widthPoint / 2 + this.widthPoint * 2 + this.widthPoint
        let circle: number = bY + this.widthPoint * 2 + this.widthPoint;

        let name = e.name;
        let type = e.type;

        if (eY >= bY) {
            if (eY < circle) {
                if (GameData.type === type) {
                    // this.hitFun(name, type, index, 30);

                    if (eY >= (circle - this.widthPoint * 1.2) && eY < (circle - this.widthPoint * 0.8)) {
                        // this.hitFun(e, 1, arr, index);
                        this.boardcastColliderEvent(name, 30, 1);
                    }
                    else if (eY >= circle - this.widthPoint * 1.6 && eY < circle - this.widthPoint * 1.2 || eY >= circle - this.widthPoint * 0.8 && eY < circle - this.widthPoint * 0.4) {
                        // this.hitFun(e, 1, arr, index);
                        this.boardcastColliderEvent(name, 30, 1);
                    }
                    // eY >= circle - this.widthPoint * 2 && eY < circle - this.widthPoint * 1.6
                    // eY >= circle - this.widthPoint * 0.4 && eY < circle + this.widthPoint * 0.2
                    else if (eY >= circle - this.widthPoint * 2 && eY < circle - this.widthPoint * 1.6 || eY >= circle - this.widthPoint * 0.4 && eY < circle + this.widthPoint * 0.2) {
                        // this.hitFun(e, 2, arr, index);
                        this.boardcastColliderEvent(name,30, 2);
                    }
                    else {
                        // this.hitFun(e, 2, arr, index);
                        this.boardcastColliderEvent(name, 30, 2);
                    }

                } else {
                    // accidentally injure
                    let meType: string = GameData.type;
                    this.accHitFun(meType);
                }
            }

            else {
                this.streakWin = 0;
            }
        }
    }


    public missFun(name: string, type: string, index: number) {

        let data = JSON.stringify({
            event: Const.MISS_FUN_EVENT,
            name: name,
            type: type,
            index: index
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            // console.error('sendFrameEvent MISS_FUN_EVENT error', result);
            this.mvsFrameUpdate(data);    
        }
    }

    public accHitFun(type: string) {


        let data = JSON.stringify({
            event: Const.ACC_HIT_FUN_EVENT,
            type: type,
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            console.error('sendFrameEvent accHitFun error', result)
        }
    }
    /**
     * 广播碰撞事件
     */
    public boardcastColliderEvent(name: string,score: number, rank: number) {
        let data = JSON.stringify({
            event: Const.HIT_FUN_EVENT,
            name: name,
            score: score,
            rank: rank
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            // console.error('sendFrameEvent HIT_FUN_EVEN error', result);
            this.mvsFrameUpdate(data);
        }
    }

    public missOver(data) {
        let name = data.name;
        let type = data.type;
        let index = data.index;
        let arr = this.allEnemyArr[index];
        let enemy;

        let i: number = 0;
        let n: number = arr.length;
        for (; i < n; i++) {
            if (arr[i].name == name) {
                enemy = arr[i];
                break;
            }
        }

        if (enemy.guo === true) {
            return;
        }

        if (GameData.type === type) {
            this.streakWin = 0;

            let isDie = type === GameData.players[0].type ?
                GameData.players[0].isDie :
                GameData.players[1].isDie;

            if (!isDie) {
                SoundUtils.instance().playMiss();
                SoundUtils.instance().playBeHit();
            }

        }
        // console.error("---------")
        // console.log("recend")
        // console.error("enemy.name", enemy.name)
        // console.error("enemy.row", enemy.row)
        // console.error("enemy.guo", enemy.guo)
        // console.error("---------")


        enemy.guo = true;

        this.changeBlood({ type: enemy.type }, Const.DROP_ACTION);

        // this.dropBlood(enemy.type);
        // console.error('---------------------')
        // console.error('GameData.players', GameData.players)
        // console.error('---------------------')
    }

    public changeBlood(data, action) {
        if (action === Const.DROP_ACTION) {
            let type = data.type;
            this.dropBlood(GameData.getPlayer(type),type);
        }
        else if (action === Const.RELIVE_ACTION) {
            let type = data.type;
            this.relive(GameData.getPlayer(type),type);
        }
    }

    public dropBlood(player,type: string): void {
        if (type === "r" && GameData.players[0].blood > 0) {
            if (GameData.type === type) {
                this.shanBoo = true

                this.shan.visible = true;
                this.shan.alpha = 1;
                //TODO 添加掉血动画
                egret.Tween.get(this.shan).to({ "alpha": 0, "visible": false }, 300).call(function () {
                    this.shanBoo = false
                }, this);
            }

            GameData.players[0].blood--;
            this.blodBar1.scaleBlodX(player.blood ,GameData.MAX_BLOOD);

            // TODO: 修改UI
            if (GameData.players[0].blood <= 0) {
                GameData.players[0].blood = 0
                GameData.players[0].isDie = true

                // test
                if (GameData.type === type) {
                    this.reliveTime++;


                    let gold = Math.pow(10, this.reliveTime);
                    let value;
                    if (GameData.gold < gold) {
                        value = "金币不足"
                    } else {
                        value = "复活" + gold + "金币";
                    }
                    this.reliveBtn.setValue(value);

                    this.showReliveBtnView();
                }
            }
        }

        else if (type === "b" && GameData.players[1].blood > 0) {
            if (GameData.type === type) {
                this.shanBoo = true

                this.shan.visible = true;
                this.shan.alpha = 1;
                egret.Tween.get(this.shan).to({ "alpha": 0, "visible": false }, 300).call(function () {
                    this.shanBoo = false
                }, this);
            }

            GameData.players[1].blood--;
            this.blodBar1.scaleBlodX(player.blood ,GameData.MAX_BLOOD);

            if (GameData.players[1].blood <= 0) {
                GameData.players[1].blood = 0
                GameData.players[1].isDie = true


                if (GameData.isAddRobot) {
                    setTimeout(() => {
                        this.relive(GameData.getPlayer("b"),"b");
                    }, 5000)
                }
                else {
                    // test
                    if (GameData.type === type) {
                        this.reliveTime++;

                        // let value = "复活" + Math.pow(10, this.reliveTime) + "金币";
                        // this.reliveBtn.setValue(value);

                        let gold = Math.pow(10, this.reliveTime);
                        let value;
                        if (GameData.gold < gold) {
                            value = "金币不足"
                        } else {
                            value = "复活" + gold + "金币";
                        }
                        this.reliveBtn.setValue(value);

                        this.showReliveBtnView()
                    }
                }
            }
        }
    }

    // public show relive view
    public showReliveBtnView() {
        // console.log('one');
        // var startBtn: MyButtonForGame = new MyButtonForGame("startBtnImage", "startBtnImage");
        // this.addChild(startBtn);
        // startBtn.x = Const.SCENT_WIDTH / 2 - startBtn.width / 2;
        // startBtn.y = Const.SCENT_HEIGHT / 2 - startBtn.height / 2;
        // startBtn.setClick(function () {
        //     console.log('relive')
        // })

        this.reliveBtn.visible = true;
    }

    public hideReliveBtnView() {
        this.reliveBtn.visible = false;
    }
    /**复活 */
    public relive(player,type: string): void {
        if (type === "r" && GameData.players[0].blood === 0) {
            GameData.players[0].blood =  GameData.MAX_BLOOD;
            GameData.players[0].isDie = false

           this.blodBar1.scaleBlodX(player.blood ,GameData.MAX_BLOOD);
        }
        else if (type === "b" && GameData.players[1].blood === 0) {
            GameData.players[1].blood =  GameData.MAX_BLOOD;
            GameData.players[1].isDie = false

            this.blodBar1.scaleBlodX(player.blood ,GameData.MAX_BLOOD);
        }
    }

    public accHitOver(data) {
        let type = data.type;

        if (GameData.type === type) {
            this.streakWin = 0;

            let isDie = type === GameData.players[0].type ?
                GameData.players[0].isDie :
                GameData.players[1].isDie;

            if (!isDie) {
                SoundUtils.instance().playBeHit();
            }
        }

        this.changeBlood(data, Const.DROP_ACTION);
    }

    public hitOver(data) {
        let name = data.name;
        let nameArr = name.split("_");
        let [type, row, num] = [...nameArr]
        let rank = data.rank;
        let score = Number(data.score);
        let arr = this.allEnemyArr[row];

        for (var i = 0; i <arr.length; i++) {
            if (arr[i].name == name) {
                let enemy:Enemy;
                enemy = arr[i];
                if (enemy.die) {
                    console.log("is die"+enemy);
                    return;
                } else {
                    console.log("goto die"+enemy);
                    // 加分
                    if (enemy.type === "r") {
                        GameData.players[0].score += score;
                        this.score1.setValue(GameData.players[0].score + "");
                    }
                    else if (enemy.type === "b") {
                        GameData.players[1].score += score;
                        this.score2.setValue(GameData.players[1].score + "");
                    }
                    enemy.gotoDie();
                    enemy.stopMove = true;
                    enemy.die = true;
                    break;
                }

            }
        }

        // 不可重复


        if (GameData.type === type) {
            GameData.langNum++;
            this.streakWin++;

            SoundUtils.instance().playHit();

            if (rank === 1) {
                this.popProm("pop1");
            } else if (rank === 2) {
                this.popProm("pop2");
            }
        }

    }



    public fire(src: egret.DisplayObject, dst: egret.DisplayObject): void {

        // 没有对象池
        // 而是固定个数10个
        // 
        for (var i = 0; i < this.bombArr.length; i++) {
            if (this.bombArr[i].visible == false) {
                this.isFire = true;
                // 每次都重新设置原点
                (<Bomb>this.bombArr[i]).x = src.x;
                (<Bomb>this.bombArr[i]).y = src.y - this.widthPoint;
                (<Bomb>this.bombArr[i]).lastX = dst.x + this.widthPoint;
                (<Bomb>this.bombArr[i]).lastY = dst.y + this.widthPoint;

                (<Bomb>this.bombArr[i]).move();
                (<Bomb>this.bombArr[i]).visible = true;
                break;
            }
        }
    }

    public onFrameHandler(e: egret.Event): void {
        if (GameData.gameTime <= 0) {
            GameData.gameStatus = GameData.GAME_STATUS_OVER;
            return;
        }
        if (GameData.gameStatus === GameData.GAME_STATUS_OVER) {
            SoundUtils.instance().stopBg();
            this.shouldGameOver()
            return;
        }
        if (this.streakWin == 0) {
            this.streakWinNum.visible = false;
        } else {
            this.streakWinNum.visible = true;
            this.streakWinNum.setValue(this.streakWin);
        }

        this.bg.updata();

        this.timeBoo++;
        if (this.timeBoo >= GameData.createEnemyTime) {
            this.timeBoo = 0;
            this.willInitEnemy();
        }

        if (GameData.isAddRobot === true) {
            this.timeBooRobot++;
            if (this.timeBooRobot >= GameData.createEnemyTime) {
                this.timeBooRobot = 0;
                this.willInitEnemyByRobot();
            }
        }
        this.enemiesMoveOrStop();
    }

    public dispose(): void {
        egret.Ticker.getInstance().unregister(this.onFrameHandler, this);

        // removeAllTweens
        egret.Tween.removeAllTweens();

        // this.oneEnemyArr = [];
        // this.popArr = [];
        // this.twoEnemyArr = [];
        // this.threeEnemyArr = [];
        // this.fourEnemyArr = [];
        // this.btnArr = [];
        // this.enemySp = null;
        // this.uiSp = null;
        // this.bg = null;
        // this.redGirl1 = null;
        // this.redGirl2 = null;
    }


    public onReliveBtnHandler() {
        let gold = Math.pow(10, this.reliveTime);

        if (GameData.gold >= gold) {
            GameData.gold -= gold;

            this.goldView.setValue(GameData.gold + "");

            this.hideReliveBtnView();
            this.reliveFun(GameData.type)
        }
        else {
            // TODO: UI
            console.error('金币不够了')
            console.error('GameData.gold', GameData.gold)
        }
    }

    public reliveFun(type: string) {
        let data = JSON.stringify({
            event: Const.RELIVE_EVENT,
            type: type,
        })

        let result = MvsManager.getInstance().sendFrameEvent(data);
        if (result === 0) {
        } else {
            console.error('sendFrameEvent reliveFun error', result)
        }
    }

    public shouldGameOver(): void {
        SoundUtils.instance().stopBg();
        this.mvsUnBind();
        GameSceneView._gameScene.over();
        this.dispose();
    }
}