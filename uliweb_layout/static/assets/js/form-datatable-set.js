//循环从报文取list数据到data table
function initDatatable(resultData, tableFields, tblIds, colNms) {
    var rowText = "";
    var dataAry = [];
    var colAry = [];
    
    for(var i=0; i < tableFields.length; i++){
        dataAry = resultData[tableFields[i]];
        if(dataAry == undefined){
            continue;
        }
        for(var j=0; j < dataAry.length; j++) {
            rowText = "<tr>";
            colAry = colNms[tableFields[i]].split(" ");
            for(var k=0; k < colAry.length; k++){
                rowText += "<td><div title='" + dataAry[j][colAry[k]] + "' class='ellipsis-label'>" + dataAry[j][colAry[k]] + "</div></td>";  
            }
            rowText += "</tr>";
            $(tblIds[tableFields[i]]).append(rowText);
        }
    }
}

//设置占位符串
function getHiddenStr(tdVal) {
    var tdStr = "";
    tdStr = '<input type="hidden" class="hiddenFields" value="' + tdVal + '">';
    return tdStr;
}

//行数据再保存
function restoreRowWithIndex(oTable, nRow, hidCols, radioName) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);

    for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        var jqItem = $('input.form-control,.select-row', jqTds[i]);//现在只处理了文本框，单选按钮
        var hidItem = $('.hiddenFields', jqTds[i]);
        var strHtml = '';
        
        if($(jqItem).hasClass("select-row")){
            if($(hidItem).val() == "01"){
                strHtml = '<input type="radio" id="' + radioName + $(nRow).index() 
                + '" name="' + radioName + '" class="select-row" value="' + $(hidItem).val() + '" checked="checked">';
            }else{
                strHtml = '<input type="radio" id="' + radioName + $(nRow).index() 
                + '" name="' + radioName + '" class="select-row" value="' + $(hidItem).val() + '">';
            }
            oTable.fnUpdate(strHtml, nRow, i, false, false);
        }else{
            oTable.fnUpdate(aData[i], nRow, i, false, false);
        }
        
        /*for(var j=0; j < hidCols.length; j++){
            if(i == hidCols[j]){
                if($(jqItem).hasClass("select-row")){
                    $(jqTds[i]).append(getHiddenStr($(hidItem).val()));
                }else{
                    $(jqTds[i]).append(getHiddenStr($(jqItem).val()));
                }
            }
        }*/
        if($(hidItem)){//该列有隐藏字段，则取 隐藏字段的值
        	$(jqTds[i]).append(getHiddenStr($(hidItem).val()));
        }else{//该列无隐藏字段，则取td里的值
        	$(jqTds[i]).append(getHiddenStr($(jqItem).val()));
        }
    }
    //序号
    jqTds[0].innerHTML = $(nRow).index() + 1;

    oTable.fnDraw();
}

function restoreRow(oTable, nRow, hidCols) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);

    for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        var jqItem = $('input.form-control,.selectFields', jqTds[i]);
        var hidItem = $('.hiddenFields', jqTds[i]);
        oTable.fnUpdate(aData[i], nRow, i, false);
        
        /*for(var j=0; j < hidCols.length; j++){
            if(i == hidCols[j]){
                if($(jqItem).hasClass("selectFields")){
                    $(jqTds[i]).append(getHiddenStr($(hidItem).val()));
                }else{
                    $(jqTds[i]).append(getHiddenStr($(jqItem).val()));
                }
            }
        }*/
        if($(hidItem)){//该列有隐藏字段，则取 隐藏字段的值
        	$(jqTds[i]).append(getHiddenStr($(hidItem).val()));
        }else{//该列无隐藏字段，则取td里的值
        	$(jqTds[i]).append(getHiddenStr($(jqItem).val()));
        }
    }

    oTable.fnDraw();
}

//创建data table
function createDatatble(tableId) {
    var oTable = $(tableId).dataTable({
        "aoColumnDefs" : [{
            "aTargets" : [0]
        }],
        "oLanguage" : {
            "sLengthMenu" : "Show _MENU_ Rows",
            "sSearch" : "",
            "sEmptyTable" : "点击【新增】按钮可添加数据",
            "oPaginate" : {
                "sPrevious" : "",
                "sNext" : ""
            }
        },
        "bPaginate" :false,    //关闭分页
        "bLengthChange":false, //关闭每页显示多少条数据
        "bFilter":false,       //关闭检索功能
        "bInfo":false,         //关闭显示页脚
        "ordering":false       //关闭排序
        //"aaSorting" : [[1, 'asc']],
        //"aLengthMenu" : [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        //"iDisplayLength" : 10
    });

    return oTable;
}

//主提出部门计数
function countHqDept(tblId, msgInfo, hqDeptCol){
    var oTable = $(tblId).dataTable();
    var dataRows = oTable.fnGetNodes();
    var blnHqDept = false;
    
    for(var i=0; i<dataRows.length; i++){
        var jqTds = $('>td', dataRows[i]);
        var jqHid = $('input.hiddenFields', jqTds[hqDeptCol]);
        
        if($(jqHid).val() == "01"){
            blnHqDept = true;
            break;
        }
    }
    if(!blnHqDept){//未选择主提出或主实施部门时
        layer.msg(msgInfo);
    }
    
    return blnHqDept;
}

