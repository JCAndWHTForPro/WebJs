package("cm.gui.comp");

$import("cm.common.util.WsfTool");
$import("cm.gui.comp.Component");

$importStyle('cm.gui.comp.TableView');

cm.gui.comp.TableView = function (isTest) {
    cm.gui.comp.Component.call(this);
    this.selfid = cm.common.util.WsfTool.generateId("tableview-");
    this.html = "<div class='full' style='overflow: auto' ms-controller='" + this.selfid + "'>" +
        "<table class='table'>" +
        "<thead id='table-head'>" +
        "<tr ms-visible='cmTableHead.length != 0'>" +
        "<td ms-repeat='cmTableHead'>{{el}}</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='table-body'>" +
        "<tr ms-click='changeTableStyleAfterSelected($index)' ms-class='{{changeTableStyleByRowIndex($index)}}' ms-visible='isShowTableBody($index)' ms-repeat='cmTableBody'>" +
        "<td ms-repeat-elem='el'>{{elem}}</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "</div>";

    var tablemodel = {
        $id: this.selfid,
        cmTableHead: [],
        cmTableBody: [],
        
        //isShowTableHead: function(rowIndex){
        //	if(rowIndex >= 0){
        //		return true;
        //	}
        //	return false;
        //},
        
        isShowTableBody: function(rowIndex){
        	if(rowIndex >= 0){
        		return true;
        	}
        	return false;
        },
        
        changeTableStyleAfterSelected: function(rowIndex){
        	$(this).addClass("after-selected");
        },
        
        changeTableStyleByRowIndex: function(rowIndex){
        	if(rowIndex % 2 == 0){
        		return "odd-row";
        	}else{
        		return "even-row";
        	}
        }
    };
 
    this.addLinkDOMListener(function () {
    	tablemodel = avalon.define(tablemodel);
        avalon.scan();
    });

    this.getTableView = function (){
    	return tablemodel;
    }
    
}

cm.gui.comp.TableView.prototype = new cm.gui.comp.Component();