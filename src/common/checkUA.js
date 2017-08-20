function check(req) {

  let deviceAgent = req.headers['user-agent'] || req.get('User-Agent');
  if (deviceAgent) {
    deviceAgent = deviceAgent.toLowerCase();
    return (deviceAgent.match(/(iphone|ipod|ipad|android)/));
  } else {
    return false;
  }

}
module.exports = check;