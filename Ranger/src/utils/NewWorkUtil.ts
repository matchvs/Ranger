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
        this.listeners.push(l);
        if (event) {
            l["event"] = event;
        }
    }
    public removeEventListener(l) {
        for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
            if (NetWorkUtil.instance.listeners[i] == l) {
                NetWorkUtil.instance.listeners[i] = null;
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