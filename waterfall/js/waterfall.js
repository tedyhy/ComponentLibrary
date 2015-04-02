/**
 * 
 * @authors flyer (flyer153@gmail.com)
 * @date    2015-01-22 18:36:37
 * @version $Id$
 */
/*(function(){
	var waterFall = function(conf) {

	};
	waterFall.prototype.prepend = function(){

	}
})();
*/

$(document).ready(function(){
	var click_counter = 0;
	$(window).bind("scroll",function(){
		if( $(document).scrollTop() + $(window).height() > $(document).height() - 100 ) {
				$("#paginatios a").addClass("loading").text("正在给力加载中...");
				
				if ( $("#paginatios").hasClass("show") ){
					click_counter++;
					if(click_counter <= 3){
						$("#paginatios").removeClass("show");
						$.ajax({
							type: "POST",
							url: $("#paginatios a").attr("href"),
							success: function(data){
								result = $(data).find("#ajaxContent .ft");
								nextHref = $(data).find("#paginatios a").attr("href");
								// 渐显新内容
								$("#ajaxContent").append(result.fadeIn(800));
								$("#paginatios a").removeClass("loading").text("加载下一页...");
								if ( nextHref != undefined ) {
									$("#paginatios a").attr("href", nextHref);
								} else {
								// 若没有链接，即为最后一页，则移除导航
									$("#paginatios").remove();
								}
								window.mTipTimer = setTimeout("$('#paginatios').addClass('show')",1000);
							}
						});
						return false;
					}else{
						window.location.href=$("#paginatios a").attr("href");
					}
				}
			
			}
	});
	


	
//end
});