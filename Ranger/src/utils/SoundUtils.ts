/**
 * Created by Administrator on 2014/10/16.
 */
class SoundUtils {

    private static _instance: SoundUtils;
    private bgSound: SoundBase;
    private winSound: SoundBase;
    private missSound: SoundBase;
    private hitSound: SoundBase;
    private goSound: SoundBase;
    private overSound: SoundBase;
    private beHitSound: SoundBase;
    private numSound: SoundBase;

    public static instance(): SoundUtils {
        return this._instance == null ? this._instance = new SoundUtils() : this._instance;
    }

    constructor() {
        if (SoundUtils._instance != null)
            throw new Error("singleton");
    }

    public initSound(): void {
        // 名字在resource.json中定义
        this.bgSound = new SoundBase("sound_bg_mp3");
        this.winSound = new SoundBase("sound_win_mp3");
        this.missSound = new SoundBase("sound_miss_mp3");
        this.hitSound = new SoundBase("sound_hit_mp3");
        this.goSound = new SoundBase("sound_hit_mp3");
        this.overSound = new SoundBase("sound_gameover_mp3");
        this.beHitSound = new SoundBase("sound_behit_mp3");
        this.numSound = new SoundBase("OneTwoThree_mp3");
    }
    public playNum(): void {
        if (GameData.closeMusic) return;
        // 生成一个新的 SoundChannel 对象来播放该声音???
        // 如果已经播放了其他音频,怎么样???
        this.numSound.play();
    }
    public playBeHit(): void {
        if (GameData.closeMusic) return;
        this.beHitSound.play();
    }
    public playOver(): void {
        if (GameData.closeMusic) return;
        this.overSound.play();
    }
    public playGo(): void {
        if (GameData.closeMusic) return;
        this.goSound.play();
    }
    public playHit(): void {
        if (GameData.closeMusic) return;
        this.hitSound.play();
    }
    public playMiss(): void {
        if (GameData.closeMusic) return;
        this.missSound.play();
    }
    public playWin(): void {
        if (GameData.closeMusic) return;
        this.winSound.play();
    }

    public playBg(): void {
        if (GameData.closeBgMusic) {
            this.bgSound.pause();
            return;
        }
        this.bgSound.setLoop(true);
        this.bgSound.play();
    }
    public stopBg(): void {
        this.bgSound.pause();
    }
}