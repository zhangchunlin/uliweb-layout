(function(factory) {
	"use strict";
	if ("function" === typeof define && define.amd) {
		define(["jquery"], factory);
	} else if ("object" === typeof exports) {
		factory(require("jquery"));
	} else {
		factory(jQuery);
	}
}(function($, undefined) {
	"use strict";

	$.fn.money = function() {
		this.each(function() {
			if ($(this).siblings('[standfor=#' + this.id + '],[standfor=' + this.name + ']').length > 0) {
				return;
			}
			var tagStand = $(
				'<input type="text" standfor=""/>'
			);
			var tag = $(this);
			var mx = tag.attr('max-int') || 15;

			tagStand.on('change', function() {
				changeTagValue($(this));
			});
			tagStand.on('input focus', function() {
				formatter(this, mx);
			});
			tagStand.on('blur keyup', function() {
				formatter(this, mx);
				changeTagValue($(this));
			});

			tag.css('display', 'none');
			var standFor = tag.attr('id') ? "#" + tag.attr('id') : tag.attr('name');
			tagStand.attr('standfor', standFor);
			tagStand.val(tag.val());

			tag.before(tagStand);
			setTimeout(function(){
				tagStand.blur().focus();
			}, 0);
		});
	}

	function cutInt(strInt, mx) {
		var str = parseInt(strInt).toString();
		if (str.length > mx) {
			str = str.substring(0, mx);
		}
		return str;
	}

	function formatter(o, mx, blur) {
		o.value = o.value.replace(/[^\d\.]/g, ''); //删除非数字的内容，防止乱输入非数字内容
		var str = o.value;
		// 如果为空，退出以免报错
		if (!(str)) {
			return;
		}

		// 开头输入.自动在前面补0
		if (str[0] == ".") {
			str = '0' + str;
		}

		// 判断有没有小数点
		if (Math.abs(str.length - str.replace(/\./g, '').length) > 0) {
			// 有小数点
			// 判断是1个还是大于1个
			var dotCount = Math.abs(str.length - str.replace(/\./g, '').length);
			// 如果小数点个数大于1个，只保留第二个小数点前的字符串
			if (dotCount > 1) {
				str = (str.split('.'))[0] + '.' + (str.split('.'))[1];
			}
			// 整数字符串长度检测和裁剪
			var strInt = cutInt(str, mx);
			var strFlt = (str.split('.'))[1];
			if (strFlt.length > 2) {
				strFlt = strFlt.substring(0, 2);
			}
			// 重新拼装字符串
			str = strInt + '.' + strFlt;
		} else {
			// 输入数为整数
			// 做整数长度检测和裁剪
			str = cutInt(str, mx);
		}

		o.value = str;

		if (blur) {
			if ((str.split('.'))[1]) { // 有小数点，且有小数
				var strInt = (str.split('.'))[0];
				var strFloatOnly = (str.split('.'))[1];
				o.value = strInt.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + "." + strFloatOnly;
			} else {
				o.value = parseInt(str).toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
			}
		}
	}

	function changeTagValue(st) {
		var standFor = st.attr('standfor')
		var value = st.val().replace(/[^\d.]/g, '');
		if (standFor[0] == "#") {
			$(standFor).val(value);
		} else {
			$('[name="' + standFor + '"]').val(value);
		}
	}
}))