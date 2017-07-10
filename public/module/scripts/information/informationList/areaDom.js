/**
 * Created by Administrator on 2017/7/7.
 */
export let areaDom = '<div class="searchConditionItem">'+
    '<div class="txt">区域：</div>'+
    '<div class="item"><ul>'+
        '{{#each this}}'+
    '<li><a data-queryitem="{{itemName}}" data-itemname ="{{itemName}}" data-querycategory ="region" >{{itemName}}'+
    '</a></li>'+
        '{{/each}}'+
    '</ul></div>' +
    '<input type="hidden" name="region" value=""/>'+
    '</div>';
