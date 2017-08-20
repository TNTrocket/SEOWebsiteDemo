import basic from '../global/basic'
import dispatcher from '../global/dispatch'

export default  class test extends basic{
  constructor(){
    super();
  }
  render(){
    // let pp = new dispatch();
    dispatcher.emit('test',function () {
      alert("ttyy")
    })
  }
}