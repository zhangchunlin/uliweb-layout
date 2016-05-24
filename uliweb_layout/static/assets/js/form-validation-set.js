//表单验证用共同属性
var validOptions = {
    errorElement: "span", // contain the error msg in a span tag
    errorClass: 'help-block error',
    errorPlacement: function (error, element) { // render error placement for each input type
        error.appendTo($(element).parents(".validDiv"));
    },
    ignore: "",
    highlight: function (element) {
//        $(element).closest('.help-block').removeClass('valid');
//        // display OK icon
//        $(element).parents(".validDiv").removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
//        // add the Bootstrap error class to the control group
    },
    unhighlight: function (element) { // revert the change done by hightlight
//        $(element).parents(".validDiv").removeClass('has-error');
        // set error class to the control group
    },
    success: function (label, element) {
//        label.addClass('help-block valid');
//        // mark the current input as valid and display OK icon
//        $(element).parents(".validDiv").removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
    	label.remove();
    },
    invalidHandler: function (event, validator) { //display error alert on form submit
    	$(".successHandler", this).hide();
    	$(".errorHandler", this).show();
    },
    submitHandler: function (form) {
    	$(".successHandler", this).show();
    	$(".errorHandler", this).hide();
    }
};

var validateCheckRadio = function (val) {
   // $("input[type='radio'], input[type='checkbox']").on('ifChecked', function(event) {
   //     $(this).parent().closest(".has-error").removeClass("has-error").addClass("has-success").find(".help-block").hide().end().find('.symbol').addClass('ok');
   // });

   $("input[type='radio']").on('click', function(event) {
       $(this).parents(".validDiv").find(".help-block").remove();
   });
};

//删除验证出错class
function clearErrorClass(itemId){
    $(itemId).parents(".validDiv").find(".help-block").remove();
}

//表单验证对象设置
var runPageValidator = function (formId) {
    var form1 = $(formId);
    var errorHandler1 = $('.errorHandler', form1);
    var successHandler1 = $('.successHandler', form1);
    
    var validMap = $.extend(validOptions,{
        invalidHandler: function (event, validator) { //display error alert on form submit
            successHandler1.hide();
            errorHandler1.show();
        },
        submitHandler: function (form) {
            successHandler1.show();
            errorHandler1.hide();
        }
    });
    
    $(formId).validate(validMap);
};