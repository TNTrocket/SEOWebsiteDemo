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
        window.localStorage.removeItem(name)
    }
    function clear() {
        window.localStorage.clear()
    }

    return{
        get : get,
        set : set,
        remove : remove,
        clearLocationStorage : clear
    }
}


export function isEmptyObject(e) {
    let t;
    for (t in e){
        return false;
    }
    return true
}

