/***********************************************/
/*
/*
/*		A3mobile
/*
/*		version 1.0.0
/*		https://code.a3mobile.co/A3mobile-events-1.0.0.js
/*
/*		Copyright 2016
/*		https://a3mobile.co
/*
/*		require jQuery.js
/*
/*
/***********************************************/

function prevWindowUrl(){
	return $.data(window,"prevWindowUrl");
};
function currentWindowUrl(){
	return $.data(window,"currentWindowUrl");
};
(function(){
	$.data(window,"prevWindowUrl",window.location.href);
	$.data(window,"currentWindowUrl",window.location.href);
	setInterval(function(){
		if(currentWindowUrl()!==window.location.href){
			$.data(window,"prevWindowUrl",currentWindowUrl());
			$.data(window,"currentWindowUrl",window.location.href);
			$.event.dispatch.call(window,"urlChange");
		}
	},100);
	$.event.special.orientationEvents={
		setup:function(){
			$(window).on('orientationchange',function(event){
				triggercustomevent(window,"orientationChange",event);
				switch(window.orientation){
					case 0:
						triggercustomevent(window,"portraitNormal",event);
						triggercustomevent(window,"portrait",event);
					break;
					case 90:
						triggercustomevent(window,"landscapeLeft",event);
						triggercustomevent(window,"Landscape",event);
					break;
					case -90:
						triggercustomevent(window,"landscapeRight",event);
						triggercustomevent(window,"landscape",event);
					break;
					case 180:
						triggercustomevent(window,"portraitUpDown",event);
						triggercustomevent(window,"portrait",event);
					break;
				}
			});
		}
	};
	$.event.special.tapEvents={
		setup:function(){
			var touch_object,
			tap_time,
			this_jq=$(this),
			this_object=this,
			tap_intval,
			touch_x=[],
			touch_y=[],
			is_canceled=false,
			is_taphold=false;
			this_jq.bind("touchstart",function(event){
				touch_object=event.target;
				var touches=event.originalEvent.changedTouches,
				current_time;
				if(touches.length===2){
					touch_x[0]=touches[0].pageX;
					touch_y[0]=touches[0].pageY;
					touch_x[1]=touches[1].pageX;
					touch_y[1]=touches[1].pageY;
				}else{
					touch_x[0]=touches[0].pageX;
					touch_y[0]=touches[0].pageY;
				}
				tap_time=Date.now();
				is_canceled=false;
				
				tap_intval=setInterval(function(){
					current_time=Date.now();
					if(current_time>tap_time+750 && !is_canceled && touches.length===1){
						is_taphold=true;
						clearInterval(tap_intval);
						triggercustomevent(this_object,"tapHold",event);
					}
				},50);
			});
			this_jq.bind("touchmove",function(event){
				is_canceled=true;
			});
			this_jq.bind("touchend",function(event){
				if(is_canceled){
					return;
					event.preventDefault();
					event.stopPropagation();
				}
				clearInterval(tap_intval);
				var timer=Date.now(),touches=event.originalEvent.changedTouches;
				if(!is_taphold && !is_canceled && touch_object===event.target && touches.length===1 && touch_x[0]===touches[0].pageX && touch_y[0]===touches[0].pageY){
					triggercustomevent(this_object,"tap",event);
				}
				if(!is_taphold && !is_canceled && touch_object===event.target && touches.length===2 && touch_x[0]===touches[0].pageX && touch_y[0]===touches[0].pageY && touch_x[1]===touches[1].pageX && touch_y[1]===touches[1].pageY){
					triggercustomevent(this_object,"tapTwo",event);
				}
				is_taphold=false;
				is_canceled=true;
				event.preventDefault();
				event.stopPropagation();
			});
		},
		teardown:function(){
			$(this).unbind("touchstart").unbind("touchmove").unbind("touchend");
		}
	};
	$.event.special.swipeEvents={
		setup:function(){
			var touch_object,
			this_jq=$(this),
			this_object=this,
			is_swipe=false,
			touch_x=[],
			touch_y=[],
			touch_object_x,
			touch_object_y,
			touch_object_width,
			touch_object_height;
			this_jq.on("touchstart",function(event){
				touch_object=event.target;
				var touches=event.originalEvent.changedTouches;
				if(touches.length===2){
					touch_x[0]=touches[0].pageX;
					touch_y[0]=touches[0].pageY;
					touch_x[1]=touches[1].pageX;
					touch_y[1]=touches[1].pageY;
				}else{
					touch_x[0]=touches[0].pageX;
					touch_y[0]=touches[0].pageY;
				}
				touch_object_x=$(this).offset().left;
				touch_object_y=$(this).offset().top;
				touch_object_width=$(this).outerWidth();;
				touch_object_height=$(this).outerHeight();;
				is_swipe=true;
			});
			this_jq.bind("touchmove",function(event){
				var current_object=event.target,
				touches=event.originalEvent.changedTouches,
				vertical_scrolled=$(this).outerHeight() < this.scrollHeight,
				horizontal_scrolled=$(this).outerWidth() < this.scrollWidth;
				if(is_swipe && current_object===touch_object && touches){
					if(touches.length===1 && (touch_object_x < touches[0].pageX) && (touch_object_y < touches[0].pageY) && ((touch_object_x + touch_object_width) > touches[0].pageX) && ((touch_object_y + touch_object_height) > touches[0].pageY)){
						if((touches[0].pageX > (touch_x[0]+50)) && (touches[0].pageY > touch_y[0]-30) && (touches[0].pageY < touch_y[0]+30)){
							if(horizontal_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeRight",event);
						}
						if((touches[0].pageX < (touch_x[0]-50)) && (touches[0].pageY > touch_y[0]-30) && (touches[0].pageY < touch_y[0]+30)){
							if(horizontal_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeLeft",event);
						}
						if((touches[0].pageY > (touch_y[0]+50)) && (touches[0].pageX > touch_x[0]-30) && (touches[0].pageX < touch_x[0]+30)){
							if(vertical_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeDown",event);
						}
						if((touches[0].pageY < (touch_y[0]-50)) && (touches[0].pageX > touch_x[0]-30) && (touches[0].pageX < touch_x[0]+30)){
							if(vertical_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeUp",event);
						}
					}
					if(touches.length===2 && 
					(touch_object_x < touches[0].pageX) && (touch_object_x < touches[1].pageX) && 
					(touch_object_y < touches[0].pageY) && (touch_object_y < touches[1].pageY) && 
					((touch_object_x + touch_object_width) > touches[0].pageX) && ((touch_object_x + touch_object_width) > touches[1].pageX) && 
					((touch_object_y + touch_object_height) > touches[0].pageY) && ((touch_object_y + touch_object_height) > touches[1].pageY) 
					){
						if((touches[0].pageX > (touch_x[0]+50)) && (touches[1].pageX > (touch_x[1]+50)) &&  
						(touches[0].pageY > touch_y[0]-30) && (touches[1].pageY > touch_y[1]-30) && 
						(touches[0].pageY < touch_y[0]+30) && (touches[1].pageY < touch_y[1]+30)
						){
							if(horizontal_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeRightTwo",event);
						}
						if((touches[0].pageX < (touch_x[0]-50)) && (touches[1].pageX < (touch_x[1]-50)) && 
						(touches[0].pageY > touch_y[0]-30) && (touches[1].pageY > touch_y[1]-30) && 
						(touches[0].pageY < touch_y[0]+30) && (touches[1].pageY < touch_y[1]+30)
						){
							if(horizontal_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeLeftTwo",event);
						}
						if(
						(touches[0].pageY > (touch_y[0]+50)) && (touches[1].pageY > (touch_y[1]+50)) && 
						(touches[0].pageX > touch_x[0]-30) && (touches[1].pageX > touch_x[1]-30) && 
						(touches[0].pageX < touch_x[0]+30) && (touches[1].pageX < touch_x[1]+30)
						){
							if(vertical_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeDownTwo",event);
						}
						if(
						(touches[0].pageY < (touch_y[0]-50)) && (touches[1].pageY < (touch_y[1]-50)) && 
						(touches[0].pageX > touch_x[0]-30) && (touches[1].pageX > touch_x[1]-30) && 
						(touches[0].pageX < touch_x[0]+30) && (touches[1].pageX < touch_x[1]+30)
						){
							if(vertical_scrolled){
								return;
							}
							is_swipe=false;
							triggercustomevent(this_object,"swipeUpTwo",event);
						}
					}
				}else{
					is_swipe=false;
				}
			});
			this_jq.bind("touchend",function(event){
				is_swipe=false;
			});
		},
		teardown:function(){
			$(this).unbind("touchstart").unbind("touchmove").unbind("touchend");
		}
	};
	$.event.special.scrollEvents={
		setup:function(){
			$(this).bind("touchmove",function(event){
				if($(this).outerHeight()<this.scrollHeight || $(this).outerWidth()<this.scrollWidth){
					triggercustomevent(this,"scroll",event);
				}
			});
		},
		teardown:function(){
			$(this).unbind("touchmove");
		}
	};
	$.event.special.keyboardEvents={
		setup:function(){
			var fire_event=false,is_focused=false,is_shown=false;
			if(this===window){
				fire_event=true;
			}else{
				fire_event=false;
			}
			$("input,textarea").bind("focus",function(event){
				if(fire_event && !is_shown){
					triggercustomevent(window,"keyboardShown",event);
				}
				is_focused=true;
				is_shown=true;
			});
			$("input,textarea").bind("blur",function(event){
				setTimeout(function(){
					if($(':focus').length && ($(':focus').prop("tagName").toLowerCase()==="input" || $(':focus').prop("tagName").toLowerCase()==="textarea")){
						is_focused=true;
					}else{
						is_focused=false;
					}
					if(fire_event && !is_focused){
						is_shown=false;
						triggercustomevent(window,"keyboardHidden",event);
					}
				},100);
			});
		},
		teardown:function(){
			$("input,textarea").unbind("focus").unbind("blur");
		}
	};
	$.each(("tap tapTwo tapHold "+
	"swipeRight swipeRightTwo "+
	"swipeLeft swipeLeftTwo "+
	"swipeDown swipeDownTwo "+
	"swipeUp swipeUpTwo scroll "+
	"orientationChange portrait landscape portraitNormal portraitUpDown landscapeLeft landscapeRight "+
	"urlChange keyboardShown keyboardHidden "
	).split(" "),function(i,name){
		$.fn[name]=function(fn){
			return fn ? this.bind(name,fn) : this.trigger(name);
		};
		if($.attrFn){
			$.attrFn[name]=true;
		}
	});
	$.each({
		tap:"tapEvents",
		tapTwo:"tapEvents",
		tapHold:"tapEvents",
		swipeRight:"swipeEvents",
		swipeRightTwo:"swipeEvents",
		swipeLeft:"swipeEvents",
		swipeLeftTwo:"swipeEvents",
		swipeDown:"swipeEvents",
		swipeDownTwo:"swipeEvents",
		swipeUp:"swipeEvents",
		swipeUpTwo:"swipeEvents",
		orientationChange:"orientationEvents",
		portrait:"orientationEvents",
		landscape:"orientationEvents",
		portraitNormal:"orientationEvents",
		portraitUpDown:"orientationEvents",
		landscapeLeft:"orientationEvents",
		landscapeRight:"orientationEvents",
		scroll:"scrollEvents",
		keyboardShown:"keyboardEvents",
		keyboardHidden:"keyboardEvents"
	},function(event,sourceEvent){
		$.event.special[event]={
			setup:function(){
				$(this).bind(sourceEvent,$.noop);
			},
			teardown:function(){
				$(this).unbind(sourceEvent);
			}
		};
	});
	function triggercustomevent(obj,eventType,event){
		var originalType=event.type;
		event.type=eventType;
		$.event.dispatch.call(obj,event);
	}
})();
