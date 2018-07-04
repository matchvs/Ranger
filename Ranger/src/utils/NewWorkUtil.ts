class NetWorkUtil {
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
            NetWorkUtil.instance.listeners[i] && NetWorkUtil.instance.listeners[i].onEvent(stats);
        }
    }
    public static instance = new NetWorkUtil();

    public addEventListener(l) {
        this.listeners.push(l);
    }
    public removeEventListener(l) {
        for (var i = 0; i < NetWorkUtil.instance.listeners.length; i++) {
            if (NetWorkUtil.instance.listeners[i] == l) {
                NetWorkUtil.instance.listeners[i] = null;
            }
        }
    }
}