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


	protected onCreated(): void {
		this.perfect.text = this.par ? this.par.perfect : 0;
		this.good.text = this.par ? this.par.good : 0;
		this.miss.text = this.par ? this.par.miss : 0;
		this.score.text = this.par ? this.par.score : 0;
		this.comob.text = this.par ? this.par.comboNum : 0;
	}
	protected onShow(par) {
		this.par = par;
	}

	public onClick(name: string, v: egret.DisplayObject) {
		SceneManager.back();
	}

}