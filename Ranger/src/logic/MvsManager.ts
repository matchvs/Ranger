class MvsManager {
    private static _instance: MvsManager;
    public static engine: MatchvsEngine = new MatchvsEngine();
    public static response: MatchvsResponse = new MatchvsResponse();


    public static getInstance(): MvsManager {
        if (MvsManager._instance == null) {
            MvsManager._instance = new MvsManager();
        }
        return MvsManager._instance;
    }

    public init(): any {
        return MvsManager.engine.init(MvsManager.response, Const.channel, Const.platform, Const.gameId);
    }

    public uninit(): any {
        return MvsManager.engine.uninit();
    }

    public registerUser(): any {
        return MvsManager.engine.registerUser();
    }

    public login(): any {
        return MvsManager.engine.login(GameData.userId, GameData.token, Const.gameId, Const.gameVersion,
            Const.appKey, Const.secretKey, Const.deviceId, Const.gatewayId)
    }

    public logout(cpProto): any {
        return MvsManager.engine.logout(cpProto);
    }

    public joinRandomRoom(maxPlayer: number, userProfile: string) {
        return MvsManager.engine.joinRandomRoom(maxPlayer, userProfile);
    }

    public joinRoom(roomId: string, userProfile: string) {
        return MvsManager.engine.joinRoom(roomId, userProfile);
    }

    public joinOver(cpProto: string) {
        return MvsManager.engine.joinOver(cpProto);
    }

    public createRoom(createRoom, userProfile) {
        return MvsManager.engine.createRoom(createRoom, userProfile)
    }

    public leaveRoom(cpProto: string): number {
        return MvsManager.engine.leaveRoom(cpProto)
    }

    public setFrameSync(rate: number) {
        return MvsManager.engine.setFrameSync(rate);
    }

    public sendFrameEvent(cpProto: string) {
        return MvsManager.engine.sendFrameEvent(cpProto);
    }

    public sendEvent(cpProto: string) {
        return MvsManager.engine.sendEvent(cpProto);
    }

    public kickPlayer(srcUserid, cpProto) {
        return MvsManager.engine.kickPlayer(srcUserid, cpProto);
    }

    public getRoomList(filter) {
        return MvsManager.engine.getRoomListEx(filter);
    }
}