//定义name空间
function define(module, funcExportDefine){
    var subNamespace = module.split('.');
    var ctx = window;
    for(var i = 0; i<subNamespace.length;  i++ ){
        if(!ctx[subNamespace[i]])
            ctx[subNamespace[i]]={}

        ctx=ctx[subNamespace[i]]
    }

    var apis = null
    try{
        apis=funcExportDefine()
        if(apis){
            for(var funcname in apis){
                ctx[funcname] = apis[funcname]
            }
        }
    }catch(e){
        console.log("module error:", module, "exception:",  e.stack )
    }
}

define("activate.processbar", function() {
    function ProcessBar(elementId) {

        var self = this;
        this.progress = 0;
        this.elemSel = $("#" + elementId);

        var strDiv = $("<div style='width:100%; height:10px; border:solid 1px #ccc; padding: 1px;'></div>");
        this.labSel = $("<div style='color:gray;font-size: 12px;text-align: right;width:100%;height:16px;'>0%</div>");
        this.barSel = $("<div style='background-color: #2db6ed; width: 10%; height: 10px;'></div>");
        strDiv.appendTo(this.elemSel);

		this.barSel.appendTo(strDiv);
		this.labSel.appendTo(strDiv);


        this.start = function(labelText, progress) {
			self.labSel.text(labelText);
			self.barSel.width(progress);
        }
		
        this.finish = function() {
			self.labSel.text('100%');
			self.barSel.width('100%');
        }
		
        this.stop = function() {
            self.elemSel.empty();
        }
        
    }

    function Map(){
        self = this;
        this.keys = [];
        this.data = {};
        this.put = function(key,value){
            if(self.data[key] == null)  
                self.keys.push(key);
            self.data[key] = value;
        }
        
        this.get = function(key){
            return self.data[key];
        }
        
        this.remove = function(key) {
            function removeArrayElement(index, array) {
                if (index >= 0 && index < array.length) {
                    for (var i = index; i < array.length; i++) {
                        array[i] = array[i + 1];
                    }
                    array.length = array.length - 1;
                }
            }
            
            var i = 0;
            for(i = 0 ;i < self.keys.length; i ++){
                if(self.keys[i] == key){
                    removeArrayElement(i,self.keys);
                    break;
                }
            }
            self.data[key] = null;
        }
    }
	
    var processBars = new Map();
	
    function beginProcessBar(elementId, labelText, progress){
        var processObj = processBars.get(elementId);
        if(processObj == null){
     	   processObj = new ProcessBar(elementId);
     	   processBars.put(elementId, processObj);
        }//将id作为key存到map中
        
        processObj.start(labelText, progress);
       console.log('kkk',processBars);     
    }

    function endProcessBar (key) {
        var processBar = processBars.get(key);
        if(processBar){
            processBar.finish();
            processBars.remove(key);
        }
    }
    function stopProcessBar(key){
        var processBar = processBars.get(key);
        if(processBar){
            processBar.stop();
            processBars.remove(key);
        }
    }

    function showTitle(titleId){
        $("#"+titleId).show();
    }

    function hideTitle(titleId){
        setTimeout(function() {
                $("#"+titleId).hide();
            }
            ,1500
        );
    }
    return {
        beginProcessBar:beginProcessBar,
        endProcessBar:endProcessBar,
        stopProcessBar:stopProcessBar,
        showTitle:showTitle,
        hideTitle:hideTitle
    };
});