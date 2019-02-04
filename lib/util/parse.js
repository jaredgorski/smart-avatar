function parseInitials(initialsStr) {
  var initials;

  if ((initialsStr.length > 1) && initialsStr.indexOf(' ') != -1) {
    var splitInit = initialsStr.split(' ')
    initials = splitInit[0][0] + splitInit[1][0];
  } else if (initialsStr.length > 1) {
    initials = initialsStr[0] + initialsStr[1];
  } else {
    initials = initialsStr;
  }

  var upperInitials = initials.toUpperCase();
  return upperInitials;
}

function parsePriority(priorityArr) {
  var allowedEntries = ['gravatar','src','smart'];
  var priorityObj = {};

  for (let i = 0; i < priorityArr.length; i++) {
    if ((allowedEntries.indexOf(priorityArr[i].toString()) != -1) &&
      (Object.values(priorityObj).indexOf(priorityArr[i].toString()) === -1)) {
        var key = 'src' + (i + 1);
        priorityObj[key] = priorityArr[i].toString();
    }
  }

  return priorityObj;
}

function parseEmail(emailStr) {
  var email;

  if (emailStr.indexOf('@') != -1) {
    email = emailStr.trim().toLowerCase();
  } else {
    email = null;
  }

  return email;
}

function parseImgFormat(formatStr) {
  var format;

  switch (true) {
    case (formatStr.toLowerCase().indexOf('png') != -1):
      format = 'png';
      break;
    case ((formatStr.toLowerCase().indexOf('jpg') != -1) || (formatStr.toLowerCase().indexOf('jpeg') != -1)):
      format = 'jpg';
      break;
    case (formatStr.toLowerCase().indexOf('tiff') != -1):
      format = 'tiff';
      break;
    default:
      format = 'jpg';
  }

  return format;
}

function parseImgRes(resStr) {
  var resNum = parseInt(resStr, 10);
  var resString;

  switch (true) {
    case (!isNaN(resNum)):
      resString = resNum.toString();
      break;
    default:
      resString = '80';
  }

  return resString;
}

function parseColor(colorStr) {
  return colorStr;
}

function parseColorScheme(colorArr) {
  return colorArr;
}

function parseProtocol(protocolStr) {
  var protocalString;

  switch(protocolStr) {
    case 'agnostic':
      protocalString = '//';
      break;
    case 'secure':
      protocalString = 'https://';
      break;
    case 'unsecure':
      protocalString = 'http://';
      break;
    default:
      protocalString = 'https://';
  }

  return protocalString;
}

function parseGravatarURIRes(res) {
  var resString = parseImgRes(res.toString())
  var resQuery = 's=' + resString;

  return resQuery;
}

module.exports.parseColor = parseColor;
module.exports.parseColorScheme = parseColorScheme;
module.exports.parseEmail = parseEmail;
module.exports.parseGravatarURIRes = parseGravatarURIRes;
module.exports.parseImgFormat = parseImgFormat;
module.exports.parseImgRes = parseImgRes;
module.exports.parseInitials = parseInitials;
module.exports.parsePriority = parsePriority;
module.exports.parseProtocol = parseProtocol;
