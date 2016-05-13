(function(window, $) {

	//---- 
	var BK_CODE_SUCCESS = '00';
	var AJAX_TIMEOUT = 300000;
	var AJAX_METHOD = "post";
	var AJAX_DATA_TYPE = "json";
	var MESSAGES = {
		'ajax_timeout': '后台服务处理超时',
		'ajax_parse'  : '后台数据格式错误',
		'ajax_failure': '与后台通信发生错误'
	}

	//--- 
	var STDCODE_MAPPING = {
		"Bsn_Rqs_Tp"			 :  "900000",
		"Bsn_Rqs_SubTp"			 :	"900001",
		"Bsn_Rqm_Tp"			 :	"900002",
		"Bsn_Rqm_SubTp"			 :	"900003",
		"Bsn_Rqm_Itm_Tp"		 :	"900004",
		"Mat_Dgr"				 :	"900005",
		"Emgr_Dgr"				 :	"900006",
		"Implt_Eff"				 :	"900007",
		"Implt_Prpsl"			 :	"900008",
		"Implt_Mod_Prpsl"		 :	"900009",
		"Implt_Scm_Prpsl_Cmpl"	 :	"900010",
		"Implt_Scm_Prpsl_Mat_Dgr":	"900011",
		"InPhs"					 :	"900012",
		"PjCy_Tp"				 :	"900013",
		"Prj_Sz"				 :	"900014",
		"Implt_Mod"				 :	"900015",
		"MdTp"					 :	"900016",
		"Dvlp_Mod"				 :	"900017",
		"LOB"					 :	"900018",
		"Revw_Form"				 :	"900019",
		"Prj_Prps_Dept_Opin"	 :	"900020",
		"Tech_Trgt"				 :	"900021",
		"Prj_Implt_Tp"			 :	"900022",
		"PrjApvl_Tp"			 :	"900023",
		"Bsn_Rqs_Src"			 :	"900027",
		"Rqs_Cmpl"				 :	"900028",
		"Rqm_Cmpl"				 :	"900029",
		"Rqm_Mat_Dgr"			 :	"900030",
		"Rqm_Implt_Eff"			 :	"900031",
		"Rqm_Id_Cnclsn"			 :	"900032",
		"Rqm_Itm_Id_Cnclsn"		 :	"900033",
		"Archt_Implt_Mod_Prpsl"  :	"900034",
		"Archt_Id_Cnclsn"  		 :	"900035",
		"Trgt_CL"		 		 :	"900036",
		"Trgt_Sub_CL"  			 :	"900037",
		"Crt_Modl_Ind"  		 :	"900038",
		"Seris_Dgr_Cd"           :	"900039",
		"Prbl_Cd"                :	"900040",
		"Md_TpCd"                :	"900041",
		"Implt_Unit"  		     :	"900042",
		"Rqm_Cgy"  		         :	"900043",
		"Splmt_Rqm_Prim_Cgy"  	 :	"900044",
		"Splmt_Rqm_Subcls"  	 :	"900045",
		"Rqm_St"  	 			 :	"900046",
		"Rqm_Item_Mode_St"  	 :	"900047",
		"Rsn_Cgy_Cd"             :	"900048",
		"Bsn_Dmn_Cd"             :	"900049",
		"Prj_Bsn_St"			 :  "900050",
		"Rqm_Item_St"			 :  "900051",
		"Slv_Scm_Implt_Cgy"		 :  "900052",
		//性别
		"Gnd_Cd"                 :  ["101686", "A0673", "00000"]
	}

	var show_error_message = function(msg, skin) {
		skin = skin == "error" ? "layui-layer-error": "layui-layer-hui"
		require(["layer"], function(layer) {
			layer.msg(msg, {time: 3000, skin: skin})
		})
	}

	var showError = function(type, extra_message) {
		var message = extra_message ? MESSAGES[type] + "<br/>" + extra_message : MESSAGES[type]
		show_message(message, "error")
	}

	var debugErrorMessage = function(d) {
		if(d.BK_STATUS != BK_CODE_SUCCESS) {
			return (d.BK_CODE + "<br/>" + d.BK_DESC + "<br/>" + d.BK_DESC_DETAIL)
		}
	}

	var defaultErrorHandler = function(d, reason) {
		if(reason != "abort") {

			if(d.BK_STATUS && d.BK_STATUS != BK_CODE_SUCCESS) {
				if(d.BK_CODE && d.BK_CODE.startsWith("Y")) {
					return show_error_message(d.BK_DESC || MESSAGES["ajax_failure"])
				}
			}

			return show_error_message(MESSAGES["ajax_failure"], "layui-layer-error")
		}
	}

	var emptyHandler = function() {}

	var sendAjaxReq = function(config, data) {
		var dfd = $.Deferred()

		$.ajax({
			url: config.url,
			dataType: config.dataType || AJAX_DATA_TYPE,
			data: data,
			type: config.type || AJAX_METHOD,
			timeout: config.timeout || AJAX_TIMEOUT,

			success: function(d) {
				return dfd.resolve(d)
			},

			error: function(data, reason) {
				return dfd.reject(data, reason)
			}
		});

		promise = dfd.promise()
		promise.success = promise.done
		promise.error = promise.fail

		return promise		
	}

	var sendCpsAjaxReq = function(config, data) {

		var dfd = $.Deferred()

		var req = $.ajax({
			url: config.url,
			dataType: config.dataType || AJAX_DATA_TYPE,
			data: data,
			type: config.type || AJAX_METHOD,
			timeout: config.timeout || AJAX_TIMEOUT,

			success: function(d) {
				if(d.BK_STATUS != BK_CODE_SUCCESS) {
					if(!dfd.hasCustomError) {
						defaultErrorHandler(d)
					}
					return dfd.reject(d)
				} else {
					return dfd.resolve(d)
				}
			},

			error: function(data, reason) {
				if(!dfd.hasCustomError) {
					defaultErrorHandler(data, reason)
				}
				return dfd.reject(data, reason)	
			}
		});

		promise = dfd.promise()
		promise.success = promise.done
		promise.error = promise.fail

		promise.error = function(errHandler) {
			dfd.hasCustomError = true;
			return promise.fail(errHandler)
		}

		promise.call = function() {}
		promise.abort = function() {
			req.abort();
		}

		return promise
	}	

	var simpleTx = function(tx_id, reqData, succHandler, errHandler) {

		var _succhandler = succHandler || emptyHandler;
		var _errHandler = errHandler;
		var _tx_id = tx_id;
		var _reqData = reqData || {};

		var config = {
			url : window.simpleTxUrl ?  window.simpleTxUrl: "ecpJsonDispatch.action"
		}

		// update common field to reqData
		_reqData.OPER_CODE = window.OPER_CODE || "00000000";
		_reqData.OPER_NAME = window.OPER_NAME || "UNKNOWN";

		var data = {
			_fw_service_id : "simpleTransaction", // 调用通用交易原子服务
			adapterId:"ecpJson",
			transaction_id : _tx_id,
			jsonData:JSON.stringify(_reqData)
		}

		var reqObj = sendCpsAjaxReq(config, data).done(_succhandler);
		if(_errHandler) {
			reqObj.error(_errHandler)
		}
		return reqObj;
	}

	var getStandardCode = function(reqData, succHandler, errHandler) {

		var _succhandler = succHandler || emptyHandler;
		var _errHandler = errHandler || defaultErrorHandler;
		var sendData;

		var config = {
			url: "ecpJson2Bean.action"
		}

		if(typeof reqData == "string") {
			sendData = {
				categoryId: reqData,
				appId : "A0902",
				clCd : "00000",
				sorted: true
			}
		} else {
			sendData = {
				categoryId: reqData[0],
				appId : reqData[1],
				clCd : reqData[2],
				sorted: true				
			}
		}

		var data = {
			_fw_service_id: "fetchStanderdCodeModelListByParams",
			jsonClass: "com.ccb.model.StandardDataCategory",
			jsonData: JSON.stringify(sendData),
		}

		return sendAjaxReq(config, data).done(_succhandler).fail(_errHandler);
	};

	var getStandardCodeBatch = function(reqList, succHandler, errHandler) {

		var _succhandler = succHandler || emptyHandler;
		var _errHandler = errHandler || defaultErrorHandler;

		var config = {
			url: "ecpJson.action"
		}

		var reqData = { sorted: true }, keys = [];
		for(var i=0; i<reqList.length; i++) {
			if(typeof reqList[i] == "string") {
				keys.push(reqList[i] + "_A0902_00000");	
			} else {
				keys.push(reqList[i].join("_"))
			}
		}

		reqData['keys'] = keys;

		var data = {
			_fw_service_id: "batchFetchStanderdCodeModelListByParams",
			jsonData: JSON.stringify(reqData),
		}

		return sendAjaxReq(config, data).done(_succhandler).fail(_errHandler);		
	}

	var getStdCode = function(name, succHandler, errHandler) {
		var reqData = STDCODE_MAPPING[name]? STDCODE_MAPPING[name]: name
		return getStandardCode(reqData, succHandler, errHandler)
	}

	var getStdCodes = function(names, succHandler, errHandler) {
		var reqList = [], revertMap={};
		for(var i=0; i<names.length; i++) {
			var stdCodeId = STDCODE_MAPPING[names[i]] ? STDCODE_MAPPING[names[i]]: names[i];
			reqList.push(stdCodeId);
			if(typeof stdCodeId == "string") {
				revertMap[stdCodeId + "_A0902_00000"] = names[i];
			} else {
				revertMap[stdCodeId.join("_")] = names[i];
			}
		}

		var succHandlerNew = function(data) {
			var newData = {};
			for(var key in revertMap) {
				if(data[key]) {
					newData[revertMap[key]] = data[key]
				}
			}

			return succHandler(newData)
		}

		return getStandardCodeBatch(reqList, succHandlerNew, errHandler);
	}

	window.P2 = {
		simpleTx: simpleTx, 
		utils : {
			getStdCode: getStdCode,
			getStdCodes: getStdCodes,
			showErrorMessage: show_error_message
		}
	}

})(window, jQuery);