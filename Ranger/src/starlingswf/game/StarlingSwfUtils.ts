/**
 * Created by lcj on 14-6-18.
 */
class StarlingSwfUtils {

    private static swfList:Array<starlingswf.Swf> = [];

    public static addSwf(swf:starlingswf.Swf):void {
        StarlingSwfUtils.swfList.push(swf);
    }

    public static removeSwf(swf:starlingswf.Swf):void{
        var index:number = StarlingSwfUtils.swfList.indexOf(swf);
        if(index != -1)
            StarlingSwfUtils.swfList.splice(index, 1);
    }

    public static createSprite(name:string, data:any[] = null, sprData:any[] = null):starlingswf.SwfSprite {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasSprite(name)) {
                return swf.createSprite(name, data, sprData);
            }
        }
        return null;
    }

    public static createImage(name:string, data:any[] = null):egret.Bitmap {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasImage(name)) {
                return swf.createImage(name, data);
            }
        }
        return null;
    }

    public static getTexture(name):egret.Texture{
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasImage(name)) {
                return swf.getTexture(name);
            }
        }
        return null;
    }

    public static createMovie(name:string, data:any[] = null, cls:any = null):starlingswf.SwfMovieClip {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasMovieClip(name)) {
                return swf.createMovie(name, data, cls);
            }
        }
        return null;
    }

    public static createS9Image(name:string, data:any[] = null):egret.Bitmap {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasS9Image(name)) {
                return swf.createS9Image(name, data);
            }
        }
        return null;
    }

    public static createShapeImage(name:string, data:any[] = null):egret.Bitmap {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.hasShapeImage(name)) {
                return swf.createShapeImage(name, data);
            }
        }
        return null;
    }

    public static getSwf(name:string):starlingswf.Swf {
        var l:number = StarlingSwfUtils.swfList.length;
        for (var i:number = 0; i < l; i++) {
            var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
            if (swf.name == name) {
                return swf;
            }
        }
        return null;
    }

    private static btnList:Array<any> = [];
    private static firstAddBtn:boolean = true;

    public static fixButton(btn:starlingswf.SwfMovieClip, onClick?:Function, thisObj?:any):void {
        if (StarlingSwfUtils.firstAddBtn) {
            StarlingSwfUtils.firstAddBtn = false;
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchEnd, this);
        }
        var data:StarlingSwfButtonData = new StarlingSwfButtonData();
        data.btn = btn;
        data.onClick = onClick;
        data.thisObj = thisObj;
        StarlingSwfUtils.btnList.push(data);
        btn.touchEnabled = true;
        btn.gotoAndStop(0);
        btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnTouchBegin, btn);
    }

    private static onBtnTouchBegin(event:egret.TouchEvent):void {
        var btn:starlingswf.SwfMovieClip = <starlingswf.SwfMovieClip>event.currentTarget;
        var l:number = StarlingSwfUtils.btnList.length;
        for (var i:number = 0; i < l; i++) {
            var data:StarlingSwfButtonData = StarlingSwfUtils.btnList[i];
            if (data.btn == btn) {
                data.touchStageX = event.stageX;
                data.touchStageY = event.stageY;
                btn.gotoAndStop(1);
                break;
            }
        }

    }

    private static onTouchEnd(event:egret.TouchEvent):void {
        var l:number = StarlingSwfUtils.btnList.length;
        for (var i:number = 0; i < l; i++) {
            var data:StarlingSwfButtonData = StarlingSwfUtils.btnList[i];
            if (data.touchStageX != -1) {
                if (event.stageX && Math.abs(data.touchStageX - event.stageX) < 10 && Math.abs(data.touchStageY - event.stageY) < 10) {
                    if (data.onClick) {
                        data.onClick.call(data.thisObj, event);
                    }
                }
                data.touchStageX = -1;
                data.touchStageY = -1;
                data.btn.gotoAndStop(0);
            }
        }
    }
}

class StarlingSwfButtonData {
    public btn:starlingswf.SwfMovieClip;
    public onClick:Function;
    public touchStageX:number = -1;
    public touchStageY:number = -1;
    public thisObj:any;
}