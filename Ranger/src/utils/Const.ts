class Const {
    // game
    public static SCENT_WIDTH: number = 480;
    public static SCENT_HEIGHT: number = 800;

    public static GamePoxY: number = 0;
    public static setSwfArr: Array<any> = ["s", "t", "a", "t", "i", "c", ".", "e", "g", "r", "e", "t", "-", "l", "a", "b", "s", ".", "o", "r", "g"];


    // matchvs
    public static gameId: number = 201126;
    public static appKey: string = "f38ef43d2c024590afd295cc311440dd";
    public static secretKey: string = "9ae1acc200bd4a178d0be24bf3b1f5a3";
    public static gameVersion: number = 1;
    public static channel: string = "Matchvs";
    public static platform: string = "release";
    public static deviceId: string = "123456789";
    public static gatewayId: any = 0;


    // event
    public static WILL_INIT_ENEMY_EVENT: string = "will_init_enemy_event";
    public static MISS_FUN_EVENT: string = "miss_fun_event";
    public static ACC_HIT_FUN_EVENT: string = "acc_hit_fun_event";
    public static HIT_FUN_EVENT: string = "hit_fun_event";
    public static GAME_WILL_PLAY_EVENT: string = "game_will_play_event";
    public static RELIVE_EVENT: string = "relive_event";

    public static MOVE_EVENT: string = "move_event";
    public static GAME_OVER_EVENT: string = "move_game_over";

    public static ADD_ACTION: string = "add_action";
    public static DROP_ACTION: string = "drop_action";
    public static RELIVE_ACTION: string = "relive_action";

    public static IN_START_VIEW: string = "in_start_view";
    public static IN_PLAY_VIEW: string = "in_play_view";
}