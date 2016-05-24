define('jquery', function(){
    return window.jQuery;
});

function get_script_variable(key) {
	var scripts = document.getElementsByTagName('script'), value = "";
	for (i = scripts.length - 1; i > -1; i -= 1) {
		value = scripts[i].getAttribute(key);
		if(value) {
			return value
		}
	}
	return value;
}

function get_static_version() {
	return get_script_variable("v")
}

function getBaseUrl() {
	return get_script_variable("baseurl") + "/static/plugins/vendor"
}

window.STATIC_URL = getBaseUrl();
window.BASE_URL = getBaseUrl() || "/static/plugins/vendor";

requirejs.config({
    "baseUrl": window.BASE_URL,
    "paths": {
        "app"      : '../app',
        "text"     : 'require/text',
        "css"      : 'require/css', 
        "markdown" : 'Markdown.Converter',

        //--------------------------------------
        "scrolling"        : '_mmgrid/scrolling',
        "mmgrid"           : '_mmgrid/mmGrid',
        "mmpaginator"      : '_mmgrid/mmPaginator',
        "mmtreegrid"       : '_mmgrid/mmTreeGrid',
        "select2"          : '../../vendor/select2/select2',
        "adminLTE"         : "app/adminLTE",
        "bootstrap-dialog" : '_bootstrap3.dialog/bootstrap-dialog.min',
        "popover"          : '_webui_popover/jquery.webui-popover.min',
        "webuploader"      : '_webuploader/webuploader.nolog.min',
        'jquery.ui.widget' : 'jquery.fileupload/js/vendor/jquery.ui.widget',
        'jqfileupload'     : 'jquery.fileupload/js/jquery.fileupload',
        'jqIfmTransport'   : 'jquery.fileupload/js/jquery.iframe-transport',
        "uploadify"        : '_uploadify/jquery.uploadify',
        "jqdialog2"        : 'jquery.dialog2/jquery.dialog2',
        "jqdialog2-helper" : "jquery.dialog2/jquery.dialog2.helpers",
        "jqtoastr"         : 'jquery.toastr/toastr.min',
        "jqformbuilder"    : 'jquery.formbuilder/jquery.formbuilder',
        "jqtimepicker"     : '_jquery.timepicker/jquery-ui-timepicker-addon',
        "jqvalidation"     : '../../vendor/jquery-validation/jquery.validate',
        "jqvalidation-fix" : '_jquery.validation/validate-fix',
        "jqvalidation_zh"  : '_jquery.validation/localization/messages_zh_fieldname',
        "../jquery.validate.min" : '_jquery.validation/jquery.validate.min',
        "datatables"       : '../../vendor/DataTables/jquery.dataTables',
        "sweetalert"       : '../../vendor/sweetalert/sweet-alert.min',
        "layer"			   : '../../vendor/layer/layer',
        "laypage"          : '../../vendor/laypage/laypage',
        "jstree"           : '../../vendor/jstree/jstree.min',
		"formJson"		   : '../../assets/js/formJson',
        "laytpl"		   : '../../vendor/laytpl/laytpl',
        "tagsinput"		   : '../../vendor/bootstrap-tagsinput/bootstrap-tagsinput',
        "jqgrid"		   : '../../vendor/jqgrid/src/jquery.jqGrid',
        "planGrid"         : '../../vendor/jqgrid/src/jqGrid-plan',
        "searchGroup"	   : '../../assets/js/search-group',
        "searchGroup2"      : '../../assets/js/search-group2',
        "subtb"            : '../../assets/js/subtb',
        "timeline"         : '../../assets/js/TimeLine',
        "codemirror"       : '../../vendor/codemirror/codemirror',
        "prgressbar"       :'../../vendor/bootstrap-progressbar/bootstrap-progressbar.min',
        "typeahead"        :'../../vendor/typeahead/js/typeahead' ,
        "rangeSlider"      :'../../vendor/ion.rangeSlider-master/js/ion.rangeSlider.min',
        "Chart"            :'../../vendor/Chart.js/Chart.min',
        "touchspin"        :'../../vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min',
        "flow"             :'../app/flow/flow',
        "moment"           :'../../vendor/moment',
        "zclip"            :'../../vendor/zclip/jquery.zclip.min'
        	
    },
    "shim": {
        "mmgrid": {
            deps: ['css!_mmgrid/mmGrid'],
            exports: 'jQuery.fn.mmGrid'},
        "mmpaginator": {
            deps: ['scrolling', 'css!_mmgrid/mmPaginator'],
            exports: 'jQuery.fn.mmPaginator'},
        "mmtreegrid": {
            deps: ["mmgrid", "css!_mmgrid/mmTreeGrid"],
            exports: 'jQuery.fn.mmGrid'},
        "select2": {
            deps: ["css!../../vendor/select2/select2.min", "css!../../vendor/select2/select2_fix"],
            exports: 'jQuery.fn.select2'
        },
        "jqdialog2": {
            deps: [
                "jquery.dialog2/jquery.controls",
                "css!jquery.dialog2/jquery.dialog2"
            ],
            exports: 'jQuery.fn.dialog2'
        },
        "jqdialog2-helper": {
            deps: ["jqdialog2"],
            exports: 'jQuery.fn.dialog2.helpers'
        },
        "jqtoastr": {
            deps: ["jquery", "css!jquery.toastr/toastr.min"]
        },
        "bootstrap-dialog": {
            deps: ['css!_bootstrap3.dialog/bootstrap-dialog.min']
        },
        "popover":{
            deps: ['css!_webui_popover/jquery.webui-popover.min']
        },
        "webuploader":{
            deps: ['css!_webuploader/webuploader.css']
        },
        "uploadify": {
            deps: ['css!_uploadify/uploadify.css'],
            exports:'jQuery.fn.uploadify'
        },
        "jqfileupload" : {
            deps: ['css!jquery.fileupload/css/jquery.fileupload']
        },
        "jqtimepicker": {
            deps: [
                "css!_jquery.timepicker/jquery-ui-timepicker-addon",
                "_jquery.timepicker/jquery-ui-sliderAccess"
            ],
            exports: 'jQuery.fn.datetimepicker'
        },
        "bootstrap-filestyle":{
            exports: 'jQuery.fn.filestyle'
        },
        "datatables": {
            deps: ['css!DataTables/css/DT_bootstrap'],
            exports: 'jQuery.fn.dataTable'
        },
        "layer": {
        	deps:['css!../../vendor/layer/skin/layer'],
        	exports:'layer'
        },
        "laypage" : {
            deps:['css!../../vendor/laypage/skin/laypage'],
            exports:'laypage'
        },
        "jstree": {
            deps: ['css!../../vendor/jstree/themes/default/style.min']
        },
        "tagsinput" : {
        	deps: ['css!tagsinput'],
        	exports:'jQuery.fn.tagsinput'
        },
        "app/combotree": {
            deps: ["jstree", "tagsinput"],
            exports:'jQuery.fn.combotree'
        },
        "jqgrid": {
        	deps: ["layer", "../../vendor/jqgrid/src/i18n/grid.locale-cn","../../vendor/jqgrid/src/jqGrid-set","css!../../vendor/jqgrid/css/ui.jqgrid.css","css!../../vendor/jqgrid/css/ui.jqgrid-bootstrap.css"],
        	exports:'jQuery.fn.jqgrid'
        },
        "planGrid": {
        	deps: ["select2", "layer", "jqgrid", "formJson", "touchspin", "moment", "../../vendor/jqgrid/src/plan-set"],
        	exports: 'jQuery.fn.planGrid'
        },
        "searchGroup": {
        	deps: ["css!../../assets/css/search-group"],
        	exports:'jQuery.fn.searchGroup'
        },
        "searchGroup2": {
            deps: ["css!../../assets/css/search-group"],
            exports:'jQuery.fn.searchGroup'
        },
        "codemirror":{
        	deps:["../../vendor/codemirror/mode/xml/xml", "../../vendor/codemirror/addon/selection/active-line", "css!../../vendor/codemirror/codemirror"]
        },
        "prgressbar":{
        	deps:["css!../../vendor/bootstrap-progressbar/bootstrap-progressbar-3.3.0.min"]
        },
        "typeahead":{
        	deps:["css!../../vendor/typeahead/css/typeahead"]
        },
        "rangeSlider":{
        	deps:["css!../../vendor/ion.rangeSlider-master/css/ion.rangeSlider","css!../../vendor/ion.rangeSlider-master/css/ion.rangeSlider.skinHTML5"]
        },
        "touchspin":{
        	deps:["css!../../vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min"],
        	exports:"jQuery.fn.TouchSpin"
        },
        "flow":{
        	deps:["css!../app/flow/flow", "layer"],
        	exports:'jQuery.fn.flowList'
        },
        "app/uploader":{
        	deps:['css!_webuploader/webuploader.css']
        },
        moment:{
            exports:"moment"
        },
        'zclip' : {
            exports:'jQuery.fn.zclip'
        }
    },
    urlArgs: get_static_version()
});
