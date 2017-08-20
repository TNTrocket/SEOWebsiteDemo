/**
 * Created by tseian on 02/08/2017.
 */

const siteMapCtrl = require('../controllers/siteMapCtrl');
const columnCtrl = require('../controllers/columnCtrl');
module.exports = {
  async init(){
    await columnCtrl.rmCacheColumns();
    await columnCtrl.cacheColumns();
    await siteMapCtrl.init();
  }
};
