/**
  pc端类之间的通信模块
 */
class dispatch{
  constructor(){
    this.clientList = []
  }
  on(key,fn){
    if(!this.clientList[key]){
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  }
  emit(){
    let key = [].shift.call(arguments);
    let fns = this.clientList[key];
    // 如果没有对应的绑定消息
    if (!fns || fns.length === 0) {
      return false;
    }

    for (let i = 0, fn; fn = fns[i++];) {
      // arguments 是 trigger带上的参数
      fn.apply(this, arguments);
    }
  }
}

const dispatcher = new dispatch();
export default dispatcher