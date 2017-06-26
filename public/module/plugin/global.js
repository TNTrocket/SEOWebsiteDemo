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

export function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}