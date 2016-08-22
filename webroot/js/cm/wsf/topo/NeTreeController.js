/**
 * Created by Administrator on 2016/7/19.
 */
package("cm.wsf.topo");

$import("cm.gui.comp.Tree");

cm.wsf.topo.NeTreeController = function(mainPanel){
    var neTree = new cm.gui.comp.Tree();

    var requesCallBack = function(neData){
        if(neData.code!="0"){
            alert(neData.message);
            return;
        }
        neTree.setData(neData);
        mainPanel.getLeftTreePanel().setTopComponent(neTree);
    }

    this.getNeTree = function(){
        return neTree;
    }

    this.requestNeData = function(dataAreaId){
    	var target = (dataAreaId==0?"cm-current-area":"cm-plan-area");
        $.ajax({
            url: getAPIPath(target)+"/getAllMeData/getTree",
            type: "GET",
            dataType: "json",
            data:{
                dataAreaId: dataAreaId
            },
            success:function(data){
                requesCallBack(data);
            }
        });

    }

}