class NetWorkUtil {
    public static LEAVE_ROOM_NOTIFY = 1;
    public static checkStatsEeception(stats: number): boolean {
        if (stats === 200) {
            return false;
        }
        NetWorkUtil.boardcastException(stats);
        return true;

    }
    private listeners: Object = { "boardcast": [] };
    public static boardcastException(stats: number) {
        for (var i = 0; i < NetWorkUtil.instance.listeners["boardcast"].length; i++) {
            var l = NetWorkUtil.instance.listeners["boardcast"][i];
            l && l(stats);
        }
    }
    public static instance = new NetWorkUtil();

    public addEventListener(callback: Function, key?: any) {
        if (!key) {
            key = "boardcast";
        }
        if(!this.listeners[key]){
            this.listeners[key]=[];
        }
        this.listeners[key].push(callback);
    }
    public removeEventListener(callback: Function, key: any) {
        if (!NetWorkUtil.instance.listeners[key]) return;

        for (var i = 0; i < NetWorkUtil.instance.listeners[key].length; i++) {
            if (NetWorkUtil.instance.listeners[key][i] && NetWorkUtil.instance.listeners[key][i] === key) {
                console.log(`removeEventListener ${key} success`)
                // NetWorkUtil.instance.listeners[i] = null;
                NetWorkUtil.instance.listeners[key].splice(i, 1)
            }
        }
    }
    public static dispatchEvent(key: any, data?: any) {
        if (!NetWorkUtil.instance.listeners[key]) return;

        for (var i = 0; i < NetWorkUtil.instance.listeners[key].length; i++) {
            if (NetWorkUtil.instance.listeners[key][i] && NetWorkUtil.instance.listeners[key][i] === key) {
                console.log(`removeEventListener ${key} success`)
                // NetWorkUtil.instance.listeners[i] = null;
                NetWorkUtil.instance.listeners[key][i](key, data);
            }
        }
        for (var i = 0; i < NetWorkUtil.instance.listeners[key].length; i++) {
            if (NetWorkUtil.instance.listeners[i]
                && NetWorkUtil.instance.listeners[i]["event"]
                && NetWorkUtil.instance.listeners[i]["event"]["key"] == key) {

            }

        }
    }
}