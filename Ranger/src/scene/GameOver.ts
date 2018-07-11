class GameOver extends BaseScene implements eui.UIComponent {
    public constructor() {
        super();
    }

    private perfect: eui.Label;
    private good: eui.Label;
    private miss: eui.Label;
    private score: eui.Label;
    private comob: eui.Label;
    private par: any;

    private loseIcon: eui.Image;
    private winIcon: eui.Image;

    protected onCreated(): void {
        this.perfect.text = this.par ? this.par.perfect : 0;
        this.good.text = this.par ? this.par.good : 0;
        this.miss.text = this.par ? this.par.miss : 0;
        // this.score.text = this.par ? (this.par.score < 0 ? 0 : this.par.score) : 0;
        this.score.text = this.par ? this.par.score : 0;
        this.comob.text = this.par ? this.par.comboNum : 0;

        // 金币结算
        let otherScore = GameData.getOtherPlayer().score;
        // if (this.par.score === -1) {
        //     this.loseIcon.visible = true;
        // }

        let player = GameData.getMePlayer()
        if (player.isHalfLeave) {
            this.winIcon.visible = false;
            this.loseIcon.visible = true;
        }
        else if (this.par.score > otherScore) {
            GameData.gold += 20;
            this.winIcon.visible = true;
            this.loseIcon.visible = false;
        } else {
            GameData.gold += 5;
            this.winIcon.visible = false;
            this.loseIcon.visible = true;
        }

        GameData.resetAll();
    }
    protected onShow(par) {
        this.par = par;
    }

    public onClick(name: string, v: egret.DisplayObject) {
        SceneManager.back();
    }

}