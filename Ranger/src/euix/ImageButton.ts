class ImageButton extends eui.Button implements  eui.UIComponent {
	public src:string;
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		console.log(this.src);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}