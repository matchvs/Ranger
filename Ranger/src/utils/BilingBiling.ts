/**
 * 闪速效果
 */
class BilingBiling {
	public constructor(view, looptime, time) {
		this.biling(view, looptime, time);
	}
	public biling(view, time, onComplete) {
		var onComplete1 = onComplete-1;
		if (onComplete1 > 0) {
			view.alpha = 0.1;
			egret.Tween.get(view).to({ alpha: 1.0, loop: false }, time, egret.Ease.elasticInOut).call(
				function () {
					this.biling(view, time, onComplete1);
				}.bind(this)
			).play();
		}

	}
}