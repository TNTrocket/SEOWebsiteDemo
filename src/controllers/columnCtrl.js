/**
 * Created by tseian on 02/08/2017.
 */

const ColumnModel = require('../models/columnModel');
const redis = require('../config/redis');
const sequlize = require('../config/sequelize');
class ColumnCtrl {
  constructor() {

  }

  /**
   * 在redis中缓存 所有栏目
   */
  async cacheColumns() {
    let columns = await ColumnModel.findAll({ where: { c_status: 1 }, order: 'c_id asc' });
    for (let i = 0; i < columns.length; i++) {
      await redis.hmsetAsync('column.' + i, columns[i].dataValues);
    }
    console.log('所有栏目的数据已经缓存在redis');
  }

  /**
   * 从redis中清楚 栏目缓存  在有更新的情况下调用
   */
  async rmCacheColumns() {
    let count = await ColumnModel.findAll();
    for (let i = 0; i < count; i++) {
      await redis.delAsync('column.' + i);
    }
    console.log('已清除所有缓存在redis里面的栏目数据');
  }

  /**
   * 获取一个栏目
   * @param columnNO
   * @returns {*}
   */
  async getColumnsByColumnNO(columnNO) {
    let column = await redis.hgetallAsync(columnNO);
    if (!column) {
      await this.rmCacheColumns();
      await this.cacheColumns();
      column = await redis.hgetallAsync(columnNO);
    }
    return column;
  }

  /**
   * 将栏目tkd {} 里面的参数填值
   * @param column
   */
  async parseTKD(column, options) {
    console.log('options==', options);
    let tkd = {};
    tkd.title = column.c_title || '';
    tkd.keyWords = column.c_keywords || '';
    tkd.description = column.c_description || '';
    let keys = Object.keys(options);

    for (let op of keys) {
      let reg = new RegExp("\{" + op + "\}", 'g');
      tkd.title = tkd.title.replace(reg, options[op]);
      tkd.keyWords = tkd.keyWords.replace(reg, options[op]);
      tkd.description = tkd.description.replace(reg, options[op]);
    }
    return tkd;
  }

  /**
   * 修改index 首页栏目的tkd
   * @param params
   */
  async updateIndexTkd(params) {
    params.id = 1;
    return this.updateTkd(params);
  }

  /**
   * 修改栏目的tkd
   * @param params
   */
  async updateTkd(params) {
    let { id, title, keywords, description } = params;
    let count = await ColumnModel.update({
      c_title: title,
      c_keywords: keywords,
      c_description: description,
      c_update_time: new Date().getTime()
    }, { where: { c_id: id } });
    if (count) {
      await this.rmCacheColumns();
      await this.cacheColumns();
      return { success: true, msg: '修改成功', data: await ColumnModel.findById(id) };
    } else {
      return { success: false, msg: '操作失败' };
    }
  }

}

module.exports = new ColumnCtrl();