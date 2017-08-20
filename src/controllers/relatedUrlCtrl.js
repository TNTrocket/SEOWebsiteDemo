/**
 * Created by tseian on 07/08/2017.
 */
const BaseCtrl = require('../controllers/baseCtrl');
const RelatedUrlModel = require('../models/relatedUrlModel');
const assert = require('assert');
class RelatedUrlCtrl extends BaseCtrl {

  /**
   * 根据status 获取相应的链接
   * @param status
   * @returns {*}
   */
  async list(status) {
    let where = {};
    if (status) {
      where.status = parseInt(status) || 1;
    }
    let list = await RelatedUrlModel.findAll({ where });
    return { success: true, msg: '获取成功', data: list };
  }

  /**
   * 增加一个relatedUrl
   * @param params
   */
  async add(name, url, createBy) {
    assert(name, '400 链接名字不正确');
    assert(url, '400 链接不正确');
    let now = new Date().getTime();
    let values = {
      ru_name: name,
      ru_url: url,
      ru_create_by: createBy,
      ru_update_by: createBy,
      ru_create_time: now,
      ru_update_time: now
    };
    let relatedUrl = await RelatedUrlModel.create(values);
    return { success: true, msg: '创建成功', data: relatedUrl };
  }

  /**
   * 删除一个链接
   * @param id
   * @returns {*}
   */
  async del(id) {

    let result = await this.updateStatus(0, id);

    if (result.success) {
      return {
        success: true, msg: '删除成功', data: result.data
      };
    } else {
      return { success: false, msg: ' 操作失败' };
    }

  }

  /**
   * 更新状态
   * @param status
   * @param id
   * @returns {*}
   */
  async updateStatus(status, id) {

    let values = { ru_status: status };
    let count = await RelatedUrlModel.update(values, { where: { ru_id: id } });
    return { success: true, msg: '更新成功', data: await RelatedUrlModel.findById(id) };
  }


  /**
   * 恢复一个链接
   * @param id
   */
  async resume(id) {

    let result = await this.updateStatus(1, id);
    if (result.success) {
      return { success: true, msg: '恢复成功', data: result.data };
    } else {
      return { success: false, msg: ' 操作失败' };
    }
  }

  async update(name, url, id) {

    let values = { ru_name: name, ru_url: url };
    let count = await RelatedUrlModel.update(values, { where: { ru_id: id } });
    if (count >= 1) {
      return { success: true, msg: '更新成功', data: await RelatedUrlModel.findById(id) };
    } else {
      return { success: false, msg: ' 操作失败' };
    }

  }

}


module.exports = new RelatedUrlCtrl();