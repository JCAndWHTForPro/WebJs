package("cm.gui.comp.toolbar");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");
$importStyle("cm.gui.comp.toolbar.Toolbar");

cm.gui.comp.toolbar.Toolbar = function(param){
	cm.gui.comp.Component.call(this);
	this.param = {
		btnArr:[]
	}
	if(param!=undefined){
		for(var o in param){
			this.param[o] = param[o];
		}
	}
	this.selfid = cm.common.util.WsfTool.generateId("toolbar-");

	this.html = '<div class="btn-toolbar" id="'+this.selfid+
				'" ms-controller="'+this.selfid+
				'" role="toolbar"'+
				' style="background: #428BCA;'+
				'text-align: center;width: 100%;'+
				'padding:3px 5px;height: 30px;margin: 0;">'+
				'</div>';
	this.toolbarVMObj = {
		$id:this.selfid
	}
	this.addLinkDOMListener(function($this){
		for(var i=0;i<$this.param.btnArr.length;i++){
			$this.addToolbarBtnComp($this.param.btnArr[i]);
		}
		$this.toolbarVM = avalon.define($this.toolbarVMObj);
		avalon.scan();
	});

}

cm.gui.comp.toolbar.Toolbar.prototype = new cm.gui.comp.Component();

cm.gui.comp.toolbar.Toolbar.prototype.addToolbarBtnComp = function(comp){
	this.getHtml().append(comp);
}