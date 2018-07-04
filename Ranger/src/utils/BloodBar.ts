class BloodBar {
    private r: egret.Rectangle;
    private type: string;
    private container: egret.DisplayObject;
    private w: number = 0;
    constructor(type: string, view: egret.DisplayObject) {
        this.type = type;
        this.container = view;
        this.r = new egret.Rectangle();
        this.r.x = 0;
        this.r.y = 0;
        this.w = view.width;
        this.r.width = view.width;
        this.r.height = view.height;
        view.mask = this.r;
    }

    private initView(type: string): void {

    }

    public scaleBlodX(blood: any, max: any): void {

        this.r.x = -(this.w - this.w * (blood / max));
        this.container.mask = this.r
    }
}
