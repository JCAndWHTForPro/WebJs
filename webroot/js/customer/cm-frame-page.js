

var cmFramePageVM = avalon.define({
	$id:"cm-main",
	tableViewValue:{
		text:"asdjliasdf"
	},
	mocTreeValue:{
		text:"adsfadsf"
	}
});

$(function(){
	var topEl = document.getElementById("top").offsetHeight;
	var contentEl = document.getElementById("content");
	var footEl = document.getElementById("foot").offsetHeight;
	var screenHeight = document.body.scrollHeight;
	var screenWidth = document.body.scrollWidth;
	// alert(screenWidth);
	var contentHeight = screenHeight-topEl-footEl+"px";
	contentEl.style.height = contentHeight;

	var contentLeft = document.getElementById("content-left");
	var contentRight = document.getElementById("content-right");
	contentRight.style.width = screenWidth-contentLeft.offsetWidth+"px";


	var tab = new cm.gui.comp.Tab("content-right");
	tab.addPanel("id1","Title1","./page/tab1.html");
	tab.addPanel("id2","Title2","./page/tab2.html");
});