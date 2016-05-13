'use strict';

var Main = function() {
	var $html = $('html'),
		$win = $(window),
		wrap = $('.app-aside'),
		MEDIAQUERY = {},
		app = $('#app');
	var assetRoot = "static/assets";

	MEDIAQUERY = {
		desktopXL: 1200,
		desktop: 992,
		tablet: 768,
		mobile: 480
	};
	$(".current-year").text((new Date).getFullYear());
	//sidebar
	var sidebarHandler = function() {
		var eventObject = isTouch() ? 'click' : 'mouseenter',
			elem = $('#sidebar'),
			ul = "",
			menuTitle, _this;

		elem.on('click', 'a', function(e) {

			_this = $(this);
			if (isSidebarClosed() && !isSmallDevice() && !_this.closest("ul").hasClass("sub-menu"))
				return;

			_this.closest("ul").find(".open").not(".active").children("ul").not(_this.next()).slideUp(200).parent('.open').removeClass("open");
			if (_this.next().is('ul') && _this.parent().toggleClass('open')) {

				_this.next().slideToggle(200, function() {
					$win.trigger("resize");

				});
				e.stopPropagation();
				e.preventDefault();
			} else {
				//_this.parent().addClass("active");

			}
		});
		elem.on(eventObject, 'a', function(e) {
			if (!isSidebarClosed() || isSmallDevice())
				return;
			_this = $(this);

			if (!_this.parent().hasClass('hover') && !_this.closest("ul").hasClass("sub-menu")) {
				wrapLeave();
				_this.parent().addClass('hover');
				menuTitle = _this.find(".item-inner").clone();
				if (_this.parent().hasClass('active')) {
					menuTitle.addClass("active");
				}
				var offset = $("#sidebar").position().top;
				var itemTop = isSidebarFixed() ? _this.parent().position().top + offset : (_this.parent().position().top);
				menuTitle.css({
					position: isSidebarFixed() ? 'fixed' : 'absolute',
					height: _this.outerHeight(),
					top: itemTop
				}).appendTo(wrap);
				if (_this.next().is('ul')) {
					ul = _this.next().clone(true);

					ul.appendTo(wrap).css({
						top: menuTitle.position().top + _this.outerHeight(),
						position: isSidebarFixed() ? 'fixed' : 'absolute'
					});
					if (_this.parent().position().top + _this.outerHeight() + offset + ul.height() > $win.height() && isSidebarFixed()) {
						ul.css('bottom', 0);
					} else {
						ul.css('bottom', 'auto');
					}

					wrap.children().first().scroll(function() {
						if (isSidebarFixed())
							wrapLeave();
					});

					setTimeout(function() {

						if (!wrap.is(':empty')) {
							$(document).on('click tap', wrapLeave);
						}
					}, 300);

				} else {
					ul = "";
					return;
				}

			}
		});
		wrap.on('mouseleave', function(e) {
			$(document).off('click tap', wrapLeave);
			$('.hover', wrap).removeClass('hover');
			$('> .item-inner', wrap).remove();
			$('> ul', wrap).remove();

		});
	};
	// navbar collapse
	var navbarHandler = function() {
		var navbar = $('.navbar-collapse > .nav');
		var pageHeight = $win.innerHeight() - $('header').outerHeight();
		var collapseButton = $('#menu-toggler');
		if (isSmallDevice()) {
			navbar.css({
				height: pageHeight
			});
		} else {
			navbar.css({
				height: 'auto'
			});
		};
		$(document).on("mousedown touchstart", toggleNavbar);

		function toggleNavbar(e) {
			if (navbar.has(e.target).length === 0 //checks if descendants of $box was clicked
				&& !navbar.is(e.target) //checks if the $box itself was clicked
				&& navbar.parent().hasClass("collapse in")) {
				collapseButton.trigger("click");
				//$(document).off("mousedown touchstart", toggleNavbar);
			}
		};
	};
	// tooltips handler
	var tooltipHandler = function() {
		$('[data-toggle="tooltip"]').tooltip();
	};
	// popovers handler
	var popoverHandler = function() {
		$('[data-toggle="popover"]').popover();
	};
	// perfect scrollbar
	var perfectScrollbarHandler = function() {
		var pScroll = $(".perfect-scrollbar");

		if (!isMobile() && pScroll.length) {
			pScroll.perfectScrollbar({
				suppressScrollX: true
			});
			pScroll.on("mousemove", function() {
				$(this).perfectScrollbar('update');
			});

		}
	};
	//toggle class
	var toggleClassOnElement = function() {
		var toggleAttribute = $('*[data-toggle-class]');
		toggleAttribute.each(function() {
			var _this = $(this);
			var toggleClass = _this.attr('data-toggle-class');
			var outsideElement;
			var toggleElement;
			typeof _this.attr('data-toggle-target') !== 'undefined' ? toggleElement = $(_this.attr('data-toggle-target')) : toggleElement = _this;
			_this.on("click", function(e) {

				if (_this.attr('data-toggle-type') !== 'undefined' && _this.attr('data-toggle-type') == "on") {
					toggleElement.addClass(toggleClass);
				} else if (_this.attr('data-toggle-type') !== 'undefined' && _this.attr('data-toggle-type') == "off") {
					toggleElement.removeClass(toggleClass);
				} else {
					toggleElement.toggleClass(toggleClass);
				}
				e.preventDefault();
				if (_this.attr('data-toggle-click-outside')) {

					outsideElement = $(_this.attr('data-toggle-click-outside'));
					$(document).on("mousedown touchstart", toggleOutside);

				};

				if ($.jgrid && toggleClass == 'app-sidebar-closed') {
					$(".ui-jqgrid-btable").jqGrid("setGridWidth", "100%");
				}

			});

			var toggleOutside = function(e) {
				if (outsideElement.has(e.target).length === 0 //checks if descendants of $box was clicked
					&& !outsideElement.is(e.target) //checks if the $box itself was clicked
					&& !toggleAttribute.is(e.target) && toggleElement.hasClass(toggleClass)) {

					toggleElement.removeClass(toggleClass);
					$(document).off("mousedown touchstart", toggleOutside);
				}
			};

		});
	};
	//switchery
	var switcheryHandler = function() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

		elems.forEach(function(html) {
			var switchery = new Switchery(html);
		});
	};
	//search form
	var searchHandler = function() {
		var elem = $('.search-form');
		var searchForm = elem.children('form');
		var formWrap = elem.parent();

		$(".s-open").on('click', function(e) {
			searchForm.prependTo(wrap);
			e.preventDefault();
			$(document).on("mousedown touchstart", closeForm);
		});
		$(".s-remove").on('click', function(e) {
			searchForm.appendTo(elem);
			e.preventDefault();
		});
		var closeForm = function(e) {
			if (!searchForm.is(e.target) && searchForm.has(e.target).length === 0) {
				$(".s-remove").trigger('click');
				$(document).off("mousedown touchstart", closeForm);
			}
		};
	};
	// settings
	var settingsHandler = function() {
		var clipSetting = new Object,
			appSetting = new Object;
		clipSetting = {
			fixedHeader: true,
			fixedSidebar: true,
			closedSidebar: false,
			fixedFooter: false,
			theme: 'theme-1'
		};
		if ($.cookie) {
			if ($.cookie("clip-setting")) {
				appSetting = jQuery.parseJSON($.cookie("clip-setting"));
			} else {
				appSetting = clipSetting;
			}
		};

		appSetting.fixedHeader ? app.addClass('app-navbar-fixed') : app.removeClass('app-navbar-fixed');
		appSetting.fixedSidebar ? app.addClass('app-sidebar-fixed') : app.removeClass('app-sidebar-fixed');
		//		appSetting.closedSidebar ? app.addClass('app-sidebar-closed') : app.removeClass('app-sidebar-closed');
		appSetting.fixedFooter ? app.addClass('app-footer-fixed') : app.removeClass('app-footer-fixed');
		app.hasClass("app-navbar-fixed") ? $('#fixed-header').prop('checked', true) : $('#fixed-header').prop('checked', false);
		app.hasClass("app-sidebar-fixed") ? $('#fixed-sidebar').prop('checked', true) : $('#fixed-sidebar').prop('checked', false);
		app.hasClass("app-sidebar-closed") ? $('#closed-sidebar').prop('checked', true) : $('#closed-sidebar').prop('checked', false);
		app.hasClass("app-footer-fixed") ? $('#fixed-footer').prop('checked', true) : $('#fixed-footer').prop('checked', false);
		//$('#skin_color').attr("href", assetRoot + "/css/themes/" + appSetting.theme + ".css");
		$('input[name="setting-theme"]').each(function() {
			$(this).val() == appSetting.theme ? $(this).prop('checked', true) : $(this).prop('checked', false);
		});
		//switchLogo(appSetting.theme);
		$("body").addClass("body-" + appSetting.theme);

		$('input[name="setting-theme"]').change(function() {
			var selectedTheme = $(this).val();
			$('#skin_color').attr("href", assetRoot + "/css/themes/" + selectedTheme + ".css");
			switchLogo(selectedTheme);
			appSetting.theme = selectedTheme;
			$.cookie("clip-setting", JSON.stringify(appSetting));

			for (var i = 1; i < 7; i++) {
				$("body").removeClass("body-theme-" + i);
			}
			$("body").addClass("body-" + selectedTheme);
		});

		$('#fixed-header').change(function() {
			$(this).is(":checked") ? app.addClass("app-navbar-fixed") : app.removeClass("app-navbar-fixed");
			appSetting.fixedHeader = $(this).is(":checked");
			$.cookie("clip-setting", JSON.stringify(appSetting));
		});
		$('#fixed-sidebar').change(function() {
			$(this).is(":checked") ? app.addClass("app-sidebar-fixed") : app.removeClass("app-sidebar-fixed");
			appSetting.fixedSidebar = $(this).is(":checked");
			$.cookie("clip-setting", JSON.stringify(appSetting));
		});
		$('#closed-sidebar').change(function() {
			$(this).is(":checked") ? app.addClass("app-sidebar-closed") : app.removeClass("app-sidebar-closed");
			appSetting.closedSidebar = $(this).is(":checked");
			$.cookie("clip-setting", JSON.stringify(appSetting));
		});
		$('#fixed-footer').change(function() {
			$(this).is(":checked") ? app.addClass("app-footer-fixed") : app.removeClass("app-footer-fixed");
			appSetting.fixedFooter = $(this).is(":checked");
			$.cookie("clip-setting", JSON.stringify(appSetting));
		});

		function switchLogo(theme) {
			switch (theme) {
				case "theme-2":
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo-red.png");
					break;
				case "theme-3":
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo-gw.png");
					break;
				case "theme-4":
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo-gb.png");
					break;
				case "theme-5":
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo-lightgreen.png");
					break;
				case "theme-6":
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo-lightblue.png");
					break;

				default:
					$(".navbar-brand img").attr("src", assetRoot + "/images/logo.png");
					break;
			};
		};

		function defaultSetting() {
			$('#fixed-header').prop('checked', true);
			$('#fixed-sidebar').prop('checked', true);
			$('#closed-sidebar').prop('checked', false);
			$('#fixed-footer').prop('checked', false);
			$('#skin_color').attr("href", assetRoot + "/css/themes/theme-1.css");
			$(".navbar-brand img").attr("src", assetRoot + "/images/logo.png");

		};
	};
	// function to allow a button or a link to open a tab
	var showTabHandler = function(e) {
		if ($(".show-tab").length) {
			$('.show-tab').on('click', function(e) {
				e.preventDefault();
				var tabToShow = $(this).attr("href");
				if ($(tabToShow).length) {
					$('a[href="' + tabToShow + '"]').tab('show');
				}
			});
		};
	};
	// function to enable panel scroll with perfectScrollbar
	var panelScrollHandler = function() {
		var panelScroll = $(".panel-scroll");
		if (panelScroll.length && !isMobile()) {
			panelScroll.perfectScrollbar({
				suppressScrollX: true
			});
		}
	};
	//function to activate the panel tools
	var panelToolsHandler = function() {

		// panel close
		$('body').on('click', '.panel-close', function(e) {
			var panel = $(this).closest('.panel');

			destroyPanel();

			function destroyPanel() {
				var col = panel.parent();
				panel.fadeOut(300, function() {
					$(this).remove();
					if (col.is('[class*="col-"]') && col.children('*').length === 0) {
						col.remove();
					}
				});
			}
			e.preventDefault();
		});
		// panel refresh
		$('body').on('click', '.panel-refresh', function(e) {
			var $this = $(this),
				csspinnerClass = 'csspinner',
				panel = $this.parents('.panel').eq(0),
				spinner = $this.data('spinner') || "load1";
			panel.addClass(csspinnerClass + ' ' + spinner);

			window.setTimeout(function() {
				panel.removeClass(csspinnerClass);
			}, 1000);
			e.preventDefault();
		});
		// panel collapse
		$('body').on('click', '.panel-collapse', function(e) {
			e.preventDefault();
			var el = $(this);
			var panel = jQuery(this).closest(".panel");
			var bodyPanel = panel.children(".panel-body");
			bodyPanel.slideToggle(200, function() {
				panel.toggleClass("collapses");
			});

		});

	};
	// function to activate the Go-Top button
	var goTopHandler = function(e) {
		$('.go-top').on('click', function(e) {
			$("html, body").animate({
				scrollTop: 0
			}, "slow");
			e.preventDefault();
		});
	};
	var customSelectHandler = function() {
		/*		[].slice.call(document.querySelectorAll('select.cs-select')).forEach(function(el) {
					new SelectFx(el);
				});*/
		$("select").on("change", function() {
			$(this).trigger("blur")
		});
		$("select.cs-select").on("click", function() {
			$(this).siblings("i").toggleClass("ti-angle-down ti-angle-up");
		}).on("blur", function() {
			$(this).siblings("i").removeClass("ti-angle-up").addClass("ti-angle-down");
		});
	};
	// Window Resize Function
	var resizeHandler = function(func, threshold, execAsap) {
		$(window).resize(function() {
			navbarHandler();
			if ($.jgrid) {
				$(".ui-jqgrid-btable:visible").jqGrid("setGridWidth", "100%");
			}
		});
	};

	var placeholderHandler = (function() {
		//检测
		var _check = function() {
			return 'placeholder' in document.createElement('input');
		};
		//修复
		var fix = function() {
			jQuery(':input[placeholder]').each(function(index, element) {
				if ($(this).prop("readonly") || $(this).prop("disabled")) {
					return;
				}
				var self = $(this),
					txt = self.attr('placeholder');
				self.css("background-color", "transparent");
				self.wrap($('<div></div>').css({
					position: 'relative',
					zoom: '1',
					border: 'none',
					background: 'none',
					padding: 'none',
					margin: 'none'
				}));
				var pos = self.position(),
					h = self.outerHeight(true),
					paddingleft = self.css('padding-left');
				var holder = $('<span></span>').text(txt).css({
					position: 'absolute',
					left: pos.left,
					top: pos.top + 2,
					height: h,
					lienHeight: h,
					paddingLeft: paddingleft,
					color: '#BCBCBC'
				}).appendTo(self.parent());
				self.focusin(function(e) {
					holder.hide();
				}).focusout(function(e) {
					if (!self.val()) {
						holder.show();
					}else {
						holder.hide();
					}
				});
				holder.click(function(e) {
					holder.hide();
					self.focus();
				});
			});
		};

		return function() {
			if (!_check()) {
				fix();
			}
		}
	})();

	function wrapLeave() {
		wrap.trigger('mouseleave');
	}

	function isTouch() {
		return $html.hasClass('touch');
	}

	function isSmallDevice() {
		return $win.width() < MEDIAQUERY.desktop;
	}

	function isSidebarClosed() {
		return $('.app-sidebar-closed').length;
	}

	function isSidebarFixed() {
		return $('.app-sidebar-fixed').length;
	}

	function isMobile() {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		};
	}


	function collapseHandler() {
		$(".mao" ).append("<li class='pull-right' data-colse><a style='padding: 10px 5px;'>全部折叠<a></li><li class='on pull-right' data-open><a style='padding: 10px 5px;'>全部展开</a></li>");
		$(".mao [data-colse]").click(function(){
			$(".mao [data-open]").removeClass('on');
			$(this).addClass('on');
			$(".ti-minus.collapse-off:visible").click();
		});
		$(".mao [data-open]").click(function(){
			$(".mao [data-colse]").removeClass('on');
			$(this).addClass('on');
			$(".ti-plus.collapse-on:visible").click();
		});
	}

	function addInputTypeMoney(){
		// 整数字符串检测和裁剪
		function cutInt(strInt, mx){
			var str = parseInt(strInt).toString();
			if (str.length > mx){
				str = str.substring(0, mx);
			}
			return str;
		}
		function formatter(o, mx, blur) {
			o.value = o.value.replace(/[^\d\.]/g, '');//删除非数字的内容，防止乱输入非数字内容
			var str = o.value;
			// 如果为空，退出以免报错
			if (!(str)){
				return;
			}

			// 开头输入.自动在前面补0
			if (str[0] == ".") {
				str = '0' + str;
			}


			// 判断有没有小数点
			if (Math.abs(str.length - str.replace(/\./g, '').length) > 0 ){
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

			if (blur){
				if ((str.split('.'))[1]){	// 有小数点，且有小数
					var strInt = (str.split('.'))[0];
					var strFloatOnly = (str.split('.'))[1];
		        	o.value = strInt.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,') + "." + strFloatOnly;
				} else {
					o.value = parseInt(str).toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,');
				}
			}
	    }

		function changeTagValue(st){
			var standFor = st.attr('standfor')
			var value = st.val().replace(/[^\d.]/g, '');
			if (standFor[0] == "#"){
				$(standFor).val(value);
			} else {
				$('[name="' + standFor + '"]').val(value);
			}
		};

		function changeDom(t, dynamic){
			var tag = $(t);
			var mx = tag.attr('max-int') || 15;
			var tagStand = $(
				'<input type="text" standfor=""/>'
			);

			tagStand.prop('class', tag.prop('class'));
			tagStand.prop('readonly', tag.prop('readonly'));
			tagStand.prop('disabled', tag.prop('disabled'));
			if (!tag.prop("readonly") && !tag.prop("disabled")) {
				tagStand.on('focus input', function() {
					formatter(this, mx);
				});
				tagStand.on('keyup', function() {
					formatter(this, mx);
					changeTagValue($(this));
				});
			}
			tagStand.on('change', function(){
				changeTagValue($(this));
			});
			
			tagStand.on('blur', function(){
				formatter(this, mx, true);
				changeTagValue($(this));
			});

			tag.on('blur focusout', function(){
				tagStand.val(tag.val()).trigger("blur");
			});

			tag.css('display', 'none');
			var standFor = tag.attr('id') ? "#" + tag.attr('id') : tag.attr('name');
			tagStand.attr('standfor', standFor);
			tagStand.val(tag.val()).trigger("blur");

			tag.before(tagStand);

			// 如果是动态加上的输入框，需要改变下焦点
			if (dynamic){
				setTimeout(function(){
					tagStand.focus();
				}, 0);
			}
		}

		// 初始化type=money，绑定事件
		function init(arrTag){
			$.each(arrTag, function(){
				changeDom(this);
			});
		}

		// 初始化时将已有type=money隐藏，并绑定事件，
		// 这样后边onFocus时不可能会出现已经处理过的input
		// 所以后边不需要判断是否已经处理过
		var arrTag = $('input[type="money"]');
		init(arrTag);

		$('body').delegate('input[type="money"]', 'focus', function(){
			changeDom(this, true);
		})

	};

	return {
		init: function() {
			settingsHandler();
			toggleClassOnElement();
			sidebarHandler();
			navbarHandler();
			searchHandler();
			tooltipHandler();
			popoverHandler();
			perfectScrollbarHandler();
			//switcheryHandler();
			resizeHandler();
			showTabHandler();
			panelScrollHandler();
			panelToolsHandler();
			customSelectHandler();
			goTopHandler();
			placeholderHandler();
			collapseHandler();
			addInputTypeMoney();
		}
	};
}();