class Delay {
    private static delayTaskQueue = [];
    public static run(func: any, time) {
        var proxyFunc = function () {
            func();
            Delay.delayTaskQueue.pop();
        }
        Delay.delayTaskQueue.unshift(setTimeout(proxyFunc, time));
    }
    public static cancel() {
        var t = Delay.delayTaskQueue.pop();
        while (t) {
            clearTimeout(t);
            t = Delay.delayTaskQueue.pop();
        }
    }
}