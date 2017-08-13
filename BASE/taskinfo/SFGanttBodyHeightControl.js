/*
��������Ҫ����ά����������ͼ��ʾ�����ݳ��ȣ�
��ʵ�屻ע�����ʾ��ʱ��������ʵ��ĸ߶�
��ʵ�屻ȡ�������ص�ʱ�򣬼�ȥ���ʵ��ĸ߶�
��ʵ��߶ȱ仯��ʱ�򣬸߶���֮�仯
Ŀǰ�˿ؼ�����һ��BUG�����Ǽ����ڸ���ͼ��ʼ��֮ǰdata�Ѿ���ȡ��һЩ���ݣ����Ѿ���ȡ�����ݵĸ߶Ȳ��ᱻ�����ȥ
�˿ؼ����Թ������ͼ��heightchange�¼�,ͨ�����¼��������ĳ���(SFGanttLayoutControl)����,Ӱ������������߼�
*/
	//����ͼ����
	function SFGanttBodyHeightControl(config)
	{
	}
	SFGanttBodyHeightControl.prototype=new window.SFGanttControl();
	//��������ͼ��ʼ������֮�б���Ĳ�
	SFGanttBodyHeightControl.prototype.initialize=function(gantt,container)
	{
		this.listeners=[
			SFEvent.bind(this.gantt=gantt,"initialize",this,this.onGanttInit)
		];
		return true;
	}
	SFGanttBodyHeightControl.prototype.onGanttInit=function()
	{
		var gantt=this.gantt,data=gantt.getData(),el=gantt.elementType.toLowerCase();
		this.listeners=this.listeners.concat([
			SFEvent.bind(data,el+"register",this,this.onRegister),
			SFEvent.bind(data,el+"unregister",this,this.onUnRegister),
			SFEvent.bind(data,"after"+el+"change",this,this.onElementChange)
		]);
		this.setBodyHeight(0);
	}
	SFGanttBodyHeightControl.prototype.setBodyHeight=function(bodyHeight)
	{
		this.bodyHeight=bodyHeight;
		if(this.timeout){window.clearTimeout(this.timeout);}
		this.timeout=window.setTimeout(SFEvent.getCallback(this,this.triggerEvent),512);
	}
	SFGanttBodyHeightControl.prototype.triggerEvent=function()
	{
		SFEvent.trigger(this.gantt,"heightchange",[this.bodyHeight]);
		this.timeout=null;
	}
	SFGanttBodyHeightControl.prototype.onRegister=function(element)
	{
		this.setBodyHeight(this.bodyHeight+this.gantt.getElementHeight(element));
	}
	SFGanttBodyHeightControl.prototype.onUnRegister=function(element)
	{
		this.setBodyHeight(this.bodyHeight-this.gantt.getElementHeight(element));
	}
	SFGanttBodyHeightControl.prototype.onElementChange=function(element,name,value,bValue)
	{
		if(element.isHidden()){return;}
		switch(name)
		{
			case "Collapse":
				//�ڽڵ��۵�״̬�仯��ʱ�����bodyHeight��ֵ
				var gantt=this.gantt,flag=value?-1:1,bodyHeight=0;
				for(var ele=element.getFirstChild();ele;ele=ele.getNextView())
				{
					if(!element.contains(ele)){break;}
					bodyHeight+=flag*gantt.getElementHeight(ele);
				}
				this.setBodyHeight(this.bodyHeight+bodyHeight);
				break;
			case "LineHeight":
				this.setBodyHeight(this.bodyHeight+value-(bValue?bValue:this.gantt.itemHeight));
				break;
		}
	}
	window.SFGanttBodyHeightControl=SFGanttBodyHeightControl;