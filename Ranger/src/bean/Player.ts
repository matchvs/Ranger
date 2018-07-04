class Player {
	public constructor(type) {
		this.type = type;
	}

	public userId: number = 2;
	public userName: string = 'Ranger';
	public url: string = '';
	public type: string = "b";
	public score: number = 0;
	public blood: number = 0;
	public isDie: boolean = false;
	public comboNum: number = 0;
	public highComobNum: number = 0;
	public perfect: number = 0;
	public good: number = 0;
	public miss: number = 0;
}