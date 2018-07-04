class SceneManager {
    public static currentScene: egret.DisplayObjectContainer;
    public static root: egret.DisplayObjectContainer;
    public static sceneStack: egret.DisplayObjectContainer[] = [];
    public static init(root: egret.DisplayObjectContainer) {
        this.root = root;
    }
    public static showScene(scene: any, par?): egret.DisplayObject {
        if (!this.root) { console.error("SceneManager not be init()"); return; }
        if (!scene) { console.error("scene is null"); return; }
        //find a exist scene by classname
        var index = -1;
        for (var i = 0; i < this.root.numChildren; i++) {
            var child = this.root.getChildAt(i);
            if (child.constructor == scene) {
                index = i;
                scene = child;
            }
        }

        if (index >= 0) {
            console.log("[SceneManager] take scene to front from back:" + scene.constructor.name + "@" + scene.hashCode);
            scene.x = 480;
            egret.Tween.removeAllTweens();
            egret.Tween.get(scene, { loop: false }).to({ x: 0, y: 0 }, 300, egret.Ease.circInOut);
            var top: any = this.root.getChildAt(this.root.numChildren - 1);
            //hide top
            top.onHide && top.onHide();
            //show currentScene
            scene.onShow && scene.onShow(par);

            egret.Tween.get(top, { loop: false }).to({ x: 480, y: 0 }, 300, egret.Ease.sineOut);
            scene.x = 480;
            egret.Tween.get(scene, { loop: false }).to({ x: 0, y: 0 }, 300, egret.Ease.backIn).call(function () {
                top.x = 0;
                this.root.swapChildren(scene, top);
            }.bind(this));

        } else {
            //hide top
            if (this.root.numChildren > 0) {
                var top: any = this.root.getChildAt(this.root.numChildren - 1);
                top.onHide && top.onHide();
            }

            //new  a scene
            scene = new scene(par);
            scene.x = 480;
            scene.name = scene.constructor.name
            egret.Tween.get(scene, { loop: false }).to({ x: 0, y: 0 }, 300, egret.Ease.circInOut);
            scene.onShow && scene.onShow(par);
            //show currentScene
            this.root.addChild(scene);
        }
        console.log("[SceneManager] show  scene:" + scene.constructor.name + "@" + scene.hashCode);
    }






    public static back(): boolean {
        if (this.root.numChildren > 0) {
            var perScene: any = this.root.getChildAt(this.root.numChildren - 1);
            if (perScene) {
                perScene.onHide && perScene.onHide();
                perScene.x = 0;
                egret.Tween.get(perScene, { loop: false }).to({ x: 800, y: 0 }, 600, egret.Ease.quadIn).call(function () {
                    perScene.x = 0;
                    this.root.removeChild(perScene);
                }.bind(this));

                //show top
                if (this.root.numChildren > 1) {
                    var top: any = this.root.getChildAt(this.root.numChildren - 2);
                    top.onShow && top.onShow();
                    top.x = -480;
                    egret.Tween.get(top, { loop: false }).to({ x: 0, y: 0 }, 400, egret.Ease.backIn);
                }

                console.log("[SceneManager]  Back  to scene:" + perScene.constructor.name + "@" + perScene.hashCode);
            } else {
                console.warn('[WARN] preScene is undefine');
                return false;
            }
        } else {
            console.warn("[SceneManager] Do`t Back!");
            return false;
        }
    }
}