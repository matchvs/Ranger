/**
 * Created by Administrator on 2014/6/16.
 */
class StarlingSwfMovieClip extends starlingswf.SwfMovieClip{

    private frameActions:any;
    private preFrame:number;
    private complateFunc:Function;
    private complateObj:Function;
    private currFrameName:Object;

    public constructor(frames:any[], labels:any[], displayObjects:Object, ownerSwf:starlingswf.Swf){
        super(frames, labels, displayObjects, ownerSwf);
        this.frameActions = {};
        this.preFrame = -1;
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
    }

    private onRemove() {
        this.stop();
    }

    public setFrameAction($frame:number, $action:Function, $actionObj:any, $param:any=null):void{
        this.frameActions[$frame] = [$action, $actionObj, $param];
    }

    public setCompleteAction($action:Function, $actionObj:any):void{
        this.complateFunc = $action;
        this.complateObj = $actionObj;
        this.addEventListener(egret.Event.COMPLETE, this.onPlayend, this);
    }

    private onPlayend():void{
        if(this.complateFunc){
            this.complateFunc.call(this.complateObj);
        }
    }

    public goToPlay(frame:Object):void{
            this.preFrame = -1;
            this.currFrameName = frame; // 当前frame名字
            this.gotoAndPlay(frame);

    }

    public update():void {
        super.update();

        var currFrame:number = this.getCurrentFrame();
        if(this.preFrame != currFrame){
            this.preFrame = currFrame;
            if(this.frameActions && this.frameActions[currFrame]){
                var arr:Array<any> = this.frameActions[currFrame];
                if(arr[2])
                    arr[0].call(arr[1], arr[2]);
                else
                    arr[0].call(arr[1]);
            }
        }
    }

    public dispose():void{
        this.stop();
        this.removeEventListener(egret.Event.COMPLETE, this.onPlayend, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        if(this.parent){
            this.parent.removeChild(this);
        }
        this.complateFunc = null;
        this.complateObj = null;
        this.frameActions = null;
    }
}