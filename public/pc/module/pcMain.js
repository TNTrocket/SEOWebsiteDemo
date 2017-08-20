import * as route from './pcRoutes'
import $ from 'jquery'
/**
 * 入口
 */
let pageType = $("#pageType").data("pagetype");

 new route[pageType]();