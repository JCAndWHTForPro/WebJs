package("cm.wsf.topo.planned");

$import("cm.gui.comp.tablePanel.Table");
$import("cm.common.util.WsfTool");

$importStyle("cm.wsf.topo.planned.PlannedAreaTablePanel");

cm.wsf.topo.planned.PlannedAreaTablePanel = function(dialog,progress){

	cm.gui.comp.tablePanel.Table.call(this);
	var param = {
		title:"规划区管理",
		hasHeader:true,
		hasFooter:false,
		dialogId:dialog.selfid,
		progressId:progress.selfid
    }

	for(var o in param){
		this.param[o] = param[o];
	}

	this.url = "/";

	var tdButtonStr = '<td class="button-td">'+
					'<button ms-if="status==0" type="button" class="btn btn-primary btn-sm" '+
					'data-toggle="modal" ms-click="openBtnClick" '+
					'>打开</button>'+
					'<button ms-if="status==1" type="button" class="btn btn-primary btn-sm" '+
					'data-toggle="modal" ms-click="closeBtnClick" '+
					'>关闭</button>'+
					'<button type="button" class="btn btn-primary btn-sm" '+
					'data-toggle="modal" ms-disabled="{{status==1}}" ms-click="deleteBtnClick"'+
					' >删除</button>'+
					'<button type="button" class="btn btn-primary btn-sm" '+
					'data-toggle="modal" ms-disabled="{{status==0}}" ms-click="viewBtnClick"'+
					' >查看</button>'+
					'</td>';


	var headerExt='<th>操作</th>';


	this.headerArr = ["规划区ID","状态","最后修改时间"];


	var contentTrId = this.contentTrid;
	var dialogId = this.param.dialogId;
	var progressId = this.param.progressId;
	var plannedAreaPanelThis = this;

	//注册Avalon中repeat元素之后的回调函数
	this.registerAvalonVMObj.tableThRepeatCallFun = function(){
		$(this).append(headerExt);
	}

	//注册父组件中的创建规划区的click事件
	this.registerAvalonVMObj.openBtnClick = function(){
		progress.show();
		$.ajax({
            url: getAPIPath("cm-plan-area")+"/manage/create",
            type: "GET",
            dataType: "json",
            success:function(data){
//				$.cometd.init(window.location.protocol + "//"+window.location.hostname+":8084/cometd");
                var cometPath = data.cometPath;
                progress.subscribe(cometPath,function(jsonResult){
                	if(jsonResult.status=="2"){
						plannedAreaPanelThis.getAllPlanAreaInfo();
					}else if(jsonResult.status=="3"){
						alert(jsonResult.msg);
					}
                })
            },
            error:function(){
				progress.hide();            	
            }
        });
	}
	//注册表格中td标签动态加载完之后的回调函数
	this.registerAvalonVMObj.tableTdRepeatCallFun = function(){
		$(this).append(tdButtonStr);

		var statusDiv = "<span ms-if='status==0'>关闭</span>"+
						"<span ms-if='status==1'>打开</span>";
		$(this).find("[name='Status']").html(statusDiv);
		
		tableAvalonDefine($(this));
		plannedAreaPanelThis.setHeight();
	}


	var tableAvalonDefine = function(trEl){
		var index = parseInt(trEl.attr("name"));
		var parentTableVM = avalon.vmodels[plannedAreaPanelThis.VMID];
		var originStatusId = parentTableVM.contents[index].Status;
		trEl.attr("ms-controller","tableInnerVm"+index);

		var innerTRVM = avalon.define({
			$id:"tableInnerVm"+index,
			status:parseInt(originStatusId),
			planAreaId:trEl.find("[name='ID']").text(),
			openBtnClick:function(){
				$.ajax({
		            url: getAPIPath("cm-plan-area")+"/manage/open",
		            type: "GET",
		            dataType: "json",
		            data:{"dataAreaId":innerTRVM.planAreaId},
		            success:function(data){
		            	if(innerTRVM.status == 0){
			            	if(data.code == 0){
								innerTRVM.status = 1;
								alert("打开成功。");
							}else{
								if(data.message.endsWith("already open!")){
		            				innerTRVM.status = 1;
		            			}
								alert("打开失败:"+data.message);
							}
		            	}
		            },
		            error:function(){
							alert('打开失败!') ;         	
		            }
		        });

			},
			deleteBtnClick:function(){
		        var deleteArrIndex = parseInt($(this).parent().parent().attr("name"));
				//删除事件回调
				$.ajax({
		            url: getAPIPath("cm-plan-area")+"/manage/delete",
		            type: "GET",
		            dataType: "json",
		            data:{"dataAreaId":innerTRVM.planAreaId},
		            success:function(data){
						if(data.code == 0){
							parentTableVM.contents.splice(deleteArrIndex,1);
							alert("删除成功");
						}else{
							alert("删除失败"+data.message);
						}
		            },
		            error:function(){
							alert('连接异常!') ;         	
		            }
		        });
			},
			viewBtnClick:function(){
				//查看事件回调
				// console.log("open:" + "/web/plannedArea.html?dataAreaId="+innerTRVM.planAreaId )
				window.open("plannedArea.html?dataAreaId="+innerTRVM.planAreaId);
			},
			closeBtnClick:function(){
				//关闭事件回调
				$.ajax({
		            url: getAPIPath("cm-plan-area")+"/manage/close",
		            type: "GET",
		            dataType: "json",
		            data:{"dataAreaId":innerTRVM.planAreaId},
		            success:function(data){
		            	if(innerTRVM.status == 1){
		            		if(data.code == 0){
		            			innerTRVM.status = 0;
		            			alert("关闭成功")
		            		}else{
		            			alert(data.message)
		            			if(data.message.endsWith("is not open yet")){
		            				innerTRVM.status = 0;
		            			}
		            		}
						}
		            },
		            error:function(){
						alert('关闭失败!')          	
		            }
		        });
			}
		});
		avalon.scan();
	}

	this.addLinkDOMListener(function($this){
		$this.setTableHeader($this.headerArr);
		$this.getAllPlanAreaInfo();
	});

}

cm.wsf.topo.planned.PlannedAreaTablePanel.prototype = new cm.gui.comp.tablePanel.Table();

cm.wsf.topo.planned.PlannedAreaTablePanel.prototype.getAllPlanAreaInfo = function(){
	var plannedAreaTablePanelThis = this;
	$.ajax({
        url: getAPIPath("cm-plan-area")+"/manage/get",
        type: "GET",
        dataType: "json",
        success:function(data){
        	if(data.code!="0"){
        		alert(data.message);
        	}else{
        		plannedAreaTablePanelThis.setTableValue(data.planAreaInfoList)
        	}
        },
        error:function(XHR,textRequest,errorThrown){
        	alert(textRequest);
        }
    });
}