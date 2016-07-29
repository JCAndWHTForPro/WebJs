package("cm.gui.comp");

$import("bootstrap.bootstrap");
$import("cm.common.util.WsfTool");
$importStyle('cm.gui.comp.Progress');

cm.gui.comp.Progress = function(param){
    cm.gui.comp.Component.call(this);
    this.param = {
        title:"Please wait...",
        progressStyle:""
    };
    if(param!=undefined){
        this.param = param;
    }

    this.selfid = cm.common.util.WsfTool.generateId("Progress-");
    this.progressTitleTextId = cm.common.util.WsfTool.generateId("ProgressTitleTextId-");
    this.progressBarId = cm.common.util.WsfTool.generateId("ProgressBarId-");


    var VMID = cm.common.util.WsfTool.generateId("ProgressVM-");

    this.html = '<div class="modal fade modal-padding-center" id="'+this.selfid+'" '+
    'tabindex="-1" role="dialog" aria-labelledby="myModalLabel" ms-controller="'+VMID+'">'+
    '<div class="modal-dialog" role="document">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<h4 class="modal-title" id="'+this.progressTitleTextId+'">'+this.param.title+'</h4>'+
      '</div>'+
      '<div class="modal-body modal-body-my">'+
        '<div class="progress myProgress">'+
          '<div class="progress-bar progress-bar-striped active '+this.param.progressStyle+'"'+ 
          'role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" '+
          'ms-css-width="{{progressValue}}%">'+
          '</div>'+
            '<span class="myTextSpan">{{progressValue}}%</span>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '</div>'+
    '</div>';


    var progressVMID = {
        $id:VMID,
        progressValue:0
    };
    this.addLinkDOMListener(function($this){
        $this.progressVM = avalon.define(progressVMID);
        avalon.scan();
        $('#'+$this.selfid).modal({
            backdrop: 'static',
            keyboard: false,
            show:false
        });
    });
}

cm.gui.comp.Progress.prototype = new cm.gui.comp.Component();

cm.gui.comp.Progress.prototype.setProgressValue = function(data){
    //检测传入字符串或者是数字合不合法
    if(data==undefined||!(/\d+/g.test(data+''))) {
        return;
    }
    var tempData = parseInt(data);
    var num = tempData>=100?100:(tempData<=0?0:tempData);
    this.progressVM.progressValue = num;
    if(num>=100) {
        this.progressVM.progressValue = 0;
        this.hide();
    }
}
cm.gui.comp.Progress.prototype.show = function(){
    $("#"+this.selfid).modal("show");
}
cm.gui.comp.Progress.prototype.hide = function(){
    $("#"+this.selfid).modal("hide");
}

//订阅事件注册
cm.gui.comp.Progress.prototype.subscribe = function(cometPath,fun){
    var progressThis = this;
    console.log(cometPath);
    var cometd = $.cometd.subscribe(cometPath,function(result){

        var data = JSON.parse(result.data).progress;
        console.log(data);
        progressThis.setProgressValue(data.progress);
        if(data.status=="2"||data.status=="3"){
            progressThis.unSubscribe(cometd);
            fun(data);
        }
    });
}
//订阅事件解绑
cm.gui.comp.Progress.prototype.unSubscribe = function(comet){
    $.cometd.unsubscribe(comet);
}






