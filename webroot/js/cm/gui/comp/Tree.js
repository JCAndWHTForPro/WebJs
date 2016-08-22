package("cm.gui.comp");
$import("bootstrap.bootstrap-treeview");
$import("cm.common.util.WsfTool");
$import("cm.gui.comp.Component");
$importStyle('cm.gui.comp.Tree');

cm.gui.comp.Tree = function(){

	cm.gui.comp.Component.call(this);

	this.selfid = cm.common.util.WsfTool.generateId("Tree-");

	this.treeId = cm.common.util.WsfTool.generateId(this.selfid+"-inner-div-");

	this.treeData = [];

	this.treeEvent = {};

	this.html = '<div class="ne-tree-panel" id="'+this.selfid+'">'+
						'<div class="ne-tree-content" id="'+this.treeId+'"></div>'+
						'</div>';


	this.bindEvent = function($this){
		$this.getTree().on('nodeSelected',function(event,data){
			var parent = $this.getParent(data);
			if(typeof($this.treeEvent["dblclick"]) != 'undefined'){
				for(var i = 0 ;i <$this.treeEvent["dblclick"].length;i++){
					var listener = $this.treeEvent["dblclick"][i];
					try{
						listener($this,data,parent);
					}catch(e){

					}
				}
			}else if(typeof($this.treeEvent["click"]) != 'undefined'){
				for(var i = 0 ;i <$this.treeEvent["click"].length;i++){
					var listener = $this.treeEvent["click"][i];
					try{
						listener($this,data,parent);
					}catch(e){

					}
				}

			}
		});
	}


	this.addLinkDOMListener(function($this){
		$this.showTree();

	});


}

cm.gui.comp.Tree.prototype = new cm.gui.comp.Component();


cm.gui.comp.Tree.prototype.addTreeListener = function(type,fun){
	if(this.treeEvent[type] == undefined){
		this.treeEvent[type] = [];
	}
	this.treeEvent[type].push(fun);
}

cm.gui.comp.Tree.prototype.getTree = function(){
	return this.getHtml().find("#"+this.treeId);
}

cm.gui.comp.Tree.prototype.setData = function(data){
	this.treeData.length = 0;
	this.treeData.push(data);
}

cm.gui.comp.Tree.prototype.showTree = function(){
	$("#"+this.treeId).treeview({
		data: this.treeData,
		showBorder:false,
		highlightSelected:true
	});
	this.bindEvent(this);
}

cm.gui.comp.Tree.prototype.getParent = function(node){
	return $("#"+this.treeId).treeview("getParent",node);
}
