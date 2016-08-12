var neList=[];
function requestNeData(dataAreaId){
	console.debug("call requestNeData");
	var target = (dataAreaId==0?"cm-current-area":"cm-plan-area");
	console.log("dataAreaId:"+dataAreaId + "  target:" + target)
	$.ajax({
		url: getAPIPath(target)+"/getAllMeData/getTree",
		type: "GET",
		dataType: "json",
		data:{
			dataAreaId: dataAreaId
		},
		success:function(data){						
			setNeList(data);
		}
	});
}

function setNeList(data) {
	console.debug("setNeList");
	
	var dataAreaId = data.dataAreaId;
	var subnets = data.nodes;
	console.debug("dataareaid is " + dataAreaId);
	console.debug("nodes is " + subnets);
	if (subnets != null) {
		for (var subnet in subnets) {
			var mes = subnet.nodes;
			for (var me in mes) {
				var nepos;
				nepos.dataAreaId = planid;
				nepos.subnetId = subnet.subnetwork;
				nepos.meId = me.managedElement;
				neList.push(nepos);
			}
		}
	}	
}

function getNeList() {
	return neList;
}
