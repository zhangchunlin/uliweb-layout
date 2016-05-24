//加签按钮切换
function convertBtn(TODO_ST, TASK_ID) {
	//加签处理按钮显示控制(加签或协办发起后，其中转签、转办按钮需隐藏)
	if(TODO_ST == "JQ") {//发起人
		$(".subcall").hide();
		$(".addcall").hide();
		$(".recallsub").hide();
		$(".recall").show();
		$(".turn").hide();
		$(".back").hide();
		$(".save").hide();
	}else if(TODO_ST == "XB") {//发起人
		$(".subcall").hide();
		$(".addcall").hide();
		$(".recallsub").hide();
		$(".recall").show();
		$(".turn").hide();
		$(".back").hide();
		$(".save").hide();
	}else if(TODO_ST == "DJQ") {//处理人
		$(".subcall").hide();
		$(".addcall").show();
		$(".recallsub").show();
		$(".recall").hide();
		$(".turn").hide();
		$(".back").hide();
		$(".save").hide();
	}else if(TODO_ST == "DXB") {//协办处理人
		$(".subcall").hide();
		$(".addcall").show();
		$(".recallsub").show();
		$(".recall").hide();
		$(".turn").hide();
		$(".back").hide();
		$(".save").show();
	}else if(TODO_ST == "DCL"){//正常
		$(".subcall").show();
		$(".addcall").show();
		$(".recallsub").hide();
		$(".recall").hide();
		$(".back").show();
		$(".turn").show();
		$(".save").show();
	}else if (TODO_ST == "ZLC") {//发起子流程后，主流程待办挂起，状态 “ZLC” 显示强制撤回按钮
		$(".enforce").show();
		$(".recall").hide();
		$(".recallsub").hide();
		$(".subcall").hide();
		$(".addcall").hide();
		$(".back").hide();
		$(".turn").hide();
		$(".save").hide();
	}else if (TODO_ST == "TLC") {//主流程退回子流程，主流程待办挂起，状态 “TLC”,办理等按钮不可用
		$(".subcall").show().attr("disabled",true);
		$(".addcall").show().attr("disabled",true);
		$(".recallsub").hide();
		$(".recall").hide();
		$(".back").show().attr("disabled",true);
		$(".turn").show().attr("disabled",true);
		$(".save").show().attr("disabled",true);
	}
}
//认领、释放按钮切换
function rlBtnChange(TODO_ST) {
	if(TODO_ST == "DCL") {
		$("#claimBtn, #recallBtn, #recallsubBtn").hide();
		$("#freeBtn, #addBtn, #roundBtn, #sthBtn, #subBtn, #turnBtn, #backBtn, #uploadA, #creatBtn").show();
	}else if (TODO_ST == "XB"){
		$("#claimBtn, #freeBtn, #creatBtn").hide();
	}else if (TODO_ST == "DXB"){
		$("#claimBtn, #freeBtn").hide();
		$("#creatBtn").show();
	}
}