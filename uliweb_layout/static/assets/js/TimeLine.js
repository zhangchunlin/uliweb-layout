/**
 * Created by admin on 2015/11/16.
 */
(function (factory) {
    "use strict";
    if ("function" === typeof define && define.amd) {
        define(["jquery", "laytpl", "laypage"], factory);
    } else if ("object" === typeof exports) {
        factory(require("jquery"), require("laytpl"), require("laypage"));
    } else {
        factory(jQuery, laytpl, laypage);
    }
}(function($,laytpl,laypage){

	function init(options,obj){
		
		function queryForm(){
			
			var divs = $("#"+opts.div);
			var foot = $("#"+opts.pagination)
			if(opts.isPagination){
				
				//var url = opts.url;
		
				var reqData = {"SN": opts.sn};
//			
			    var req = P2.simpleTx(opts.code, reqData);
			//	var reqData = {"SN": "273"};
				//$("#SN").val(reqData.SN);
	//		    var req = P2.simpleTx("A09020215", reqData);
			    req.success(function(result) {
			    	var dataArray = result["APPROVE_INFO_LIST"]["APPROVE_INFO"];
			    	if(dataArray){
			    		var trStr =$("<div style='text-align:center'></div>")
			    		foot.insertAfter(trStr.append("<img src='static/assets/images/media-user.png'/>数据加载中...").appendTo(obj))
			    	     if(dataArray.length >0 && opts.isPagination){
			    	    	 trStr.css("display","none");
			    	    	 var PageSize,totalCount,div
			    	    	 div=$("#"+opts.div);
			    	    	 totalCount= dataArray.length;
			    	    	 PageSize =2;
			    	    	 var pages= Math.ceil(totalCount/PageSize);
			    	    	 initpage(pages,dataArray,PageSize,div,totalCount);
			    	     }
	
			    	}
			    })
			}
		}
		function initpage (totalpage,result,pagesize,divs,totalcount) {
			
			laypage({
				cont:$("#"+opts.pagination),
				pages:totalpage,
				groups:0,
				prev:false,
				next:'查看更多',
				skin:'flow',
				jump:function(e,first){
					opts.pageIndex = e.curr;
					 if (!first) {
                        // 返回所显示页面的数据
						// method.onLoad; 
                             }
					if(e.curr===totalpage-1)
						{this.next='没有更多了'; }
					//var pagesize= opts.pe
					var list= GetData(e.curr,result,pagesize,totalcount);//此次调用P8根据传入的页数显示
					var script =$("#"+opts.scriptHtml);
					laytpl(script.html()).render(list, function(html){
						divs.append(html);
					});
					
				}	
			});
		}
		function GetData(PageIndex,result,PageSize,totalCount){
			var str='', strs=[],last = PageIndex*PageSize-1;
			last = last>= totalCount?(totalCount-1):last;
			for(var i=(PageIndex*PageSize-PageSize);i<=last;i++){
				var person={};
		       
                  person.TASK_NAME=result[i].TASK_NAME;
                  person.START_TIME= result[i].START_TIME;
             
                  person.APPROVE_DESC= result[i].APPROVE_DESC;
                  person.APPROVE_PERSON=result[i].APPROVE_PERSON;
                  person.APPROVE_RESULT=result[i].APPROVE_RESULT;
                
                  strs.push(person);
			}
			return strs;
		}
		var defaults = {
	            pageSize: 10,
	            pageIndex: 1,
	            pagination: "",
	            scriptHtml: "",
	            div: "",
	            sn:"",
	            code:"",
	            isPagination: false,
	            onLoadSuccess: null
	        }
		var opts = $.extend({}, defaults, options);
        var data = new Array();
        var totalCount;
        queryForm();
        
       var method ={};
       return method.getPageIndex =function(){
    	   return this.pageindex;
       },
       method.onReload =function(){
    	   queryForm();
       },
       method.onLoad =function(){
    	   opts.pageIndex =0;
    	   queryForm();
       },
       method.getData = function(){
    	   return data;
       },
       method.getTotalCount =function(){
    	   return totalCount;
       },
       method
	}
	return $.fn.timeline = function(options){
		init(options,$(this));
	}
}));
