/* !!
 * Javascript Action Operat -- By Joenix.com
 * @ejoenix, QQ: 312272592
 * born for developer . 1985.09.13~(256=2^8)
 * ** *** **** ***** **** *** ** *
 */

/* closures pass variables */
(function(window, document, body, location, userAgent, undefined){

var
/* for peace of the world, for compatible mobiles */
mobile = ~userAgent.indexOf('Mobile') !== 0;

/* The Global Fn */
function _(options){
	options = options || {};
	return this.init( this, this.global(options.global || {}), (delete options.global, options || {}) );
}

/* Prototype Fn */
_.prototype = {
	// 全局参数设置
	global: function(options){
		return window.jOperatGlobal || (window.jOperatGlobal = {
			// 容器: HTMLElement
			container: options.container && options.container.nodeType === 1 ? options.container : document,
			// 动作名称: 字符串
			action: options.action || 'action',
			// 触发方式: 事件
			evt: this.evt[options.evt] || options.evt || this.evt.click,
			// 参数名称: 数组
			params: options.params || [],
			// 阻止默认事件: 布尔
			stop: options.stop === true
		});
	},
	// 定义静态常量
	constant: {
		mobile: mobile,
		domain: location.protocol + '//' + location.host
	},
	// 定义兼容事件
	evt: [
		{
			click: 'touchstart',
			over: 'touchstart',
			out: 'touchend',
			down: 'touchstart',
			move: 'touchmove',
			up: 'touchend'
		},
		{
			click: 'click',
			over: 'mouseover',
			out: 'mouseout',
			down: 'mousedown',
			move: 'mousemove',
			up: 'mouseup'
		}
	][ mobile ? 0 : 1 ],
	// 动作存储池
	cache: [],
	// 验证动作是否冲突
	verify: function( argument, options ){
		if( this.isJson(argument) && argument.setting && this.isJson(argument.setting) && argument.setting.evt != options.evt && !~this.inArray(argument.setting.evt, options) ){
			return argument.setting.evt;
		}
	},
	// 验证是否为JSON格式
	isJson: function( argument ){
		return typeof argument == 'object' && Object.prototype.toString.call(argument).toLowerCase() == '[object object]' && !argument.length;
	},
	// 验证是否为FUNCTION
	isFunction: function( argument ){
		return typeof argument === 'function';
	},
	// 验证是否在数组内
	inArray: function(argument, array){
		if(array.indexOf){
			return array.indexOf( argument );
		}
		else{
			var result = -1;
			this.each(array, function(index, value){
				if(value === argument){
					result = argument;
					return false;
				}
			});
			return result;
		}
	},
	// 事件绑定
	bind: function(element, evt, fn){
		element.addEventListener ? element.addEventListener( evt, fn, true ) : element.attachEvent( 'on'+evt, fn )
	},
	// 停止跳转
	stop: function(e){
		e && e.preventDefault ? e.preventDefault() : window.event.returnValue = false;
		return false;
	},
	// 遍历
	each: function(params, fn){
		if(params.length){
			for( var i=0; i<params.length; i++ ){
				fn( i, params[i] );
			}
		}
		else{
			for( var i in params ){
				fn( i, params[i] );
			}
		}
	},
	// 获取动作对象
	element: function(e){
		e = e || window.event;
		return e.target || e.srcElement;
	},
	// 获取动作与参数
	action: function(element, action){
		return element.getAttribute( action );
	},
	// 获取参数
	params: function(element, params){
		var array = {};
		this.each( params, function(index, param){
			var gParam = element.getAttribute( param );
			if( gParam ){
				array[param] = gParam;
			}
		});
		return array;
	},
	// 触发事件
	run: function(action, fn){
		if( action ){
			fn( action );
		}
	},
	// 执行调用
	init: function(_, options, events){
		
		// 默认触发全局动作
		_.cache.push( options.evt );
		
		// 遍历参数
		_.each(events, function(index, argument){
			if( _.verify( argument, options ) ){
				_.cache.push( argument.setting.evt );
			}
		});
		
		// 多个动作
		_.each(_.cache, function(index, event){
			
			// 绑定动作于容器
			_.bind(options.container, _.evt[event] || event, function(e){
				
				var element = _.element(e), action = _.action( element, options.action );
				
				if( action ){
					// 重置并获取参数实体
					action = events[action] || window[action];
					
					// 如果参数是Function, 则执行默认动作
					if( _.isFunction( action ) && event === options.evt ){
						action( element, _.params(element, options.params) );
					}
					
					// 如果参数是JSON, 并且有执行回调函数
					if( _.isJson( action ) && action.exe ){
						if( action.setting ){
							action.setting.evt = action.setting.evt || options.evt;
							if( event === action.setting.evt ){
								action.exe( element, _.params(element, action.setting.params || options.params) );
							}
						}
					}
					
					// 阻止默认事件
					if( event == _.evt['click'] ){
						if( _.isJson( action ) && action.setting && action.setting.stop != undefined ){
							if( action.setting.stop === false ){
								return true;
							}
						}
						if( action.setting && action.setting.stop === true || options.stop === true ){
							return _.stop(e);
						}
					}
				}
				
			});
			
		});

		return this;		
	}
}

/* 将方法传到闭包外部 */
window.jOperat = _;

})
(window
,window.document
,window.document.body
,window.location
,window.navigator.userAgent
);