/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import Swiper from 'swiper'

export default class foreignTeacher{
    constructor(){
        this.domEvent()
    }
    domEvent(){
        let mySwiper = new Swiper('.swiper-container', {
            autoplay: 2000,
            pagination : '.swiper-pagination',
            paginationElement : 'li',
            autoplayDisableOnInteraction : false
        })
    }
}