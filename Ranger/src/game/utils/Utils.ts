
// 微信上的适配
// 其他端可以不用那么麻烦 showAll原有的尺寸正常缩放

class Utils {
    public static _wWidthScale: number = null;
    public static _wHeightScale: number = null;
    public static _wXScale: number = null;
    public static _wYScale: number = null;

    public static wWidthScale() {
        if (this._wWidthScale === null) {
            this._wWidthScale = Math.floor((Const.SCENT_WIDTH / 480) * 100) / 100;
        }

        return this._wWidthScale;
    }

    public static wHeightScale() {
        if (this._wHeightScale === null) {
            this._wHeightScale = Math.floor((Const.SCENT_HEIGHT / 800) * 100) / 100;
        }

        return this._wHeightScale;
    }

    public static wXScale() {
        if (this._wXScale === null) {
            this._wXScale = Math.floor((Const.SCENT_WIDTH / 480) * 100) / 100;
        }

        return this._wXScale;
    }

    public static wYScale() {
        if (this._wYScale === null) {
            this._wYScale = Math.floor((Const.SCENT_HEIGHT / 800) * 100) / 100;
        }

        return this._wYScale;
    }
}