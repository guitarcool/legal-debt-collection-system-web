export function initObj (obj) {
  if (obj instanceof Array) {
    obj = []
  } else if (obj instanceof Object) {
    for (let index in obj) {
      if (obj[index] instanceof Array) {
        obj[index] = []
      } else if (obj[index] instanceof Object) {
        initObj(obj[index])
      } else {
        switch(true)
        {
          case (index == 'pageNum'):
            obj[index]=0
            break;
          case (index == 'pageSize'):
            obj[index]=10
            break;
          case (index == 'total'):
            obj[index]=0
            break;
          default:
            obj[index] = ''
        }
      }
    }
  } else {
    obj = ''
  }
}

export function automatic (orginData, targetData) {

}

export function guid () {
  // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
