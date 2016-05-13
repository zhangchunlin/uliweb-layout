var ModelFullScreen = function () {
    var modelFullScreenHandler = function () {
        $(".modal-content").each(function(){
            var t = this;
            $(".fullscreen-button",this).click(function(){
                var m = $(this).parents(".modal-content");
                var c = m.parents(".modal");
                if (c.hasClass("fullscreen")) {
                    $(".modal-dialog,.modal-content", c).removeClass("margin-padding-0");
                    c.css("padding-left","17px").removeClass("fullscreen");
                    $(".modal-dialog,.modal-content", c).css("height","auto");
                }else {
                    $(".modal-dialog,.modal-content", c).addClass("margin-padding-0");
                    c.css("padding-left","0px").addClass("fullscreen");

                    if ($(".modal-content", c).height()<$(window).height()) {
                        $(".modal-dialog,.modal-content", c).css("height","100%");
                    }
                }
            });
            $(".btn-submit",this).click(function(){
                var fn = $(".modal-body",t).parents(".modal").data("function");
                $("[data-dismiss=modal]:first",t).trigger("click");
                window[fn]($(".modal-body form"));
            });
        });

        $("[data-toggle='modal']").click(function(){
            $(".modal").find(".modal-dialog,.modal-content").removeClass("margin-padding-0").css("height","auto");
            $(".modal").css("padding-left","17px").removeClass("fullscreen");
        });

        $(".modal").on("hidden.bs.modal", function() {
            $(this).removeData("bs.modal");
        });
    };

    return {
        init: function () {
            modelFullScreenHandler();
        }
    };
}();