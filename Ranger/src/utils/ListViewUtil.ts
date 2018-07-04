class ListViewUtil {

	/**
	 * // *.exml
	 * 	<e:List id="listview" anchorOffsetX="0" anchorOffsetY="0" useVirtualLayout="true" touchChildren="true"
	        touchEnabled="true" touchThrough="true" height="148.3" width="320.36" x="41.47" y="124.99">
		<e:layout>
			<e:VerticalLayout/>
		</e:layout>
		</e:List>
	 *
	 *
	 * 
	 * =========================================
	 * //*Scene.ts
	 * 	var sourceArr: any[] = [];
		for (var i: number = 1; i < 50; i++) {
			sourceArr.push({ label: "item" + i });
		}
		ListViewUtil.initListView(this,this.listview,sourceArr,ListViewImageItem);

	 * 
	 * 
	 * ==========================================
	 * //*ItemRender.ts
	 * class ListViewImageItem extends eui.ItemRenderer {
			public constructor() {
				super();
			}
			private labelDisplay: eui.Label;
			protected partAdded(partName: string, instance: any): void {
				super.partAdded(partName, instance);


				instance.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
					console.log('[INFO] '+this.itemIndex);
				}, this);

			}


			protected childrenCreated(): void {
				super.childrenCreated();
			}
			protected dataChanged(): void {
				this.labelDisplay.text = this.data.label;
			}
		}
	 * 
	 * 
	 */
	public static initListView(root: egret.DisplayObjectContainer, listview: eui.List, sourceArr: any[], itemClass: any) {

		//用ArrayCollection包装
		var myCollection: eui.ArrayCollection = new eui.ArrayCollection(sourceArr);

		listview.dataProvider = myCollection;
		listview.useVirtualLayout = true;
		listview.itemRenderer = itemClass;


		// //创建一个 Scroller
		var scroller = new eui.Scroller();
		scroller.height = listview.height;
		scroller.width = listview.width;
		scroller.viewport = listview;
		// scroller.horizontalScrollBar.autoVisibility = false;
		// scroller.width = 200;
		// scroller.height = 200;
		scroller.x = listview.x;
		scroller.y = listview.y
		scroller.name = "scroller";
		// scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
		// scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
		root.addChild(scroller);
	}
}