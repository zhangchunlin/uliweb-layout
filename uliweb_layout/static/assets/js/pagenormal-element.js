/**
 * Created by admin on 2015/8/1.
 */
var PageElement = function() {
    "use strict";

    var autosizeHandler = function () {
        $('.autosize.area-animated').append("\n");
        autosize($('.autosize'));
    };
    var select2Handler = function () {
        $(".js-example-basic-single").select2();
        $(".js-example-basic-multiple").select2();
        $(".js-example-placeholder-single").select2({
            placeholder: "Select a state"
        });
        var data = [{
            id: 0,
            text: 'enhancement'
        }, {
            id: 1,
            text: 'bug'
        }, {
            id: 2,
            text: 'duplicate'
        }, {
            id: 3,
            text: 'invalid'
        }, {
            id: 4,
            text: 'wontfix'
        }];
        $(".js-example-data-array-selected").select2({
            data: data
        });
        $(".js-example-basic-hide-search").select2({
            minimumResultsForSearch: Infinity
        });
    };
    var datePickerHandler = function () {
        $('.datepicker').datepicker({
            autoclose: true,
            todayHighlight: true
        });
        $('.format-datepicker').datepicker({
            format: "M, d yyyy",
            todayHighlight: true
        });

    };
    var timePickerHandler = function() {
        $('#timepicker-default').timepicker();
    };
    //function to goolgecode
	var loadHandler  = function(e)
	{
	     $(function(){
	            $("pre").addClass("prettyprint linenums");
	             prettyPrint();
	            });	
	};
    var  datetimePickerHanlder =function(){
        var time= $("#start-date-time");
        time.datetimepicker();
        time.on("dp.change", function(e) {
            time.data("DateTimePicker").minDate(e.date);
        });
    }
    return{
            init:(function(){
               // autosizeHandler();
                select2Handler();
             //   loadHandler();
           //     datetimePickerHanlder();
            //    datePickerHandler();
             //   timePickerHandler();
            })
        }
}();
