class BaseScene extends eui.Component implements eui.UIComponent {
    private root: any = this;
    public constructor() {
        super();
        this.root = this;
        /**
         * egret.Event.COMPLETE 调用时机源码
         *             if (skin) {
                var skinParts = skin.skinParts;
                var length_8 = skinParts.length;
                for (var i = 0; i < length_8; i++) {
                    var partName = skinParts[i];
                    var instance = skin[partName];
                    if (instance) {
                        this.setSkinPart(partName, instance);
                    }
                }
                var children = skin.$elementsContent;
                if (children) {
                    for (var i = children.length - 1; i >= 0; i--) {
                        this.addChildAt(children[i], 0);
                    }
                }
                skin.hostComponent = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
            this.dispatchEventWith(egret.Event.COMPLETE);
         */
        this.addEventListener(egret.Event.COMPLETE, this.onCreated, this);
        // this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreated, this);
        // this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDestory, this);
    }
    public menuAnimation: egret.tween.TweenGroup;
    // private hashMap = {};
    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
        instance.name = partName;
        // if (partName !== "") {
        //     this.hashMap[partName] = instance;
        // }
        if (partName === "" || (instance.touchEnabled === false)) {
            // console.log("[BaseScene] [W] [Touch Unable]: " + partName);
        } else {
            instance.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent) {
                // Toast.show("[BaseScene]  click:" + partName);
                return this.onClick(partName, instance);
            }, this);
        }
    }


    protected childrenCreated(): void {
        super.childrenCreated();
        console.log("[BaseScene] childrenCreated");
    }
    protected onCreated(): void {
        console.log("[BaseScene] [onCreated] " + this.name);
    }
    protected onDestory(): void {
        console.log("[BaseScene] [onDestory] " + this.name);
    }
    protected onShow(par) {
        console.log("[BaseScene] onShow:" + par);
    }
    protected onHide() {
        console.log("[BaseScene] onHide");

    }

    public finish(){
        console.log('[INFO] [BaseScene] finish');
    }

    public onClick(name: string, v: egret.DisplayObject) {
        console.log("[BaseScene] No Handler for  click " + name);
    }

    public findChild(name: string): egret.DisplayObject {
        var view = this.findChildFrom(this.root, name);
        if (!view) {
            console.warn('[WARN] Not Found the view:' + name);
        }
        return view;
        // return this.hashMap[name];
    }
    private findChildFrom(parent: egret.DisplayObjectContainer, name: string): egret.DisplayObject {
        // console.log("findChildFrom " + parent.name);

        for (var i = 0; i < parent.numChildren; i++) {
            var child = parent.getChildAt(i);
            // console.log("childname:" + child.name);
            if (name === child.name) {
                return child;
            } else {
                if (child instanceof egret.DisplayObjectContainer) {
                    var p1 = <egret.DisplayObjectContainer>child;
                    var r = this.findChildFrom(p1, name);
                    if (r) {
                        return r;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }

        }
        return null;
    }
}