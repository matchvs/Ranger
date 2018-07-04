/**
 * StarlingSwfSpriteSheet解析器
 */
module starlingswf {
    export class StarlingSwfSheetAnalyzer implements RES.processor.Processor {
        public parseSpriteSheet(texture: egret.Texture, data: any): egret.SpriteSheet {
            var frames: any = data.frames;
            if (!frames) {
                return;
            }
            var spriteSheet: egret.SpriteSheet = new egret.SpriteSheet(texture);
            for (var name in frames) {
                var config: any = frames[name];
                spriteSheet.createTexture(name, config.x, config.y, config.w, config.h, -config.offX, -config.offY);
            }
            return spriteSheet;
        }

        public async  onLoadStart(host, resource) {
            console.log('[INFO] onLoadStart' + host + " " + resource);
            let text = host.load(resource, RES.processor.SheetProcessor);
            // let data = this.parseSpriteSheet(text);
            return text;
        }

        public async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

        public getData(host, resource, key, subkey) { //可选函数
            console.log('[INFO] getData' + JSON.stringify(arguments));
        }
    }


}