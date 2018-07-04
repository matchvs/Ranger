class GameLogic {
	public root: BaseScene;
	//保存所有敌人的数组,二维数组
	public allEnemyArr: DisplayObjectPool = new DisplayObjectPool();

	public reliveBtn: eui.Button;
	public goldView: egret.DisplayObject;
	// redGirl 
	public redGirl1: egret.DisplayObject;
	public redGirl2: egret.DisplayObject;


	// arrow
	public arrow: egret.DisplayObject;

	// blodBar
	public blodBar1: BloodBar;
	public blodBar2: BloodBar;

	// combo
	public comboNumView: StreakNum;

	private maxBoomCahceSize = 16;

	// score
	public score1: SpecialNumber;
	public score2: SpecialNumber;

	// gameTime
	public gameTime: SpecialNumber;
	public ping: eui.Label;

	private shan: egret.DisplayObject;
	private layerFight: egret.DisplayObjectContainer;
	private speedCreatEnemyInterval: number = GameData.createEnemyInterval;
	private lastCreatEnemy: number = 0;
	private lastRecNewPkgTime: number = 0;

	private gameState = GameData.GAME_STATUS_PLAY;
	public constructor(gameView: BaseScene) {

		this.root = gameView;
		this.layerFight = <egret.DisplayObjectContainer>this.findChild("fight");
		this.goldView = this.root.findChild("gold");
		this.redGirl1 = this.root.findChild("red");
		this.redGirl2 = this.root.findChild("blue");
		this.ping = <eui.Label>this.root.findChild("ping");
		this.reliveBtn = <eui.Button>this.root.findChild("relive");
		this.blodBar1 = new BloodBar(GameData.p1, this.root.findChild("full1"));
		this.blodBar2 = new BloodBar(GameData.p2, this.root.findChild("full2"));

		//命中精准度Toast
		for (var i = 0; i < 10; i++) {
			var prom = new PromptPop();
			prom.activate(Const.SCENT_WIDTH / 2 - 100 * Utils.wXScale(), Const.SCENT_HEIGHT - 300 * Utils.wYScale(), prom.config);
			this.addChild(prom);
			this.popArr.push(prom);
		}

		// combo
		this.comboNumView = new StreakNum();
		this.comboNumView.x = Const.SCENT_WIDTH / 2 - this.comboNumView.width / 2;
		this.comboNumView.y = 125 * Utils.wYScale();;
		this.addChild(this.comboNumView);
		this.comboNumView.visible = false;

		//倒计时
		this.gameTime = new SpecialNumber(this.findChild("timer"),
			[this.findChild("time100"),
			this.findChild("time010"),
			this.findChild("time001")]
		);

		//分数p1
		this.score1 = new SpecialNumber(this.findChild("score1"),
			[this.findChild("score11000"),
			this.findChild("score10100"),
			this.findChild("score10010"),
			this.findChild("score10001")]
		)
		this.score1.setValue(0 + "")

		//分数p2
		this.score2 = new SpecialNumber(this.findChild("score2"),
			[this.findChild("score21000"),
			this.findChild("score20100"),
			this.findChild("score20010"),
			this.findChild("score20001")]
		)
		this.score2.setValue(0 + "")


		//arrow 标识是自己

		this.arrow = this.findChild("arrow");

		if (GameData.type === "r") {
			this.arrow.x = 165;
		} else if (GameData.type === "b") {
			this.arrow.x = 285;
		}
		this.arrow.y = 640;

		this.shan = this.findChild("shan");

		this.initBomb(this.maxBoomCahceSize);

	}
	protected addChild(v) {
		this.root.addChild(v);
	}
	protected findChild(name): egret.DisplayObject {
		return this.root.findChild(name);
	}
	public onFailSendFrameEvent(data) {
		this.handlerAllGameEvent(data);
	}
	public getMe(): egret.DisplayObject {
		return GameData.type == GameData.p1 ? this.redGirl1 : this.redGirl2;
	}
	public getOther(): egret.DisplayObject {
		return GameData.type == GameData.p2 ? this.redGirl1 : this.redGirl2;
	}


	public checkGameEvent() {
		this.checkMissEvent();
	}
	public checkMissEvent() {
		let enemyOnOneRoad: Array<Wolf> = this.allEnemyArr.getAll();
		for (var i = 0; i < enemyOnOneRoad.length; i++) {
			var e: Wolf = enemyOnOneRoad[i];
			if (e.state != AmimationState.ENABLE) {
				continue;
			}

			if (e.y > (this.layerFight.y + this.layerFight.height - e.height)) {
				this.boardMissEvent(e.name, e.type, e.time);
				// console.log('[INFO] miss'+e.name+" state:"+e.state+" e.hashcode"+e.hashCode);
				e.over();
				break;
			}

		}
	}
	public updateGame(time) {

		var timeReal = time / GameData.FPS;
		this.boardMove(timeReal);
		if (timeReal > GameData.GAME_TOTAL_TIME) {
			this.gameState = GameData.GAME_STATUS_OVER;
			this.boardGameOver(GameData.getMePlayer());
			return;
		}

		if (timeReal - this.lastCreatEnemy > this.speedCreatEnemyInterval) {
			this.boardCreateEnemy(timeReal);
			this.lastCreatEnemy = timeReal;

			//加速产生怪物
			this.speedCreatEnemyInterval = (1 - timeReal / GameData.GAME_TOTAL_TIME) * this.speedCreatEnemyInterval;
			this.speedCreatEnemyInterval = this.speedCreatEnemyInterval < GameData.TIME_MIN_INTVRAL_ENEMY_CREATE
				? GameData.TIME_MIN_INTVRAL_ENEMY_CREATE : this.speedCreatEnemyInterval;

		}

	}
	public handlerAllGameEvent(data) {
		if (GameData.debug) {
			this.ping.text = "pkg interval:" + (new Date().getMilliseconds() - this.lastRecNewPkgTime);
			this.lastRecNewPkgTime = new Date().getMilliseconds();
		}
		let items = data.frameItems ? data.frameItems : [{ "cpProto": data }];
		for (let i = 0; i < items.length; i++) {
			let jsonItems = JSON.parse(items[i].cpProto);
			let event = jsonItems.event;
			if (event === Const.WILL_INIT_ENEMY_EVENT) {
				this.handlerCreatEnemy(jsonItems);
			} else if (event === Const.MISS_FUN_EVENT) {
				this.handlerMiss(jsonItems);
			} else if (event === Const.HIT_FUN_EVENT) {
				this.handlerHitedEmeny(jsonItems)
			} else if (event === Const.RELIVE_EVENT) {
				this.handlerChangeBlood(jsonItems, Const.RELIVE_ACTION);
			} else if (event === Const.GAME_OVER_EVENT) {
				this.showGameOver();
			} else {
				this.handlerMove(jsonItems);
			}
		}
	}

	public boardMove(time) {
		let data = JSON.stringify({
			event: Const.MOVE_EVENT,
			time: time
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
		}
	}
	public handlerMove(data) {
		if (!this.allEnemyArr) {
			console.warn('[WARN] No emeny to move');
			return;
		}
		let time = (data && data.time) ? data.time : 0;
		this.gameTime.setValue((GameData.GAME_TOTAL_TIME - Math.floor(time)) + "");
		let enemyOnOneRoad: Array<Wolf> = this.allEnemyArr.getAll();
		for (var i = 0; i < enemyOnOneRoad.length; i++) {
			var e: Wolf = enemyOnOneRoad[i];
			e.move((1 + e.time / GameData.GAME_TOTAL_TIME * GameData.SPEED_MAX_RUN_MULTIPLE) * GameData.enemySpeed);
			// e.move(GameData.enemySpeed);
		}
	}
    /**
     * 生成一个敌人
     */
	public boardCreateEnemy(time) {
		var name = ((Math.floor(Math.random() * 10 % 2) === 0) ? GameData.p1 : GameData.p2) + "_" + Math.floor(Math.random() * 10 % 4) + "_" + time
		let data = JSON.stringify({
			event: Const.WILL_INIT_ENEMY_EVENT,
			name: name
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
		}
	}
	public handlerCreatEnemy(data) {
		let name = data.name;
		let nameArr = name.split("_");
		let [type, row, num] = [...nameArr]

		// console.log('[INFO] new enemy' + data.name);
		this.allEnemyArr.get(function (o: Wolf) {
			if (o == null) {
				o = new Wolf(this.layerFight);
			} else {
				// console.log('[INFO] use old:'+o.name+" state:"+o.state+" e.hashcode"+o.hashCode);
			}
			o.init(row, name, type, num);
			return o;
		}.bind(this));

	}

	// prompt pop
	public popArr: Array<PromptPop> = [];
	/**
     *@str pop1 is prefect,pop2 is good,pop3 is miss
     */
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
	public boardMissEvent(name: string, type: string, time: number) {
		let data = JSON.stringify({
			event: Const.MISS_FUN_EVENT,
			name: name,
			type: type,
			time: time
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
		}
	}



	public handlerMiss(data) {
		// console.log('[INFO] miss'+JSON.stringify(data));
		let name = data.name;
		let type = data.type;
		let time = data.time;
		GameData.getPlayer(type).miss++;
		GameData.getPlayer(type).comboNum = 0;

		this.handlerChangeBlood({ type: type }, Const.DROP_ACTION);
		if (!GameData.getPlayer(type).isDie) {
			SoundUtils.instance().playMiss();
			SoundUtils.instance().playBeHit();
			this.popProm("pop3");
		}
		let enemy: Wolf = this.allEnemyArr.getItemByName(name);
		if (enemy) {
			enemy.over();
		}else{
			console.warn('[WARN] enemy not be find from array:'+name);
		}
	}

	public handlerChangeBlood(data, action) {
		if (action === Const.DROP_ACTION) {
			let type = data.type;
			this.dropBlood(GameData.getPlayer(type), type);
		}
		else if (action === Const.RELIVE_ACTION) {
			let type = data.type;
			this.relive(GameData.getPlayer(type), type);
		}
	}

	public dropBlood(player, type: string): void {
		var player: any = GameData.getPlayer(type);
		var bloodbar = (type === GameData.p1 ? this.blodBar1 : this.blodBar2);
		if (player.isDie) {
			return;
		}
		if (player.blood > 0) {
			if (GameData.type === type) {
				this.shan.visible = true;
				this.shan.alpha = 1;
				egret.Tween.get(this.shan).to({ "alpha": 0, "visible": false }, 200).call(function () {
					this.shan.visible = false;
				}.bind(this), this);
			}

			player.blood--;
			bloodbar.scaleBlodX(player.blood, GameData.MAX_BLOOD);

		} else {
			player.blood = 0;
			player.isDie = true;
			if (GameData.type === type) {
				let gold = GameData.Gold4Relive;
				let value;
				if (GameData.gold < gold) {
					value = "金币不足";
					this.showReliveBtnView(value, false);
				} else {
					value = "复活" + gold + "金币";
					this.showReliveBtnView(value, true);
				}
			}
			Toast.show(player.userName +" is dead");
		}
	}

	// public show relive view
	public showReliveBtnView(value, isEnable) {
		this.reliveBtn.label = value;
		this.reliveBtn.touchEnabled = isEnable;
		this.reliveBtn.visible = true;
		this.reliveBtn.alpha = 0.1;
		new BilingBiling(this.reliveBtn, 400, 10);
	}

	public hideReliveBtnView() {
		this.reliveBtn.visible = false;
	}
	/**复活 */
	public relive(player, type: string): void {
		var player: any = GameData.getPlayer(type);
		player.blood = GameData.MAX_BLOOD;
		player.isDie = false;
		this.blodBar1.scaleBlodX(player.blood, GameData.MAX_BLOOD);
	}

	public boardcastColliderEvent(name: string, score: number, rank: number, killer: string) {
		let data = JSON.stringify({
			event: Const.HIT_FUN_EVENT,
			name: name,
			score: score,
			killer: killer,
			rank: rank
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
		}
	}
	/**
	 * 打中怪物
	 */
	public handlerHitedEmeny(data) {
		let name = data.name;
		let killer = data.killer;
		let nameArr = name.split("_");
		let [type, row, num] = [...nameArr]
		let rank = data.rank;
		let score = Number(data.score);
		let enemy: Wolf = this.allEnemyArr.getItemByName(name);
		var player = GameData.getPlayer(killer);

		// 显示打击效果
		player.comboNum++;
		player.highComobNum = MathUtils.max(player.comboNum, player.highComobNum);

		if (killer !== GameData.getMePlayer().type) {
			this.playFireAnimation(this.getOther(), this.findChild("btnfight" + row));
		}

		killer === GameData.getMePlayer().type && SoundUtils.instance().playHit();

		if (rank >= 0.8 && rank <= 1.0) {//perfect
			killer === GameData.getMePlayer().type && this.popProm("pop1");
			player.perfect++;
		} else if (rank > 1.0 && (rank < 0.8 && rank > 0.0)) {//good
			killer === GameData.getMePlayer().type && this.popProm("pop2");
			player.good++;
		} else if (rank <= 0.0) {//miss
			killer === GameData.getMePlayer().type && this.popProm("pop3");
			player.miss++;
		} else {//good
			killer === GameData.getMePlayer().type && this.popProm("pop2");
		}

		if (enemy) {
			enemy.goDie();
			// 加分
			player.score += (score + player.comboNum);
			var scoreView = (killer === GameData.p1 ? this.score1 : this.score2);
			scoreView.setValue(GameData.getPlayer(killer).score + "");
		} else {
			console.warn('[WARN] the  emeny is not existing' + data);
		}

	}




	public dispose(): void {
		this.allEnemyArr.destoryAll(function (o: Wolf) {
			o.desotry();
		});
	}

	public sendReliveEvent(type: string) {
		let data = JSON.stringify({
			event: Const.RELIVE_EVENT,
			type: type,
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
			console.error('sendFrameEvent reliveFun error', result)
		}
	}

	public boardGameOver(player: Player) {
		let data = JSON.stringify({
			event: Const.GAME_OVER_EVENT,
			player: JSON.stringify(player)
		})

		let result = MvsManager.getInstance().sendFrameEvent(data);
		if (result === 0) {
		} else {
			this.onFailSendFrameEvent(data);
			console.error('sendFrameEvent reliveFun error', result)
		}
	}

	// bomb
	public bombArr: Array<Bomb> = [];
	public initBomb(maxBoomCahceSize): void {
		for (var i = 0; i < maxBoomCahceSize; i++) {
			var bomb = new Bomb();
			this.layerFight.addChildAt(bomb, 0);
			bomb.visible = false;
			this.bombArr.push(bomb);
		}
	}
	public playFireAnimation(src: egret.DisplayObject, dst: egret.DisplayObject): void {
		for (var i = 0; i < this.bombArr.length; i++) {
			if (this.bombArr[i].visible == false) {
				(<Bomb>this.bombArr[i]).fire(src, dst.parent);
				break;
			}
		}

	}
	public colliderCheck(src: egret.DisplayObject): void {
		let enemyOnOneRoad: Array<Wolf> = this.allEnemyArr.getAll();
		for (var i = 0; i < enemyOnOneRoad.length; i++) {
			var e: Wolf = enemyOnOneRoad[i];
			if (e.state != AmimationState.ENABLE) {
				continue;
			}
			var r = ColliderCheckUtil.checkPercentage(e, src.parent);
			// console.log("collider:" + r);
			if (r > 0) {
				this.boardcastColliderEvent(e.name, Math.floor(GameData.BASE_SCORE * r), r, GameData.type);
				break;
			}

		}
	}
	public showGameOver(): void {
		this.dispose();
		this.root.finish();
	}
}