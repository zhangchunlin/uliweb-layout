String.prototype.getQueryString = function (name)//name 是URL的参数名字
{
    var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)"), r;
    if (r = this.match(reg)) return unescape(r[2]);
    return null;
};

(function ($) {
    $.fn.combotree = function (options) {
        var is_method	= (typeof options === 'string'),
            args		= Array.prototype.slice.call(arguments, 1),
            $this = $(this),
            that = this;

        //没有选择对象时返回false
        if (!this.length) {return false;}

        //获取实例和方法
        var instance = $this.data("combotree"),
            method = is_method && instance ? instance[options] : null;

        //返回方法操作
        if (method) {
            return method.apply(instance, args);
        }

        //如果没有参数返回实例
        if (options===undefined) {
            return instance;
        }

        var v, to = false, tree,
            id = $this.attr("id"),

            //默认参数
            defultOptions = {
                searchOptions: false,
                searchDelay : 300,
                placeholder: "筛选",
                tags: {
                    freeInput: false,
                    tagClass: "label blue-tag",
                    itemValue: 'id',
                    itemText: 'text'
                },
                tree: {
                    "core": {
                        "strings": {
                            "Loading ...": "正在加载 ..."
                        },
                        "multiple": false,
                        "themes": {
                            "responsive": false
                        },
                        // so that create works
                        "check_callback": true
                    },
                    "types": {
                        "default": {
                            "icon": "fa fa-folder text-primary fa-lg"
                        },
                        "user": {
                            "icon": "fa fa-user text-primary fa-lg"
                        }
                    },
                    "state": "closed", // or "open"
                    "search": {
                        "show_only_matches": true
                    },
                    "checkbox": {
                        "three_state": false
                    },
                    "plugins": ["search", "types", "checkbox"]
                },
                "inputClass": "",
                "selectClass": ""
            },

            //合并设置参数
            settings = $.extend(true, {}, defultOptions, $this.data(), options),

            str = '<div class="select-picker">' +
                '<input type="text" placeholder="' + settings.placeholder + '">' +
                '<div role="tree">' +
                '</div>' +
                '</div>',

            picker = $this.siblings(".select-picker").length == 0 ? $(str) : $this.siblings(".select-picker");

        if (settings.rootID && $.isFunction(settings.tree.core.newData)) {
            settings.tree.core.data = function (obj, callback) {
                return settings.tree.core.newData(obj, settings.rootID, callback);
            }
        }

        $this.attr("readonly", "true");
        $this.css("background-color","#fff");

        if (settings.tree.core.multiple) {
            $this.tagsinput(settings.tags);
            $this.siblings(".bootstrap-tagsinput").find("input").css({width: "0"});
        }

        picker.css({"min-width": $this.parent().width(), "top": $this.parent().height()});

        $this.on("change", function () {
            picker.css({"top": $this.parent().height()});
        });


        $("input", picker).addClass(settings.inputClass);
        $("div", picker).addClass(settings.selectClass);

        if ($this.siblings(".select-picker").length == 0) {
            $this.after(picker);
        }

        picker.hide();

        $this.parent().find(".bootstrap-tagsinput,.input-group-btn,.input-group-addon, #" + id).on("click", function () {
            picker.css({"top": $this.parent().height()});
            picker.toggle();
            //$("input", picker).focus();
        });


        //区域外点击隐藏picker
        $(document).click(function (e) {
            if ($(e.target).parents(".input-group").children("#" + id).length == 0 && $(e.target).parents(".select-picker").length == 0) {
                picker.hide();
            }
        });

        this._getText = function() {
            $this.data("value", $this.val());
            var t = "";
            $.each($this.tagsinput("items"), function() {
                t += this.text + ",";
            });
            $this.val(t.replace(/(^,)|(,$)/g));
        };


        $("div", picker).jstree(settings.tree).bind("select_node.jstree", function (e, data) {

            if (settings.tree.core.multiple) {
                $this.tagsinput("add", data.node);
                that._getText();

            } else {
                $this.data("value", data.node.id);
                $this.val(data.node.text);
            }
        }).bind("deselect_node.jstree", function (e, data) {
            if (settings.tree.core.multiple) {
                $this.tagsinput("remove", data.node);

                that._getText();
            } else {
                $this.data("value", "");
                $this.val("");
            }
        }).bind("deselect_all.jstree", function(){
            if (settings.tree.core.multiple) {
                $this.tagsinput("removeAll");
            }
            else {
                $this.data("value", "");
                $this.val("");
            }
        }).bind("load_node.jstree",function(){
            $(this).jstree("select_node",$this.data("value")&&$this.data("value").toString().split(","));
        });

        tree = $("div", picker).data('jstree');

        $this.on('itemRemoved', function (event) {
            $this.data("value", $this.val());
            tree.uncheck_node(event.item);
        });


        $("input", picker).keyup(function () {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                if (!(v + $("input", picker).val()) == "") {
                    v = $("input", picker).val();
                    if (!settings.searchOptions) {
                        tree.search(v);
                    } else {
                        if (v != "") {
                            if ($.isFunction(settings.searchOptions)) {
                                settings.searchOptions(v,function(data) {
                                    tree.settings.core.data = data;
                                    tree.refresh(true, true);
                                });
                            }
                        } else {
                            tree.settings.core.data = settings.tree.core.data;
                            tree.refresh(true, true);
                        }
                    }
                }
            }, settings.searchDelay);
        });

        this.clear = function() {
            tree.deselect_all(true);
            $this.tagsinput("removeAll");

            $this.val("");
            $this.data("value","");
            return this;
        };

        this.setCheck = function(v) {
            v = v?v:$this.data("value");
            //tree.deselect_all(true);
            if (v) {
                tree.select_node(v.toString().split(","));
            }
            return this;
        };

        this.setValue = function(obj) {
            if (settings.tree.core.multiple) {
                $.each(obj,function() {
                    $this.tagsinput("add", this);
                    that._getText();
                })
            }else if (typeof(obj)==="object"&& !$.isArray(obj)) {
                $this.val(obj.text);
                $this.data("value", obj.id);
            }
            this.setCheck();
            return this;
        };
        this.jstree =  tree;
        this.tagsinput = $this.data("tagsinput");

       $this.data("combotree",this);

        return this;
    };
})(jQuery);