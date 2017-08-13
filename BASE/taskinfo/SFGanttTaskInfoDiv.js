	function SFGanttTaskInfoDiv(gantt)
	{
		this.gantt=gantt;
		var tabDiv=new SFGanttTabDiv([500,250],gantt);
		SFEvent.bind(tabDiv,"focuschange",this,this.onTabFocusChange);
		tabDiv.addTab("����",document.createElement("div"));
		tabDiv.addTab("�߼�",document.createElement("div"));
		tabDiv.addTab("ǰ������",document.createElement("div"));
		tabDiv.addTab("��Դ",document.createElement("div"));
		tabDiv.addTab("�Զ�����",document.createElement("div"));
		this.tabDiv=tabDiv;
	}
	SFGanttTaskInfoDiv.prototype.setTask=function(task)
	{
		this.task=task;
		this.tabDiv.setTab(0);
	}
	SFGanttTaskInfoDiv.prototype.getDiv=function()
	{
		return this.tabDiv.container;
	}
	SFGanttTaskInfoDiv.prototype.onTabFocusChange=function(tabInfo)
	{
		var task=this.task;
		switch(tabInfo.name)
		{
			case '����':
				this.showInputForm(tabInfo,'General');
				break;
			case '�߼�':
				this.showInputForm(tabInfo,'Advanced');
				break;
			case '�Զ�����':
				this.showInputForm(tabInfo,'Extended');
				break;
			case 'ǰ������':
				SFEvent.deposeNode(tabInfo.div,true);
				tabInfo.div.style.textAlign="center";
				var table=document.createElement("table");
				table.style.fontSize="12px";
				SFGlobal.setProperty(table,{width:'90%',cellPadding:3,cellSpacing:1,bgColor:'#000000'});

				var row=table.insertRow(-1);
				row.bgColor='#F4F4F4';
				var cell=row.insertCell(-1);
				cell.appendChild(document.createTextNode("��ʾ��"));
				cell=row.insertCell(-1);
				cell.appendChild(document.createTextNode("��������"));
				cell=row.insertCell(-1);
				cell.appendChild(document.createTextNode("����"));
				if(task && task.PredecessorLinks)
				{
					for(var i=0;i<task.PredecessorLinks.length;i++)
					{
						var link=task.PredecessorLinks[i];
						var row=table.insertRow(-1);
						row.bgColor='#FFFFFF';
						var cell=row.insertCell(-1);
						cell.width="20%";
						cell.appendChild(document.createTextNode(link.PredecessorUID));
						cell=row.insertCell(-1);
						cell.width="40%";
						cell.appendChild(document.createTextNode(link.preTask.Name));
						cell=row.insertCell(-1);
						cell.width="40%";
						cell.appendChild(document.createTextNode(link.getTypeString()));
						SFEvent.bind(cell,"mousedown",this,this.onPredecessorTypeClick(task,i,cell));
					}
				}
				tabInfo.div.appendChild(table);
				break;
			case '��Դ':
				SFEvent.deposeNode(tabInfo.div,true);
				tabInfo.div.style.textAlign="center";
				var table=document.createElement("table");
				table.style.fontSize="12px";
				SFGlobal.setProperty(table,{width:'90%',cellPadding:3,cellSpacing:1,bgColor:'#000000'});

				var row=table.insertRow(-1);
				row.bgColor='#F4F4F4';
				var cell=row.insertCell(-1);
				cell.appendChild(document.createTextNode("��Դ����"));
				cell=row.insertCell(-1);
				cell.appendChild(document.createTextNode("��λ"));
				if(task && task.assignments)
				{
					for(var i=0;i<task.assignments.length;i++)
					{
						var assignment=task.assignments[i];
						if(!assignment.getResource()){continue;}
						var row=table.insertRow(-1);
						row.bgColor='#FFFFFF';
						var cell=row.insertCell(-1);
						cell.appendChild(document.createTextNode(assignment.getResource().Name));
						cell=row.insertCell(-1);
						cell.appendChild(document.createTextNode((assignment.Units?assignment.Units:1)*100+"%"));
					}
				}
				tabInfo.div.appendChild(table);
				break;
		}
	}
	SFGanttTaskInfoDiv.prototype.onPredecessorTypeClick=function(task,i,cell)
	{
		return function(e)
		{
			SFEvent.deposeNode(cell,true);
			SFEvent.clearListeners(cell);
			var link=task.PredecessorLinks[i];
			var reader=this.gantt.data.getTaskReader().children.PredecessorLink;
			SFGanttInputType.show.apply(reader.children.Type,[cell,link.Type]);
		}
	}
	SFGanttTaskInfoDiv.prototype.showInputForm=function(tabInfo,group)
	{
		var task=this.task;
		SFEvent.deposeNode(tabInfo.div,true);
		var table=document.createElement("table");
		table.style.fontSize="12px";
		SFGlobal.setProperty(table,{width:'100%',cellPadding:3});
		tabInfo.div.appendChild(table);
		this.submitHandles=[];

		var taskChildren=this.gantt.data.getTaskReader().children;
		for(var key in taskChildren)
		{
			if(!taskChildren[key].input || taskChildren[key].group!=group){continue;}
			this.showFieldInput(table,taskChildren[key],task,key,taskChildren[key].name);

		}
		var attributes=this.gantt.data.ExtendedAttributes;
		if(attributes && group=="Extended")
		{
			var reader=this.gantt.data.reader.children.ExtendedAttributes.children.ExtendedAttribute.children.FieldName;
			for(var i=0;i<attributes.length;i++)
			{
				this.showFieldInput(table,reader,task,attributes[i].FieldID,attributes[i].FieldName,true);
			}
		}
		if(this.submitHandles.length>0)
		{
			var row=table.insertRow(-1);
			var cell=row.insertCell(-1);
			SFGlobal.setProperty(cell,{colSpan:3,align:'center'});
			var input=document.createElement("input");
			SFGlobal.setProperty(input,{type:'button',value:'Ӧ��'});
			SFEvent.bind(input,"click",this,this.onSubmit);
			cell.appendChild(input);
		}
	}
	SFGanttTaskInfoDiv.prototype.showFieldInput=function(table,reader,task,key,inputName,isExtend)
	{
		var row=table.insertRow(-1);
		var inputNoice=reader.notice;

		var cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode(inputName+':'));

		cell=row.insertCell(-1);
		var value;
		if(task)
		{
			if(isExtend)
			{
				var attributes=task.ExtendedAttributes;
				if(attributes)
				{
					var attribute=task.getExtentedAttribute(key);
					value=attribute?attribute.Value:null;
				}
			}
			else
			{
				value=task[key];
			}
		}
		SFGanttInputType.show.apply(reader,[cell,value]);
		this.submitHandles.push({obj:reader,argu:[cell,task,key,isExtend]});

		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode(inputNoice?inputNoice:''));
	}
	SFGanttTaskInfoDiv.prototype.onSubmit=function()
	{
		var handle;
		while(handle=this.submitHandles.pop())
		{
			var argu=handle.argu;
			if(argu[3])
			{
				var attribute=argu[1].getExtentedAttribute(argu[2],true);
				attribute.node=SFAjax.selectSingleNode(argu[1].node,"ExtendedAttribute/FieldID[.="+argu[2]+"]").parentNode;
				argu[1]=attribute;
				argu[2]="Value";
				SFGanttInputType.parse.apply(handle.obj,argu);
			}
			else
			{
				SFGanttInputType.parse.apply(handle.obj,argu);
			}
		}
	}
	window.SFGanttTaskInfoDiv=SFGanttTaskInfoDiv;