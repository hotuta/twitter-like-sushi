const $  = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const _  = FireQuery();

task(function*(){
	// 右下に表示されるバルーンに対する上書き処理
	overrideToastFire();
	
	// 通知ページに表示されるいいねに対する上書き処理
	overrideNotifyPageFire();
}());

// 右下に表示されるバルーンに対する上書き処理
function overrideToastFire(){
	$("#spoonbill-outer")[_.createObserver]((mutations)=>{
		for(var mutation of mutations){
			update(mutation.addedNodes);
		}
	}, {attributes: false, childList: true, characterData: false});
	
	function update(nodeList){
		nodeList[_.toArray].forEach((ele)=>{
			if(!ele[_.find](".Icon--heartBadge")[0]) return; // あちち以外(RT)の時は弾く
			
			const target = ele[_.find](".WebToast-contentBox");
			target[0][_.html] = "「あちち」しました";
			target[1].childNodes[_.toArray]
				.filter(x=>(x.nodeType===Node.TEXT_NODE&&~x.nodeValue.indexOf("さんがいいねしました")))
				.forEach(x=>{
					x[_.node] = "さんが「あちち」しました";
				});
		});
	}
}

// 通知ページに表示されるいいねに対する上書き処理
function overrideNotifyPageFire(){
	// 既に表示されているリストの上書き
	update($("#stream-items-id")[_.find](".stream-item-content"));
	
	// 以降追加されるリストの監視上書き
	$("#stream-items-id")[_.createObserver]((mutations)=>{
		// 通知ページ以外にいる時は更新処理を行わせない
		if(!~location.pathname.indexOf("i/notifications")) return;
		
		for(var mutation of mutations){
			mutation.addedNodes[_.toArray].forEach((ele)=>{
				update(mutation.addedNodes);
			});
		}
	}, {attributes: false, childList: true, characterData: false});
	
	function update(nodeList){
		// 通知ページ以外にいる時は更新処理を行わせない
		if(!~location.pathname.indexOf("i/notifications")) return;
		
		nodeList[_.toArray].forEach((ele)=>{
			const header = ele[_.find](".stream-item-activity-line");
			const button = ele[_.find](".activity-supplement button>span");
			
			// ヘッダ部分の書き換え
			header[0].childNodes[_.toArray]
				.filter(x=>(x.nodeType===Node.TEXT_NODE&&~x.nodeValue.indexOf("いいねしました")))
				.forEach(x=>{
					x[_.node] = x[_.node].replace("いいねしました","あちちしました");
				});
			
			// ボタン部分の書き換え
			if(button.length){
				button[_.toArray].forEach(x=>{
					x[_.text] = x[_.text].replace("いいね","あちち");
				});
			}
		});
	}
}

function task(gen,res){
	const itr = gen.next(res);
	
	if(itr.done) return;
	
	itr.value.then((val)=>{
		if(val === null) console.warn("nullはrejectの時だけ渡してくれ頼む");
		Task(gen,val);
	}).catch((val)=>{
		Task(gen,null);
	})
}
