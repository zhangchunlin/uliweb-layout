/**
 * Created by admin on 2015/9/1.
 */

   var Affix = function() {
    "use strict";
   var affixHandler = function() {
       $(".mao").each(function() {
           $(this).affix({
               offset: {
                   top: $(this).offset().top
               }
           });

           window.onhashchange = function () {
               if (($(document).scrollTop() + $(window).height()) < $(document).height()) {
                   $(document).scrollTop($(document).scrollTop() -55);
               }
           };
       });
   };
    return  {
        init:function(){
            affixHandler();
        }
    };
}();