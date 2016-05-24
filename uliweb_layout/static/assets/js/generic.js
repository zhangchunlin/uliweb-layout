function show_message(message, category){

    require(["jqtoastr"], function(toastr){
        category = category || "success"

        var config = {
            "closeButton": true,
            "positionClass": "toast-top-center"   
        }
        var title = ""

        if(category == "success") {
            toastr.success(message, title, config)
        } else if (category == "error") {
            toastr.error(message, title, config)
        } else if (category == "info") {
            toastr.info(message, title, config)
        } else if (category == "warning") {
            toastr.warning(message, title, config)
        } else {
            toastr.info(message, title, config)
        }
    });

    return;

}

(function($){
    QueryString = function(url){
        this.urlParams = {};
        this.load(url);
    }
    QueryString.prototype = {
        load: function(param){
            this.urlParams = {}
            var e,k,v,i,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); }
            if(!param){
                param = window.location.search;
            }
            if (param.charAt(0) == '?'){
                param = param.substring(1);
            }else{
                i = param.indexOf('?');
                if (i>-1){
                    param = param.substring(i+1);
                }
            }
            while (e = r.exec(param)){
                k = d(e[1]);
                v = d(e[2]);
                this.set(k, v, false);
            }
            return this;
        },
        toString:function(options){
            var settings = {
                'hash' : false,
                'traditional' : true
            };
            if ( options ) { 
              $.extend( settings, options );
            }
            var old = jQuery.ajaxSettings.traditional;
            jQuery.ajaxSettings.traditional = settings.traditional;
            var result = '?' + $.param(this.urlParams);
            jQuery.ajaxSettings.traditional = old;
            if (settings.hash)
                result = result + window.location.hash;
            return result;
        },
        set:function(k, v, replace){
            replace = replace || false;
            if (replace)
                this.urlParams[k] = v;
            else{
                if (k in this.urlParams){
                    if ($.type(this.urlParams[k]) === 'array'){
                        this.urlParams[k].push(v);
                    }
                    else{
                        if (this.urlParams[k] == '')
                            this.urlParams[k] = v;
                        else
                            this.urlParams[k] = [this.urlParams[k], v];
                    }
                }
                else
                    this.urlParams[k] = v;
            }
            return this;
        },
        get:function(k){
            return this.urlParams[k];
        },
        remove:function(k){
            if (k in this.urlParams){
                delete this.urlParams[k];
            }
            return this;
        }
    }
    $.query_string = new QueryString();
})(jQuery);

//name 是URL的参数名字
String.prototype.getQueryString = function(name) {
    var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)"),
        r;
    if (r = this.match(reg)) return unescape(r[2]);
    return null;
};

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

function closelayer() {
    if (parent && parent.layer) {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
        return true;
    }

    return false;
}


//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}


//得到日期年月日等加数字后的日期 
Date.prototype.dateAdd = function(interval,number) 
{ 
	var t = parseInt(number, 10);
    var d = this; 
    var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'}; 
    var n={'q':3, 'w':7}; 
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*t)+')'); 
    return d; 
}


//计算两日期相差的日期年月日等 
Date.prototype.dateDiff = function(interval,objDate2) 
{ 
    var d=this, i={}, t=d.getTime(), t2=objDate2.getTime(); 
    i['y']=objDate2.getFullYear()-d.getFullYear(); 
    i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4); 
    i['m']=i['y']*12+objDate2.getMonth()-d.getMonth(); 
    i['ms']=objDate2.getTime()-d.getTime(); 
    i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000)); 
    i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000); 
    i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000); 
    i['n']=Math.floor(t2/60000)-Math.floor(t/60000); 
    i['s']=Math.floor(t2/1000)-Math.floor(t/1000); 
    return i[interval]; 
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
    return this.slice(0, prefix.length) === prefix;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();
    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi;
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;

    if (agent.indexOf("msie")>0) {
        window.browser_name="ie";
        return agent.match(regStr_ie);
    }

    if (agent.indexOf("firefox")>0) {
        window.browser_name="firefox";
        return agent.match(regStr_ff);
    }

    if (agent.indexOf("chrome")>0) {
        window.browser_name="chrome";
        return agent.match(regStr_chrome);
    }

    if (agent.indexOf("safari")>0) {
        window.browser_name="safari";
        return agent.match(regStr_saf);
    }
}

function arr_dive(aArr, bArr) { //第一个数组减去第二个数组
    if (bArr.length === 0) {
        return aArr;
    }
    var diff = [];
    var str = bArr.join("<<");
    for (var i = aArr.length - 1; i >= 0; i--) {

        if (str.indexOf(aArr[i]) == -1) {
            diff.push(aArr[i]);
        }
    }
    return diff;
}

Number.prototype.toFixed = function(n){
    var f = Math.pow(10,n);
    return Math.round(this*f)/f;
}

var browser = getBrowserInfo();
var verinfo = (browser+"").replace(/[^0-9.]/gi,"");