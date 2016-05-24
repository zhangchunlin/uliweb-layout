//通用办理页面
function handProc(SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID, HISTORY_TASK_ID) {
	$("#subBtn").attr('disabled',true);
	var targetUrl = '/ecpweb/pages/pub/aprvRegion.jsp?SN=' + SN
	+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO="
	+ P_TPL_NO + "&TASK_ID=" + TASK_ID;
	
	if(HISTORY_TASK_ID) {
		targetUrl = targetUrl + "&HISTORY_TASK_ID=" + HISTORY_TASK_ID
		+ "&type=bl1";
    }else{
    	targetUrl = targetUrl + "&type=bl";
    }
	
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : targetUrl,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				for ( var i = 0, len = userTree.length; i < len; i++) {
					userGrp.push(userTree[i].data);
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.OPIN_CODE = "2";
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					parent.layer.msg("提交成功，流程流转至下一环节!", {time : 2000}, function() {
						window.opener.location.reload();
						window.close();
					});
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
					$("#subBtn").attr('disabled',false);
				});
			  req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//通用审核、审批页面办理
function handAdtProc(Tp, SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID, multi, HISTORY_TASK_ID,DEPT_ID, ROLE_NAME) {
	$("#subBtn").attr('disabled',true);
	var targetUrl = '/ecpweb/pages/pub/aprvRegion.jsp?type=' + Tp + '&SN=' + SN
	+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO=" + P_TPL_NO + "&TASK_ID=" + TASK_ID;
	
	if(multi){
		targetUrl = targetUrl + "&multi=" + multi;
	}
	if(HISTORY_TASK_ID) {
		targetUrl = targetUrl + "&HISTORY_TASK_ID=" +HISTORY_TASK_ID;
    }
	if(DEPT_ID) {
		targetUrl = targetUrl + "&DEPT_ID=" +DEPT_ID;
    }
	if(ROLE_NAME){
		targetUrl = targetUrl + "&ROLE_NAME=" + ROLE_NAME;
		targetUrl = encodeURI(targetUrl);
    }
	
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : targetUrl,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				if(userTree.length>0){
					for ( var i = 0, len = userTree.length; i < len; i++) {
						userGrp.push(userTree[i].data);
					}
					reqData.NEXT_USER_GRP = userGrp;
				}else {
					reqData.NEXT_USER_GRP = null;
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.SN = SN;
				// 通过 '1' 不通过 '0'
				var rad = reqData.radio;
				if (rad == '1') {
					reqData.OPIN_CODE = "1";
				} else {
					reqData.OPIN_CODE = "0";
					if(userGrp){
						for ( var i = 0, len = userGrp.length; i < len; i++) {
							if(userGrp[i].PRC_ACTION_ID){
								reqData.PCS_TARGET_AVY_ID = userGrp[i].PRC_ACTION_ID;
							}
						}
					}
				}
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					if (rad == '1') {
						parent.layer.msg("提交成功，流程流转至下一环节", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					} else {
						parent.layer.msg("提交成功，流程退回至历史环节", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					}
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
					$("#subBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//退回
function backProc(SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID) {
	$("#backBtn").attr('disabled',true);
	var layerset = {
		type : 2,
		title : '退回',
		area : [ '80%', '60%' ],
		shift : 2,
		content : '/ecpweb/pages/pub/aprvRegion.jsp?type=th&SN=' + SN
				+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO="
				+ P_TPL_NO + "&TASK_ID=" + TASK_ID,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				if(userTree.length>0){
					for ( var i = 0, len = userTree.length; i < len; i++) {
						userGrp.push(userTree[i].data);
					}
					reqData.NEXT_USER_GRP = userGrp;
				}else {
					reqData.NEXT_USER_GRP = null;
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.OPIN_CODE = "0";
				if(userGrp){
					for ( var i = 0, len = userGrp.length; i < len; i++) {
						if(userGrp[i].PRC_ACTION_ID){
							reqData.PCS_TARGET_AVY_ID = userGrp[i].PRC_ACTION_ID;
						}
					}
				}
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					parent.layer.msg("操作成功，流程退回至历史环节", {
						time : 2000
					}, function() {
						window.opener.location.reload();
						window.close();
					});
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("操作失败，流程无法流转!");
					$("#backBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#backBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//触发管理业务要求主流程
function handTriggerProc(CHOICE,DEPT_ID,USER_TREE,BSN_REL_MGR_ID){
	$("#subBtn").attr('disabled',true);
	var url = '/ecpweb/pages/pub/aprvRegion3.jsp?TYPE=bl&CHOICE='+CHOICE+'&DEPT_ID='+DEPT_ID
	+'&USER_TREE='+USER_TREE+'&BSN_REL_MGR_ID='+BSN_REL_MGR_ID+"&QUERY_TARGET=ACPT_PSN_MGR";
	
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : url,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqwfe = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				for ( var i = 0, len = userTree.length; i < len; i++) {
					if(USER_TREE=="6"){//业务委
						userGrp.push({ID:userTree[i].id,NAME:userTree[i].text});
					}else{
						userGrp.push(userTree[i].data);
					}
				}
				var reqData = $("#form2").formJson();
				if(UE.getEditor("BSN_RQS_TXT").getContent()){
					reqData.BSN_RQS_TXT = UE.getEditor("BSN_RQS_TXT").getContent().replace(/[<]/g,"@A@").replace(/[>]/g,"@B@");
				}
				reqData.OPIN_DESC = reqwfe.OPIN_DESC;
				reqData.OPRATE_FLAG = "2";
				reqData.CHOICE = "0";
				reqData.BSN_DEPT_NM =$("#BSN_DEPT_ID").val();
				if(CHOICE=="1"){
					reqData.CRT_PSN_NM = $("#CRT_PSN_ID").val();
				}else{
					reqData.CRT_PSN_ID = window.OPER_CODE;//编号
					reqData.CRT_PSN_NM = window.OPER_FULL_NAME;//中文姓名
				}
				reqData.BSN_CTCPSN_NM = $("#BSN_CTCPSN_ID").val();
				reqData.USER_INFO = {ID: window.OPER_CODE, NAME: window.OPER_FULL_NAME};
				reqData.NEXT_USER_GRP = userGrp;
				var req = P2.simpleTx("A09020201", reqData);
				var loadDiv = layer.load();
				req.success(function(result) {
					layer.close(loadDiv);
					var mode = $("#mode").val();
					window["uploader_"+mode].save(result.SN,"21").success(function(){
						parent.layer.msg("提交成功，流程流转至下一环节!",{time: 2000},function(){
							window.opener.location.reload();
							window.close();
						});
		            });
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
					$("#subBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//修改业务要求办理工作流
function handSubProc(SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID,CHOICE,DEPT_ID,USER_TREE,BSN_REL_MGR_ID) {
	$("#subBtn").attr('disabled',true);
	var layerset = {
			type : 2,
			title : '办理',
			area : [ '80%', '60%' ],
			shift : 2,
			content : '/ecpweb/pages/pub/aprvRegion3.jsp?TYPE=bl&SN='+SN+'&PROCESS_INST_ID='+PROCESS_INST_ID
					+'&P_TPL_NO='+P_TPL_NO+'&TASK_ID='+TASK_ID+'&CHOICE='+CHOICE+'&DEPT_ID='+DEPT_ID
					+'&USER_TREE='+USER_TREE+'&BSN_REL_MGR_ID='+BSN_REL_MGR_ID+"&QUERY_TARGET=ACPT_PSN_MGR",
			end : function() {
				var submitFlag = $("#submitFlag").val();
				if (submitFlag == "1") {
					var reqwfe = $("#wfeLayerData").data("formData");
					var userTree = $("#wfeLayerData").data("userTree");
					var userGrp = [];
					for ( var i = 0, len = userTree.length; i < len; i++) {
						if(USER_TREE=="6"){//业务委
							userGrp.push({ID:userTree[i].id,NAME:userTree[i].text});
						}else{
							userGrp.push(userTree[i].data);
						}
					}
					var reqData = $("#form2").formJson();
					if(UE.getEditor("BSN_RQS_TXT").getContent()){
						reqData.BSN_RQS_TXT = UE.getEditor("BSN_RQS_TXT").getContent().replace(/[<]/g,"@A@").replace(/[>]/g,"@B@");
					}
					reqData.OPIN_DESC = reqwfe.OPIN_DESC;
					reqData.OPRATE_FLAG = "2";
					reqData.CHOICE = "0";//触发流程时判断是否为：“业务委”
					reqData.BSN_DEPT_NM =$("#BSN_DEPT_ID").val();
					if(CHOICE=="1"){
						reqData.CRT_PSN_NM = $("#CRT_PSN_ID").val();
					}else{
						reqData.CRT_PSN_ID = window.OPER_CODE;//编号
						reqData.CRT_PSN_NM = window.OPER_FULL_NAME;//中文姓名
					}
					reqData.BSN_CTCPSN_NM = $("#BSN_CTCPSN_ID").val();
					reqData.USER_INFO = {ID: window.OPER_CODE, NAME: window.OPER_FULL_NAME};
					reqData.NEXT_USER_GRP = userGrp;
					var req = P2.simpleTx("A09020201", reqData);
					var loadDiv = layer.load();
					req.success(function(result) {
						layer.close(loadDiv);
						uploader_edit.save(result.SN,"21").success(function(){
							parent.layer.msg("提交成功，流程流转至下一环节!",{time: 2000},function(){
								window.opener.location.reload();
								window.close();
							});
			            });
					});
					req.error(function(result){
						layer.close(loadDiv);
						parent.layer.msg("提交失败，流程无法流转!");
						$("#subBtn").attr('disabled',false);
					});
					req.call();
				}else{
					$("#subBtn").attr('disabled',false);
				}
			}
		};
		if (parent && parent.layer) {
			parent.layer.open(layerset);
		} else {
			layer.open(layerset);
		}
}
//通用协办
function handXBProc(process_inst_id,todo_id,dealw_tp){
	$("#addBtn").attr('disabled',true);
	var reqData = {};
	var itdmLayerSet = getItdmLayerSet('协办', '/ecpweb/pages/pub/aprvRegion.jsp?type=jq', '80%', '60%');
	var layerSet = $.extend(itdmLayerSet,{
		end:function(){
			if($("#submitFlag").val() == "1"){//弹出层点确认时
				var layerData = $("#wfeLayerData").data("formData"); 
				var userTree = $("#wfeLayerData").data("userTree");
				
				var userList = $.map(userTree, function(node){
					return node.data.CCB_EMPID;
				});
          	    reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
				reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
				reqData.CUR_LNK_EXEC_PSN_ID = userList.join(",");
				reqData.CHK_OPIN_DSC = layerData.OPIN_DESC;//意见详情
				reqData.DEALW_TP = dealw_tp;//加签协办标志
				var req = P2.simpleTx("A09021197",reqData);
          	    var loadDiv = layer.load();
    	        req.success(function(result) {
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("协办成功!",{time: 2000},function(){
         				window.opener.location.reload();
        			    window.close();
         			});
    	        });
    	        req.error(function(result){
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("协办失败!");
    	        	$("#addBtn").attr('disabled',false);
    	        });
    	        req.call();
			}else{
				$("#addBtn").attr('disabled',false);
			}
        }
    });
    
    layer.open(layerSet);
}
//协办办理
function coHandProc(process_inst_id,todo_id,dealw_tp){
	$("#recallsubBtn").attr('disabled',true);
	var reqData = {};
	var itdmLayerSet = getItdmLayerSet('协办办理', '/ecpweb/pages/pub/aprvRegion.jsp', '80%', '60%');
	var layerSet = $.extend(itdmLayerSet,{
		end:function(){
			if($("#submitFlag").val() == "1"){//弹出层点确认时
				var layerData = $("#wfeLayerData").data("formData");
          	    reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
				reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
				reqData.CHK_OPIN_DSC = layerData.OPIN_DESC;//意见详情
				reqData.DEALW_TP = dealw_tp;//加签协办标志
				var req = P2.simpleTx("A09021195",reqData);
				var loadDiv = layer.load();
    	        req.success(function(result) {
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("协办办理成功!",{time: 2000},function(){
         				window.opener.location.reload();
        			    window.close();
         			});
    	        });
    	        req.error(function(result){
    	        	layer.close(loadDiv);
    	        	parent.layer.msg("协办办理失败!");
    	        	$("#recallsubBtn").attr('disabled',false);
    	        });
    	        req.call();
			}else{
				$("#recallsubBtn").attr('disabled',false);
			}
        }
    });
    
    layer.open(layerSet);
}
//协办撤回
function coWithdraw(process_inst_id,todo_id,dealw_tp){
	$("#recallBtn").attr('disabled',true);
	var reqData = {};
	reqData.PROCESS_INST_ID = process_inst_id;//流程实例标识
	reqData.TODO_AVY_TBL_ID = todo_id;//待办表SN
	reqData.DEALW_TP = dealw_tp;//加签协办标志
	var req = P2.simpleTx("A09021196",reqData);
	var loadDiv = layer.load();
	req.success(function(result) {
		layer.close(loadDiv);
		parent.layer.msg("协办撤回成功",{time: 2000},function(){
			window.opener.location.reload();
		    window.close();
		});
    });
	req.error(function(result){
		layer.close(loadDiv);
		parent.layer.msg("协办撤回失败!");
		$("#recallBtn").attr('disabled',false);
	});
    req.call();
}
//通用网关调用(审核或审批时触发子流程判断)
function handAdtNetProc(TP, SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID){
	$("#subBtn").attr('disabled',true);
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : '/ecpweb/pages/pub/aprvRegion.jsp?type='+TP+'&SN=' + SN
				+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO="
				+ P_TPL_NO + "&TASK_ID=" + TASK_ID,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				for ( var i = 0, len = userTree.length; i < len; i++) {
					userGrp.push(userTree[i].data);
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				// 通过 '1' 不通过 '0'
				var rad = reqData.radio;
				var condition = [];
				if (rad == '1') {
					reqData.OPIN_CODE = "1";
					condition.push({"KEY":'choice',"VALUE":'1'});
				} else {
					reqData.OPIN_CODE = "0";
					condition.push({"KEY":'choice',"VALUE":'3'});
					if(userGrp){
						for ( var i = 0, len = userGrp.length; i < len; i++) {
							if(userGrp[i].PRC_ACTION_ID){
								reqData.PCS_TARGET_AVY_ID = userGrp[i].PRC_ACTION_ID;
							}
						}
					}
				}
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				reqData.CONDITIONS = condition;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					if (rad == '1') {
						parent.layer.msg("提交成功，流转至下一环节!", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					} else {
						parent.layer.msg("提交成功，流转至上一环节!", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					}
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
					$("#subBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//通用转签、转办交易
function handTurnToDo(TLE, TODO_SN, P_TPL_NO, TASK_ID, DEPT_ID, PROCESS_INST_ID){
	$("#turnBtn").attr('disabled',true);
	// add 2016-02-25 start
	var targetUrl = '/ecpweb/pages/pub/aprvRegion.jsp?type=zb&TODO_SN=' + TODO_SN + "&P_TPL_NO="
	+ P_TPL_NO + "&TASK_ID=" + TASK_ID;
	if(PROCESS_INST_ID) {
		targetUrl = targetUrl + ";" + PROCESS_INST_ID;
    }
	if(DEPT_ID) {
		targetUrl = targetUrl + "&DEPT_ID=" + DEPT_ID;
    }
	// add 2016-02-25 end
	var layerset = {
		type : 2,
		title : TLE,
		area : [ '80%', '60%' ],
		shift : 2,
		content : targetUrl,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userNode = userTree[0].data;
				reqData.AVY_OWR = userNode.ID;
				reqData.WF_EXTR_NM = userNode.NAME;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.SN = TODO_SN;
				reqData.CHK_OPIN_DSC = reqData.OPIN_DESC;
				if(TLE == "转签"){
					reqData.DEALW_TP = "ZQ";
				}
				var req = P2.simpleTx("A09021192", reqData);
				var loadDiv = layer.load();
				req.success(function(result) {
					layer.close(loadDiv);
					parent.layer.msg(TLE+"成功!", {
						time : 2000
					}, function() {
						window.opener.location.reload();
						window.close();
					});
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg(TLE+"失败!");
					$("#turnBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#turnBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//保存附件列表并办理
function attachHandProc(SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID,bsnType){
	$("#subBtn").attr('disabled',true);
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : '/ecpweb/pages/pub/aprvRegion.jsp?type=bl&SN=' + SN
				+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO="
				+ P_TPL_NO + "&TASK_ID=" + TASK_ID,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				for ( var i = 0, len = userTree.length; i < len; i++) {
					userGrp.push(userTree[i].data);
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.OPIN_CODE = "2";
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					uploader_edit.save(SN,bsnType).success(function(){
         				parent.layer.msg("提交成功，流转至下一环节!",{time: 2000},function(){
             				window.opener.location.reload();
            			    window.close();
             			});
    	            });
				});
				req.error(function(result){
					layer.close(loadDiv);
					$("#subBtn").attr('disabled',false);
					parent.layer.msg("提交失败，流程无法流转!");
				});
				req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
//安排业务需求转办
function handAstRqmTurnToDo(TODO_SN, P_TPL_NO, TASK_ID){
	$("#turnBtn").attr('disabled',true);
	var layerset = {
		type : 2,
		title : '转办',
		area : [ '80%', '60%' ],
		shift : 2,
		content : '/ecpweb/pages/pub/aprvRegion.jsp?type=zb&TODO_SN=' + TODO_SN + "&P_TPL_NO="
			+ P_TPL_NO + "&TASK_ID=" + TASK_ID,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userNode = userTree[0].data;
				reqData.AVY_OWR = userNode.ID;
				reqData.WF_EXTR_NM = userNode.NAME;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.SN = TODO_SN;
				reqData.CHK_OPIN_DSC = reqData.OPIN_DESC;
				var req = P2.simpleTx("A09021192", reqData);
				var loadDiv = layer.load();
				req.success(function(result) {
					layer.close(loadDiv);
					parent.layer.msg("转办成功!", {
						time : 2000
					}, function() {
						window.opener.location.reload();
						window.close();
					});
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("转办失败!");
					$("#turnBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#turnBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
} 

//审核审批通用网关调用(choice)
function handApvGetewayProc(reqData, urlMap){
	var roleName="";
	if(urlMap.ROLE_NAME){
		roleName="&ROLE_NAME="+urlMap.ROLE_NAME;
	}
	var layerset = {
		type : 2,
		title : urlMap.TITLE,
		shade : 0.8, //弹出层透明度
        maxmin : true, //最大最小按钮
		area : [ '80%', '60%' ],
		//shift : 2,
		content : '/ecpweb/pages/pub/aprvRegion.jsp?type=' + urlMap.TYPE+"&single=" + urlMap.MULTI
			+ "&PROCESS_INST_ID=" + urlMap.PROCESS_INST_ID + "&P_TPL_NO="+ urlMap.P_TPL_NO + "&TASK_ID=" + urlMap.TASK_ID+roleName,		
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = {};
				var wfeFormData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				if(userTree.length>0){
					for ( var i = 0, len = userTree.length; i < len; i++) {
						userGrp.push(userTree[i].data);
					}
					reqData.NEXT_USER_GRP = userGrp;
				}else {
					reqData.NEXT_USER_GRP = null;
				}
				reqData.PROCESS_INST_ID = urlMap.PROCESS_INST_ID;
				reqData.P_TPL_NO = urlMap.P_TPL_NO;
				reqData.TASK_ID = urlMap.TASK_ID;
				// 通过 '1' 不通过 '0'
				var rad = wfeFormData.radio;
				var condition = [];
				if (rad == '1') {
					reqData.OPIN_CODE = "1";	 
					condition.push({"KEY":'choice',"VALUE":urlMap.CHOICE}); 
				} else {
					reqData.OPIN_CODE = "0"; 
					condition.push({"KEY":'choice',"VALUE": '3'});
					
					if(userGrp){
						for ( var i = 0, len = userGrp.length; i < len; i++) {
							if(userGrp[i].PRC_ACTION_ID){
								reqData.PCS_TARGET_AVY_ID = userGrp[i].PRC_ACTION_ID;
							}
						}
					}
				}			
				// add 2016-02-18 start
                reqData.AVY_DSC = wfeFormData.AVY_DSC;//审核审批结论            
				reqData.OPIN_DESC = wfeFormData.OPIN_DESC;//审核审批意见				
				// add 2016-02-18 end
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				 
				reqData.CONDITIONS = condition;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					if (rad == '1') {
						parent.layer.msg("提交成功，流转至下一环节!", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					} else {
						parent.layer.msg("提交成功，流转至上一环节!", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					}
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
				});
				req.call();
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}

//未启动流程加签/协办请求报文
function handXBProcNoProInstId(title, dealw_tp, P_TPL_NO, BSN_COM_INFO, CONDITIONS){
	$("#addBtn").attr('disabled',true);
	var reqData = {};
	var itdmLayerSet = getItdmLayerSet(title, '/ecpweb/pages/pub/aprvRegion.jsp?type=jq', '80%', '60%');
	var layerSet = $.extend(itdmLayerSet,{
		end:function(){
			if($("#submitFlag").val() == "1"){//弹出层点确认时
				var layerData = $("#wfeLayerData").data("formData"); 
				var userTree = $("#wfeLayerData").data("userTree");
				var userList = $.map(userTree, function(node){
					return node.data.CCB_EMPID;
				});
				
				var SIGN_INFO = {};
				SIGN_INFO.CUR_LNK_EXEC_PSN_ID = userList.join(',');
				SIGN_INFO.CHK_OPIN_DSC = layerData.OPIN_DESC;//意见详情
				SIGN_INFO.DEALW_TP = dealw_tp;//加签协办标志
				reqData.SIGN_INFO = SIGN_INFO;
				
				var START_PROC_INFO = {};
				START_PROC_INFO.P_TPL_NO = P_TPL_NO;
				START_PROC_INFO.OPIN_CODE = "2";
				START_PROC_INFO.OPIN_DESC = "";
				START_PROC_INFO.AVY_DSC = layerData.OPIN_DESC;//意见详情
				reqData.START_PROC_INFO = START_PROC_INFO;
				
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				
				reqData.BSN_COM_INFO = BSN_COM_INFO;
				
				if(CONDITIONS){
					reqData.CONDITIONS = CONDITIONS;
				}
				// console.log(reqData);
				var req = P2.simpleTx("A09021110",reqData);
          	    var loadDiv = layer.load();
    	        req.success(function(result) {
    	        	layer.close(loadDiv);
    	        	parent.layer.msg(title+"成功!",{time: 2000},function(){
         				window.opener.location.reload();
        			    window.close();
         			});
    	        });
    	        req.error(function(result){
    	        	layer.close(loadDiv);
    	        	parent.layer.msg(title+"失败!");
    	        	$("#addBtn").attr('disabled',false);
    	        });
    	        req.call();
			}else{
				$("#addBtn").attr('disabled',false);
			}
        }
    });
    
    layer.open(layerSet);
}

//审核审批-选择历史节点人
function handHistProc(Tp, SN, PROCESS_INST_ID, P_TPL_NO, TASK_ID, multi, HISTORY_TASK_ID,DEPT_ID) {
	$("#subBtn").attr('disabled',true);
	var targetUrl = '/ecpweb/pages/pub/aprvRegion3.jsp?TYPE=' + Tp +"&USER_TREE=5"+"&USER_TREE_FALSE=3"
	+ "&PROCESS_INST_ID=" + PROCESS_INST_ID + "&P_TPL_NO=" + P_TPL_NO + "&TASK_ID=" + TASK_ID;
	
	if(multi){
		targetUrl = targetUrl + "&multi=" + multi;
	}
	if(HISTORY_TASK_ID) {
		targetUrl = targetUrl + "&HISTORY_TASK_ID=" +HISTORY_TASK_ID;
    }
	if(DEPT_ID) {
		targetUrl = targetUrl + "&DEPT_ID=" +DEPT_ID;
    }
	
	var layerset = {
		type : 2,
		title : '办理',
		area : [ '80%', '60%' ],
		shift : 2,
		content : targetUrl,
		end : function() {
			var submitFlag = $("#submitFlag").val();
			if (submitFlag == "1") {
				var reqData = $("#wfeLayerData").data("formData");
				var userTree = $("#wfeLayerData").data("userTree");
				var userGrp = [];
				if(userTree.length>0){
					for ( var i = 0, len = userTree.length; i < len; i++) {
						userGrp.push(userTree[i].data);
					}
					reqData.NEXT_USER_GRP = userGrp;
				}else {
					reqData.NEXT_USER_GRP = null;
				}
				reqData.PROCESS_INST_ID = PROCESS_INST_ID;
				reqData.P_TPL_NO = P_TPL_NO;
				reqData.TASK_ID = TASK_ID;
				reqData.SN = SN;
				// 通过 '1' 不通过 '0'
				var rad = reqData.radio;
				if (rad == '1') {
					reqData.OPIN_CODE = "1";
				} else if (rad == '3') {
					reqData.OPIN_CODE = "0";
					if(userGrp){
						for ( var i = 0, len = userGrp.length; i < len; i++) {
							if(userGrp[i].PRC_ACTION_ID){
								reqData.PCS_TARGET_AVY_ID = userGrp[i].PRC_ACTION_ID;
							}
						}
					}
				} else if(!(rad) || rad == 'undefined'){
					reqData.OPIN_CODE = "1";
				}
				reqData.USER_INFO = {
					ID : window.OPER_CODE,
					NAME : window.OPER_FULL_NAME
				};
				reqData.NEXT_USER_GRP = userGrp;
				var loadDiv = layer.load();
				var req = P2.simpleTx("A09021105", reqData);
				req.success(function(result) {
					layer.close(loadDiv);
					//if (rad == '1') {
					if (reqData.OPIN_CODE == '1') {
						parent.layer.msg("提交成功，流程流转至下一环节", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					} else {
						parent.layer.msg("提交成功，流程退回至历史环节", {
							time : 2000
						}, function() {
							window.opener.location.reload();
							window.close();
						});
					}
				});
				req.error(function(result){
					layer.close(loadDiv);
					parent.layer.msg("提交失败，流程无法流转!");
					$("#subBtn").attr('disabled',false);
				});
				req.call();
			}else{
				$("#subBtn").attr('disabled',false);
			}
		}
	};
	if (parent && parent.layer) {
		parent.layer.open(layerset);
	} else {
		layer.open(layerset);
	}
}
