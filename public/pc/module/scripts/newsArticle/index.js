import $ from "jquery"
import basic from '../global/basic'


export default class newsArticle extends basic{
  constructor(){
    super();
  }
  initData() {
    this.eventList = {}
  }
  render(){

    this.bindEVent();
  }
}