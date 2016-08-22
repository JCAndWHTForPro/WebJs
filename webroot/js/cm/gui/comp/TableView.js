package("cm.gui.comp");

$import("cm.common.util.WsfTool");
$import("cm.gui.comp.tablePanel.Table");

$importStyle('cm.gui.comp.TableView');

cm.gui.comp.TableView = function (isTest) {
    cm.gui.comp.tablePanel.Table.call(this);
    var param = {
        hasHeader:false,
        hasFooter:false,
        hasBorder:false
    }
    for(var o in param){
        this.param[o] = param[o];
    }
    this.trCallFunArr = [];
    this.xPanelObjArr = [];

 
    var tableViewThis = this;

    this.registerAvalonVMObj.tableThRepeatCallFun = function(){
        var thArr = $(this).children('th');
        for(var i=0;i<thArr.length;i++){
            var thJquery = $(thArr[i]);
            if(thJquery.text()=="moIdentify"){
                thJquery.remove();
            }
        }
    }

    this.registerAvalonVMObj.tableTdRepeatCallFun = function(){
        $(this).find("[name='moIdentify']").remove();
        tableViewThis.setHeight();
        tableViewThis.setTrClickStyle();

        var tableVm = cm.common.util.WsfTool.getAvalonVMById(tableViewThis.VMID);

        $("#"+tableViewThis.selfid).find("tr").click(function(event) {
            tableVm.currentSlectedTr = $(this).attr("name");
            for(var i=0;i<tableViewThis.trCallFunArr.length;i++){
                tableViewThis.trCallFunArr[i](tableViewThis.getSelectedValue(),tableViewThis.xPanelObjArr[i],"trClick");
            }
        });
    }

    this.registerTableViewTrClick = function(xPanel,fun){
        this.xPanelObjArr.push(xPanel);
        this.trCallFunArr.push(fun)
    }
    
}

cm.gui.comp.TableView.prototype = new cm.gui.comp.tablePanel.Table();

cm.gui.comp.TableView.prototype.dealData = function(data){
    var header = data.fieldNames;
    var valueList = data.fieldValueList;
    this.setTableHeader(header);
    var result = [];
    for(var i = 0;i<valueList.length;i++){
        var resultObj = {};
        var values = valueList[i];
        for(var j=0;j<values.length;j++){
            resultObj[header[j]] = values[j];
        }
        result.push(resultObj);
    }
    this.setTableValue(result);
}

cm.gui.comp.TableView.prototype.getSelectedValue = function(){
    var selectInde = parseInt(this.registerAvalonVM.currentSlectedTr);
    var result = this.registerAvalonVM.contents[selectInde].$model;
    return result;
}

