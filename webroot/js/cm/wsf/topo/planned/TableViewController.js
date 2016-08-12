package("cm.wsf.topo.planned");

$import("cm.gui.comp.TableView");
$import("cm.gui.comp.toolbar.Toolbar");
$import("cm.gui.comp.tablePanel.PropertyTable");

cm.wsf.topo.planned.TableViewController = function(tabPanel){

    var requestParam;
    var parentRequstParam;
    var canAdd = false;
    var treeOnClick = function(tree,nodeData,parentData){
        if (typeof(tree.getNeData) == 'function') {
            var neInfo = tree.getNeData();
            requestParam = {
                dataAreaId: neInfo.dataAreaId,
                subnetwork: neInfo.subnetwork,
                managedElement: neInfo.managedElement,
                mocName: nodeData.text,
                treePath: nodeData.treePath
            }
        }else {
            if(nodeData.mocName == "subnetwork" || nodeData.mocName == "CurrentArea"){
                return;
            }
            requestParam = {
                dataAreaId: nodeData.dataAreaId,
                subnetwork: nodeData.subnetwork,
                managedElement: nodeData.managedElement,
                mocName: nodeData.mocName,
                treePath: nodeData.treePath
            }
        }
        parentRequstParam = {
            dataAreaId: requestParam.dataAreaId,
            subnetwork: requestParam.subnetwork,
            managedElement: requestParam.managedElement,
            mocName: parentData.mocName,
            treePath: parentData.treePath
        };
        var id;
        var title = requestParam.dataAreaId+"-"+requestParam.subnetwork+"-"+requestParam.managedElement+"-"+requestParam.mocName;
        if(null == requestParam.treePath||""==requestParam.treePath){
            id = title;
        }else{
            id = requestParam.treePath+"#"+requestParam.subnetwork+"#"+requestParam.managedElement;
        }
        if(tabPanel.canActivateTab(id)){
            return
        }
        var target = (requestParam.dataAreaId==0?"cm-current-area":"cm-plan-area");

        $.get({
            url: getAPIPath(target)+"/getTableView?treeNodeInfo="+JSON.stringify(requestParam),
            success: function (data) {
                if(data.code!="0"){
                 alert(data.message);
                 return;
                }
                var rightTableContainer = new cm.gui.comp.XSeperatorPanel({
                    dragable: false,
                    splitWidth: 2,
                    splitUnit: "%",
                    splitValue: 100
                });
                var tableView = new cm.gui.comp.TableView();

                tableView.registerAvalonVMObj.requstData = requestParam;

         
                rightTableContainer.setLeftComponent(tableView);

                tabPanel.addPanel(id,title,rightTableContainer,true,null,function(currentActivatePanel){
                    var leftPanel = currentActivatePanel.leftComponent;
                    requestParam = leftPanel.registerAvalonVM.requstParam.$model;
                    parentRequstParam = leftPanel.registerAvalonVM.parentRequstParam.$model;
                });

                //为每一个表格保存当前请求参数与父亲请求参数
                tableView.registerAvalonVM.requstParam = requestParam;
                tableView.registerAvalonVM.parentRequstParam = parentRequstParam;
                setTableViewToolbar(tableView,rightTableContainer);
                canAdd = (data.fieldValueList.length==0);
                tableView.dealData(data);
                //注册表格行监听事件
                tableView.registerTableViewTrClick(rightTableContainer,showLeftPropertyTable);
            }
        })
    }

    /*tabPanel.registerChangeIndexCallFun(function(currentActivatePanel){
        var leftPanel = currentActivatePanel.leftComponent;
        requestParam = leftPanel.registerAvalonVM.requstParam.$model;
        parentRequstParam = leftPanel.registerAvalonVM.parentRequstParam.$model;
    });*/

    this.registTreeClickEvent = function(tree){
        tree.addTreeListener("click",treeOnClick);
    }

    var showLeftPropertyTable = function(data,xPanel,type){
        
        if(xPanel.rightComponent==null){
            showXpanelLeft(xPanel);
            var propertyTable = new cm.gui.comp.tablePanel.PropertyTable();
            xPanel.setRightComponent(propertyTable);

            if(type=="trClick"){//单击一行的时候出发的事件回调
                trClickShowPropertyTable(data,propertyTable);
                
            }else if(type == "addBtnClick"){//点击add按钮触发的事件回调
                addBtnShowPropertyTable(data,propertyTable);
            }

            //设置右边表格的工具栏
            setPropertyTableToolbar(propertyTable,xPanel,type);
            
        }
    }

    var setPropertyTableToolbar = function(propertyTable,xPanel,type){
        //下面是设置PropertyTable的工具栏
        var saveBtn = '<div class="btn-group" ms-click="saveInfo" '+
                    'style="float:right;" role="group">'+
                    '<button type="button" class="btn btn-default">'+
                '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true">'+
                    '</span>Save</button></div>';
        var cancelbtn = '<div class="btn-group" ms-click="cancelEvent" '+
                    'style="float:right;" role="group">'+
                    '<button type="button" class="btn btn-default">'+
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true">'+
                    '</span>Cancel</button></div>';
        var btnArr = [];
        btnArr.push(cancelbtn);
        btnArr.push(saveBtn);
        var toolbar = new cm.gui.comp.toolbar.Toolbar({
            btnArr:btnArr
        });
        //注册propertyTable工具栏按钮点击事件
        toolbar.toolbarVMObj.saveInfo = function(){
            if(type=="trClick"){//更新
                dealMocInfo(propertyTable,"update");
            }else if(type == "addBtnClick"){//添加
                if(canAdd){
                    dealMocInfo(propertyTable,"add");
                    
                }else{
                    alert("此为container类型的moc，只能拥有唯一数据。");
                }
            }
        }

        toolbar.toolbarVMObj.cancelEvent= function(){
            hideXpanelLeft(xPanel);
            propertyTable.dispose();
        }
        propertyTable.setToolbar(toolbar);
    }
    var dealParemObj = function(modelData,type){
        var result = {};
        var moAttributes = {};
        if(type == "add"){
            var createMoKeyObj = {
                mocName:requestParam.mocName
            }
            for(var i=0;i<modelData.length;i++){
                var obj = modelData[i];
                if(obj.fieldName=="managedElement"||obj.fieldName=="dataAreaId"||obj.fieldName=="subnetwork"){
                    createMoKeyObj[obj.fieldName] = obj.displayValue;
                }else if(obj.fieldName=="parentMoDesc"){
                    createMoKeyObj["moParent"] = obj.displayValue;
                }else{
                    moAttributes[obj.fieldName] = obj.displayValue;
                }
            }
            result["createMoKey"] = createMoKeyObj;
        }else if(type == "update"){
            var updateMoKeyObj = {
                mocName:requestParam.mocName
            };
            for(var i=0;i<modelData.length;i++){
                var obj = modelData[i];
                if(obj.fieldName=="managedElement"||obj.fieldName=="dataAreaId"||obj.fieldName=="subnetwork"||obj.fieldName=="moIdentify"){
                    updateMoKeyObj[obj.fieldName] = obj.displayValue;
                }else{
                    moAttributes[obj.fieldName] = obj.displayValue;
                }
            }
            result["updateMoKey"] = updateMoKeyObj;
        }
        result["moAttributes"] = moAttributes;
        return result;
    }
    var dealMocInfo = function(propertyTable,type){
        var modelData = propertyTable.propertyTableVM.resultData.$model;
        var paramObj = dealParemObj(modelData,type);
       $.ajax({
            url: getAPIPath("cm-plan-area")+(type=="update"?"/moUpdate/get":"/moCreate/get"),
            type: "GET",
            dataType: "json",
            data:{
                paramsObj:JSON.stringify(paramObj)
            },
            success:function(data){
                if(data.message=="success"){
                    window.location.reload();
                    
                }else{
                    var msg = (type=="add"?"添加":"更新");
                    alert(msg+"失败！");
                }
            },
            error:function(){
                alert('规划区数据获取失败!');
            }
        });
    }

    var deleteMocInfo = function(tablePanel,index){
        var moIdentify = tablePanel.registerAvalonVM.contents[index].$model.moIdentify;
        var paramObj = {
            delMoKey:{
                moIdentify:moIdentify,
                dataAreaId:requestParam.dataAreaId,
                subnetwork:requestParam.subnetwork,
                managedElement:requestParam.managedElement,
                mocName:requestParam.mocName
            }
        };
        $.ajax({
            url: getAPIPath("cm-plan-area")+"/moDelete",
            type: "GET",
            dataType: "json",
            data:{
                param:JSON.stringify(paramObj)
            },
            success:function(data){
                if(data.message=="success"){
                    window.location.reload();
                    
                }else{
                    alert("删除失败！");
                }
            },
            error:function(){
                alert('规划区数据获取失败!');
            }
        });
    }

    var trClickShowPropertyTable = function(header,propertyTable){
        $.ajax({
            url: getAPIPath("cm-plan-area")+"/mocInfo/getFields",
            type: "GET",
            dataType: "json",
            data:{"mocName":requestParam.mocName,"neVersion":"5GV1.0"},
            success:function(data){
                //添加固定几个不可修改属性
                addreadOnlyProperty(propertyTable,requestParam.managedElement);
                dealParentMoDes(propertyTable,header["parentMoDesc"]);


                for(var i=0;i<data.length;i++){
                    var isKey = data[i].isKey;
                    var propertyName = data[i].name;
                    if(propertyName=="ManagedElementId"||propertyName=="managedElementId"||propertyName=="subnetwork"){
                        continue;
                    }
                    var result = {};
                    result["fieldName"] = propertyName;
                    result["displayValue"] = header[propertyName];
                    result["readOnly"] = isKey;
                    result["isVisible"] = true;
                    switch(data[i].type){
                        case "ENUM":
                            result["compType"] = 2;
                            var range = data[i].range;
                            range.push("");
                            result["comboValue"] = range;
                            break;
                        case "BOOLEAN":
                            result["compType"] = 2;
                            result["comboValue"] = ["true","false",""];
                            break;
                        default:
                            result["compType"] = 1;

                    }
                    propertyTable.propertyTableVM.resultData.push(result);
                }
                propertyTable.propertyTableVM.resultData.push({
                    fieldName:"moIdentify",
                    displayValue:header.moIdentify,
                    readOnly:true,
                    compType:1,
                    isVisible:false
                });
            },
            error:function(){
                alert('规划区数据获取失败!')              
            }
        });
    }

    var addBtnShowPropertyTable = function(header,propertyTable){
        $.ajax({
            url: getAPIPath("cm-plan-area")+"/mocInfo/getFields",
            type: "GET",
            dataType: "json",
            data:{"mocName":requestParam.mocName,"neVersion":"5GV1.0"},
            success:function(data){
                //添加固定几个不可修改属性
                addreadOnlyProperty(propertyTable);
                dealParentMoDes(propertyTable,"");

                for(var i=0;i<data.length;i++){
                    var propertyName = data[i].name;
                    var isKey = data[i].isKey;
                    if(isKey){
                        canAdd = true;
                    }
                    if(propertyName=="ManagedElementId"||propertyName=="managedElementId"||propertyName=="subnetwork"||propertyName=="moIdentify"){
                        continue;
                    }
                    var result = {};
                    result["fieldName"] = data[i].name;
                    result["displayValue"] = data[i].defaultValue;
                    result["readOnly"] = false;
                    result["isVisible"] = true;
                    result["isKey"] = isKey;
                    switch(data[i].type){
                        case "ENUM":
                            result["compType"] = 2;
                            var range = data[i].range;
                            range.push("");
                            result["comboValue"] = range;
                            break;
                        case "BOOLEAN":
                            result["compType"] = 2;
                            result["comboValue"] = ["true","false",""];
                            break;
                        default:
                            result["compType"] = 1;

                    }
                    propertyTable.propertyTableVM.resultData.push(result);
                }
            },
            error:function(){
                alert('规划区数据获取失败!')              
            }
        });
    }

    var dealParentMoDes = function(propertyTable,displayValue){
        if(requestParam.mocName!="ManagedElement"){
            var parentMoDesc = {
                fieldName:"parentMoDesc",
                displayValue:displayValue,
                readOnly:false,
                compType:2,
                // isVisible:false,
                comboValue:[]
            };
            $.ajax({
                url: getAPIPath("cm-plan-area")+"/getTableView",
                type: "GET",

                dataType: "json",
                data:{"treeNodeInfo":JSON.stringify(parentRequstParam)},
                success:function(data){
                    var header = data.fieldNames;
                    var valueList = data.fieldValueList;
                    var result = [];
                    for(var i = 0;i<valueList.length;i++){
                        var resultObj = {};
                        var values = valueList[i];
                        for(var j=0;j<values.length;j++){
                            resultObj[header[j]] = values[j];
                        }
                        result.push(resultObj);
                    }
                    for(var i=0;i<result.length;i++){
                        var obj = result[i];
                        parentMoDesc.comboValue.push(obj.moIdentify)
                    }
                    propertyTable.propertyTableVM.resultData.unshift(parentMoDesc);
                },
                error:function(){
                    alert('规划区数据获取失败!')              
                }
            });

        }

    }
    var addreadOnlyProperty = function(propertyTable,trMeData){
        var arr = [{
            fieldName:"dataAreaId",
            isVisible:true,
            displayValue:requestParam.dataAreaId,
            readOnly:true
        },{
            fieldName:'subnetwork',
            isVisible:true,
            displayValue:requestParam.subnetwork,
            readOnly:true
        }];
        if(requestParam.mocName!="ManagedElement"||trMeData!=undefined){
            arr.push({
                fieldName:'managedElement',
                isVisible:true,
                displayValue:requestParam.managedElement,
                readOnly:true
            });
        }else{
            arr.push({
                fieldName:'managedElement',
                isVisible:true,
                displayValue:"",
                readOnly:false,
                compType:1
            });
        }
        
        for(var i=0;i<arr.length;i++){
            propertyTable.propertyTableVM.resultData.push(arr[i]);
        }
    }
    var setTableViewToolbar = function(tablePanel,xPanel){
        var addBtn = '<div class="btn-group" ms-click="addInfo" role="group">'+
                    '<button type="button" class="btn btn-default">'+
                    '<span class="glyphicon glyphicon-plus" aria-hidden="true">'+
                    '</span>Add</button></div>';
        var deletebtn = '<div class="btn-group" ms-click="deleteInfo" role="group">'+
                    '<button type="button" class="btn btn-default">'+
                    '<span class="glyphicon glyphicon-trash" aria-hidden="true">'+
                    '</span>Delete</button></div>';
        var btnArr = [];
        btnArr.push(addBtn);
        btnArr.push(deletebtn);

        var toolbar = new cm.gui.comp.toolbar.Toolbar({
            btnArr:btnArr
        });
        toolbar.toolbarVMObj.addInfo = function(){
            var headerData = tablePanel.registerAvalonVM.header.$model;
            showLeftPropertyTable(headerData,xPanel,"addBtnClick");
        }
        toolbar.toolbarVMObj.deleteInfo = function(){
            var selectedIndex = tablePanel.registerAvalonVM.currentSlectedTr;
            if(selectedIndex==""||selectedIndex==undefined){
                alert("请选择一行");
            }else{
                deleteMocInfo(tablePanel,parseInt(selectedIndex));
            }
        }
        tablePanel.setToolbar(toolbar);
    }

    var showXpanelLeft = function(xPanel){
        xPanel.resetXSeperator({
            dragable: true,
            splitWidth: 2,
            splitUnit: "%",
            splitValue: 60
        });
        
    }

    var hideXpanelLeft = function(xPanel){
        xPanel.resetXSeperator({
            dragable: false,
            splitWidth: 0,
            splitUnit: "%",
            splitValue: 100
        });
        xPanel.rightComponent=null;
    }

}