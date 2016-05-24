(function (factory) {
    "use strict";
    if ("function" === typeof define && define.amd) {
        define(["jquery", "layer"], factory);
    } else if ("object" === typeof exports) {
        factory(require("jquery"), require("layer"));
    } else {
        factory(jQuery, layer);
    }
}(function ($, layer, undefined) {
    "use strict";
    return $.fn.searchGroup = function (options) {
        var is_method = (typeof options === 'string'),
            args = Array.prototype.slice.call(arguments, 1),
            $this = $(this),
            that = this;

        //没有选择对象时返回false
        if (!this.length) {
            return false;
        }

        //获取实例和方法
        var instance = $this.data("searchGroup"),
            method = instance && is_method ? instance[options] : null;

        //返回方法操作
        if (method) {
            return method.apply(instance, args);
        }

        //如果没有参数返回实例
        if (options === true) {
            return instance;
        }

        var to = false, showMore = true, c = true,
            defultOptions = {
                num: 3,
                mess: true,
                messText: "筛选内容不能为空"
            };

        var settings = $.extend({}, defultOptions, $(this).data(), options);

        var showN = parseInt(settings.num), labelP = $(settings.label), dataT = $(settings.target);

        var clickFunction = settings.cf, removeFunction = settings.rf;

        this.callback = function (fn) {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                if (typeof(fn) == "function") {
                    fn();
                } else if (typeof(fn) == "string" && typeof (window[fn]) == "function") {
                    window[fn]();
                }
            }, 200);
        };

        this.getQuery = function () {
            var r = {};
            if (window.location.search) {
                var d = window.location.search.replace(/^\?/g, "").split("&");

                for (var i = d.length - 1; i >= 0; i--) {
                    var e = d[i].split("=");
                    if (e.length > 1) {
                        r[e[0]] = unescape(decodeURI(e[1]));
                    } else {
                        r[e[0]] = "";
                    }
                }
            }

            return r;
        };

        this.setUrl = function(obj) {
            var url = location.origin + location.pathname;
            if (typeof(obj) === "object") url += "?" + $.param(obj);
            if (history.pushState) {
                history.pushState({}, document.title, url);
            }
        };

        this.showMoreHandler = function () {
            var o = $this.find(".s-more-group");
            var nodes = $(".select-group:not(.selected)", $this).eq(showN - 1).nextAll(".select-group:not(.selected)");
            var showNodes = $this.find(".select-group:not(.selected)");

            $(".select-group.selected", $this).hide();

            if (nodes.length == 0) {
                o.find(".more-text").hide();
                o.removeClass("s-more-line");
            } else {
                o.find(".more-text").show();
                o.addClass("s-more-line");
            }
            showNodes.show();

            if (showMore) {
                nodes.hide();
            }
        };

        //设置元素更多操作
        $(".sm-wrap", this).each(function () {
            $(this).click(function () {
                $(this).hide();
                $(this).siblings().show();
                showMore = !showMore;
                that.showMoreHandler();
            });
        });

        var queryP;

        var showL = $(".label-group .select-choice-group", labelP).length != 0 ? $(".label-group .select-choice-group", labelP) : $(".label-group", labelP).html("<div class='select-choice-group'></div>").find(".select-choice-group");

        var clear_button = $("<input type='button' value='全部撤销' class='clear-button btn btn-primary btn-squared btn-sm' style='display: none;'>").prependTo($(".label-button", labelP)).click(function () {
            queryP = that.getQuery();
            $(".select-choice", showL).remove();
            $(".select-group", $this).removeClass("selected");
            that.showMoreHandler();
            dataT.val("");
            $(this).hide();
            that.callback(removeFunction);

            var list = $this.find(".select-group .select-label span").map(function(){return this.id});
            for (var t in list) {
                delete queryP[list[t]];
            }
            that.setUrl(queryP);
        });

        this.showClearButton = function () {
            if ($(".select-choice", showL).length > 0) {
                clear_button.show();
            } else {
                clear_button.hide();
            }
        };

        this.addLable = function (obj) {
            var l, lt;
            l = obj.label;
            if (obj.value.length > 21) {
                lt = obj.value.substr(0, 18) + "...";
            } else {
                lt = obj.value;
            }
            var labelItem = $("<div class='btn btn-o btn-default btn-squared btn-sm margin-right-15 select-choice' title='" + obj.value + "'><span class='label-text'>" + l + "：" + lt + "</span> <span class='select-remove eff'>×</span></div></div>");
            labelItem.find(".select-remove").click(function () {
                queryP = that.getQuery();
                labelItem.remove();
                $(".select-group .select-label #" + obj.id, $this).parents(".select-group").removeClass("selected");
                var d = $.parseJSON(dataT.val() == "" ? "{}" : dataT.val());
                delete d[obj.id];
                dataT.val(JSON.stringify(d));

                that.showClearButton();
                that.showMoreHandler();

                that.callback(removeFunction);
                delete queryP[obj.id];
                that.setUrl(queryP);
            });
            showL.append(labelItem);
        };

        this.setValue = function (data) {
            if (data) {
                var d;
                if (typeof(data) == "string") {
                    dataT.val(data);
                    d = $.parseJSON(data);
                } else if (typeof(data) == "object") {
                    dataT.val(JSON.stringify(data));
                    d = data;
                }

                for (var item in d) {
                    var g = $(".select-group .select-label #" + item, this);
                    if (g.length > 0) {
                        g.parents(".select-group").addClass("selected");
                        var label = g.text();
                        var value = "";

                        switch (g.parents(".select-group").data("item")) {
                            case 1 :
                            {
                                g.parents(".select-group").find(".select-button").each(function () {
                                    var t = [];
                                    if (d[item]) t = d[item].split(",");
                                    for (var x in t) {
                                        if ($(this).data("value") == t[x]) {
                                            value += "," + $.trim($(this).data("label") == undefined ? $(this).text() : $(this).data("label"));
                                        }
                                    }
                                });
                                break;
                            }

                            case 2 :
                            {
                                var t = [];
                                if (d[item]) t = d[item].split(",");
                                if (t[0]&&t[1]) {
                                    value = t[0]+"至"+t[1];

                                }else if (t[0]) {
                                    value = t[0]+"以后";

                                }else {
                                    value = t[1]+"以前";
                                }
                                break;
                            }

                            default :
                            {
                                value = d[item];
                            }
                        }

                        that.addLable({id: item, label: label, value: value.replace(/^,|,$/g, "")});
                    }
                }

                that.showClearButton();
                that.showMoreHandler();
//                that.callback(clickFunction);
            }
        };

        $(".select-group", $this).each(function () {
            var $g = $(this);
            var label = $(".select-label span", $g);

            //设置确定事件
            $g.on($g.data("even"), ".select-button", function () {
                queryP = that.getQuery();

                var t = $.trim($(this).data("label") == undefined ? $(this).text() : $(this).data("label"));

                if (!t) {
                    if (settings.mess)
                        layer.msg(settings.messText);
                    return;
                }

                that.addLable({id: label.prop("id"), label: $.trim(label.text()), value: t});
                $g.addClass("selected");
                var d = $.parseJSON(dataT.val() == "" ? "{}" : dataT.val());
                d[label.attr("id")] = $(this).data("value");
                dataT.val(JSON.stringify(d));

                that.showClearButton();
                that.showMoreHandler();

                that.callback(clickFunction);
                queryP[label.attr("id")] = $(this).data("value");
                that.setUrl(queryP);
            });

            //设置更多按钮
            if ($(".text-group .text-list", this).height() > 60) {
                $g.addClass("select-college");
                $(".more-select", this).css("visibility", "visible").toggler(function () {
                    $g.addClass("select-expand");
                    $("i", this).removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
                }, function () {
                    $g.removeClass("select-expand");
                    $("i", this).removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
                });
            }

            //多选操作
            $(".muti-select", this).toggler(function () {
                //如果没有展开立即展开
                if (!$g.hasClass("select-expand")) {
                    $(".more-select", $g).trigger("click");
                }

                //添加checkbox
                $(".text-group label", $g).removeClass("select-text").removeClass("select-button").each(function (i) {
                    var id = $(".select-label span", $g).prop("id");
                    $(this).wrap("<div class='checkbox check-primary check-sm checkbox-inline'> <input type='checkbox' id='" + id + i + "'></div>").attr("for", id + i);
                });

                //添加操作按钮
                $(".text-group .text-list", $g).append("<button type='button' class='btn btn-default btn-xs check-all'>全选</button> <button type='button' class='btn btn-primary select-button btn-xs' data-value >确定</button>").find(".select-button").click(function () {
                    var t = [];
                    var v = [];
                    $(this).siblings().find("[type='checkbox']:checked").each(function () {
                        t.push($(this).siblings("label").text());
                        v.push($(this).siblings("label").attr("data-value"));
                    });

                    $(this).siblings().find("[type='checkbox']").prop("checked", false);
                    c = true;

                    $(this).data("label", t.join(","));
                    $(this).data("value", v.join(","));
                }).siblings(".check-all").click(function () {
                    if (c) {
                        $("[type='checkbox']", $g).prop("checked", true);
                    } else {
                        $("[type='checkbox']", $g).prop("checked", false);
                    }
                    c = !c;
                });

                $("i", this).removeClass("glyphicon-plus").addClass("glyphicon-minus");


            }, function () {
                if ($g.hasClass("select-expand")) {
                    $(".more-select", $g).trigger("click");
                }
                $("button", $g).remove();
                $(".text-list", $g).replaceWith($("<div class='text-list'></div>").append($(".text-group label", $g).addClass("select-text").addClass("select-button")));
                $("i", this).removeClass("glyphicon-minus").addClass("glyphicon-plus");
            });
        });

        this.showClearButton();
        this.showMoreHandler();

        $this.data("searchGroup", this);

        this.setValue(this.getQuery());

        return this;
    }
}));