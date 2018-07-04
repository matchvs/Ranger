/**
 * Created by geliang@matchvs.com on 18/6/29.
 */
class SpecialNumber {
    private root: any;

    private views: Array<any> = [];
    public constructor(root, arr: Array<any>) {
        for (var i = arr.length - 1; i >= 0; i--) {
            arr[i].visible = false;
            this.views.push(arr[i]);
        }
        this.root = root;
    }

    public setValue(num: string) {
        if (num == "" || num == null)
            return;
        if (Number(num) < 0) {
            num = "0";
        }
        var numLen = ("" + num).length;
        if (numLen > this.views.length) {
            numLen = this.views.length;
        } 
        for (var i = 0; i < this.views.length; i++) {
            this.views[i].visible = false;
        }
        for (var i = numLen - 1; i >= 0; i--) {
            this.views[i].source = "number-0" + (num).substring(i, i + 1);
            this.views[i].x = (i + 1) * (this.views[i].parent.width / (numLen + 1)) - (this.views[i].width / 2);
            this.views[i].visible = true;
        }
    }
}