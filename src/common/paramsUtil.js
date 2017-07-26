/**
 * Created by tseian on 25/07/2017.
 */

module.exports = {
  async parseParams(queryString){
    let alphabets = queryString.match(/[a-z]+/g);
    let params = queryString.match(/\d+/g);
    let tem = [];
    for (let i = 0; i < params.length; i++) {
      let ap = {};
      ap[alphabets[i]] = params[i];
      tem.push(ap);
    }
    return tem;
  }
};
