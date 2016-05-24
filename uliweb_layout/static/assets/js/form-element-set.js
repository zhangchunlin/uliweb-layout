//数据字典缓存对象
var dicMaps = {};

//审核，审批意见常量
var aduitDesc = ['通过','不通过','同意','不同意'];

//现有项目下拉框的查询条件-项目状态
//01未提交,02定义中,03已定义,11申请中,12已立项,21实施中,31验收中,32已验收,33已关闭,41已中止
var QUERY_EXST_PRJ_ST = "12,21,31";

//根据ID画现有系统下拉框
function drawRltvStmSelect(cmptId){
	$(cmptId).selectOnChange({
		serviceid:"A09020227",
		param : {'QUERY_TARGET':'SUB_SYSTEM'},
		node :["RLTV_LIST","RLTV"],
		value : "LGC_SUB_STM_ECD",
		text : "LGC_SUB_STM_CHNFLNM"
	});
}

//根据ID画现有项目下拉框
function drawExstPrjSelect(cmptId){
	$(cmptId).selectOnChange({
		serviceid:"A0902E094",
		param : {PRJ_BSN_ST:QUERY_EXST_PRJ_ST,FLAG:'2',CUR_ST:"02,03,06,21,31,32"},
		node :["ListPrjApprovalManage"],
		value : "SN",
		text : "PRJ_NM"
	});
}

//根据ID画业务条线下拉框
function drawBsnLobSelect(cmptId){
	$(cmptId).selectOnChange({
		serviceid:"A09021101",
		param : {"tpCds":[{"tpCd":"4"}]},
		node: ["CCBINS_GRP","CCBINS_VDO"],
    	value:"CCBINS_ID",
    	text:"CCBINS_CHN_FULLNM"
	});
}

//取得弹出层共通设置
function getItdmLayerSet(varTitle, varContent, varWidth, varHeight){
    var itdmLayerSet = {
            type : 2,
            title : varTitle,
            shade : 0.8,
            maxmin : true,
            area : [varWidth, varHeight],
            content : varContent
        };
    return itdmLayerSet;
}

function setSelect(selectType, selectId, selectedVal){
	var strOption = '';
    
    P2.utils.getStdCode(selectType, function(options) {
        //strOption = "<option value=''></option>";
        for(var i=0; i<options.length; i++) {
            strOption += "<option value='" + options[i]['itemValue'] + "'>";
            strOption += options[i].itemName + "</option>";
        }
        $(selectId).append(strOption);
        $(selectId).select2();
        
        if (!selectedVal) {
            selectedVal = $(selectId).data("value");
            $(selectId).data("value", null);
            $(selectId).removeData("value");
        }
        
        $(selectId).select2("val", selectedVal);
    });
}

//加载下拉框数据字典函数(data table)
function setTableSelect(options, jqTd, oldVal){
    var strHtml = '<select class="js-example-basic-single js-states form-control selectFields">';
    var strOptions = '';
    for(var i=0; i<options.length; i++) {
        strOptions += "<option value='" + options[i]['itemValue'] + "'>";
        strOptions += options[i].itemName + "</option>";
    }
    strHtml += strOptions + '</select>';
    jqTd.innerHTML = strHtml + getHiddenStr(oldVal);
    var jqSelect = $('select', jqTd);
    $(jqSelect).select2();
    $(jqSelect).select2("val", oldVal);
}

//panel展开折叠函数(所有的panel)
function operPanel(closeFlag){
    var panelAry = $("div.panel");
    
    if(closeFlag){//折叠
        for(var i=0; i < panelAry.length; i++){
            if(!$(panelAry[i]).hasClass("collapses")){
                $(panelAry[i]).addClass("collapses");
                $(panelAry[i]).children(".panel-body").css("display","none");
            }
        }
    } else {//展开
        for(var i=0; i < panelAry.length; i++){
            if($(panelAry[i]).hasClass("collapses")){
                $(panelAry[i]).removeClass("collapses");
                $(panelAry[i]).children(".panel-body").css("display","normal");
            }
        }
    }
}

//panel展开折叠函数(选定的panel)
function operSelectedPanel(closeFlag, panelAry){
    if(closeFlag){//折叠
        for(var i=0; i < panelAry.length; i++){
            if(!$(panelAry[i]).hasClass("collapses")){
                $(panelAry[i]).addClass("collapses");
                $(panelAry[i]).children(".panel-body").css("display","none");
            }
        }
    } else {//展开
        for(var i=0; i < panelAry.length; i++){
            if($(panelAry[i]).hasClass("collapses")){
                $(panelAry[i]).removeClass("collapses");
                $(panelAry[i]).children(".panel-body").css("display","normal");
            }
        }
    }
}

//封装单个表单元素的JSON格式数据
function setP8ReqData(fieldClass, varDiv){
     var reqData = {};
     
     if(varDiv){
         $(varDiv).find(fieldClass).each(function(){
             reqData[$(this).attr("id")] = $.trim($(this).val());
         });
     }else{
         $(fieldClass).each(function(){
             reqData[$(this).attr("id")] = $.trim($(this).val());
         });
     }
     
     return reqData;
}

