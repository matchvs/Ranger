/**
 * Created by Channing on 2014/9/17.
 */
class GameData {
    // login
    // public static isLogin: Boolean = false;

    // enter room
    public static isCreateRoomBtnClick: Boolean = false;
    public static isQuickJoinBtnClick: Boolean = false;
    public static isJoinRoomBtn1Click: Boolean = false;
    public static isJoinRoomBtn2Click: Boolean = false;
    public static isRoomItemClick: Boolean = false;
    public static isLeaveRoomBtnClick: Boolean = false;
    public static isLeaveRoomBtn2Click: Boolean = false;
    

    public static isShowProfileView: Boolean = false;
    public static isShowJoinRoomView: Boolean = false;
    public static isShowRandomMatchView: Boolean = false;

    // room
    public static isAddRobot: Boolean = false;

    public static isOwner: Boolean = false;
    public static ownerId: Number = 0;
    public static MAX_BLOOD: Number = 100;
    public static lastRoomId: string = "";
    public static roomId: string = "";
    public static players: Array<any> = [
        {
            userId: 1,
            userName: '我的名字',
            type: 'r', // red
            score: 0,
            blood: GameData.MAX_BLOOD,
            isDie: 0, // false, 1 true
        },
        {
            userId: 2,
            userName: '你的名字',
            type: 'b', // blue
            score: 0,
            blood: GameData.MAX_BLOOD,
            isDie: 0
        }
    ];

    // 成长数据
    public static gold: number = 10;
    public static allValue: number = 0;
    public static winValue: number = 0;

    // public static type: string = ""; // r b
    public static type: string = "r"; // r b

    // 游戏中
    public static curScene: number = 1;
    public static gameTime: number = 600; // 帧数

    public static isInRoomView: Boolean = false;
    public static isInEnterView: Boolean = false;

    // 状态
    public static createRoomStatus: number = 1;
    public static joinRandomRoomStatus: number = 1;
    public static joinRoomStatus: number = 1;
    public static leaveRoomStatus: number = 1;
    public static joinOverStatus: number = 1;
    public static logoutStatus: number = 1;
    public static getRoomListStatus: number = 1;
    public static kickPlayerStatus: number = 1;
    public static setFrameStatus: number = 1;

    // 状态 用于过程标识
    // public static isLeaveRoom: Boolean = false;
    // public static isJoinOver: Boolean = false;

    // 状态 用于状态标识 
    public static GAME_STATUS_PLAY: Number = 5;
    public static GAME_STATUS_OVER: Number = 6;
    public static GAME_STATUS_PLAY_DEAD: Number = 7;
    public static gameStatus: Number = GameData.GAME_STATUS_PLAY;
    
    public static isGameOver: Boolean = false;
    // public static isPause: Boolean = true;
    public static isWin: Boolean = false;


    public static enemyNum: number = 0; // forName

    // public static sheDie: Boolean = false;
    // public static score: number = 0;
    // public static blod: number = 5;

    public static closeMusic: Boolean = false;
    public static closeBgMusic: Boolean = false;

    public static isClickBtn: Boolean = false;

    // public static num: Array<any> = ["1", "0", ".", "0", ".", "4", ".", "1", "8", "0", ":", "3", "0", "0", "0"];
    // public static redGirlDistance: number = 0;

    public static bgSpeed: number = 3;
    // public static enemySpeed: number = 6;
    public static enemySpeed: number = 36;
    public static createEnemyTime: number = 30; 
    // public static stopCreateEnemy: number = 0;
    // public static stopEnemyBoo: Boolean = false;
    // public static count: number = 0;

    public static profectNum: number = 0;

    /**
     * 杀的怪数量
     */
    public static langNum: number = 0
    // public static huliNum: number = 0
    // public static bianfuNum: number = 0

    // public static dazhaoTime: number = 50;


    // public static dubleSorce: Boolean = false;
    // public static curTimeNum: number = 0;
    // public static sheTimeNum: number = 0;

    // GameData.curScene = 1;
    // GameData.score = 0;
    // GameData.langNum = 0;
    // GameData.huliNum = 0;
    // GameData.bianfuNum = 0;
    // GameData.isPause = true;
    // GameData.count = 0;
    // GameData.profectNum = 0;
    // GameData.stopCreateEnemy = 0;
    // GameData.redGirlDistance = 0;
    // GameData.blod = 5;


    // server error
    public static isServerErrorCode1000: Boolean = false
    public static getPlayer(type:string){
        return GameData.players[type === "r"?0:1];
    }
}