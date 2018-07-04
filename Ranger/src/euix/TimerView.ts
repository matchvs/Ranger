class TimerView {

    private root: any;

    private timerView_001: any;
    private timerView_010: any;
    private timerView_100: any;
    private time: any;
    private timer: any;

    public constructor(root, _001, _010, _100) {
        this.timerView_001 = _001;
        this.timerView_010 = _010;
        this.timerView_100 = _100;
        this.root = root;
    }

    public start() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(function () {
            this.update()
        }.bind(this), 1000);

        this.root.visible = true;
        this.time = 1;
        this.update();
    }
    public stop() {
        clearInterval(this.timer);
        this.root.visible = false;
    }
    private update() {
        // console.log("time:" + this.time);
        if (this.time > 999) {
            this.time = 0;
        }
        var numLen = ("" + this.time).length;
        switch (numLen) {
            case 1:
                this.timerView_001.x = 215;
                this.timerView_001.visible = true;
                this.timerView_010.visible = false;
                this.timerView_100.visible = false;
                break;
            case 2:
                this.timerView_001.x = 230;
                this.timerView_010.x = 190;
                this.timerView_001.visible = true;
                this.timerView_010.visible = true;
                this.timerView_100.visible = false;
                break;
            case 3:
                this.timerView_001.x = 260;
                this.timerView_010.x = 215;
                this.timerView_100.x = 170;
                this.timerView_001.visible = true;
                this.timerView_010.visible = true;
                this.timerView_100.visible = true;
                break;
        }
        this.timerView_001.source = ("" + this.time).substring(numLen - 1, numLen - 0);
        this.timerView_010.source = ("" + this.time).substring(numLen - 2, numLen - 1);
        this.timerView_100.source = ("" + this.time).substring(numLen - 3, numLen - 2);

        this.time++;
    }

}