/**
 * Created by Administrator on 2016/7/19.
 */
package("cm.wsf.topo");

$import("cm.wsf.topo.MocTree");

cm.wsf.topo.MocTreeController = function (mainPanel) {
    var mocTree = new cm.wsf.topo.MocTree();

    var neTreeOnClickForMocTree = function (tree, neNodeData) {
        if(neNodeData.mocName == "subnetwork" || neNodeData.mocName == "CurrentArea"){
            return;
        }
        $.ajax({
            url: getAPIPath("cm-model")+"/getMocTree",
            type: "GET",
            dataType: "json",
            data: {
                neVersion: '5GV1.0'
            },
            success: function (moctreedata) {
                mocTree.setNeData(neNodeData);
                mocTree.setData(moctreedata);
                mocTree.showTree();
                mainPanel.getLeftTreePanel().setBottomComponent(mocTree);
            }
        });
    }


    this.getMocTree = function(){
        return mocTree;
    }

    this.registNeTreeClickEvent = function(neTree){
        neTree.addTreeListener("click",neTreeOnClickForMocTree);
    }

}