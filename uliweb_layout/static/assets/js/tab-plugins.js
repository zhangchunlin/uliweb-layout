(function ($) {
    $.fn.tabs = function (option) {
        var that = this,
            defObj = {
            id: false,
            title: false,
            url: false,
            content: false,
            close: false
        };


        this.addTabs = function (objs) {
            $(objs).each(function () {
                that.addTab(this);
            });
        };

        this.addTab = function (obj) {
        	if ($("li[role='presentation']",this).length>5) {
        		layer.msg('页签打开过多请关闭一些！');
        		return;
        	} 
        	
            var a;
            obj = $.extend({}, defObj, obj);

            var title = $('<li role="presentation" id="tab_' + obj.id + '"><a href="#' + obj.id + '" aria-controls="' + obj.id + '" role="tab" data-toggle="tab">' + obj.title + '</a>'),
                content = $("<div class='tab-pane padding-0 fade' style='position: relative;' id=" + obj.id + "/>");

            $(".active").removeClass("active in");

            if ($("#" + obj.id, this).length == 0) {
                //是否允许关闭
                if (obj.close) {
                    title.append('<i class="fa fa-close close-tab"></i>');
                }

                if (!obj.url) {
                    content.append(obj.content);
                } else {//没有内容，使用IFRAME打开链接
                	// console.log($(this).height());
                    content.append("<iframe src='" + obj.url + "' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='yes' allowtransparency='yes' width='100%' height='" + ($(this).height()-1-$(".nav-tabs",this).height()) + "px' style='margin-bottom: -5px;'></iframe>");
                    a = layer.load();
                }

                //加入TABS
                $(".nav-tabs", this).append(title);
                $(".tab-content", this).append(content);
                title.addClass("active");
                content.addClass("active in");
                $("iframe",content).load(function(){
                    layer.close(a);
                });

            } else {
                $("#tab_" + obj.id + " a").tab("show");
            }
        };


        $(this).on("dblclick",".nav-tabs a",function(){
            var t = $($(this).attr("href")+" > iframe"),
                e,a;
            if (t.length>0) {
                e = t.attr("src");
                a = layer.load();
                t.attr("src", e).load(function () {
                    layer.close(a)
                })
            }

        });

        $(this).on("click", ".close-tab", function () {
            if ($(this).parent().hasClass("active")) {
                $(this).parent().prev().addClass("active");
                $($(this).parent().prev().find("a").attr("href")).addClass("active in");
            }

            $($(this).parent().find("a").attr("href")).remove();
            $(this).parent().remove();
        });

        $(this).data("tabs",this);
        return this;
    };
})(jQuery);