(function(g, d, w, undefined) {
var  version = "Morpheus UI 0.1.2"
	,hasTouch = 'ontouchstart' in w || false
	,startEvt = hasTouch ? 'touchstart' : 'mousedown'
	,moveEvt = hasTouch ? 'touchmove' : 'mousemove'
	,endEvt = hasTouch ? 'touchend' : 'mouseup'
	,cancelEvt = hasTouch ? 'touchcancel' : 'mouseup'
Mui = function(_selector) {
	return new Mui.fn.init(_selector);
}
 
Mui.fn = Mui.prototype = {
 
	/* 초기화 */
	init: function(_selector) {
		if (!w.isMobile) {
			w.isMobile = Mui.browser().device !== 'pc'
		}
		if (!_selector) return this;
 
		if (typeof _selector === "string") {
			this.selector = d.querySelectorAll(_selector);
			Mui.selector = _selector;
			Mui.that = this;
			return this;
		}
		if (typeof _selector === "object") {
			this.selector = d.querySelectorAll(_selector.nodeName);
			Mui.that = this;
			return this;
		}
	},
 
	/* CSS */
	css: function(_key, _value) {
		var  selector = this.selector
			,transScale = ''
			,transRotate = ''
			,transPos = ''
			,transX = ''
			,transY = ''
		if (_value === undefined) {
			if (_key == 'clientWidth') {
				return selector[0].clientWidth;
			} else if (_key == 'clientHeight') {
				//console.dir(selector[0].clientHeight)
				return selector[0].clientHeight;
			} else if (_key == 'x') {
				var  matrix = document.defaultView.getComputedStyle(selector[0], null).webkitTransform
					,matrixX = matrix.substr(7, matrix.length - 8).split(', ')[4];
				matrixX == undefined ? matrixX = '0px' : matrixX = matrixX + 'px'
				return matrixX;
			} else if (_key == 'y') {
				var  matrix = document.defaultView.getComputedStyle(selector[0], null).webkitTransform
					,matrixY = matrix.substr(7, matrix.length - 8).split(', ')[5];
				matrixY == undefined ? matrixY = '0px' : matrixY = matrixY + 'px'
				return matrixY;
			} else {
				style = document.defaultView.getComputedStyle(selector[0], null);
				return w['style'][_key];
			}
		} else {
			for (var i=0; i<selector.length; i++) {
				if (_key == 'scale') {
					transScale = ' scale(' + _value + ') ';
					selector[i].style['webkitTransform'] = transScale;
					return this;
				}
				if (_key == 'rotate') {
					transRotate = ' rotate(' + _value + ') ';
					selector[i].style['webkitTransform'] += transRotate;
					return this;
				}
				if (_key == 'x') {
					selector[i].style['webkitTransform'] = 'translate3d('+_value+', 0,0)';
				}
				if (_key == 'y') {
					selector[i].style['webkitTransform'] = 'translate3d(0, '+_value+', 0)';
				}
				selector[i].style[_key] = _value;
			}
			return this;
		}
	},
 
	/* animation */
	animate: function(_option, _callback) {
		var  styleText = ""
			,time = _option.time || "1s"
			,delay = _option.delay || "0s"
			,callBack = _callback || null
			,selector = this.selector
			,obj
			,prefix = mpui.browser().prefix
			,transX = _option.x || this.css('x')
			,transY = _option.y || this.css('y')
			,transZ = _option.z || this.css('z')
			,transScale = _option.scale || ''
			,transRotate = _option.rotate || ''
			,trans3d = (_option.x != '') ? true : 
						(_option.y != '') ? true : 
						(_option.z != '') ? true : 
						(_option.scale != '') ? true : 
						(_option.rotate != '') ? true : 
						false
		
		for (var i=0; i<selector.length; i++) {
			for (var _key in _option) {
				var _value = _option[_key];
				switch (_key) {
					case 'scale':
						transScale = ' scale('+_value+') ';
					break;
					case 'rotate':
						transRotate = ' rotate('+_value+') ';
					break;
					case 'time': case 'delay':
					break;
					default:
						styleText += _key + ":" + _value + "; ";
					break;
				}
			}
			
			if (callBack) {
				this.selector[i].callback = callBack;
			}
			var style = document.defaultView.getComputedStyle(this.selector[i], null)
			if( style['position'] == "static" ){
				this.selector[i].style.position = "relative";
			}
			styleText += "-webkit-transition:all " + time + " ease " + delay + "; ";
			
			if (trans3d) {
				transX == '' ? transX = 0 : transX
				transY == '' ? transY = 0 : transY
				transZ == '' ? transZ = 0 : transZ
				styleText += '-webkit-transform:translate3d(' + transX + ', ' + transY + ', 0) ' + transScale + transRotate;
			}
			selector[i].style.cssText += styleText;
 
			selector[i].addEventListener("webkitTransitionEnd", this.transEnd = function(event) {
				if (!obj) {
					obj = event;
					obj.currentTarget.style['webkitTransition'] = "";
					if (callBack !== "") {
						id = "id" + Math.floor(Math.random()*1000000000) || '';
						event.currentTarget.setAttribute('data-id', id);
						if (callBack) {
							eval(callBack)(event, M('[data-id="' + id + '"]'));
							delete event.currentTarget.callback;
						}
						event.target.removeAttribute('data-id');
					}
				}
			}, false);
		}
		return this;
	},
 
	animateStop: function(){
		var selector = this.selector
		for (var i=0; i<selector.length; i++) {
			selector[i].style['webkitTransition'] = '';
			callback = selector[i].callback
			if (callback) {
				eval(callback)(undefined, selector[i].getAttribute('data-id'));
			}
			selector[i].removeEventListener("webkitTransitionEnd", this.transEnd, false)
		}
	},
 
	/* drag and drop */
	drag: function(_option) {
		var  selector = this.selector
			,dragOption = {}
		
		if (!d.dragOption) {
			d.dragOption = {}
		}
		if (!_option) {
			_option = {};
		}
 
		dragOption.handler 	= _option.handler == undefined ? selector : d.querySelectorAll(_option.handler);
		Mui.dragInit.mpSelector = this;
		
		if ( w.isMobile ) {
			dragOption.handler[0].addEventListener('touchstart', Mui.dragInit, false);
			dragOption.handler[0].dragOption = this.drag.arguments[0];
			dragOption.handler[0].dragOption.target = this.selector;
		} else {
			dragOption.handler[0].addEventListener('mousedown', Mui.dragInit, false);
			dragOption.handler[0].dragOption = this.drag.arguments[0];
			dragOption.handler[0].dragOption.target = this.selector;
		}
		return this;
	},
 
	/* drag and drop */
	stopDrag: function() {
		var  selector = this.selector
		if ( w.isMobile ) {
			selector[0].removeEventListener('touchstart', Mui.dragInit, false);
		} else {
			selector[0].removeEventListener('mousedown', Mui.dragInit, false);
		}
		return this;
	}
}
 
Mui.eventListener = {}
 
Mui.dragInit = function(evt){
	if (evt) {
		var  point = hasTouch ? evt.touches[0] : evt
			,scroller = Mui.dragInit.mpSelector
	}
	switch (evt.type) {
		case 'mousedown': case 'touchstart':
			d.dragOption = {}
			if (!evt.currentTarget.dragOption) {
				evt.currentTarget.dragOption = {};
			}
			d.dragOption.vertical 	= evt.currentTarget.dragOption.vertical == undefined ? true : evt.currentTarget.dragOption.vertical;
			d.dragOption.horizon 	= evt.currentTarget.dragOption.horizon 	== undefined ? true : evt.currentTarget.dragOption.horizon;
			d.dragOption.scale 		= evt.currentTarget.dragOption.scale	== undefined ? 1 	: evt.currentTarget.dragOption.scale;
			d.dragOption.opacity 	= evt.currentTarget.dragOption.opacity 	== undefined ? 1 	: evt.currentTarget.dragOption.opacity;
			d.dragOption.css 		= evt.currentTarget.dragOption.css 		== undefined ? null : evt.currentTarget.dragOption.css;
			d.dragOption.oneway 	= evt.currentTarget.dragOption.oneway 	== undefined ? false: evt.currentTarget.dragOption.oneway;
			d.dragOption.left 		= evt.currentTarget.dragOption.left 	== undefined ? null : evt.currentTarget.dragOption.left;
			d.dragOption.right 		= evt.currentTarget.dragOption.right 	== undefined ? null : evt.currentTarget.dragOption.right;
			d.dragOption.top 		= evt.currentTarget.dragOption.top 		== undefined ? null : evt.currentTarget.dragOption.top;
			d.dragOption.bottom 	= evt.currentTarget.dragOption.bottom 	== undefined ? null : evt.currentTarget.dragOption.bottom;
			
			d.dragOption.onStart 	= evt.currentTarget.dragOption.onStart 	== undefined ? null : evt.currentTarget.dragOption.onStart;
			d.dragOption.onMove 	= evt.currentTarget.dragOption.onMove 	== undefined ? null : evt.currentTarget.dragOption.onMove;
			d.dragOption.onEnd 		= evt.currentTarget.dragOption.onEnd 	== undefined ? null : evt.currentTarget.dragOption.onEnd;
			d.dragOption.onCancel 	= evt.currentTarget.dragOption.onCancel == undefined ? null : evt.currentTarget.dragOption.onCancel;
 
			Mui.dragInit.target = evt.currentTarget.dragOption.target[0]
			scroller.length = 0;
			scroller[0] = Mui.dragInit.target
			scroller.selector = []
			scroller.selector[0] = Mui.dragInit.target
			Mui.dragInit.startPos = [];		// [objPos, mousePos]
			Mui.dragInit.endPos = [];
			Mui.dragInit.lastPos = [];
			Mui.dragInit.centerPos = [];	// [가로, 세로]
			Mui.dragInit.firstDirection = null;
			if (scroller.css('position') == 'static') {
				scroller.css('position', 'relative')
			}
 
			d.addEventListener(moveEvt, Mui.dragInit, false);
			d.addEventListener(endEvt, Mui.dragInit, false);
			Mui.dragInit.startPos[1] = [point.pageX, point.pageY];
			
			Mui.dragInit.startPos[0] = [parseFloat(scroller.css('x'))||0, parseFloat(scroller.css('y'))||0];
			Mui.dragInit.centerPos[0] = [Mui.dragInit.startPos[0][0] - Mui.dragInit.startPos[1][0]];
			Mui.dragInit.centerPos[1] = [Mui.dragInit.startPos[0][1] - Mui.dragInit.startPos[1][1]];
			w.direction = 0;
			w.updown = 0;
			w.startX = Mui.dragInit.startPos[1][0];
			w.startY = Mui.dragInit.startPos[1][1];
 
			// scale
			if (d.dragOption.scale != 1) {
				scroller.css('scale', d.dragOption.scale);
			}
			// opacity
			if (d.dragOption.opacity != 1) {
				scroller.css('opacity', d.dragOption.opacity);
			}
			// css
			if (d.dragOption.css) {
				scroller.addClass(d.dragOption.css);
			}
			// 콜백
			if (d.dragOption.onStart) {
				eval(d.dragOption.onStart)(point, scroller);
			}
		break;
		
		case 'mousemove': case 'touchmove':
			var  transX = ''
				,transY = ''
			
			if (Mui.dragInit.endPos[1] != undefined) {
				Mui.dragInit.lastPos[1] = Mui.dragInit.endPos[1];
			} else {
				Mui.dragInit.lastPos[1] = 0
			}
			Mui.dragInit.endPos[0] = [parseFloat(scroller.css('x'))||0, parseFloat(scroller.css('y'))||0];
			Mui.dragInit.endPos[1] = [point.pageX, point.pageY];
			Mui.dragInit.posDirection = Mui.dragInit.endPos[1][0] - Mui.dragInit.lastPos[1][0];
			Mui.dragInit.posUpdown = Mui.dragInit.endPos[1][1] - Mui.dragInit.lastPos[1][1];
			if (Mui.dragInit.posDirection > 0) {
				w.direction = 1;
			} else if (Mui.dragInit.posDirection < 0) {
				w.direction = -1;
			} else {
				w.direction = 0;
			}
			if (Mui.dragInit.posUpdown > 0) {
				w.updown = 1;
			} else if (Mui.dragInit.posUpdown < 0) {
				w.updown = -1;
			} else {
				w.updown = 0;
			}
			w.distanceX = Mui.dragInit.endPos[1][0] - Mui.dragInit.startPos[1][0];
			w.distanceY = Mui.dragInit.endPos[1][1] - Mui.dragInit.startPos[1][1];
 
			if( !Mui.dragInit.firstDirection ){
				if(Math.abs(Mui.dragInit.endPos[1][1] - Mui.dragInit.startPos[1][1]) > Math.abs(Mui.dragInit.endPos[1][0] - Mui.dragInit.startPos[1][0])){
					Mui.dragInit.firstDirection = 'horizon';
				}else {
					Mui.dragInit.firstDirection = 'vertical';
				}
				if (d.dragOption.vertical && d.dragOption.horizon && !d.dragOption.oneway) {
					Mui.dragInit.firstDirection = 'all';
				}
			}
			
			// oneway option
			if (d.dragOption.oneway){
				if (Mui.dragInit.firstDirection == 'vertical'){
					evt.preventDefault();
					var  left = parseFloat(point.pageX) + parseFloat(Mui.dragInit.centerPos[0])
					
					// limit
					if (d.dragOption.left && d.dragOption.right) {
						if ( parseFloat(d.dragOption.left) < left && parseFloat(d.dragOption.right) > left ) {
							transX = left+'px';
						}
					} else if (d.dragOption.left) {
						if ( parseFloat(d.dragOption.left) < left ) {
							transX = left+'px';
						}
					} else if (d.dragOption.right) {
						if ( parseFloat(d.dragOption.right) > left ) {
							transX = left+'px';
						}
					} else {
						transX = left+'px';
					}
				} else if (Mui.dragInit.firstDirection == 'horizon'){
					evt.preventDefault();
					var top = parseFloat(point.pageY) + parseFloat(Mui.dragInit.centerPos[1])
					
					// limit
					if (d.dragOption.top && d.dragOption.bottom) {
						if ( parseFloat(d.dragOption.top) < top && parseFloat(d.dragOption.bottom) > top ) {
							transY = top+'px';
						}
					} else if (d.dragOption.top) {
						if ( parseFloat(d.dragOption.top) < top ) {
							transY = top+'px';
						}
					} else if (d.dragOption.bottom) {
						if ( parseFloat(d.dragOption.bottom) > top ) {
							transY = top+'px';
						}
					} else {
						transY = top+'px';
					}
				}
				
				if (!transX){
					transX = scroller.css('x');
				}
				if (!transY){
					transY = scroller.css('y');
				}
				Mui.dragInit.target.style['webkitTransform'] = 'translate3d('+transX+', '+transY+', 0)'
			} else {
				if (d.dragOption.vertical){
					if (Mui.dragInit.firstDirection == 'vertical') {
						Mui.dragEnd(evt);
						transY = scroller.css('y');
					} else {
						// console.log('세로');
						evt.preventDefault();
						var top = parseFloat(point.pageY) + parseFloat(Mui.dragInit.centerPos[1])
						
						// limit
						if (d.dragOption.top && d.dragOption.bottom) {
							if ( parseFloat(d.dragOption.top) < top && parseFloat(d.dragOption.bottom) > top) {
								transY = top+'px';
							} else if (parseFloat(d.dragOption.top) > top) {
								transY = d.dragOption.top;
							} else if (parseFloat(d.dragOption.bottom) < top) {
								transY = d.dragOption.bottom;
							}
						} else if (d.dragOption.top) {
							if ( parseFloat(d.dragOption.top) < top ) {
								transY = top+'px';
							}
						} else if (d.dragOption.bottom) {
							if ( parseFloat(d.dragOption.bottom) > top ) {
								transY = top+'px';
							}
						} else {
							transY = top+'px';
						}
					}
				}
				
				if (d.dragOption.horizon){
					if (Mui.dragInit.firstDirection == 'horizon') {
						Mui.dragEnd(evt);
						transX = scroller.css('x');
					} else {
						evt.preventDefault();
						var left = parseFloat(point.pageX) + parseFloat(Mui.dragInit.centerPos[0])
						
						// limit
						if (d.dragOption.left && d.dragOption.right) {
							if ( parseFloat(d.dragOption.left) < left && parseFloat(d.dragOption.right) > left ) {
								transX = left+'px'
							} else if (parseFloat(d.dragOption.left) > left) {
								transX = d.dragOption.left;
							} else if (parseFloat(d.dragOption.right) < left) {
								transX = d.dragOption.right;
							}
						} else if (d.dragOption.left) {
							if ( parseFloat(d.dragOption.left) < left ) {
								transX = left+'px'
							}
						} else if (d.dragOption.right) {
							if ( parseFloat(d.dragOption.right) > left ) {
								transX = left+'px'
							}
						} else {
							transX = left+'px';
						}
					}
				}
				
				if (!transX){
					transX = scroller.css('x');
				}
				if (!transY){
					transY = scroller.css('y');
				}
				Mui.dragInit.target.style['webkitTransform'] = 'translate3d('+transX+', '+transY+', 0)';
			}
			if (d.dragOption.onMove) {
				eval(d.dragOption.onMove)(evt, scroller);
			}
		break;
		
		case 'mouseup': case 'touchend':
			//Mui.dragEnd();
			if ( w.isMobile ) {
				d.removeEventListener('touchmove', Mui.dragInit, false);
				d.removeEventListener('touchend', Mui.dragInit, false);
			} else {
				d.removeEventListener('mousemove', Mui.dragInit, false);
				d.removeEventListener('mouseup', Mui.dragInit, false);
				
			}
 
			// reset
			if (d.dragOption.scale != 1) {
				scroller.css('scale', 1);
			}
			if (d.dragOption.opacity != 1) {
				scroller.css('opacity', 1);
			}
			// css
			if (d.dragOption.css != 1) {
				scroller.removeClass(d.dragOption.css);
			}
			
			if (Mui.dragInit.endPos.length == 0) {
				w.direction = 0;
				w.updown = 0;
			} else {
				if ( Mui.dragInit.firstDirection == 'vertical' ) {
					w.updown = 0;
				} else {
					if (Mui.dragInit.endPos[1][1] - Mui.dragInit.startPos[1][1] > 0) {
						//console.log('->');
						w.updown = 1;
					} else if(Mui.dragInit.endPos[1][1] - Mui.dragInit.startPos[1][1] < 0) {
						//console.log('<-');
						w.updown = -1;
					}
				}
				
				if ( Mui.dragInit.firstDirection == 'horizon' ) {
					w.direction = 0;
				} else {
					if (Mui.dragInit.endPos[1][0] - Mui.dragInit.startPos[1][0] > 0) {
						//console.log('->');
						w.direction = -1;
					} else if (Mui.dragInit.endPos[1][0] - Mui.dragInit.startPos[1][0] < 0) {
						//console.log('<-');
						w.direction = 1;
					}
				}
			}
			if (typeof Mui.dragInit.endPos[1] != 'undefined') {
				w.distanceX = Mui.dragInit.endPos[1][0] - Mui.dragInit.startPos[1][0];
				w.distanceY = Mui.dragInit.endPos[1][1] - Mui.dragInit.startPos[1][1];
			} else {
				w.distanceX = 0;
				w.distanceY = 0;
			}
			if (d.dragOption.onEnd) {
				eval(d.dragOption.onEnd)(evt, scroller);
			}
		break;
	}
}
 
Mui.dragEnd = function(evt){
	d.removeEventListener(moveEvt, Mui.dragInit, false);
	d.removeEventListener(endEvt, Mui.dragInit, false);
	
	// reset
	if (d.dragOption.scale != 1) {
		scroller.css('scale', 1);
	}
	if (d.dragOption.opacity != 1) {
		scroller.css('opacity', 1);
	}
	// css
	if (d.dragOption.css) {
		scroller.removeClass(d.dragOption.css);
	}
	if (d.dragOption.onCancel) {
		eval(d.dragOption.onCancel)(evt, scroller);
	}
}
 
/* check browser */
Mui.browser = function() {
	var  ua = navigator.userAgent
		,browserName = (/chrome/gi).test(ua) ? "chrome" : 
					(/safari/gi).test(ua) ? "safari" : 
					(/simulator/gi).test(ua) ? "ios simulator" : 
					(/presto/gi).test(ua) ? "opera" : 
					(/firefox/gi).test(ua) ? "firefox" : 
					(/triden/gi).test(ua) ? "ie" : "other"
		,device = (/iphone|ipad|ipod|android/gi).test(ua) ? "mobile" : "pc"
		,os = (/iphone|ipad|ipod/gi).test(ua) ? "ios" : 
				(/android/gi).test(ua) ? "android" :
				(/mac/gi).test(ua) ? "macOS" : 
				(/windows/gi).test(ua) ? "Windows" : "other"
		,prefix = (/presto/gi).test(ua) ? "-o-" : 
					(/webkit/gi).test(ua) ? "-webkit-" :
					(/firefox/gi).test(ua) ? "-moz-" : 
					(/triden/gi).test(ua) ? "-ms-" : ""
		,androidVersion
		,androidName;
	switch(browserName) {
		case "opera": case "safari":
			try{
				browserVer = ua.match(/version\/([0-9.]+)/ig).toString().split("/")[1];
			}catch(err) {
				browserVer = undefined;
			}
		break;
		case "chrome":
			browserVer = ua.match(/chrome\/([0-9.]+)/ig).toString().split("/")[1];
		break;
		case "firefox":
			browserVer = ua.match(/firefox\/([0-9.]+)/ig).toString().split("/")[1];
		break;
		case "ie":
			browserVer = ua.match(/MSIE ([0-9.]+)/ig).toString().split(" ")[1];
		break;
		default:
			browserVer = undefined;
		break;
	}
	if (os == "android") {
		androidVersion = ua.match(/android ([0-9.]+)/ig).toString().split(" ")[1];
		switch(androidVersion) {
			case "1.0":
				androidName = "applepie";
			break;
			case "1.1":
				androidName = "bananabread";
			break;
			case "1.5":
				androidName = "cupcake";
			break;
			case "1.6":
				androidName = "donut";
			break;
			case "2.0": case "2.0.1": case "2.1":
				androidName = "eclair";
			break;
			case "2.2": case "2.2.1": case "2.2.2":
				androidName = "Froyo";
			break;
			case "2.3": case "2.3.2": case "2.3.3": case "2.3.4": case "2.3.5": case "2.3.6": case "2.3.7":
				androidName = "gingerbread";
			break;
			case "3.0": case "3.1": case "3.2":
				androidName = "honeycomb";
			break;
			case "4.0": case "4.0.1": case "4.0.2": case "4.0.3": case "4.0.4":
				androidName = "icecreamsandwich";
			break;
			case "4.1":
				androidName = "jellybean";
			break;
			default:
				androidName = undefined;
			break;
		}
	}
	return {
		 "device":device
		,"os":os
		,"browser":browserName
		,"browserVer":browserVer
		,"androidName":androidName
		,"androidVersion":androidVersion
		,"prefix":prefix
	}
}
 
Mui.screen = function() {
	return {"width": w.innerWidth, "height": w.innerHeight};
}
 
Mui.json = function(_value, _type) {
	if (_type == 0) {
		return JSON.stringify(_value);
	}
	if (_type == 1) {
		if (_value != ''){
			return JSON.parse(_value);
		} else {
			return {}
		}
	}
	if (typeof _value === 'object') {
		return JSON.stringify(_value);
	} else {
		if (_value != ''){
			return JSON.parse(_value);
		} else {
			return {}
		}
	}
}
 
/* version */
Mui.version = function() {
	console.log(version);
}
 
/* String utils */
Mui.trim = function(_value) {
	return _value.replace(/^\s+|\s+$/g,"");
}
Mui.leftTrim = function(_value) {
	return _value.replace(/^\s+/,"");
}
Mui.rightTrim = function(_value) {
	return _value.replace(/\s+$/,"");
},
Mui.isNumber = function(_value) {
	return !isNaN(parseFloat(_value)) && isFinite(_value);
}
camelize = function(_value) {
	return _value.replace (/(?:^|[-_])(\w)/g, function (_, c) {
		return c ? c.toUpperCase () : '';
	})
}
decamelize = function(_value) {
	return _value.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();
}
Mui.toCurrency = function(_value) {
	if ( _value !== 0 && isNaN(_value) ) return '';
	if (_value === 0) return 0;
	if ( _value === '' ) return '';
	_value = ''+_value;
	
	var  unit
		,point = _value.split('.')[1]
		,amountStr
		
	if( !Mui.isNumber(_value.substr(0, 1)) ) {
		unit = _value.substr(0, 1);
		_value = parseFloat(_value.replace(unit, ''));
	}
	amountStr = String(_value);
	amountArray = amountStr.split(".");
	var currencyArray = new Array();
	var start, end = amountArray[0].length;
	while(end > 0) {
		start = Math.max(end - 3, 0);
		currencyArray.unshift( amountArray[0].slice(start, end) );
		end = start;
	}
	amountArray[0] = currencyArray.join(",");
	if (unit != undefined) {
		amountArray[0] = unit + amountArray[0];
	}
	if (point != undefined) {
		amountArray[0] = amountArray[0] + "." + point;
	}
	return amountArray[0];
}
Mui.toNumber = function(_value) {
	var amountArray = new Array();
	var currencyArray = new Array();
 
	for (var i=0; i<_value.toString().length; i++) {
		amountArray[i] = _value.toString().substr(i, 1);
 
		if (amountArray[i] == ",") amountArray.splice(i);
		if (amountArray[i] == ".") amountArray.splice(i);
		if (amountArray[i] != undefined) currencyArray.push(amountArray[i]);
	}
	return currencyArray.join("")
}
Mui.format = function(_value, _format) {
	var  str = ''
		,j = 0
		
	for(var i=0; i<_format.length; i++){
		if( _format.substr(i, 1) == "0") {
			str += _value.substr(j, 1);
			j++;
		} else {
			str += _format.substr(i, 1);
		}
	}
	return str;
}
Mui.scroll = function(vscroll, hscroll){
	if (arguments.length == 1) {
		w.scrollTo(w.pageXOffset, vscroll);
	} else if (arguments.length == 2) {
		w.scrollTo(hscroll, vscroll);
	} else if (arguments.length == 0) {
		return {y: w.pageYOffset, x: w.pageXOffset};
	}
}
Mui.getUrl = function(){
	return d.URL.split('/html/')[1].split('?')[0];
}
 
Mui.storage = function(key, value){
	if (value == undefined) {
		// getter
		return localStorage.getItem(key);
	}
	//setter
	localStorage.setItem(key, value);
}
 
/* parameter from url */
Mui.getParameter = function(_key) {
	address = location.href;
	if (address.indexOf("?") != -1) {
		parameters = address.slice(address.indexOf("?")+1, address.length).split("&");
		for (var i=0; i<parameters.length; i++) {
			key = parameters[i].split("=")[0];
			if (key == _key) {
				return decodeURIComponent(parameters[i].split("=")[1]);
			} else {
				return undefined;
			}
		}
	} else {
		return undefined;
	}
}
/* 다이나믹 날짜계산 */
Mui.dynamicDate = function(basis, now) {
	var  basisDate
		,nowDate
		,dif
 
	basisDate = Math.round( new Date(basis.replace(/\-/g, '/')).getTime() / 1000 );
	if (now === undefined) {
		nowDate = Math.round( new Date().getTime() / 1000 );
	} else {
		nowDate = Math.round( new Date(now.replace(/\-/g, '/')).getTime() / 1000 );
	}
	seconds = nowDate - basisDate;
	minutes = Math.floor(seconds / 60);
	hours = Math.floor(minutes / 60);
	days = Math.floor(hours / 24);
	monthes = Math.floor(days / 30);
	year = Math.floor(days / 365);
	
	if (isNaN(seconds)) {
		//console.error('날짜형식이 정확하지 않습니다.');
		return basis.split(' ')[0];
	}
	if (seconds < 0) {
		console.error('현재날짜는 기준날짜보다 빠를수 없습니다.');
		return '';
	}
	if (seconds <= 5) {
		return '방금전';
	}
	if (seconds < 60) {
		return seconds + '초전';
	}
	if (minutes < 60) {
		return minutes + '분전';
	}
	if (hours < 24) {
		return hours + '시간전';
	}
	if (days < 30) {
		return days + '일전';
	}
	if (days < 365) {
		return monthes + '개월전';
	}
	return year + '년전';
}
 
Mui.extend = function(_pName, _option) {
 
}
/* 전역변수 할당 */
Mui.fn.init.prototype = Mui.fn;
w.mpui = w.M = Mui;
})(this, document, window);