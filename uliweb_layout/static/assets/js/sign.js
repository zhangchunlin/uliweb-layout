//加签触发流程交易
function sign(process_inst_id,todo_id){
	var reqData = {};
	
	var itdmLayerSet = getItdmLayerSet('加签', '/ecpweb/pages/pub/aprvRegion.jsp?type=jq', '80%', '60%');
	var layerSet = $.extend(itdmLayerSet,{
		end:function(){
			if($("#submitFlag").val() == "1"){//弹出层点确认时
				$("#addBtn").attr('disabled',true);
				var layerData = $("#wfeLayerData").data("formData"); 
				var userTree = $("#wfeLayerData").data("userTree");
				
				var userList = $.map(userTree, function(node){
					return node.data.CCB_EMPID;
				});
          	    reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
				reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
//				reqData.CUR_LNK_EXEC_PSN_ID = layerData.name;//加签候选人ID
				reqData.CUR_LNK_EXEC_PSN_ID = userList.join(",");
				reqData.CHK_OPIN_DSC = layerData.OPIN_DESC;//意见详情
				var req = P2.simpleTx("A09021197",reqData);
          	    var loadDiv = layer.load();
    	        req.success(function(result) {
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("加签成功!",{time: 2000},function(){
         				window.opener.location.reload();
        			    window.close();
         			});
    	        });
    	        req.error(function(result){
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("加签失败!");
    	        	$("#addBtn").attr('disabled',false);
    	        });
    	        req.call();
			}
        }
    });
    
    layer.open(layerSet);
}
//加签办理
function signBack(process_inst_id,todo_id){
	var reqData = {};
	
	var itdmLayerSet = getItdmLayerSet('加签办理', '/ecpweb/pages/pub/aprvRegion.jsp?type=jqbl', '80%', '60%');
	var layerSet = $.extend(itdmLayerSet,{
		end:function(){
			if($("#submitFlag").val() == "1"){//弹出层点确认时
				$("#recallsubBtn").attr('disabled',true);
				var layerData = $("#wfeLayerData").data("formData");
          	    reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
				reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
				reqData.CHK_OPIN_DSC = layerData.OPIN_DESC;//意见详情
				var req = P2.simpleTx("A09021195",reqData);
				var loadDiv = layer.load();
    	        req.success(function(result) {
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("加签办理成功!",{time: 2000},function(){
         				window.opener.location.reload();
        			    window.close();
         			});
    	        });
    	        req.error(function(result){
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("加签办理失败!");
    	        	$("#recallsubBtn").attr('disabled',false);
    	        });
    	        req.call();
			}
        }
    });
    
    layer.open(layerSet);
}
//加签撤回
function signWithdraw(process_inst_id,todo_id){
	$("#recallBtn").attr('disabled',true);
	var reqData = {};
	reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
	reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
	var req = P2.simpleTx("A09021196",reqData);
	var loadDiv = layer.load();
	req.success(function(result) {
		layer.close(loadDiv);
		parent.layer.msg("加签撤回成功",{time: 2000},function(){
			window.opener.location.reload();
		    window.close();
		});
    });
	req.error(function(result){
		layer.close(loadDiv);
		parent.layer.msg("加签撤回失败!");
		$("#recallBtn").attr('disabled',false);
	});
    req.call();
}
//子流程强制撤回调用 A09021198 交易
function signSonWithdraw(process_inst_id, task_id){
	$("#enforceBtn").attr('disabled',true);
	var reqData = {};
	reqData.PRIM_PCS_EXMP_IDR = process_inst_id;//要撤回的子流程的相对主流程实例标识
	reqData.PRIM_PCS_AVY_ID = task_id;//主流程活动编号
	var req = P2.simpleTx("A09021198",reqData);
	var loadDiv = layer.load();
	req.success(function(result) {
		layer.close(loadDiv);
		parent.layer.msg("收回子流程成功!",{time: 2000},function(){
			window.opener.location.reload();
		    window.close();
		});
    });
	req.error(function(result){
		layer.close(loadDiv);
		parent.layer.msg("收回子流程失败!");
		$("#enforceBtn").attr('disabled',false);
	});
    req.call();
}