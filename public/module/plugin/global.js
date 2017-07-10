import $ from 'jquery'


export  function evaluate() {
    let viewMoreEvaluateBtn = $(".viewMoreEvaluateBtn");
    let evaluate = $(".evaluate");
    let packUpEvaluate = $(".packUpEvaluate")
    viewMoreEvaluateBtn.click(function () {
        evaluate.show();
        viewMoreEvaluateBtn.hide();
        packUpEvaluate.show();
    })
    packUpEvaluate.click(function () {
        evaluate.hide();
        viewMoreEvaluateBtn.show();
        packUpEvaluate.hide();
    })
}
export function navEvent() {
    let navMoreList = $(".navMoreList");
    $(".homePageNav a").click(function () {
        let nav = $(this).data("nav");
        switch (nav){
            // case "teacher":
            //     window.location.href = "/selectTeacher"
            //     break;
            // case "information":
            //     window.location.href = "/information"
            //     break;
            // case "example":
            //     window.location.href = "/successCase"
            //     break;
            case "more":
                $(this).toggleClass("blueColor");
                navMoreList.toggleClass("toggleList");
                break;
        }
    })
}

export function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}

export function locationStorage() {
    function set(name,value) {
        if(typeof value === "object"){
            value = JSON.stringify(value)
        }
        window.localStorage.setItem(name,value)
    }
    function get(name) {
       return window.localStorage.getItem(name)
    }
    function remove(name) {
        window.localStorage.getItem(name)
    }
    function clear() {
        window.localStorage.clear()
    }

    return{
        getLocationStorage : get,
        setLocationStorage : set,
        removeLocationStorage : remove,
        clearLocationStorage : clear
    }
}

export let locationTemp = '<div class="globalModal locationModal">'+
    '<div class="tooltip">'+
    '<div class="close" data-role ="close" ></div>'+
    '<div>当前城市：<span class="locationModalName"></span></div>'+
    '</div>'+
    '<ul>'+
    '{{#each this}}'+
    '<li data-location="{{this}}">{{this}}</li>'+
    '{{/each}}'+
    '</ul></div>;';

export function isEmptyObject(e) {
    let t;
    for (t in e){
        return false;
    }
    return true
}

