import $ from 'jquery'


export default class teacherEvaluate{
    constructor(){
        this.domEvent();
    }
    domEvent(){
        this.evaluateEvent();
    }
    evaluateEvent(){
        let goodEvaluate = $(".goodEvaluate");
        let middleEvaluate = $(".middleEvaluate");
        let badEvaluate = $(".badEvaluate");

        $("[data-evaluatetype]").click(function () {
            let evaluateType = $(this).data("evaluatetype");
            $(this).addClass("blueColor").siblings("div").removeClass("blueColor");
            $(this).children("span").addClass("activeBorder").closest("div").siblings("div").children("span").removeClass("activeBorder");
            switch (evaluateType){
                case "good":
                    goodEvaluate.fadeIn();
                    middleEvaluate.hide();
                    badEvaluate.hide();
                    break;
                case "middle":
                    goodEvaluate.hide();
                    middleEvaluate.fadeIn();
                    badEvaluate.hide();
                    break;
                case "bad":
                    goodEvaluate.hide();
                    middleEvaluate.hide();
                    badEvaluate.fadeIn();
                    break;
            }
        })
    }
}