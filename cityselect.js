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
	 * @param {object} data ������Ϣ����
	 * @example var foo=new Y.Cityselect(data);
	 * @description ���캯��
	*/
	var Cityselect=function() {
		var _this=this;
		
		/**
		 * @memberof Y.Cityselect
		 * @param {string} ʡ��������ѡ����
		 * @param {string} ����������ѡ����
		 * @param {string} ����������ѡ����
		 * @description ����ʡ����������
		*/
		this.attach=function(province,city,area) {
			_this.province=Y.one(province);
			_this.city=Y.one(city);
			_this.area=Y.one(area);
		};
		
		/**
		 * @memberof Y.Cityselect
		 * @param {object} ������Ϣ����
		 * @description ��ʼ����������
		*/
		this.initdata=function(data) {
			_this.data=data;
		};
		
		/**
		 * @memberof Y.Cityselect
		 * @param {array} Ĭ��ʡ��������������ַ�������
		 * @description ��ʼ��������Ĭ��ѡ��
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
		 * @description ѡ��ʡ�ݺ󴥷��¼�
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
		 * @description ѡ����к󴥷��¼�
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
		 * @param {array} ʡ�����ַ�������
		 * @return {array} ʡ�������ݽṹ
		 * @description ����ʡ�����ַ������鷵��С��Χ����
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
		 * @param {string} ʡ�����ַ���
		 * @return {string} ʡ��������
		 * @description ��ʡ�����ַ���ת��Ϊ��������
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
		 * @param {string} ʡ������������
		 * @return {array} ������������
		 * @description ��ȡ�õ�����������
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
		 * @param {string} ʡ������������
		 * @return {array} ������������
		 * @description ��ȡ�õ���������������
		*/
		var getparent=function(code) {
			if(!_this.data[code]) return 1;
			return _this.data[code][1];
		};
		
		/**
		 * @private
		 * @memberof Y.Cityselect
		 * @param {node} �����ڵ�
		 * @description ��������б�ѡ��
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
		 * @param {node} �����ڵ�
		 * @param {string} ��������
		 * @description ����ǰ�ڵ��ʼ��������Ĭ��ֵ
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
		 * @param {node} �����ڵ�
		 * @param {array} ������������
		 * @description ��ǰ�ڵ�����б�
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
		 * @param {node} �����ڵ�
		 * @param {string} ��������
		 * @description ѡ�е�ǰ�������ĳһ��
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