package("cm.gui.comp");
$import("bootstrap.bootstrap");
$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");
$importStyle("cm.gui.comp.Dialog");

cm.gui.comp.Dialog = function(param){
	cm.gui.comp.Component.call(this);
	this.param = {
		title:"测试对话框",
		contents:"内容"
	}
	if(param!=undefined){
		this.param = param;
	}
	this.selfid = cm.common.util.WsfTool.generateId("dialog-");
	
	this.html = '<div class="modal fade" id="'+this.selfid+'" tabindex="-1" role="dialog"'+
			'aria-labelledby="exampleModalLabel">'+
			'<div class="modal-dialog" role="document">'+
			'<div class="modal-content">'+
			'<div class="modal-header">'+
			'<button type="button" class="close" data-dismiss="modal"'+
			'aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
			'<h4 class="modal-title" id="exampleModalLabel">'+this.param.title+'</h4>'+
			'</div>'+
			'<div class="modal-body">'+this.param.contents+
			/*'<form>'+
			'<div class="form-group">'+
			'<label for="recipient-name" class="control-label">Recipient:</label>'+
			'<input type="text" class="form-control" id="recipient-name">'+
			'</div>'+
			'<div class="form-group">'+
			'<label for="message-text" class="control-label">Message:</label>'+
			'<textarea class="form-control" id="message-text"></textarea>'+
			'</div>'+
			'</form>'+*/
			'</div>'+
			'<div class="modal-footer">'+
			'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
			'<button type="button" class="btn btn-primary">Send message</button>'+
			'</div>'+
			'</div></div></div>';
	this.addLinkDOMListener(function($this){
    	$('#'+$this.selfid).modal({
            keyboard:false,
            show:false,
            backdrop:'static'
        });/*.on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var recipient = button.data('whatever') // Extract info from data-* attributes

            var modal = $(this)
            modal.find('.modal-title').text('New message to ' + recipient)
            modal.find('.modal-body input').val(recipient)
        })*/
    });
}

cm.gui.comp.Dialog.prototype = new cm.gui.comp.Component(); 

cm.gui.comp.Dialog.prototype.show = function(){
	$("#"+this.selfid).modal("show");
}