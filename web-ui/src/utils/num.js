import Vue from 'vue'

const __localEnumBean = {
  effectiveness : {
    items : [
      {id:0,name:'无效'},
      {id:1,name:'有效'}
    ]
  },
  haveNo : {
    items : [
      {id:0,name:'无'},
      {id:1,name:'有'}
    ]
  }
}



const __remoteEnumBean = {};



const local = {
  items : function (enumType) {
    const enumTypeBean = __localEnumBean[enumType];
    if(!enumTypeBean){
      return null;
    }
    return enumTypeBean.items;
  },
  item : function (enumType,itemCode) {
    const enumTypeBean = __localEnumBean[enumType];
    if(!enumTypeBean || !enumTypeBean.items){
      return null;
    }
    const items = enumTypeBean.items;
    for(let i=0;i<items.length;i++){
      if(items[i].id == itemCode){
        return items[i].name;
      }
    }
  }
}

const remote = {
  type : function(enumTypeCode){
    enumTypeCode = enumTypeCode.toLowerCase();
    return __remoteEnumBean[enumTypeCode];
  },
  item : function (enumType,itemId) {
    if(!enumType || !itemId){
      return null;
    }
    let enumTypeBean = __remoteEnumBean[enumType.toLowerCase()];
    if(enumTypeBean == null){
      enumTypeBean = {code : enumType,children : []};
    }
    const items = enumTypeBean.children;
    for(let i=0;i<items.length;i++){
      if(items[i].id == itemId){
        return items[i].name;
      }
    }
    const newItem = {id:itemId,name:''};
    items.push(newItem);
    return newItem.name;
  },
  itemByCode : function (enumType,itemCode) {
    if(!enumType || !itemCode){
      return null;
    }
    let enumTypeBean = __remoteEnumBean[enumType.toLowerCase()];
    if(enumTypeBean == null){
      enumTypeBean = {code : enumType,children : []};
    }
    const items = enumTypeBean.children;
    for(let i=0;i<items.length;i++){
      if(items[i].code == itemCode){
        return items[i].name;
      }
    }
  },
  items : function(enumTypeCode){
    enumTypeCode = enumTypeCode.toLowerCase();//需要转成小写
    let enumTypeBean = this.type(enumTypeCode);
    if(enumTypeBean == null || enumTypeBean.children == null){
      enumTypeBean = {code : enumTypeCode,children : []};
      __remoteEnumBean[enumTypeCode] = enumTypeBean
    }
    return enumTypeBean.children;
  },
  load : function (typeCodeArr,callback) {
    Vue.prototype.$$request.get({
      url : '/api/v1/enum/load',
      params : {
        types : typeCodeArr.join(",")
      },
      success_callback : (header,body) => {
        for(let i=0;i<typeCodeArr.length;i++){
          const key = typeCodeArr[i].toLowerCase();
          const enumBean = body && body[key] || {code : key}
          Vue.prototype.$$enum.remote.set(enumBean);
        }
        callback && callback(body);
      },
      loading : false
    })
  },
  /**
   * 远程枚举如果已存在必须先清空再推入新值，不能直接覆盖，否则无法在NamekEnum里绑定联动
   * @param enumList
   */
  set : function (enumList) {
    if(!enumList){
      return;
    }
    if(!(enumList instanceof Array)){
      enumList = [enumList];
    }
    for(let i=0;i<enumList.length;i++){
      const enumType = enumList[i];
      const code = enumType.code.toLowerCase();//编码转小写
      let typeBean = __remoteEnumBean[code];

      if(typeBean == null){
        typeBean = __remoteEnumBean[code] = {code:enumType.code,name:enumType.name,children:[],remark:enumType.remark};
      }else if(typeBean.children != null){
        typeBean.children.splice(0,typeBean.children.length);//如果已经存在，则需要先清空ß
      }
      if(enumType.children) {
        const oldItems = typeBean && typeBean.children;
        for (let k = 0; k < enumType.children.length; k++) {
          const newItem = enumType.children[k];
          const oldItem = Vue.prototype.$$.matchItem(oldItems,newItem.id,'id');
          if(oldItem){
            oldItem.name = newItem.name;
            typeBean.children.push(oldItem);
          }else{
            typeBean.children.push(newItem);
          }

        }
      }
    }
  }

}



export default {local,remote}