//data table各列数据校验
function validateTableData(nTitle, nRow, msgPrefix){
    var hasError = false;
    var jqTds = $('>td', nRow);
    var jqTitles = $('>th', nTitle);
    var msgInfo = "";
    
    for(var i=0; i<jqTds.length-1; i++){
        var jqItem = $('input.form-control,select', jqTds[i]);
        if(jqItem.length > 0){
            if(!($(jqItem).val())){
                hasError = true;
                if($(jqItem).attr("type") == "text"){
                    msgInfo = "请输入" + $(jqTitles[i]).text();
                }else{
                    msgInfo = "请选择" + $(jqTitles[i]).text();
                }
                if(msgPrefix){
                    msgInfo = msgPrefix + msgInfo;
                }
                layer.msg(msgInfo);
                break;
            }else{
            	var value = $(jqItem).val();
            	if($(jqItem).hasClass("telphone")){
            		var exp = /[^0-9\-]/;
    				if(exp.test(value)){
    					hasError = true;
    					
    					msgInfo = "请输入正确的" + $(jqTitles[i]).text();
    					if(msgPrefix){
    	                    msgInfo = msgPrefix + msgInfo;
    	                }
    					
    					layer.msg(msgInfo);
		                break;
    				}
            	}else if($(jqItem).hasClass("email")){
            		var exp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    				if(!exp.test(value)){
    					hasError = true;
    					
    					msgInfo = "请输入正确的" + $(jqTitles[i]).text();
    					if(msgPrefix){
    	                    msgInfo = msgPrefix + msgInfo;
    	                }
    					
    					layer.msg(msgInfo);
		                break;
    				}   
            	}else if($(jqItem).hasClass("mobile")){
            		var exp = /^1\d{10}$/;
    				if(!exp.test(value)){
    					hasError = true;
    					
    					msgInfo = "请输入正确的" + $(jqTitles[i]).text();
    					if(msgPrefix){
    	                    msgInfo = msgPrefix + msgInfo;
    	                }
    					
    					layer.msg(msgInfo);
		                break;
    				}
            	}
            }
        }
    }
    
    return hasError;
}

//data table参数设置(暂时未用到)
function initTableWrrapper(oTable, tableId){
    var wrapAry =[tableId+'_wrapper .dataTables_filter input',
                  tableId+'_wrapper .dataTables_length select',
                  tableId+'_column_toggler input[type="checkbox"]'];
    $(wrapAry[0]).addClass("form-control input-sm").attr("placeholder", "Search");
    // modify table search input
    $(wrapAry[1]).addClass("m-wrap small");
    // modify table per page dropdown
    $(wrapAry[1]).select2();
    // initialzie select2 dropdown
    $(wrapAry[2]).change(function() {
        /* Get the DataTables object again - this is not a recreation, just a get of the object */
        var iCol = parseInt($(this).attr("data-column"));
        var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
        oTable.fnSetColumnVis(iCol, ( bVis ? false : true));
    });
}

//判断部门是否有重复
function checkDeptCode(oTable, nRow, colIndex, msgInfo){
    var aDatas = oTable.fnGetNodes();
    if(aDatas.length < 1){//数据行为0时
        return;
    }
    //当前行信息对象
    var jqCurTds = $('>td', nRow);
    var jqCurHid = $('input:text', jqCurTds[colIndex]);
    var curDeptCode = $(jqCurHid).data("value");
    var curIndex = $(nRow).index();
    //别行信息对象
    var jqPreTds = null;
    var jqPreHid = null;
    var preDeptCode = null;
    
    for(var i=0; i<aDatas.length; i++){
        if(i != curIndex){
            var jqPreTds = $('>td', aDatas[i]);
            var jqPreHid = $('input.hiddenFields', jqPreTds[colIndex]);
            preDeptCode = $(jqPreHid).val();
            if(curDeptCode == preDeptCode){
                layer.msg(msgInfo);
                return true;
            }
        }
    }
   
    return false;
}

//判断表里是否有未保存的行
function checkTableRows(tableId, msgPrefix, noCheck){
    var hasError = false;
    var msgInfoNoData = "未添加数据！";
    var msgInfoNoSave = "有未保存的行，请确认！";
    var oTable = $(tableId).dataTable();
    var aData = oTable.fnGetData();
    
    if((!noCheck) && (aData.length < 1)){//数据行为0,并且需要check时
        layer.msg(msgPrefix + msgInfoNoData);
        return true;
    }
    var tblRows = oTable.fnGetNodes();
    for(var i=0; i < tblRows.length; i++){
        var jqTds = $('>td', tblRows[i]);
        
        if($(jqTds[jqTds.length-1]).find("a.save-row").length > 0){
            hasError = true;
            layer.msg(msgPrefix + msgInfoNoSave);
            break;
        }
    }
    
    return hasError;
}

