package("cm.gui.comp.tablePanel");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");
$importStyle("cm.gui.comp.tablePanel.Table");

/**
this.param = {
		title:"", 标题
		hasHeader:false, 是否有标题头div
		footerContents:'', 下方脚div
		hasFooter:false,  是否有下方脚div
		dialogId:''  弹出对话框的id
	}


*/
cm.gui.comp.tablePanel.Table = function(param){
	cm.gui.comp.Component.call(this);

	this.param = {
		title:"",
		hasHeader:false,
		footerContents:'',
		hasFooter:false,
		dialogId:'',
        hasBorder:true
	};

	if(param!=undefined){
		this.param = param;
	}

	this.selfid = cm.common.util.WsfTool.generateId("tablePanel-");

    this.toolbarId = cm.common.util.WsfTool.generateId("tablePanel-toolbar-");

	this.panelHeaderId = cm.common.util.WsfTool.generateId("panelHeader-");

	this.panelFooterId = cm.common.util.WsfTool.generateId("panelFooter-");

	this.tableid = cm.common.util.WsfTool.generateId("table-");

	this.headerTrid = cm.common.util.WsfTool.generateId("headerTr-");

	this.contentTrid = cm.common.util.WsfTool.generateId("contentTr-");

	this.VMID = cm.common.util.WsfTool.generateId("tableVMID-");

	this.paginationVMID = cm.common.util.WsfTool.generateId("paginationVMID-");

	this.header ='<div style="width:20px;display:inline;" ms-text="param.title"></div>'+
				'<button type="button" ms-click="openBtnClick" class="btn btn-primary btn-sm" '+
				'style="float: right;border: 0;" data-toggle="modal" '+
				// 'ms-attr-data-target="#{{param.dialogId}}"'+
				' >'+
				'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'+
				'</button>';
				
	this.footer = '<div style="height:30px;padding:0 40%;" ms-controller="'+
			this.paginationVMID+'">'+
			'<div id="masking" style="z-index:1002;opacity:.20; background-color:'+
			'black;display:none;width: 133px;height: 39px;position: absolute;">'+
			'</div>'+
			'<nav id="tablePagination" style="z-index:1001;position: absolute;">'+
			'<ul class="pagination" style="margin: 0;"> '+
			'<li>'+
			'<a href="#" aria-label="Previous" ms-click="previous">'+
			'<span aria-hidden="true">&laquo;</span>'+
			'</a>'+
			'</li>'+
			'<li ms-repeat="pageArr" ms-class="active: $index+1  == currentPage"'+
			' data-repeat-rendered="'+'pageRepeatArrCallFun">'+
			'<a href="#" ms-click="pageClick">{{$index+1}}</a>'+
			'</li>'+
			'<li>'+
			'<a href="#" aria-label="Next" ms-click="next">'+
			'<span aria-hidden="true">&raquo;</span>'+
			'</a>'+
			'</li>'+
			'</ul>'+
			'</nav>'+
			'</div>';

	this.html = '<div style="width:100%;height:100%;" id="'+this.selfid
                +'" ms-controller="'+this.VMID+
                '"><div class="panel panel-primary" ms-class="hasBorder:!param.hasBorder">'+
				'<div class="panel-heading" id="'+this.panelHeaderId
				+'" ms-visible="param.hasHeader">'+
				this.header+'</div>'+
				'<div class="panel-body panel-body-my">'+
                '<div id="'+this.toolbarId
                +'"></div>'+
				'<table class="table table-bordered tablePanel" id="'+
				this.tableid+'" >'+
				'<tr id="'+this.headerTrid+'">'+
				'<th ms-repeat="header" data-repeat-rendered="tableThRepeatCallFun">'+
				'{{el}}</th>'+
				'</tr>'+
				'<tr ms-repeat="contents" data-repeat-rendered="tableTrRepeatCallFun"'+
				' ms-attr-name="{{$index}}" id="'+this.contentTrid+'">'+
				'<td ms-repeat="el" ms-attr-name="{{$key}}" ms-visible="$val.isVisible || $val.isVisible==undefined"'+
				' data-repeat-rendered="tableTdRepeatCallFun">{{$val|html}}</td>'+
				'</tr>'+
				'</table>'+
				'</div>'+
				'<div class="panel-footer" id="'+this.panelFooterId
				+'" style="text-align:center;padding:10px;"'+
				' ms-visible="param.hasFooter">'+
				this.footer+
				'</div></div></div>';
	var registerAvalonPaginationVM = this.registerAvalonPaginationVM;
    this.registerAvalonVMObj = {
		$id:this.VMID,
        mocName:"",
        requstParam:{},
        parentRequstParam:{},
        header:[],
        param:this.param,
        contents:[],
        currentSlectedTr:""
    };
    //分页组件上面的视图对象
    this.avalonCallFun = function(vm){
    	vm.size=2,//TODO 首次加载的时候发送一条ajax提交，回复中要带有总共有多少条数的记录
        vm.limit=10,//TODO 通过外界参数进行设定，主要就是new的时候传入的参数
        vm.start=0,
        vm.param={},//TODO 手工传入的，这个是保存表格申请数据过程中的其他参数
        vm.url="",//TODO 手工传入的，主要是访问地址
        vm.pageArr=new Array(2),//TODO 模拟数组的大小，主要通过返回的size来确定
        vm.currentPage=1,//当前所在的页码，从1开始计数
        vm.isRemote=false,
    	vm.previous = function(){
        	vm.masking(true);
            vm.currentPage--;
            if(vm.currentPage<1){
                vm.currentPage = vm.size;
            }
            vm.masking(false);
        },
        vm.next = function(){
            vm.masking(true);
            vm.currentPage++;
            if(vm.currentPage>vm.size){
                vm.currentPage = 1;
            }
            vm.masking(false);
        },
        vm.pageClick = function(){
            var num = parseInt($(this).text());
            vm.currentPage = num;
        },
        vm.init = function(){
            vm.requstData(function(data){
                vm.size = data.size;
                vm.limit = data.limit;
                vm.start = data.start;
                vm.pageArr = new Array(vm.size);

            });
        },
        vm.requstData = function(fun){
            if(vm.isRemote){
                $.ajax({
                    url: vm.url,
                    type: "GET",
                    dataType: "json",
                    data:{
                        start:vm.start,
                        limit:vm.limit,
                        param:vm.param
                    },
                    success:function(data){
                        //TODO 将返回的数据封装到外层的表格数据中去，要调用外层的方法
                        fun(data);
                    }
                });
            }else{
                //不是通过ajax进行数据请求的，是本地数据
            }
        },
        vm.masking = function(isMask){
            $("#masking").css({
                display:isMask?"block":"none",
                height:$("#tablePagination").height(),
                width:$("#tablePagination").width()
            });
        },
        vm.pageRepeatArrCallFun = function(){}
    }
    	

    this.setHeight = function(){
    	var headerHeight = 0;
    	var footerHeight = 0;
    	var contentHeight = 0;
    	var windowHeight = $("#"+this.selfid).height();
    	if(this.param.hasHeader){
    		headerHeight = $("#"+this.panelHeaderId).outerHeight();
    	}
    	if(this.param.hasFooter){
    		footerHeight = $("#"+this.panelFooterId).height();
    	}
    	contentHeight = windowHeight-headerHeight-footerHeight;
    	$("#"+this.selfid).find(".panel-body-my").height(contentHeight).css("overflow","auto");
    }

    this.setTrClickStyle = function(){
        $("table.tablePanel").find("tr").click(function(event) {
            if($(this).get(0)==$(this).parent().find(".trSelected").get(0)){
                return;
            }
            $(this).parent().find(".trSelected").removeClass("trSelected");
            $(this).addClass("trSelected");
        });
    }

    this.addLinkDOMListener(function($this){
        $(window).resize(function(){
            $this.resize();
        });
    	$this.registerAvalonVMObj.param = $this.param;
    	$this.registerAvalonVM = avalon.define($this.registerAvalonVMObj);
    	$this.registerAvalonPaginationVM = avalon.define($this.paginationVMID,$this.avalonCallFun);
    	avalon.scan();
    });


}

cm.gui.comp.tablePanel.Table.prototype = new cm.gui.comp.Component();

cm.gui.comp.tablePanel.Table.prototype.setTableHeader = function(data){
	if(data instanceof Array){
		this.registerAvalonVM.header = data;
	}
}
cm.gui.comp.tablePanel.Table.prototype.pushTableHeader = function(data){
	this.registerAvalonVM.header.push(data);
}

cm.gui.comp.tablePanel.Table.prototype.pushTableValue = function(data){
	this.registerAvalonVM.contents.push(data);
}

cm.gui.comp.tablePanel.Table.prototype.setTableValue = function(data){
	if(data!=undefined &&  data instanceof Array){
		this.registerAvalonVM.contents = data;
	}
}

cm.gui.comp.tablePanel.Table.prototype.setToolbar = function(toolbar){
    toolbar.linkDOM(this.toolbarId);
}