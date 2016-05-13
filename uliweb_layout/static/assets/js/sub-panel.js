var SubPanel = function () {
    var m = this;

    this.percentWindow = function (num, num2) {
        num2 = num2 ? num2 : $(window).height();
        return Math.round(num / num2 * 10000) / 100.00 + "%"
    };

    var SubPanelHandler = function () {
        $(".sub-panel").each(function () {
            var p = $(this);
            $(".top-panel", p).height("100%");
            $(".center-line", p).hide();
            $(".bottom-panel", p).hide();

            $(".center-line", p).on("mousedown", function (e) {
                var offset = 50;
                var wHeight = p.height();
                var wTop =  p.offset().top;
                var divTop = $(".top-panel", p).height();
                var sh = e.pageY;
                $(document).on('mousemove', function (eMove) {
                    eMove.stopPropagation();
                    eMove.preventDefault();

                    if (eMove.pageY > wTop + offset && eMove.pageY <= wHeight + wTop - offset) {

                        var divPos = eMove.pageY - sh;
                        var newTop = (divTop + divPos) > 0 ? (divTop + divPos) : 0;
                        var newBottom = wHeight - newTop - 8;
                        $(".top-panel", p).height(m.percentWindow(newTop,wHeight));
                        $(".bottom-panel", p).height(m.percentWindow(newBottom,wHeight));
                    }
                    return false;
                });

                $(document).on('mouseup', function () {
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    $(document).off('mousedown');
                });
            });


            $(".sub-show").click(function () {
                var pl = $($(this).attr("for"));
                var dH = 300;
                var wHeight = pl.height();

                if (dH > wHeight * 0.4) {
                    dH = wHeight * 0.4 - 8;
                }


                if ($(".center-line:hidden").length>0) {
                    $(".top-panel", pl).height(m.percentWindow(($(".top-panel", pl).height() - dH - 8),wHeight));
                    $(".bottom-panel", pl).height(m.percentWindow(dH,wHeight));
                    $(".center-line", pl).show();
                    $(".bottom-panel", pl).show();

                } else {
                    $(".top-panel", pl).height("100%");
                    $(".center-line", pl).hide();
                    $(".bottom-panel", pl).hide();
                }
            });
        });
    };

    return {
        init: function () {
            SubPanelHandler();
        }
    };
}();
