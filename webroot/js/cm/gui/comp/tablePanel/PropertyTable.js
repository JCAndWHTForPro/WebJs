package("cm.gui.comp.tablePanel");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");
$importStyle("cm.gui.comp.tablePanel.PropertyTable");


cm.gui.comp.tablePanel.PropertyTable = function(){
	cm.gui.comp.Component.call(this);

	this.selfid = cm.common.util.WsfTool.generateId("propertyTable-");
	this.tableId = cm.common.util.WsfTool.generateId("pTable-");
	this.toolbarId = cm.common.util.WsfTool.generateId("pTable-toolbar-");
	
	this.html = '<div ms-controller="'+this.selfid
				+'" class="panel panel-primary" id="'+this.selfid
				+'" style="border:0;height:100%;width:100%;overflow:auto;">'+
				'<div class="panel-body" style="padding:0;">'+
				'<div id="'+this.toolbarId
				+'"></div>'+
				'<table class="table table-bordered propertyTable" id="'+this.tableId
				+'" >'+
				'<tr ms-repeat="resultData" ms-attr-id="'+this.selfid+
				'-propertyTable-{{$index}}" data-repeat-rendered="tableTrRepeatCallFun"'+
				' ms-visible="el.isVisible || el.isVisible==undefined">'+
				'<td style="width:50%;">{{el.fieldName}}</td>'+
				'<td style="width:50%;padding:0;"><div'+
				' style="width:100%;height:100%;line-height:37px;"'+
				' ms-visible="el.readOnly">{{el.displayValue}}</div>'+
				'<input class="form-control" placeholder="Please Input..." type="text"'+
				' style="width:100%;height:100%;padding:0;"'+
				' ms-visible="!el.readOnly && el.compType==1" ms-duplex="el.displayValue"/>'+
				'<div style="width:100%;"'+
				' class="btn-group dropdown" ms-visible="!el.readOnly && el.compType==2" >'+
			    '<input type="text" style="width: 85%;float: left;height:37px;"'+
			    ' readonly="readonly"  ms-duplex="el.displayValue"/>'+
			    '<button style="width: 15%;float: left;padding: 6px 10px;height:37px;"'+
			    ' type="button" class="btn btn-primary dropdown-toggle"'+
			    ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
			    '<span class="caret"></span>'+
			    '<span class="sr-only">Toggle Dropdown</span>'+
			    '</button>'+
			    '<ul class="dropdown-menu" style="height:100px;width:100%;overflow:auto;">'+
			    '<li ms-repeat-elem="el.comboValue">'+
			    '<a href="#" ms-click="liClick">{{elem}}</a></li>'+
			    '</ul></div></td></tr></table></div></div>';
	this.propertyTableVMObj = {
		$id:this.selfid,
		resultData:[],
		liClick:function(){
            var result = $(this).text();
            if(result=="true"||result=="false"){
            	result = (result=="true"?1:0);
            }
            $(this).parent().parent().parent().find('input').val(result);
        },
        tableTrRepeatCallFun:function(){

        }
	}

	this.addLinkDOMListener(function ($this) {
		$this.propertyTableVM = avalon.define($this.propertyTableVMObj);
		avalon.scan();
		
    });

}

cm.gui.comp.tablePanel.PropertyTable.prototype = new cm.gui.comp.Component();

cm.gui.comp.tablePanel.PropertyTable.prototype.setToolbar = function(toolbar){
	toolbar.linkDOM(this.toolbarId);
}