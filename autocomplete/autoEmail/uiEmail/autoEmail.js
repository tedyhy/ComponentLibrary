/**
 * AutoEmail
 * @authors yaohya@yonyou.com
 * @date    2015-07-16 14:55:11
 * @version 1.0.0
 * @description 
 * 		new AutoEmail({
			input: "#email", // input输入框
			layout: $('#email').parent(), // 定位下拉参考层
			select: function() { // 选择后的回调
				this.$input.blur();
			}
		})
 */
;
(function(global, $) {
	var ac = function(opts) {
		opts = opts || {};
		this.opts = $.extend(ac.defaults, opts);
		if (!opts.input || !$(opts.input).length) return;
		this.init();
	};

	ac.prototype = {
		init: function() {
			var opts = this.opts,
				$input = this.$input = (opts.input && typeof opts.input === 'string') ? $(opts.input) : opts.input,
				$wrap = this.$wrap = $(opts.wrap).appendTo('body'),
				$list = this.$list = $wrap.find('.ui-autocomplete-list'),
				$layout = this.$layout = (opts.layout && typeof opts.layout === 'string') ? $(opts.layout) : opts.layout;
			this.bindEvents();
			this.timer = null;
		},
		render: function(v) {
			var reg = /^[^@\s]+@[^@\s]*$/,
				emails = [];
			if (reg.test(v)) {
				emails = this.renderData(v);
				if (emails.length) {
					this.showList();
					this.renderList(v, emails);
				} else this.hideList();
			} else this.hideList();
		},
		renderData: function(v) {
			var emails = this.opts.emails,
				splits = v.split('@'),
				domain = splits[1],
				reg = new RegExp('^' + domain + '\\S*$'),
				ret = [];
			ret = $.map(emails, function(email, arr) {
				if (reg.test(email) && domain !== email) return email;
			});
			return ret;
		},
		renderList: function(v, emails) {
			var splits = v.split('@'),
				html = '';
			$.each(emails, function(i, email) {
				html += '<li><a href="javascript:;">' + splits[0] + '@' + email + '</a></li>'
			});
			this.$list.get(0).innerHTML = html;
		},
		arrowAction: function(kc, e) {
			var $cur = this.$list.find('li.hover');
			// up
			if (kc === 38) {
				this.arrowUp($cur);
				// down
			} else if (kc === 40) {
				this.arrowDown($cur);
				// enter
			} else if (kc === 13) {
				this.enter($cur);
			};
		},
		position: function() {
			var $input = this.opts.layout ? this.$layout : this.$input,
				$wrap = this.$wrap,
				offset = $input.offset(),
				input_w = $input.outerWidth(),
				input_h = $input.outerHeight(true);
			$wrap.css({
				top: offset.top + input_h,
				left: offset.left,
				minWidth: input_w + 'px'
			});
		},
		bindEvents: function() {
			var self = this,
				opts = this.opts;
			// input
			this.$input.focus(function() {
				self.position();
				self.render(this.value);
				return false;
			}).blur(function() {
				this.value = $.trim(this.value);
			}).click(function() {
				return false;
			}).keyup(function(e) {
				var kc = e.keyCode;
				if (kc !== 38 && kc !== 40 && kc !== 13) {
					self.render(this.value);
				};
			}).keydown(function(e) {
				var kc = e.keyCode;
				if (kc === 38 || kc === 40 || kc === 13) {
					self.arrowAction(kc, e);
				};
			});
			// list li
			this.$list.on('mouseenter', 'li', function() {
				self.selectThisOne($(this));
			}).on('mouseleave', 'li', function() {
				$(this).removeClass('hover');
			});
			// list a
			this.$list.on('click', 'a', function() {
				self.$input.val(this.innerHTML);
				self.hideList();
				opts.select.call(self);
			});
			// document
			$(document).on('click.autoc', function() {
				self.hideList();
			});
			// resize
			$(window).on('resize.autoc', function() {
				self.position();
			});
		},
		arrowUp: function($cur) {
			var $prev;
			if ($cur.length) $prev = $cur.prev();
			if (!$prev || !$prev.length) $prev = this.$list.find('li:last');
			this.selectThisOne($prev);
			this.setCursorEnd();
		},
		arrowDown: function($cur) {
			var $next;
			if ($cur.length) $next = $cur.next();
			if (!$next || !$next.length) $next = this.$list.find('li:first');
			this.selectThisOne($next);
		},
		enter: function($cur) {
			if (!$cur.length) return;
			this.$input.val($cur.find('a').html());
			this.hideList();
		},
		setCursorEnd: function() {
			var input = this.$input.get(0),
				pos = 0;
			if (!this.$wrap.is(':visible')) return;
			if (input.setSelectionRange) { // 标准浏览器
				pos = input.value.length;
				clearTimeout(this.timer);
				this.timer = setTimeout(function() {
					input.setSelectionRange(pos, pos);
				}, 0);
			};
		},
		selectThisOne: function($ele) {
			$ele.addClass('hover').siblings().removeClass('hover');
		},
		showList: function() {
			this.position();
			this.$wrap.show();
		},
		hideList: function() {
			this.$wrap.hide();
		}
	};

	ac.defaults = {
		emails: ['sina.com', '163.com', 'qq.com', '126.com', 'vip.sina.com', 'sina.cn', 'hotmail.com', 'gmail.com', 'sohu.com', '139.com', 'wo.com.cn', '189.cn', '21cn.com', 'yahoo.cn', 'yahoo.com.cn'],
		wrap: '<div class="ui-autocomplete-wrap"><ul><li class="note">请选择邮箱类型</li></ul><ul class="ui-autocomplete-list"></ul></div>',
		select: function() {}
	};

	global.AutoEmail = ac;
})(window, window.jQuery);