(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($, undefined) {
    "use strict";
    var radioNode = $('<div class="radio clip-radio radio-primary radio-inline">' + '<input type="radio">' + '<label></label></div>');
    if (window.browser_name=="ie"&&window.verinfo<"9.0") {
        radioNode = $('<div class="radio radio-primary radio-inline">' + '<input type="radio">' + '<label style="white-space:nowrap;"></label></div>');
    }

    $.fn.formJson = function(el) {

        this.getJson = function(el) {
            var jsonList = [];

            $(this).each(function() {
                var value,formJson = {};

                $(el, this).each(function() {
                    if (this.id || $(this).is("input:radio")) {
                        if ($(this).hasClass("ue")) {
                            formJson[this.id] = UE && UE.getEditor(this.id) && UE.getEditor(this.id).getContent();
                        } else if ($(this).is("input:radio")) {
                            if ($(this).is(":checked")) formJson[this.name] = $(this).val();
                            formJson[this.name + "_DESC"] = $(this).siblings('label:visible').text().replace("：","");
                        } else if ($(this).is("input:checkbox")) {
                            if ($(this).is(":checked")) formJson[this.id] = $(this).val();
                            formJson[this.id + "_DESC"] = $(this).siblings('label:visible').text().replace("：","");
                        } else if ($(this).is("select")) {
                            formJson[this.id] = $(this).val() ? $(this).val().toString() : $(this).val();
                            formJson[this.id + "_DESC"] = $(this).find("option:selected").map(function() {
                                return $(this).text()
                            }).get().toString();
                        } else if ($(this).hasClass('combotree')) {
                            value = $(this).data("value");
                            if ($(this).attr("vType")=="obj") {
                                formJson[this.id] = $(this).combotree("getValue", true);
                            } else if ($(this).attr("vType")=="nopart") {
                                formJson[this.id] = value ? value.replace(/^\||[^,|]+\|/g,"") : value;
                            } else {
                                formJson[this.id] = value ? value.toString() : value;
                            }
                            formJson[this.id + "_DESC"] = $(this).val();
                        } else {
                            value = $(this).data("value") || $(this).val();
                            formJson[this.id] = value ? value.toString() : value;
                            if ($(this).data("value")) {
                                formJson[this.id + "_DESC"] = $(this).val();
                            }
                        }
                    }
                });
                jsonList.push(formJson);
            });
            if (jsonList.length == 1) {
                jsonList = jsonList[0];
            }
            return jsonList;
        };

        this.setJson = function(obj) {
            var $this, value, tnode;
            for (var item in obj) {
                value = obj[item];
                //            	if ("string"===typeof(value))
                //            		value = $.trim(value);

                if ("string" === typeof(item)) {
                    if ($(this).find("#" + item + ":not(:checkbox,:radio)").length > 0) {
                        $this = $(this).find("#" + item);

                        if ($this.is("label")) {
                            $this.text(value);
                        } else if ($this.is("select")) {

                            var list = "string" === typeof(value) ? value.split(",") : value;
                            $this.val(list);
                            if (list&&!$this.val()) {
                                $this.data("value", list);
                            } else {
                            	$this.trigger("change");
                            }
                        } else if ($this.is(":checkbox") && $this.val() == value) {
                            $this.prop("checked", true).trigger("change");
                        } else if ($this.hasClass("ue")) {
                        	var tue;
                        	if (UE) {
                        		tue = UE.getEditor($this.prop("id"));
                        		tue.ready(function(){
                                    var node = tue, tValue = value, elem = $this;
                                    return function(){
                                        node.setContent(tValue);
                                        if (elem.hasClass("readonly")) {
                                            node.setDisabled("fullscreen");
                                        }
                                    }
                        		}());
                        	}
                        } else if ($this.hasClass("combotree")) {
                            if ("object" == typeof(value)) {
                                $this.combotree("setValue", value);
                            } else {
                                $this.data("value", value);
                            }

                        } else {
                            $this.val(value);
                            $this.trigger("focusout");
                        }
                    } 
                    if ($(this).find(":radio[name=" + item + "],:checkbox[name=" + item + "],:radio[id=" + item + "],:checkbox[id=" + item + "]").length > 0) {
                        $(this).find(":radio[name=" + item + "][value=" + value + "]," +
                            ":checkbox[name=" + item + "][value=" + value + "]," +
                            ":radio[id=" + item + "][value=" + value + "]," +
                            ":checkbox[id=" + item + "][value=" + value + "]").prop("checked", true).trigger("change");
                    }

                }
            }
        };

        if (!el) el = "input:not(:file,:radio,:checkbox),input:radio:checked,input:checkbox:checked,select,textarea,.ue";

        if (typeof(el) === "object") {
            this.setJson(el);
        }

        if ("string" === typeof(el)) {
            return this.getJson(el);
        }
    };

    $.fn.selectOnChange = function(option, control, extOption) {

        var defaultOption = {
            serviceid: false,
            param: {},
            node: [],
            value: "itemValue",
            text: "itemName",
            getParam: false,
            template:false
        };

        var extDefaultOption = {
            init: true,
            nullChange: true,
            singleSelect: false,
            firstSelect: false,
            nullRemove: true,
            success: false,
            keyMap: false,
            debug: false,
            select2: false
        }

        var that = this,
            settings,
            extSettings,
            promise;
        
        if (that.length==0) {
        	if (window.console && console.warn) {
                console.warn(
                    'selectOnChange： 没有选中的对象！'
                );
            }
        	return;
        }
        
        if (typeof(option) === "string") {
            settings = option;
        } else if ($.isPlainObject(option)) {
            settings = $.extend({}, defaultOption, option);
        }
        
        if (settings===undefined) {
        	if (window.console && console.warn) {
                console.warn(
                    'selectOnChange：没有配置基础属性！'
                );
            }
        	return;
        }

        that.data("selectOnChange", that);

        extSettings = $.extend({}, extDefaultOption, extOption);

        this.settings = settings;
        this.extSettings = extSettings;
        this.control = control;

        if ($.isFunction(settings.getParam)) {
            settings.param = settings.getParam();
        }

        this._g = function(list, param) {
            var param2, result;
            if ($.isArray(param) && param.length > 0) {
                param2 = param.slice(1);
                result = list[param[0]];
                if (param.length > 1) {
                    result = that._g(result, param2);
                }
            } else {
                result = list;
            }

            return result;
        };

        this.setSelect2 = function(node, control, flag) {
        	var f = false;
            if (extSettings.keyMap) {
                var nodeList = $("option", node).not("[value=]");
                if (typeof(extSettings.keyMap) === "string") {
                    nodeList.not(extSettings.keyMap).remove();
                }else if ($.isArray(extSettings.keyMap)){
                    var ss = "";
                    $.each(extSettings.keyMap,function(){
                        nodeList = nodeList.not("[value=]"+this);
                    });
                    nodeList.remove();
                }else if (control&&$.isPlainObject(extSettings.keyMap)) {
                    var value = $(control).val()||$(control).data("value");
                
                    if ($.isArray(value)) {
                        for (var i=0;i<value.length;i++) {
                            nodeList = nodeList.not(extSettings.keyMap[value[i]]);
                        }
                        nodeList.remove();
                    }else if (extSettings.keyMap[$(control).val()]) {
                        nodeList.not(extSettings.keyMap[$(control).val()]).remove();
                    }else if (extSettings.keyMap["else"]) {
                        nodeList.not(extSettings.keyMap["else"]).remove();
                    }
                }
            }

            node.val(null);

            if (node.data("value")) {
                node.val(node.data("value"));
                node.data("value", null);
                node.removeData("value");
                node.removeAttr("data-value");
                f = true;
            } else if (extSettings.singleSelect && $("option[value!=]", node).length == 1) {
                $("option[value!=]", node).prop("selected", true);
                f = true;

            } else if (extSettings.firstSelect && $("option[value!=]", node).length > 0) {
                $("option[value!=]:eq(0)", node).prop("selected", true);
                f = true;
            }

            if (node.data("select2")) {
                node.triggerHandler("change.select2");
            }
            
            if (f) {
            	node.trigger("change");
            }
        }

        this.setRadio = function(node, control, flag) {
            var tnode, tList = [],
                value = node.data("value");

            that.setSelect2(node, control, flag);

            $("option[value!=]", node).each(function(index) {
                tnode = radioNode.clone();
                $(":radio", tnode).prop("id", node.prop("id") + "_" + index).prop("name", node.prop("id"))
                    .val($(this).val()||$(this).text());
                if ($(this).val() == value) {
                    $(":radio", tnode).prop("checked", true);
                }
                $("label", tnode).html($(this).text()).attr("for", node.prop("id") + "_" + index);
                tList.push(tnode);
            })

            if (tList.length > 0) {
                if (node.hasClass("required")) {
                    $(":radio", tList[0]).addClass("required");
                }
                if (node.is(":disabled")) {
                	$.each(tList,function(){
                		$(":radio", this).prop("disabled",true);
                	})
                }
                if (node.is("[readonly]")) {
                	$.each(tList,function(){
                		$(":radio", this).prop("readonly",true);
                	})
                }

                $(tList).each(function(){
                    $(":radio", this).change(function(){
                        if ($(this).is(":checked")) {
                            that.val($(this).val());
                            that.trigger("change");
                        }
                    });
                });

                if (!value) {
                    if (extSettings.singleSelect && tList.length == 1) {
                        $(":radio", tList[0]).prop("checked", true);
                    } else if (extSettings.firstSelect && tList.length > 0) {
                        $(":radio", tList[0]).prop("checked", true);
                    }
                }
            }

            node.hide();
            node.after(tList);
        }

        this.P2 = function(param, node, control, flag) {
            var op,mtype = node.attr("mtype");

            return P2.utils.getStdCode(param, function(options) {
                if (extSettings.debug)
                    console.log(options);

                for (var i = 0; i < options.length; i++) {
                    op = $("<option>", {
                        value: options[i]['itemValue']
                    }).text(options[i].itemName).data("value", options[i]);
                    node.append(op);
                }

                if (!mtype) {
                    that.setSelect2(node, control, flag);
                } else if (mtype == "radio") {
                    that.setRadio(node, control, flag);
                }


                if ($.isFunction(extSettings.success)) {
                    extSettings.success(node);
                }

                if (node.data("select2") && node.select2("isOpen")) {
                    node.select2("close");
                    node.select2("open");
                }
            });
        }

        this.P8 = function(settings, node, control, flag) {
            var item,value,op,mtype = node.attr("mtype");

            return P2.simpleTx(settings.serviceid, settings.param).success(function(result) {
                if (extSettings.debug)
                    console.log(result);

                var list = that._g(result, settings.node);
                if ($.isArray(list)) {
                    for (var len = list.length, i = 0; i < len; i++) {
                        item = value = null;
                        if (settings.template) {
                            item = that.getTemplate(list[i], settings.text);
                            value = that.getTemplate(list[i], settings.value);

                        }else {
                            item = list[i][settings.text];
                            value = list[i][settings.value];
                        }

                        if (item) {
                            op = $("<option>");
                            op.val(value).text(item).data("value", list[i]);
                            node.append(op);
                        }
                    }
                } else if ($.isPlainObject(list)) {
                    item = value = null;
                    if (settings.template) {
                        item = that.getTemplate(list, settings.text);
                        value = that.getTemplate(list, settings.value);

                    }else {
                        item = list[settings.text];
                        value = list[settings.value];
                    }

                    if (item) {
                        op = $("<option>");
                        op.val(value);
                        op.text(item);
                        node.append(op);
                    }
                }

                if (!mtype) {
                    that.setSelect2(node, control, flag);
                } else if (mtype == "radio") {
                    that.setRadio(node, control, flag);
                }

                if ($.isFunction(extSettings.success)) {
                    extSettings.success(node);
                }

                if (node.select2("isOpen")) {
                    node.select2("close");
                    node.select2("open");
                }
            });
        }

        this.getTemplate = function(node, temp) {
                var result=temp, t = (/(#)([^#]+)(#)/g).exec(temp);
                if (t&&t.length) {
                    result = result.replace(t[0],node[t[2]]);
                    result = this.getTemplate(node, result);
                }
                return result;
        };

        this.init = function(flag) {
            var mtype = that.attr("mtype");
            if (!mtype) {
            	that.find("option[value!=]").remove();
                if (!that.data("select2")) {
                	that.select2(extSettings.select2);
                }
            }

            if (typeof(settings) === "string") {
                return that.P2(settings, that, control, flag);

            } else {
                return that.P8(settings, that, control, flag);
            }
        };

        if (control) {
            $(control).on("change", function() {
                var value = $(this).val()||$(this).data("value");
                if ($(this).val() || extSettings.nullChange) {
                    if ($.isFunction(settings.getParam)) {
                        settings.param = settings.getParam();
                    }
                    that.init(1);
                } else if (!extSettings.nullChange && extSettings.nullRemove) {
                    $("option[value!=]", that).remove();
                    that.val(null).trigger("change");
                }

                that.data("select2").dropdown.trigger("button:reset");
            });
        }

        if (extSettings.init) {
            promise = that.init();
        } else {
            that.select2(extSettings.select2);
        }


        return promise || true;
    };

    $.fn.setDisabled = function(option) {
        var defaultOption = {
            text: true,
            select: true,
            combotree: true,
            radio: true,
            checkbox: true,
            ue: true,
            button: true
        };

        var setting = $.extend({}, defaultOption, option);

        var node;
        
        $(this).each(function(index, el) {
            if (setting.text) {
            	node = $(":text,textarea", this).not(".ui-pg-input,.pagebar :text");
            	if (typeof(setting.text)=="string") {
            		node = node.filter(setting.text);
            	}
                node.prop('readonly', true);
                
                node = $("[onclick*=WdatePicker]", this);
            	if (typeof(setting.text)=="string") {
            		node = node.filter(setting.text);
            	}
                node.off("click").removeAttr("onclick");
            }
            if (setting.select) {
            	node = $("select", this).not(".ui-pg-selbox,.pagebar select");
            	if (typeof(setting.select)=="string") {
            		node = node.filter(setting.select);
            	}
                node.prop('disabled', true);
            }
            if (setting.combotree) {
            	node = $(".combotree", this);
            	if (typeof(setting.combotree)=="string") {
            		node = node.filter(setting.combotree);
            	}
                node.css('background-color', '').parent().find('*').off();
            }
            if (setting.radio) {
            	node = $(":radio", this);
            	if (typeof(setting.radio)=="string") {
            		node = node.filter(setting.radio);
            	}
                node.prop('disabled', true);
            }
            if (setting.checkbox) {
            	node = $(":checkbox", this);
            	if (typeof(setting.button)=="string") {
            		node = node.filter(setting.checkbox);
            	}
                node.prop('disabled', true);
            }
            if (setting.button) {
            	node = $(":button,.btn", this);
            	if (typeof(setting.button)=="string") {
            		node = node.filter(setting.button);
            	}
            	node.prop("disabled", true).off();
            }
            
            if (setting.ue) {
            	node = $(".ue", this);
            	if (typeof(setting.ue)=="string") {
            		node = node.filter(setting.ue);
            	}
                var tue;
                node.each(function() {
                    tue = UE.getEditor(this.id);
                    tue.ready(function(){
                        tue.setDisabled("fullscreen");
                    });
                });
            }
            
        });
        return this;
    }
    
    $.fn.reset = function(){
    	var tue;
    	$("select", this).val("").trigger("change");
    	$(":input", this).val("").removeData("value");
    	$("textarea", this).html();
    	$(":radio,:checkbox", this).prop("checked",false);
    	$(".ue[id]", this).each(function(){
        	if (UE) {
        		tue = UE.getEditor(this.id||this.uid);
        		tue.ready(function(){
        			tue.setContent("");
        		});
        	}
    	});
    }
}));