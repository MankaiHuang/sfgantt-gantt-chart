if(!window){var window={};}//����Ϊwsfִ�е�ʱ�򣬴���window����
function LTNS()
{
	window._obscure=true;	//���õ�ǰ�Ǵ��������ģʽ
	//������������������Դ�����л���
	//�����ǲ��ܱ������ı����б�
	function LTObscureJS(names)
	{
		this.setPassword("K_Reverter");
		this.configStr="";	//�����ַ���
		this.defiStr="";	//Ϊ�˶���������ַ���
		this.initStr="";	//API�����г�ʼ��
		this.authStr="";	//API����֤����
		this._version="0.1.20080518";//����������汾
		this.version=1.0;	//API���ݵİ汾
		this.nameSpace="SFNS";	//�����ռ�����
		this.strings=[];	//ʹ�õ����ַ����������
		this.regsStr=[];	//���ַ�������������ʽ�滻������
		this.regObjects=[];	//��������������ʽ�滻������
		this.vPassword="_OBS_Password";
		this.arrString=this.getName();	//�����ַ�����������
		this.rtString=this.getName();	//����ʱ�ַ�����������
		this.fnDecodeString=this.getName();//�ַ������뺯������
		this.fnSetProperty=this.getName();//setProperty��������
		this.objects=[];
		this.commFunctions=[];
		this.hanziReg=new RegExp("[^\\x00-\\xff]");
	}
	LTObscureJS.prototype.getName=function()
	{
		if(!this.nameIndex){this.nameIndex=1;}
		return "_OBS_"+(this.nameIndex++);
	}
	//������������ʽ֮�в���������
	LTObscureJS.getCallback=function(obj,handle){return function(){return handle.apply(obj,arguments)};}
	LTObscureJS.prototype.getReturnString=function(str)
	{

		if(this.hanziReg.test(str))
		{
			str=this.fnDecodeString+"("+str.charAt(0)+LTObscureJS.functionEncodeString(LTObscureJS.getUtmString(str.substr(1,str.length-2)),this.password)+str.charAt(str.length-1)+")";
		}
		else if(str.indexOf("location")>=0 || str.indexOf("script")>=0 || str.indexOf("http")>=0 || str.indexOf("0800 20")>=0)
		{
			str=this.fnDecodeString+"("+str.charAt(0)+LTObscureJS.functionEncodeString(LTObscureJS.getUtmString(str.substr(1,str.length-2)),this.password)+str.charAt(str.length-1)+")";
		}
		return str;
	}
	LTObscureJS.prototype.getString=function(str)
	{
		var s=str.substring(1,str.length-1)
		for(var i=this.regsStr.length-1;i>=0;i--)
		{
			if(s==this.regsStr[i][0])
			{
				str='"'+this.regsStr[i][1]+'"';
				break;
			}
		}
		var index;
		for(index=this.strings.length-1;index>=0;index--)
		{
			var strObj=this.strings[index];
			if(strObj[0].length==str.length && strObj[0].substring(1,strObj[0].length-1)==str.substring(1,str.length-1))
			{
				strObj[1]++;
				break;
			}
		}
		if(index<0)
		{
			index=this.strings.length;
			this.strings.push([str,1]);
		}
		return this.rtString+"["+index+"]";
	}
	//���������ַ�������������
	LTObscureJS.prototype.parseString=function(a,b)
	{
		var strObj=this.strings[parseInt(b)];
		return (strObj.length==3)?this.arrString+"["+strObj[2]+"]":this.getReturnString(strObj[0]);
	}
	LTObscureJS.prototype.parseStringArray=function()
	{
		var j=0,strArray=[];
		for(var i=this.strings.length-1;i>=0;i--)
		{
			var strObj=this.strings[i],len=strObj[0].length;
			if(len>5 && strObj[1]*(len-5)>(len+1))
			{
				strObj.push(j);
				strArray.push(this.getReturnString(strObj[0]));
				j++;
			}
		}
		return strArray;
	}
	LTObscureJS.prototype.parseFunction=function(body)
	{
		body=" "+body.toString();
		//�����ַ�����ע�͵Ĵ���
		if(!this.SACReg)
		{
			this.SACReg=new RegExp("(?:(?:['\"])|(?:/\\*)|(?://))","g");
			this.SACReg1=new RegExp("\\\\[\\S]","g");
			this.SACReg2=new RegExp("^[\\s]*\\:");
			this.SACReg3=new RegExp("(?:(?:\\?)|(?:case))[\\s]*$")
		}
		var result;
		while(result=this.SACReg.exec(body))
		{
			switch(result[0])
			{
				case "\"":
				case "'":
					var startIndex=RegExp.index;
					var endIndex=body.substring(RegExp.index+1).replace(this.SACReg1,"  ").indexOf(result[0]);
					var startBody=body.substr(0,startIndex);
					var endBody=body.substring(startIndex+endIndex+2);
					if(this.SACReg2.test(endBody) && (!this.SACReg3.test(startBody)))
					{
						body=startBody+body.substr(startIndex+1,endIndex)+endBody;
					}
					else
					{
						body=startBody+this.getString(body.substr(startIndex,endIndex+2))+endBody;
					}
					RegExp.index=startIndex;
					break;
				case "//":
					body=body.substring(0,RegExp.index)+body.substring(body.indexOf("\r\n",RegExp.index));
					break;
				case "/*":
					body=body.substring(0,RegExp.index)+body.substring(body.indexOf("*/",RegExp.index)+2);
					break;
			}
		}
		return body;
	}
	LTObscureJS.prototype.loadObjects=function(objects){for(var i=0;i<objects.length;i++){this.loadObject(objects[i]);}}
	LTObscureJS.prototype.loadObject=function(objStr)
	{
		var obj=eval("window."+objStr),supperObj=null,supperName="";
		if(obj.prototype.constructor!=obj)
		{
			supperObj=obj.prototype.constructor;
			for (var key in window){if(window[key]==supperObj){supperName=key;}}
			if(!supperName){WScript.Echo("��"+objStr+"�ĸ���δ֪");}
			if(obj._Inherit)
			{
				supperName=obj._Inherit;
				supperObj=window[supperName];
			}
		}
		if(!obj){WScript.Echo(objStr);}
		var jsobj=[objStr,this.parseFunction(obj),[],[],[]];
		if(supperObj){jsobj.push({supperObj:supperObj,supperName:supperName});}
		var mtd;
		for(mtd in obj)
		{
			if(typeof(obj[mtd])=="function")
			{
				var i=0;
				for(i=0;i<this.commFunctions.length;i++)
				{
					if(this.commFunctions[i].oName==objStr+"."+mtd)
					{
						jsobj[3].push([mtd,null,this.commFunctions[i].fName]);
						break;
					}
				}
				if(i>=this.commFunctions.length)
				{
					jsobj[3].push([mtd,this.parseFunction(obj[mtd]),this.getName()]);
				}
			}
			else if(typeof(obj[mtd])=="string")
				jsobj[4].push([mtd,this.getString("\""+obj[mtd]+"\"")]);
			else if(mtd=="prototype")
				continue;
			else
				alert(objStr+"."+mtd);
		}
		for(mtd in obj.prototype)
		{
			if(supperObj && supperObj.prototype[mtd]==obj.prototype[mtd]){continue;}
			jsobj[2].push([mtd,this.parseFunction(obj.prototype[mtd])]);
		}
		this.objects.push(jsobj);
	}
	LTObscureJS.prototype.getContent=function()
	{
		var content=[];
		var objArray=[];
		for(var i=0;i<this.objects.length;i++)
		{
			var jsobj=this.objects[i];
			content.push("\t"+jsobj[1]+"\r\n");
			if(jsobj[5] && jsobj[5].supperObj)
			{
				content.push("\t"+jsobj[0]+".prototype=new "+jsobj[5].supperName+"()\r\n");
			}
			if(jsobj[2].length>0)
			{
				var property=[];
				var p;
				for(var j=0;j<jsobj[2].length;j++)
				{
					p=jsobj[2][j];
					property.push(""+p[0]+":"+p[1])
				}
				content.push("\t"+this.fnSetProperty+"("+jsobj[0]+".prototype,{"+property+"});\r\n");
			}
			if(jsobj[3].length>0)
			{
				var property=[];
				var p;
				for(var j=0;j<jsobj[3].length;j++)
				{
					p=jsobj[3][j];
					property.push(""+p[0]+":"+p[2]);
					if(p[1])
					{
						content.push("\t"+p[1].replace("function","function "+p[2])+"\r\n");
					}
				}
				content.push("\t"+this.fnSetProperty+"("+jsobj[0]+",{"+property+"});\r\n");
			}
			objArray.push(""+jsobj[0]+":"+jsobj[0]);
		}
		content.push(this.authStr+"\r\n");
		content.push("\t"+this.fnSetProperty+"("+"window"+",{"+objArray+"})\r\n");
		content.push("\t"+this.parseFunction(this.configStr)+"\r\n");
		content.push("\t"+this.parseFunction(this.initStr)+"\r\n");
		var contentStr=content.join("");
		//��̬�����Ĵ���
		for(var i=0;i<this.objects.length;i++)
		{
			var sm=this.objects[i][3];
			for(var j=0;j<sm.length;j++)
			{
				contentStr=contentStr.replace(new RegExp("([^a-zA-Z$])"+this.objects[i][0]+"\\."+sm[j][0]+"([^a-zA-Z$])","gm"),"$1"+sm[j][2]+"$2");
			}
		}
		for(var i=0;i<this.regObjects.length;i++)
		{
			if(this.regObjects[i][2])
			{
				this.defiStr+=this.regObjects[i][2];
			}
			contentStr=contentStr.replace(this.regObjects[i][0],this.regObjects[i][1]);
		}
		//�ַ�������ȡ
		var strArray=this.parseStringArray();
		contentStr=contentStr.replace(new RegExp(this.rtString+"\\[([0-9]+)]","gm"),LTObscureJS.getCallback(this,this.parseString));
		contentStr=this.defiStr+contentStr;
		var str=[];
		str.push("function "+this.nameSpace+"()\r\n");
		str.push("{\r\n");
		str.push("\t"+this.nameSpace+".vinfo={time:'"+new Date()+"',version:'"+this.version+"',ov:'"+this._version+"'};\r\n");
		str.push("\tvar "+this.vPassword+"='"+this.password+"';");
		str.push(this.parseFunction(LTObscureJS.addProperty).replace("function","function "+this.fnSetProperty));
		str.push(this.parseFunction(LTObscureJS.functionDecodeString).replace("function","function "+this.fnDecodeString));
		str.push("\tvar "+this.arrString+"=["+strArray+"];\r\n");
		str.push(contentStr);
		str.push("}\r\n");
		str.push(this.nameSpace+"();");
		return str.join("");
	}
	LTObscureJS.prototype.setPassword=function(password,nochange)
	{
		if(this.passwordNoChange){return false;}
		this.passwordNoChange=nochange;
		this.password=password;
		_OBS_Password=password;
		return true;
	}
	//����ֵ���ú���
	LTObscureJS.addProperty=function(obj,property)
	{
		for(var key in property)
		{
			obj[key]=property[key];
		}
	}
	//�������·����֤
	LTObscureJS.prototype.addScriptAuth=function(str)
	{
		var pass=this.setPassword(LTObscureJS.functionEncodeString(str,false),true);
		var name=this.getName();
		var funcStr="\tvar "+name+"="+this.parseFunction(LTObscureJS.functionScriptAuth)+"\r\n";
		this.authStr+=funcStr;
		if(pass)
		{
			this.authStr+="\tif(!"+name+"("+this.fnDecodeString+"("+this.vPassword+",false)))return false;\r\n";
		}
		else
		{
			this.authStr+="\tif(!"+name+"("+this.getString(LTObscureJS.getTmString("\""+str+"\""))+"))return false;\r\n";
		}
	}
	LTObscureJS.functionScriptAuth=function(str)
	{
		var scripts=document.getElementsByTagName("script");
		var re=new RegExp(str,"i");
		for(var i=0;i<scripts.length;i++)
		{
			var script=scripts[i];
			if(script.src && re.test(script.src))
			{
				break;
			}
		}
		return  !document.all || i<scripts.length;//ע��������֤��ʽ��FireFox�²������ã���˼���document.all��֤FireFox�µ���ֱ֤��ͨ��
	}
	//���������֤����
	LTObscureJS.prototype.addLocationAuth=function(str)
	{
		var pass=this.setPassword(LTObscureJS.functionEncodeString(str,false),true);
		var name=this.getName();
		var funcStr="\tvar "+name+"="+this.parseFunction(LTObscureJS.functionLocationAuth)+"\r\n";
		this.authStr+=funcStr;
		if(pass)
		{
			this.authStr+="\tif(!"+name+"("+this.fnDecodeString+"("+this.vPassword+",false)))return false;\r\n";
		}
		else
		{
			this.authStr+="\tif(!"+name+"("+this.getString(LTObscureJS.getTmString("\""+str+"\""))+"))return false;\r\n";
		}
	}
	LTObscureJS.functionLocationAuth=function(str)
	{
		return new RegExp(str,"i").test(location.href);
	}
	//��ӿͻ���ʱ����֤����
	LTObscureJS.prototype.addDateAuth=function(dates)
	{
		var name=this.getName();
		var funcStr="\tvar "+name+"="+this.parseFunction(LTObscureJS.functionDateAuth)+"\r\n";
		this.authStr+=funcStr;
		this.authStr+="\tif(!"+name+"("+this.getString(LTObscureJS.getTmString("\""+new Date(new Date().valueOf()+dates*1000*60*60*24).toString()+"\""))+"))return false;\r\n";
	}
	//�ͻ���ʱ����֤����
	LTObscureJS.functionDateAuth=function(dateValue)
	{
		return (new Date().valueOf()<=new Date(dateValue).valueOf());
	}
	//���ʹ�ý�ֹ�û��б������֤��ģʽ
	LTObscureJS.prototype.addForbidAuth=function()
	{
		var name=this.getName();
		var funcStr="\tvar "+name+"="+this.parseFunction(LTObscureJS.functionForbidAuth)+"\r\n";
		this.authStr+=funcStr;
		this.authStr+=" if(!"+name+"()){return false;}\r\n";
	}
	//ʹ�ý�ֹ�û��б������֤�ĺ���
	LTObscureJS.functionForbidAuth=function(dateValue)
	{
		var sites=window.forbiddenSites;
		if(sites)
		{
			for(var i=0;i<sites.length;i++)
			{
				if(sites[i][0].test(location.href))
				{
					if(!sites[i][1]){alert(window.forbiddenNotice);}
					else{setTimeout(function(){alert(window.forbiddingNotice)},1000)}
					return sites[i][1];
				}
			}
		}
		return true;
	}
	//����ת�崦����ַ���
	LTObscureJS.getUtmString=function(str)
	{
		var index=0;
		for(;;)
		{
			index=str.indexOf("\\",index);
			if(index<0){break;}
			str=str.substr(0,index+0)+str.substr(index+1);
			index++;
		}
		return str;
	}
	//�ַ���ת��
	LTObscureJS.getTmString=function(str)
	{//alert(str);
		str=str.replace(new RegExp("\\\\","gi"),"\\\\");
		return str;
	}
	//�����ַ�������ĺ���
	LTObscureJS.functionEncodeString=function(str,password)
	{
		password=password==false?password:_OBS_Password;
		var passIndex,passLength;
		if(password)
		{
			passIndex=0;
			passLength=password.length;
		}
		var num=0,byt=0;
		var len=str.length;
		var resultStr="";
		for(var i=0;i<len;i++)
		{
			var code=str.charCodeAt(i);
			if(code>=2048)		//0800 - FFFF 1110xxxx 10xxxxxx 10xxxxxx 
			{
				byt=(byt<<24)+(((code>>12)|0xe0)<<16)+((((code&0xfff)>>6)|0x80)<<8)+((code&0x3f)|0x80);
				num+=24;
			}
			else if(code>=128)	//0080 - 07FF 110xxxxx 10xxxxxx 
			{
				byt=(byt<<16)+(((code>>6)|0xc0)<<8)+((code&0x3f)|0x80);
				num+=16;
			}
			else			//0000 - 007F 0xxxxxxx 
			{
				num+=8;
				byt=(byt<<8)+code;
			}
			while(num>=6)
			{
				var b=byt>>(num-6);
				byt=byt-(b<<(num-6));
				num-=6;
				if(password)
				{
					b=(b+password.charCodeAt(passIndex++))%64;
					passIndex=passIndex%passLength;
				}
				/*
					b	0-9		����0-9		b+48
					b	10-35	��ĸA-Z		b+65-10=b+55
					b	36-61	��ĸa-z		b+97-36=b+61
					b	62		�ַ�,		44
					b	63		�ַ�_		95
				*/
				var code=(b<=9)?(b+48):((b<=35)?(b+55):((b<=61)?(b+61):((b==62)?44:95)));
				resultStr+=String.fromCharCode(code);
			}
		}
		if(num>0)
		{
			var b=byt<<(6-num);
			if(password)
			{
				b=(b+password.charCodeAt(passIndex++))%64;
				passIndex=passIndex%passLength;
			}

			resultStr+=String.fromCharCode((b<=9)?(b+48):((b<=35)?(b+55):((b<=61)?(b+61):((b==62)?44:95))));
		}
		return resultStr;
	}
	//�����ַ�������ĺ���
	LTObscureJS.functionDecodeString=function(str,password)
	{
		password=(password===false)?password:_OBS_Password;
		var passIndex,passLength;
		if(password)
		{
			passIndex=0;
			passLength=password.length;
		}
		var num=0,byt=0;
		var len=str.length;
		var resultStr=new String();
		var preNum=-1;
		var preIndex=0;
		for(var i=0;i<len;i++)
		{
			var code=str.charCodeAt(i);
			code=(code==95)?63:((code==44)?62:((code>=97)?(code-61):((code>=65)?(code-55):(code-48))));
			if(password)
			{
				code=(code-password.charCodeAt(passIndex++)+128)%64;
				passIndex=passIndex%passLength;
			}

			byt=(byt<<6)+code;
			num+=6;
			while(num>=8)
			{
				var b=byt>>(num-8);
				if(preIndex>0)
				{
					preNum=(preNum<<6)+(b&(0x3f));
					preIndex--;
					if(preIndex==0){resultStr+=String.fromCharCode(preNum);}
				}
				else
				{
					if(b>=224)
					{
						preNum=b&(0xf);
						preIndex=2;
					}
					else if(b>=128)
					{
						preNum=b&(0x1f);
						preIndex=1;
					}
					else
					{
						resultStr+=String.fromCharCode(b);
					}
				}
				byt=byt-(b<<(num-8));
				num-=8;
			}
		}
		return resultStr;
	}
	window.LTObscureJS=LTObscureJS;
}
LTNS();