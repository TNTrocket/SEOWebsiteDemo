/**
 * Created by tseian on 25/07/2017.
 */

module.exports = {
  async parseParams(queryString) {
    if (!queryString) return [];
    let alphabets = queryString.match(/[a-z]+/g);
    let params = queryString.match(/\d+/g);
    let tem = [];
    for (let i = 0; i < params.length; i++) {
      let ap = {};
      ap[alphabets[i]] = parseInt(params[i]);
      tem.push(ap);
    }
    return tem;
  }
};
