/**
 * Created by Channing on 14-9-23.
 */
class SpecialNumber extends egret.Sprite
{
    private charName:string;
    constructor(str:string) {
        super();
        this.charName = str;
    }

    public setValue(num:string)
    {
        this.removeChildren();
        if(num == "" || num == null)
            return;
//        var _s:string = "";
//        var ln:number = 0;
//        for (var i:number=num.length; i>=ln; i--)
//        {
//            if (i<4)
//            {
//                _s +=  num.charAt(i);
//            }
//            else if (i==4)
//            {
//                _s +=  ",";
//            }
//            else
//            {
//                _s+=num.charAt(i-1);
//            }
//        }

//        num = _s;

        var chars:Array<any> = (num+"").split("");
        var length:number = chars.length;
        var ww:number = 0;
        for(var i:number = 0;i < length;i++)
        {
            var str:string = chars[i];
            if(str == ",")
                str = "dot";
            if(str == "/")
                str = "gang";

            if(this.charName == "number-")
            {
                var image:egret.Bitmap;
                if(str == "gang")
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"sourceNum");
                else if(str == "dot")
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"sourceNum");
                else
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"sourceNum");
            }else if(this.charName == "number-0")
            {
                var image:egret.Bitmap;
                if(str == "gang")
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"streakNum");
                else if(str == "dot")
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"streakNum");
                else
                    image = ResourceUtils.createBitmapFromSheet(this.charName+str,"streakNum");
            }

            if(image){
                image.x = ww;
                ww += image.width;
                this.addChild(image);
            }
        }

    }
}