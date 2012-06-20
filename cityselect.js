/**
 *	@author liuhuo.gk@taobao.com
 *	@version 0.0.1
 *	@datetime 2011-10-12
 *	@requires ['node','city-data']
*/

//trip-oCityselect
YUI.add('trip-oCitySelect',function(Y) {
	Y.namespace('Cityselect');
	
	/**
	 * @name Y.Cityselect
	 * @constructor
	 * @class Y.Cityselect
	 * @param {object} data 城市信息数据
	 * @example var foo=new Y.Cityselect(data);
	 * @description 构造函数
	*/
	var Cityselect=function() {
		var _this=this;
		
		/**
		 * @memberof Y.Cityselect
		 * @param {string} 省份下拉框选择器
		 * @param {string} 城市下拉框选择器
		 * @param {string} 地区下拉框选择器
		 * @description 关联省市区下拉框
		*/
		this.attach=function(province,city,area) {
			_this.province=Y.one(province);
			_this.city=Y.one(city);
			_this.area=Y.one(area);
		};
		
		/**
		 * @memberof Y.Cityselect
		 * @param {object} 城市信息数据
		 * @description 初始化城市数据
		*/
		this.initdata=function(data) {
			_this.data=data;
		};
		
		/**
		 * @memberof Y.Cityselect
		 * @param {array} 默认省市区地区代码或字符串数组
		 * @description 初始化下拉框默认选项
		*/
		this.initselection=function(arr) {
			if(Y.Lang.isArray(arr) && arr[0].indexOf("0")==-1) {
				for(var i=0;i<arr.length;i++) {
					var data=getdata(getchildren(arr[i-1]));
					arr[i]=str2code(arr[i],data);
					if(!arr[i]) {
						arr=arr.slice(0,i);
						break;
					}
				}
			}
			
			if(Y.Lang.isArray(arr) && arr.length>0) {
				initoptions(_this.province,arr[0]);
				initoptions(_this.city,arr[1]);
				initoptions(_this.area,arr[2]);
				if(arr.length==1) provincechange();
				if(arr.length==2) citychange();
			} else {
				if(arr) {
					Y.Lang.isString(arr) && (arr=str2code(arr));
					initoptions(_this.province,arr);
					provincechange();
				}
				else {
					initoptions(_this.province,1);
					provincechange();
				}
			}
			
			_this.province.on('change',provincechange);
			_this.city.on('change',citychange);
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @description 选择省份后触发事件
		*/
		var provincechange=function() {
			!this._node && (this._node=_this.province._node);
			var selectedcode=this._node.options[this._node.selectedIndex].value;
			var list=getchildren(selectedcode);
			clearoptions(_this.city);
			clearoptions(_this.area);
			addoptions(_this.city,list);
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @description 选择城市后触发事件
		*/
		var citychange=function() {
			!this._node && (this._node=_this.city._node);
			var selectedcode=this._node.options[this._node.selectedIndex].value;
			var list=getchildren(selectedcode);
			clearoptions(_this.area);
			addoptions(_this.area,list);
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {array} 省市区字符串数组
		 * @return {array} 省市区数据结构
		 * @description 根据省市区字符串数组返回小范围数据
		*/
		var getdata=function(arr) {
			var result={};
			if(!arr) return _this.data;
			for(var i=0;i<arr.length;i++) {
				if(arr.hasOwnProperty(i)) {
					result[arr[i]]=_this.data[arr[i]];
				}
			}
			return result;
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {string} 省市区字符串
		 * @return {string} 省市区代码
		 * @description 将省市区字符串转换为地区代码
		*/
		var str2code=function(str,data) {
			var data=data || _this.data;
			if(_this.strdata={}) {
				for(var i in data) {
					if(data.hasOwnProperty(i)) {
						_this.strdata[data[i][0]]=i;
					}
				}
			}
			return _this.strdata[str] || null;
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {string} 省市区地区代码
		 * @return {array} 下属地区数组
		 * @description 获取该地区下属地区
		*/
		var getchildren=function(code) {
			var data=_this.data;
			if(!_this.subdata && (_this.subdata={})) {
				for(var i in data) {
					if(data.hasOwnProperty(i)) {
						if(!_this.subdata[data[i][1]]) {
							_this.subdata[data[i][1]]=[];
						}
						_this.subdata[data[i][1]].push(i);
					}
				}
			}
			return _this.subdata[code];
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {string} 省市区地区代码
		 * @return {array} 上属地区代码
		 * @description 获取该地区上属地区代码
		*/
		var getparent=function(code) {
			if(!_this.data[code]) return 1;
			return _this.data[code][1];
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {node} 下拉节点
		 * @description 清空下拉列表选项
		*/
		var clearoptions=function(node) {
			var node=node._node;
			var options=node.options;
			for(var i=options.length-1;i>0;i--) {
				node.remove(i);
			}
		}
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {node} 下拉节点
		 * @param {string} 地区代码
		 * @description 将当前节点初始化并设置默认值
		*/
		var initoptions=function(node,code) {
			clearoptions(node);
			if(typeof(code)!='undefined') {
				var parent=getparent(code);
				var list=getchildren(parent);
				addoptions(node,list);
				setoption(node,code);
			}
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {node} 下拉节点
		 * @param {array} 地区代码数组
		 * @description 向当前节点添加列表
		*/
		var addoptions=function(node,arr) {
			var node=node._node;
			if(!arr) return;
			for(var i=0;i<arr.length;i++) {
				var text=_this.data[arr[i]][0];
				var value=arr[i];
				node.options.add(new Option(text,value));
			}
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {node} 下拉节点
		 * @param {string} 地区代码
		 * @description 选中当前下拉结点某一项
		*/
		var setoption=function(node,code) {
			var node=node._node;
			var options=node.options;
			for(var i=options.length-1;i>0;i--) {
				if(!(options[i].value-code)) {
					options[i].selected=true;
				}
			}
		};
		
		this.initdata.apply(this,arguments);
	};
	
	Y.Cityselect=Cityselect;
},'0.0.1',{requires:['node']});