var {
  parseProtocol,
  parseImgFormat,
  parseGravatarURIRes
} = require('./parse.js');

function generateGravatarUrl(saData) {
  var imgProtocol = parseProtocol(saData.protocol);
  var imgFormat = parseImgFormat(saData.format);
  var imgRes = parseGravatarURIRes(saData.resolution);
  var queryString = '?d=404&' + imgRes;
  var gravatarUrl = imgProtocol + 'www.gravatar.com/avatar/' + saData.hash + '.' + imgFormat + queryString;

  return gravatarUrl;
}

module.exports.generateGravatarUrl = generateGravatarUrl;