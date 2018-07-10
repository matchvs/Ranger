class NetWorkUtil {
    public static LEAVE_ROOM_NOTIFY = 1;
    public static checkStatsEeception(stats: number): boolean {
        if (stats === 200) {
            return false;
        }
        NetWorkUtil.boardcastException(stats);
        return true;

    }
    private listeners: Array<any> = [];
    public static boardcastException(stats: number) {
        for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
            NetWorkUtil.instance.listeners[i] && NetWorkUtil.instance.listeners[i].onEvent && NetWorkUtil.instance.listeners[i].onEvent(stats);
        }
    }
    public static instance = new NetWorkUtil();

    public addEventListener(l, event?) {
        if (event) {
            l["event"] = event;
        }
        this.listeners.push(l);
    }
    // public removeEventListener(l) {
    //     for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
    //         if (NetWorkUtil.instance.listeners[i] == l
    //             || (l["event"]
    //                 && NetWorkUtil.instance.listeners[i]["event"]
    //                 && NetWorkUtil.instance.listeners[i]["event"] == l["event"])) {
    //             console.log('l["event"]', l["event"])
    //             NetWorkUtil.instance.listeners[i] = null;
    //         }
    //     }
    // }
    public removeEventListener(name: number) {
        for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
            if (NetWorkUtil.instance.listeners[i]['event'] && NetWorkUtil.instance.listeners[i]['event'] === name) {
                console.log(`removeEventListener ${name} success`)
                // NetWorkUtil.instance.listeners[i] = null;
                NetWorkUtil.instance.listeners.splice(i, 1)
            }
        }
    }
    public static dispatchEvent(stats: number) {
        for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
            if (NetWorkUtil.instance.listeners[i]
                && NetWorkUtil.instance.listeners[i]["event"]
                && NetWorkUtil.instance.listeners[i]["event"] == stats) {
                NetWorkUtil.instance.listeners[i](stats);
            }

        }
    }
}