function getTableData(tableId, startCol, endCol, colIds){
    var listAry = [];//返回值
    var listItem= {};
    var oTable = $(tableId).dataTable();
    var aDatas = oTable.fnGetData();
    var aRows = oTable.fnGetNodes();
    var hiddenItem = null;
    var jqTd = null;
    var subIds = [];
    
    if(aRows.length == 0){
        return [];
    }
    for(var i=0; i < aRows.length; i++){
        var k = 0;
        listItem= {};
        for(var j=startCol; j <= endCol; j++){
            jqTd = $(">td",aRows[i])[j];
            hiddenItem = $(".hiddenFields",jqTd);
            subIds = colIds[k].split(" ");
            if(subIds.length > 1){
                listItem[subIds[0]] = $.trim($(hiddenItem).val());
                listItem[subIds[1]] = $.trim($(jqTd).text());
            } else {
                listItem[colIds[k]] = $.trim($(hiddenItem).val());
            }
            k++;
        }
        listAry[i] = listItem;
    }
    
    return listAry;
}

//屏蔽输入框的输入和鼠标点击
function initControlFileds(fieldClass){
    $(fieldClass).bind(
        {contextmenu:function(e){
            if (e.which == 3) {
                return false;
            }
        },
        keyup:function(){
            $(this).val("");
        }
    });
}

//给只读字段加上只读属性
function initReadonlyFileds(divId, fieldClass, blnAll){
    var inputItems = [];
    
    inputItems = $(divId).find("input,select,textarea");
    for(var i=0; i < inputItems.length; i++) {
        if(($(inputItems[i]).attr("type") != "hidden")){
            if(blnAll){
                $(inputItems[i]).attr("readonly",true);
            }else if($(inputItems[i]).hasClass(fieldClass)){
                $(inputItems[i]).attr("readonly",true);
            }
        }
    }
}

//根据是或否进行相应转换
function decodeYesNo(objVal,cnvtType){
    var strRtn = "";
    if(objVal){
        if(cnvtType == "1"){//汉字到code
            if(objVal == "是"){
                strRtn = "01";
            }else{
                strRtn = "02";
            }
        }else{//code到汉字
            if(objVal == "01"){
                strRtn = "是";
            }else{
                strRtn = "否";
            }
        }
    }
    
    return strRtn;
}

//设置数据字典转换用map
function getSelectMap(selectType){
     P2.utils.getStdCode(selectType, function(options) {
         dicMaps[selectType] = options;
     });
}

//返回客户端当前日期串
function getLocalDate(){
    var dateStr = "";
    var locatDate = new Date();
    var vYear = locatDate.getFullYear();
    var vMon = locatDate.getMonth() + 1;
    var vDay = locatDate.getDate();
    var vhh = locatDate.getHours();
    var vmm = locatDate.getMinutes();
    var vss = locatDate.getSeconds();
    
    dateStr = vYear + "-" + (vMon<10 ? "0"+vMon:vMon) + "-" + (vDay<10 ? "0"+vDay:vDay);
    dateStr +=" " + (vhh<10 ? "0"+vhh:vhh) + ":" + (vmm<10 ? "0"+vmm:vmm) + ":" + (vss<10 ? "0"+vss:vss);
    
    return dateStr;
}

//关闭窗口函数
function closeLayer() {
    if (parent && parent.layer) {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    }
}

//关闭画面等待层
function closeWaitDiv(pThis, pReqs, pDiv){
    $.when.apply(pThis, pReqs).done(function(){
    	layer.close(pDiv);
    }).always(function(){
    	layer.close(pDiv);
    });
}

//计算工作量及投入
function getSum(itemAry, targetField){
    var sumRet = 0;
    var newSum = 0;
    for(var i=0;i < itemAry.length;i++){
        if($(itemAry[i]).val()){
            sumRet += parseFloat($(itemAry[i]).val());
        }
    }
    newSum = sumRet.toFixed(2);
    if((targetField.startsWith("#CTR_PRP_EXPN_TOT")) || (targetField.startsWith("#PRJ_IVSM_TOT"))){
    //if((targetField =="#CTR_PRP_EXPN_TOTM") || (targetField == "#PRJ_IVSM_TOTM")){
    	$(targetField).val(newSum).trigger("blur");
    }else{
    	$(targetField).val(newSum);
    }
}

//部门组件信息反显
function setResDepTreeData(id, idResult, textResult, isMultiple){
    var treeMap = {};
    if(idResult && textResult){
        var primIds = idResult.split(",");
        var primTexts = textResult.split(",");
        var treeAry = [];
        
        for(var i = 0; i < primIds.length; i++){
            treeMap = {};
            treeMap.id = primIds[i];
            treeMap.text = primTexts[i];
            treeAry.push(treeMap);
        }
        if(isMultiple){
    		$(id).combotree("setValue", treeAry);
    	}else{
    		$(id).combotree("setValue", treeMap);
    	}
    }
}

//表格里的列格式化金额（加逗号）
function fMoney(pDiv, pClass){
	var mVal = "";//原始值
	var intNum = "";//整数部分
	var tailNum = "";//小数部分
	var tVal = "";//临时值
	var retNum = "";//最终值
	
	$(pDiv).find(pClass).each(function(){
		tVal = "";
		mVal = $(this).text().replace(/,/g,"");
		
		intNum = mVal.split(".")[0].split("").reverse();
		tailNum = mVal.split(".")[1] ? mVal.split(".")[1]:"00";
		
		for(var i=0; i<intNum.length; i++){
			tVal += intNum[i] + (((i+1)%3 == 0) && ((i+1) != intNum.length) ? ",":"");
		}
		
		retNum = tVal.split("").reverse().join("") + "." + tailNum;
		$(this).html(retNum + getHiddenStr(mVal));
	});
}