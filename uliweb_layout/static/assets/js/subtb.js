(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object') {
        factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    "use strict";
    $.fn.subtb = function (len, el) {
        if (!len) len=16;
        
        if (!el) el ="td"

        $(this).each(function(){
            $("tr", this).find(el).each(function(){
            	var tar=$(this);
            	if ($("a",this).length>0) {
            		tar = $("a",this)
            	}
            	
            	tar.each(function(){
            		var text = $(this).text();
            		$(this).prop("title",text);

                    if (text&&text.length>len) {
                    	$(this).text(text.substring(0,len)+"...");
                    }
            	});
            })
        });
    };
}));