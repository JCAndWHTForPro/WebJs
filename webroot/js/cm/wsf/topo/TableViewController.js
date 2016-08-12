/**
 * Created by Administrator on 2016/7/19.
 */
package("cm.wsf.topo");

$import("cm.gui.comp.TableView");

cm.wsf.topo.TableViewController = function(tabPanel){
    var treeOnClick = function(tree,nodeData){
        var requestParam;
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
        var target = (requestParam.dataAreaId==0?"cm-current-area":"cm-plan-area");
    	  console.log("requestParam.dataAreaId:"+requestParam.dataAreaId + "  target:" + target)
        $.get({
            url: getAPIPath(target)+"/getTableView?treeNodeInfo="+JSON.stringify(requestParam),
            success: function (data) {
            	if(data.code!="0"){
                 alert(data.message);
                 return;
              }
                var tableView = new cm.gui.comp.TableView();
                var id;
                var title = requestParam.dataAreaId+"-"+requestParam.subnetwork+"-"+requestParam.managedElement+"-"+requestParam.mocName;
                if(null == requestParam.treePath){
                	id = title;
                }else{
                	id = requestParam.treePath;
                }
         
                tabPanel.addPanel(id,title,tableView,true);
                tableView.dealData(data);
            }
        })
    }

    this.registTreeClickEvent = function(tree){
        tree.addTreeListener("click",treeOnClick);
    }

}