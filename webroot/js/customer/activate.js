define("activate.dispatcher", function(){

	var app = angular.module('myApp', []);
	var response;
	var taskNo;
	app.controller('customersCtrl', function($scope) {
		$scope.neStatusMap = {
			'1,sbn=1,me2': {
				'code': 1,
				'progress': 1,
				'detail': 'createXmlFile error'
			},
			'1,sbn=1,me1': {
				'code': 1,
				'progress': 1,
				'detail': 'createXmlFile error'
			}
		};
	
		$scope.response = {
			taskNo: 73324533584581,
			briefStatus: {
				'code': 0,
				'progress': 5,
				'detail': 'success'
			},
			neStatusMap: {
				'1,sbn=1,me2': {
					'code': 1,
					'progress': 5,
					'detail': 'createXmlFile error'
				},
				'1,sbn=1,me1': {
					'code': 1,
					'progress': 5,
					'detail': 'createXmlFile error'
				}
			}
		}
		
		response = $scope.response;
		setTimeout(func, 4000);
	});
	
	function func(){

	}

    function beginActivate(e) {    	
    	DisableButton();
    	var files = e.target.files;
        sendActivateRequest("ne List", getFormData(files)); 
    	processSchedule(isTaskFinished, actionAfterFinish);  	   		
    }
    
    function getFormData(files){
        var importZipfile = files[0];
        console.info(importZipfile.name.toLowerCase());
               
        var form = new FormData();
        form.append("file", importZipfile);
        
        return form;
    }
    
    function DisableButton(){
        $("#activate_input").attr("disabled","true");
        $("#activate_span").addClass("button-disable");  	
    }
    
    function enableButton() {	
        $("#activate_input").removeAttr("disabled","disabled");
        $("#activate_span").removeClass().addClass("button")
    }
    
    function sendActivateRequest(neList, form){
		$.ajax({
            url: "http://localhost:8088/api/activate/v1" + getActivateTaskType(),
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success:function(data){
				if(data.code == 0){
					taskNo = data.taskNo;
					alert("激活任务启动成功" + data.message);
					console.info(taskNo);
				        $.cometd.init(window.location.protocol + "//"+window.location.hostname+ ":" +window.location.port+"/api/activate/v1/cometd");
               			        var cometPath = "/ssss"+taskNo;
               			        console.info("cometPath = ", cometPath);
               			        
                		        $.cometd.subscribe(cometPath,function(result){
                		            var temp = eval("(" + result.data + ")");

                                            response = temp.activateStatus;
                                            console.info("response======== ",response);

                		            //response = JSON.parse(result.data["activateStatus"]);
                		        })
                		        
				}else{
					alert("激活任务启动失败" + data.message);
				}
            },
            error:function(){
				alert('连接异常!');         	
            }
              
        });
    }
    
    function sendActivateRequest33(neList){
		$.ajax({
            url: "http://localhost:8088/api/activate/v1/taskStatus?taskNo=333070407200119",
            type: "GET",
            dataType: "JSON",
            data:{"neList":neList},
            success:function(data){
            	taskNo = data.taskNo;
            	alert("激活任务启动成功");
            },
            error:function(){
				alert('连接异常!');         	
            }
        });
    }
    
    function getActivateTaskType(){
        var item = $("input[name='activate-type']:checked").val(); 
        console.info("item:" + item);
        
        if(item == "整表"){
        	return "/wholeActivation";
        }else{
        	return "/incrementalActivation";
        }
    }
    
    function processSchedule(condition, action) {
    	updateProcessBarWithPercent();
    	
        if (condition()) {
            action();
        } else {
            setTimeout(processSchedule, 100, condition, action);
        }
    }
    
    function isTaskFinished(){
    	if(response.briefStatus.progress == 100){
    		return true;
    	}
    	
    	return false;
    }
    
    function actionAfterFinish(){
    	if(response.briefStatus.code == 1){
    	    updateProcessBarWithDetail();
    	}
    	
    	enableButton();
    }
    
    function updateProcessBarWithDetail(){
    	activate.processbar.beginProcessBar("whole_processBar", response.briefStatus.detail, response.briefStatus.progress + '%');
		
		for(var key in response.neStatusMap){
			console.info(key);
			activate.processbar.beginProcessBar(key.split(",")[2], response.neStatusMap[key].detail, response.neStatusMap[key].progress + '%');
		}
    }
    
    function updateProcessBarWithPercent(){
    	activate.processbar.beginProcessBar("whole_processBar", response.briefStatus.progress + '%', response.briefStatus.progress + '%');
		
		for(var key in response.neStatusMap){
			//console.info(key);
			activate.processbar.beginProcessBar(key.split(",")[2], response.neStatusMap[key].progress + '%', response.neStatusMap[key].progress + '%');
		}
    }
	
	function cancleActivate() {
        //将还未开始激活的网元的任务取消掉
		//sendCancelActivateRequest();
		recoverProcessBar();
		enableButton();
    }
	
	function recoverProcessBar(){
		activate.processbar.stopProcessBar("whole_processBar");
		
		for(var key in response.neStatusMap){
			activate.processbar.stopProcessBar(key.split(",")[2]);
		}
	}
	

	
    return {
        beginActivate:beginActivate,
        cancleActivate:cancleActivate
    }

})