//判断树表里是否有数据行
function checkTreeRows(tableId, msgPrefix, noCheck){
    var hasError = false;
    var msgInfoNoData = "未添加数据！";
    //var msgInfoNoSave = "有未保存的行，请确认";
    var treeData = $(tableId).getRowData(null, true);
    
    if(noCheck){
    	return false;
    }else{
    	if((!treeData.length) || (treeData.length < 1)){
    		layer.msg(msgPrefix + msgInfoNoData);
    		hasError = true;
        }
    }
    
    return hasError;
}

//循环从报文取list数据到data table
function showDtWithTemplate(result, templateAry, tableFields, tblIds, laytpl, divId) {
	var localDivId = "#tblSubPrj";
	
	if(divId){
    	localDivId = divId;
    }
    for(var i=0; i<templateAry.length; i++){
        //加载数据到模板
        if(templateAry[i] && result[tableFields[i]] && (result[tableFields[i]].length > 0)){//模板存在且有数据时
            laytpl($(templateAry[i]).html()).render(result[tableFields[i]], function (html) {
                $(tblIds[tableFields[i]]).append($(html));
            });
            if(templateAry[i] == "#subPrjTemplate"){//有子项目模块时，子项目投入金额格式化一下
            	fMoney(localDivId, ".moneyFields");
            }
        }
    }
}

//主提出部门设值
function setHqDeptVal(oTable, nRow, radMap){
     var jqCurTds = $('>td', nRow);
     var jqCurRad = $('input.select-row', jqCurTds[radMap.COL_INDEX]);
     var jqCurHid = $('input.hiddenFields', jqCurTds[radMap.COL_INDEX]);
     var curIndex = $(nRow).index();
     var dataRows = oTable.fnGetNodes();
     
     $(jqCurRad).val(radMap.CHK_VAL);
     $(jqCurHid).val(radMap.CHK_VAL);
     
     for(var i=0; i<dataRows.length; i++){
         if(i != curIndex){
             var jqTds = $('>td', dataRows[i]);
             var jqRad = $('input.select-row', jqTds[radMap.COL_INDEX]);
             var jqHid = $('input.hiddenFields', jqTds[radMap.COL_INDEX]);
             
             $(jqRad).val(radMap.UN_CHK_VAL);
             $(jqHid).val(radMap.UN_CHK_VAL);
         }
    }
}

//----------------------------------------
//项目计划 able验证
//1.至少包含一个迭代  2.开始日期和结束日期不能为空 3.每个迭代至少包含一个上线点
//----------------------------------------
function checkPrjPlanRows(tableId, msgPrefix,strtTm,edTm,moment,noCheck){

	var hasError = false; //验证结果
	var msgInfoNoTableData = "至少需要一个迭代";
	var msgInfoNoStData = "开始日期不能为空";
	var msgInfoNoEdData = "结束日期不能为空";
	var msgInfo1 = "项目计划的开始时间和结束时间必须在项目计划启动时间和项目计划结束时间范围内";
	var msgInfoNoMileStoneData = "每个迭代至少需要一个上线点！";	
	var hasMileStoneFlag = false; //是否有上线点标记
	
	var tmpStrtTm = "";
	var tmpEdTm = "";
	if(strtTm && strtTm != ""){
		if(strtTm.length = 7) {
			tmpStrtTm = strtTm + "-01";
		}		
	}
	if(edTm && edTm != ""){
		if(edTm.length = 7) {
			tmpEdTm =  edTm+ "-" + moment(edTm, "YYYY-MM").daysInMonth();
		}		
	}
	if(!noCheck) {
		var pageData = $(tableId).getRowData(null, true);	
		if(!pageData || pageData.length<1) {
			layer.msg(msgPrefix+msgInfoNoTableData);
			hasError = true;
			return hasError;
		}
		if(pageData){//有数据时
			for(var i=0; i<pageData.length; i++){
				var dataRow = pageData[i];  
				if(!dataRow.PLN_STDT ||  dataRow.PLN_STDT == "") {
					layer.msg(msgPrefix+msgInfoNoStData);
					hasError = true;
					return hasError;
				}else if(tmpStrtTm && tmpStrtTm != ""){
					if(dataRow.PLN_STDT < tmpStrtTm) {
						layer.msg(msgPrefix+msgInfo1);
						hasError = true;
						return hasError;
					}
				}
				if(!dataRow.PLN_EDDT ||  dataRow.PLN_EDDT == "") {
					layer.msg(msgPrefix+msgInfoNoEdData);
					hasError = true;
					return hasError;
				}else if(tmpEdTm && tmpEdTm != ""){
					if(dataRow.PLN_EDDT > tmpEdTm) {
						layer.msg(msgPrefix+msgInfo1);
						hasError = true;
						return hasError;
					}
				}
				if(dataRow.MILESTONE && dataRow.MILESTONE == "01") {
					hasMileStoneFlag = true;
				}
			}
		}
		//没有上线点
		if(!hasMileStoneFlag) {
			layer.msg(msgPrefix+msgInfoNoMileStoneData);
			hasError = true;
			return hasError;
		}
	}//if 
	
	return hasError;
}