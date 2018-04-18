/**
 * Created by Administrator on 2014/6/16.
 */
class StarlingSwfFactory{
    private static _instance:StarlingSwfFactory;

    /**
     * 单例
     * @returns {StarlingSwfFactory}
     */
    public static getInstance():StarlingSwfFactory{
        if(StarlingSwfFactory._instance == null){
            StarlingSwfFactory._instance = new StarlingSwfFactory();
        }
        return StarlingSwfFactory._instance;
    }

    private swfAssetsManager:starlingswf.SwfAssetManager;
    private swfAssetsNames:Array<string>;
    private swfAssets:Array<starlingswf.Swf>;
    private swfData:any;

    public constructor(){
        this.swfAssetsManager = new starlingswf.SwfAssetManager();
        this.swfAssetsNames = new Array<string>();
        this.swfAssets = new Array<starlingswf.Swf>();
        this.swfData = {};
    }

    public addSwf(name:string, swfData:Object, spriteSheep:egret.SpriteSheet):void{
        if(this.swfAssetsNames.indexOf(name) != -1)
            return;
        if(swfData == null || spriteSheep == null){
            console.log("SWF加载失败:"+name);
            return;
        }
        this.swfAssetsManager.addSpriteSheet(name, spriteSheep);
        var swf:starlingswf.Swf = new starlingswf.Swf(swfData, this.swfAssetsManager, 24);
        swf.name = name;
        StarlingSwfUtils.addSwf(swf);
        this.swfAssetsNames.push(name);
        this.swfAssets.push(swf);
    }

    public stopSwfs(arr:Array<string>):void{
        for(var i:number=0, len:number=arr.length; i<len; i++){
            var swf:starlingswf.Swf = StarlingSwfUtils.getSwf(arr[i]);
            if(swf){
                swf.swfUpdateManager.stop();
            }
        }
    }

    public playSwfs(arr:Array<string>):void{
        for(var i:number=0, len:number=arr.length; i<len; i++){
            var swf:starlingswf.Swf = StarlingSwfUtils.getSwf(arr[i]);
            if(swf){
                swf.swfUpdateManager.play();
            }
        }
    }

    private clearSwfs():void{
        while(this.swfAssets.length){
            StarlingSwfUtils.removeSwf(this.swfAssets.pop());
        }
        while(this.swfAssetsNames.length){
            this.swfAssetsNames.pop();
        }
        this.swfAssetsManager = new starlingswf.SwfAssetManager();
    }

    public clear():void{
        this.clearSwfs();
    }

    public makeMc(name:string):StarlingSwfMovieClip{
        var mc:StarlingSwfMovieClip = <StarlingSwfMovieClip>StarlingSwfUtils.createMovie("mc_" + name, null, StarlingSwfMovieClip);
        if(mc == null){
            console.log("SWF创建失败: "+ name);
        }
        return mc;
    }

    public makeImage(name:string):egret.Bitmap{
        return StarlingSwfUtils.createImage("img_"+name);
    }

    public getTexture(name):egret.Texture{
        return StarlingSwfUtils.getTexture("img_"+name);
    }
}