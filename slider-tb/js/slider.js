var unit = {};
(function($) {
	unit.Slide = new function() {
		this.init = function() {
			autoSlider()
		};

		function autoSlider() {
			var li = $("ul>li"),
				timer;

			// 如果图片超过一张，显示数字
			if (li.length > 1) {
				setTimeout(function() {
					$(".j-nav-list").show();
				}, 1000)
			} else {
				$(".j-nav-list").hide();
			}
			// 显示左右箭头
			$("#J_slideShow").hover(function() {
				$(this).children("a").show();
				clearInterval(timer)
			}, function() {
				$(this).children("a").hide();
				clearInterval(timer);
				timer = setInterval(function() {
					auto(currIndex())
				}, 5000)
			}).trigger("mouseout");

			var sliderWidth = $("ul", "#J_slideShow").width(),
				navListLen = $(".j-nav-list>li"),
				sliderWrapUl = $(".j-slide-Wrap>ul"),
				sliderWrapLi = $(".j-slide-Wrap>ul>li"),
				sliderWrapLiLen = sliderWrapLi.length,
				firstImg = sliderWrapLi.first();
			sliderWrapLi.last().clone().prependTo(sliderWrapUl); // 复制最后一个li加在第一个
			sliderWrapUl.width(sliderWidth * (sliderWrapLiLen + 2) + 100).css("left", "-" + sliderWidth + "px");

			/*
			 * 滑过数字显示对应图片功能
			 */
			navListLen.hover(function() {
				var CurrPointer = navListLen.index(this);
				console.log(CurrPointer)
				$(this).addClass("curr").siblings().removeClass("curr");
				$("ul", ".j-slide-Wrap").stop(true).animate({
					left: "-" + (CurrPointer + 1) * sliderWidth + "px"
				}, 360);
			});
			/*
			 * 点击上一帧下一帧功能
			 */
			$(".j-next,.j-prev").click(function() {
				var CurrPointer = currIndex();
				if ($("ul", ".j-slide-Wrap").is(":animated")) {
					return
				}
				if ($(this).hasClass("j-prev")) {
					$("ul", ".j-slide-Wrap").animate({
						left: "+=" + sliderWidth + "px"
					}, 360, function() {
						if (CurrPointer > 0) {
							navListLen.eq(CurrPointer - 1).addClass("curr").siblings().removeClass("curr");
						} else {
							if (CurrPointer == 0) {
								$("ul", ".j-slide-Wrap").css("left", "-" + sliderWidth * (sliderWrapLiLen) + "px");
								navListLen.eq(-1).addClass("curr").siblings().removeClass("curr");
							}
						}
					})
				} else {
					auto(CurrPointer)
				}
				return false
			});
			/*
			 * 自动播放功能
			 */
			function auto(option) {
				if (option == sliderWrapLiLen - 1) {
					firstImg.addClass("curr").css("left", sliderWidth * sliderWrapLiLen)
				}
				$("ul", ".j-slide-Wrap").stop(true, true).animate({
					left: "-=" + sliderWidth + "px"
				}, 360, function() {
					if (option < sliderWrapLiLen - 1) {
						navListLen.eq(option + 1).addClass("curr").siblings().removeClass("curr");
					} else {
						if (option == sliderWrapLiLen - 1) {
							firstImg.removeClass("curr").css("left", -sliderWidth);
							$("ul", ".j-slide-Wrap").css("left", "-" + sliderWidth + "px");
							navListLen.eq(0).addClass("curr").siblings().removeClass("curr");
						}
					}
				})
			}

			function currIndex() {
				return $("ol>li").index($("ol>li.curr"))
			}
		}
	};
	unit.Slide.init();
})(jQuery);