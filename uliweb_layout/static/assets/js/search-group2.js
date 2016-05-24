(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'layer'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('layer'));
    } else {
        factory(jQuery, layer);
    }
}(function($, layer, undefined) {
    var defaultOptions = {
        num: 3,
        messText: "筛选内容不能为空",
        // data: [{
        //     id: '',
        //     text: '',
        //     type: '',
        //     value: [{text:'',value:''}]
        // }],
        submit: null
    };

    var labelGroupStr = '<div class="row">' +
        '<h5 class="panel-title col-md-1 padding-top-10 padding-bottom-10 padding-left-0 padding-right-0" style="margin-left:-8px;">' +
        '<strong>已选择</strong>' +
        '</h5>' +
        '<div class="row col-md-11">' +
        '<div class="label-group col-md-11"><div class="select-choice-group"></div></div>' +
        '<div class="label-button pull-right col-md-1"><input type="button" value="全部撤销" class="clear-button btn btn-primary btn-squared btn-sm" style="display: none;">' +
        '</div>' +
        '</div>' +
        '</div>';

    var listNodeStr = '<div class="select-group select-college">' +
        '<div class="select-label col-md-1"></div>' +
        '<div class="text-group col-md-9">' +
        '<div class="text-list"><img src="../static/assets/images/loading-2.gif"></div>' +
        '<div class="checkbox-list" style="display:none;"><button type="button" class="btn btn-default btn-xs check-all">全选</button>&nbsp;<button type="button" class="btn btn-primary select-button btn-xs">确定</button></div>' +
        '</div>' +
        '<div class="col-md-2 pull-right">' +
        '<div class="more-select col-md-6" style="visibility: hidden;">' +
        '<span class="btn btn-xs btn-default">更多 <i class="glyphicon glyphicon-chevron-down"></i></span>' +
        '</div>' +
        '<div class="muti-select col-md-6">' +
        '<span class="btn btn-xs btn-default"><i class="glyphicon glyphicon-plus"></i> 多选</span>' +
        '</div>' +
        '</div>' +
        '</div>';

    var inputNodeStr = '<div class="select-group">' +
        '<div class="select-label col-md-1"></div>' +
        '<div class="text-group col-md-4">' +
        '<div class="input-group input-append">' +
        '<input type="text" class="form-control">' +
        '<span class="input-group-btn">' +
        '<button type="button" class="select-button btn btn-primary">确定</button>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>';

    var dateNodeStr = '<div class="select-group">' +
        '<div class="select-label col-md-1"></div>' +
        '<div class="text-group col-md-4">' +
        '<div class="input-group input-append">' +
        '<input type="text" class="form-control" onclick="WdatePicker()">' +
        '<span class="input-group-btn">' +
        '<button type="button" class="select-button btn btn-primary">确定</button>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>';

    var dateNodeStr2 = '<div class="select-group">' +
        '<div class="select-label col-md-1"></div>' +
        '<div class="text-group col-md-4">' +
        '<div class="input-group input-append">' +
        '<input type="text" class="form-control up">' +
        '<div class="input-group-addon">-</div>' +
        '<input type="text" class="form-control down">' +
        '<span class="input-group-btn">' +
        '<button type="button" class="select-button btn btn-primary"">确定</button>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>';

    var labelStr = '<div class="btn btn-o btn-default btn-squared btn-sm margin-right-15 select-choice">' +
        '<span class="label-text">' +
        '</span>' +
        '<span class="select-remove eff">×</span></div>';

    var moreButton = '<div class="s-more-group col-md-12 s-more s-more-line">' +
        '<div class="more-text col-md-12 text-center">' +
        '<span class="sm-wrap hide-text col-md-2" style="display: none;">收起<i class="ti-angle-up"></i></span>' +
        '<span class="sm-wrap show-text col-md-2">更多<i class="ti-angle-down"></i></span>' +
        '</div>' +
        '</div>';

    $.fn.searchGroup = function(options) {
        //没有选择对象时返回false
        if (!this.length) {
            return false;
        }

        var is_method = (typeof options === 'string'),
            args = Array.prototype.slice.call(arguments, 1);

        //获取实例和方法
        var instance = this.data('searchGroup'),
            method = is_method && instance ? instance[options] : null;

        //返回方法操作
        if (method) {
            return method.apply(instance, args);
        }

        //如果没有参数返回实例
        if (options === undefined) {
            return instance;
        }

        if (instance) instance.destroy();
        instance = new SearchGroup(this, options);
        this.data('searchGroup', instance);

        return this;
    };

    function SearchGroup(dom, options) {
        var that = this;

        this.$this = dom;
        dom.addClass('select-group-panel');
        this.$setting = $.extend(true, {}, defaultOptions, this.$this.data(), options);
        this.$param = {};
        if ($.isNumeric(this.$setting.num)) {
            if ((this.$setting.num = parseInt(this.$setting.num)) < 1) {
                this.$setting.num = 2;
            } else {
                this.$setting.num = this.$setting.num - 1;
            }
        } else {
            this.$setting.num = 2;
        }
        this.init();

        //注册提交事件
        this.$this.on('submit', function() {
            that.checkMore();
            if (that.to) clearTimeout(that.to);

            that.to = setTimeout(function() {
                that.$param = {};
                $('.select-group.selected', dom).each(function() {
                    that.$param[this.id] = this.value;
                });

                if ($.isFunction(that.$setting.submit)) {
                    that.$setting.submit(that.$param);
                }
                that.setUrl();
            }, 50);
        });
    }

    SearchGroup.prototype.init = function() {
        var itemList = [],
            nodeData = this.$setting.data,
            that = this;

        //创建标签容器
        this.$this.html(labelGroupStr);
        this.$label = $('.select-choice-group', this.$this);

        //注册清空条件事件
        $('.clear-button', this.$this).on('click', function() {
            $('.select-remove', that.$label).trigger('click');
        });

        //创建检索元素
        if ($.isArray(nodeData)) {
            for (var i = 0, l = nodeData.length; i < l; i++) {
                itemList.push(this.createItem(nodeData[i]));
            }
        }
        this.$this.append(itemList);

        //创建隐藏及更多按钮，并注册事件
        this.$moreNode = $(moreButton);
        this.$this.append(this.$moreNode);
        $('.show-text', this.$moreNode).on('click', function() {
            $('.select-group:not(.selected):hidden', that.$this).show();
            $(this).hide();
            $('.hide-text', that.$moreNode).show();
            that.$full = true;
        });
        $('.hide-text', this.$moreNode).on('click', function() {
            $('.select-group:visible:gt(' + that.$setting.num + ')', that.$this).hide();
            $(this).hide();
            $('.show-text', that.$moreNode).show();
            that.$full = false;
        });

        this.getUrl();

        //检查设置显示的检索元素个数处理更多按钮
        this.checkMore();
    };

    /**
     * 创建条件元素
     * @param  {json} option [description]
     * @param  {$.fn} node   [description]
     */
    SearchGroup.prototype.createItem = function(option, node) {
        var that = this,
            nodeList = [],
            checkboxList = [],
            n, show;
        if (node) {
            option = $.extend({}, node.data('option'), option);
        }
        if ($.isEmptyObject(option)) {
            return;
        }
        //根据类型创建检索元素
        switch (option.type) {
            case 'list':
                node = node ? node : $(listNodeStr);
                if ($.isFunction(option.value)) {
                    option.value(function(data) {
                        option.value = data;
                        that.createItem(option, node);
                    });
                } else if ($.isArray(option.value)) {
                    for (var i = 0, l = option.value.length; i < l; i++) {
                        n = option.value[i];
                        nodeList.push(that.createElement(n, node));
                        checkboxList.push($('<div class="checkbox check-primary check-sm checkbox-inline">' +
                            '<input type="checkbox" id="' + option.id + '_' + i + '" value="' + n.value + '">' +
                            '<label for="' + option.id + '_' + i + '">' + n.text + '</label>' +
                            '</div>'));
                    }
                    $('.text-list', node).html(nodeList);

                    //添加checkbox
                    $('.checkbox-list', node).prepend(checkboxList);

                    //如果时IE8则不添加次样式
                    if (!isIe8()) {
                        $('.checkbox-list .checkbox', node).addClass('clip-check');
                    }

                    if (typeof(node[0].value) === 'string' && node[0].value) {
                        var textList = [],
                            valueList = node[0].value.split(','),
                            tmpStr;

                        for (var j = 0, len = valueList.length; j < len; j++) {
                            tmpStr = $('.text-list .select-text[value=' + valueList[j] + ']', node).text();
                            if (tmpStr) textList.push(tmpStr);
                        }

                        node[0].text = textList.join(',');
                        that.addLabel(node[0]);
                    }
                }

                //如果为隐藏元素先显示之后再隐藏(隐藏时无法判断元素的高度)
                if ($('.text-list label', node).length > 0) {
                    show = node.is(":visible");
                    if (!show) node.show();
                    if ($('.text-list', node).offset().top !== $('.text-list label:last', node).offset().top) {
                        $('.more-select', node).css('visibility', '').on('click', function() {
                            node.toggleClass('select-expand');
                            $('i', this).toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
                        });
                    }
                    if (!show) node.hide();
                }

                if (node[0].id) {
                    return node;
                }

                //切换元素为多选
                $('.muti-select', node).on('click', function() {
                    node.toggleClass('muti-select');
                    that.changeToCheckbox(node);
                    $('i', this).toggleClass('glyphicon-plus glyphicon-minus');
                });

                //注册多选时的全选操作
                $('.check-all', node).toggler(function() {
                    $('.checkbox-list :checkbox', node).prop('checked', true);
                }, function() {
                    $('.checkbox-list :checkbox', node).prop('checked', false);
                });
                break;
            case 'input':
                node = node ? node : $(inputNodeStr);
                break;
            case 'date':
                node = node ? node : $(dateNodeStr);
                break;
            case 'date2':
                node = node ? node : $(dateNodeStr2);

                //设置起止时间限制
                $('input.up', node).prop('id', option.id + '_1').click(function() {
                    WdatePicker({
                        el: this,
                        maxDate: "#F{$dp.$D('" + option.id + "_2')}"
                    });
                });
                $('input.down', node).prop('id', option.id + '_2').click(function() {
                    WdatePicker({
                        el: this,
                        minDate: "#F{$dp.$D('" + option.id + "_1')}"
                    });
                });
                break;
        }
        $('.select-label', node).text(option.label + '：');
        //注册点击事件
        $('button.select-button', node).on('click', function() {
            var value = [],
                text = [];
            $('input:not(:checkbox),:checkbox:checked', node).each(function() {
                if (this.value || option.type === 'date2') {
                    text.push($(this).siblings('label').text() || this.value);
                    value.push(this.value);
                }
            });
            if (value.length === 0) {
                if (that.$setting.messText && window.layer) {
                    layer.msg(that.$setting.messText);
                }
                return;
            }
            node[0].text = text.join(',');
            node[0].value = value.join(',');

            //特殊处理date2显示
            if (option.type === 'date2') {
                if (!text[0]) {
                    node[0].text = text.join('') + '以后';
                } else if (!text[1]) {
                    node[0].text = text.join('') + '开始';
                } else {
                    node[0].text = text.join('至');
                }
            }
            node.addClass('selected').hide();

            //添加标签
            that.addLabel(node[0]);
            //触发提交事件
            that.$this.triggerHandler('submit');
        });

        node[0].id = option.id;
        node[0].label = option.label;
        node[0].type = option.type;
        node.data('option', option);
        return node;
    };

    /**
     * 创建标签选择项
     * @param  {json} option [description]
     * @param  {$.fn} panel  [description]
     */
    SearchGroup.prototype.createElement = function(option, panel) {
        var node = $('<label class="select-text select-button" value="' + option.value + '">' + option.text + '</label>'),
            that = this;

        //注册标签选择事件
        node.on('click', function() {
            panel[0].text = option.text;
            panel[0].value = option.value;
            panel.addClass('selected').hide();
            that.addLabel(panel[0]);
            that.$this.triggerHandler('submit');
        });

        return node;
    };

    /**
     * 创建显示标签
     * @param {dom} element [description]
     */
    SearchGroup.prototype.addLabel = function(element) {
        var node = $(labelStr),
            str = element.text,
            that = this;

        var button = $('.clear-button', this.$this).show();

        //当显示内容多长进行截取
        if (str.length > 21) {
            str = str.substr(0, 18) + '...';
        }

        $('.label-text', node).html(element.label + '：' + str);

        //注册删除条件事件
        $('.select-remove', node).on('click', function() {
            element.text = element.value = '';
            $('input:not(:checkbox)', element).val('');
            $(':checkbox', element).prop('checked', false);
            $(element).removeClass('selected').show();
            node.remove();
            if ($('.select-choice', that.$htis).length === 0) {
                button.hide();
            }
            that.$this.triggerHandler('submit');
        });

        this.$label.append(node);
    };

    /**
     * 检查并操作显示检索元素和更多按钮
     * @return {[type]} [description]
     */
    SearchGroup.prototype.checkMore = function() {
        if (this.$moreNode) {
            if ($('.select-group:not(.selected)', this.$this).length > this.$setting.num + 1) {
                this.$moreNode.show();
            } else {
                this.$moreNode.hide();
            }

            if (!this.$full) {
                $('.select-group:not(.selected):lt(' + (this.$setting.num + 1) + ')', this.$this).show();
                $('.select-group:not(.selected):gt(' + this.$setting.num + ')', this.$this).hide();
            }
        }
    };

    SearchGroup.prototype.changeToCheckbox = function(node) {
        $('.text-list, .checkbox-list', node).toggle();
        $('.checkbox-list :checkbox', node).prop('checked', false);
    };

    SearchGroup.prototype.getUrl = function() {
        var node, textList, valueList, tmpStr;
        if (!window.QueryString) {
            return;
        }

        var urlParams = new window.QueryString().load().urlParams;

        for (var item in urlParams) {
            if (urlParams[item] !== '') {
                node = $('.select-group#' + item, this.$this);
                if (node.length > 0) {
                    this.$param[item] = node[0].value = urlParams[item];
                    node.addClass('selected').hide();

                    switch (node[0].type) {
                        case 'date2':
                            textList = node[0].value.split(',');
                            if (!textList[0]) {
                                node[0].text = textList.join('') + '以后';
                            } else if (!textList[1]) {
                                node[0].text = textList.join('') + '开始';
                            } else {
                                node[0].text = textList.join('至');
                            }
                            break;
                        case 'input':
                        case 'date':
                            node[0].text = node[0].value;
                            break;
                        case 'list':
                            textList = [];
                            valueList = node[0].value.split(',');
                            for (var j = 0, len = valueList.length; j < len; j++) {
                                tmpStr = $('.text-list .select-text[value=' + valueList[j] + ']', node).text();
                                if (tmpStr) textList.push(tmpStr);
                            }
                            node[0].text = textList.join(',');
                    }

                    if (node[0].text && node[0].value) {
                        this.addLabel(node[0]);
                    }
                }
            }
        }

        if ($.isEmptyObject(this.$param)) {
            return;
        }
        this.$this.triggerHandler('submit');
    };

    /**
     *
     * 根据条件修改Url参数(是能在支持html5的浏览器中使用)
     */
    $.setUrl = SearchGroup.prototype.setUrl = function setUrl() {
        var history = window.history,
            title = document.title,
            location = window.location;
        return function(obj) {
            if (!window.QueryString) {
                return;
            }
            var url = location.origin + location.pathname,
                urlParams = new window.QueryString().load().urlParams;

            if (history.pushState) {
                if ($.isPlainObject(obj)) {
                    $.extend(urlParams, obj);
                } else if ($.isPlainObject(this.$param)) {
                    $('.select-group', this.$this).each(function() {
                        delete urlParams[this.id];
                    });
                    $.extend(urlParams, this.$param);
                } else {
                    return;
                }

                url += '?' + $.param(urlParams);
                history.pushState({}, title, url);
            }
        };
    }();

    function isIe() {
        return ('ActiveXObject' in window);
    }

    function isIe8() {
        return isIe() && !-[1, ] && document.documentMode;
    }
}));