var {md5} = require('./util/md5.js');
var {
  parseColor,
  parseColorScheme,
  parseCssClass,
  parseEmail,
  parseImgFormat,
  parseImgRes,
  parseInitials,
  parsePriority,
  parseProtocol,
} = require('./util/parse.js');
var {generateGravatarUrl} = require('./util/gravatar.js');
var {renderSA} = require('./render.js');

function smartAvatar(element, options) {
  var saData = {};

  if (!arguments[1]) {
    var options = {};
  }

  if (!arguments.length) {
    throw new Error("SmartAvatar ERROR: missing 'element' argument.")
  } else if (arguments[1] === 'dispose') {
    const saChildren = element.querySelectorAll(".smart-avatar");

    for (let i = 0; i < saChildren.length; i++) {
      element.removeChild(saChildren[i]);
    }

    if (element.querySelectorAll(".smart-avatar").length > 0) {
      throw new Error("SmartAvatar ERROR: could not dispose SmartAvatar nodes." + element.querySelectorAll(".smart-avatar").length + "left.");
    } else {
      return;
    }
  } else if (arguments[1] && (typeof arguments[1] !== 'object')) {
    throw new Error("SmartAvatar ERROR: 'options' argument must be an object.");
  }

  var isElement = function(element) {
    return element instanceof Element || element instanceof HTMLDocument;
  }

  if (isElement(element)) {
    saData.parent = element;
  } else {
    var type = typeof element;
    throw new Error('SmartAvatar ERROR: cannot append asset to ' + type + '.');
  }

  saData.priority = options.priority ? parsePriority(options.priority) : {src1:'gravatar',src2:'src',src3:'smart'};
  saData.timestamp = typeof options.timestamp === 'boolean' ? options.timestamp : false;
  saData.alt = options.alt ? options.alt.toString() : null;
  saData.icon = options.icon ? options.icon.toString() : 'smartfox';
  saData.size = options.size ? parseImgRes(options.size.toString()) : null;
  saData.round = options.round === true ? true : false;
  saData.initials = options.initials ? parseInitials(options.initials.toString()) : null;
  saData.color = options.color ? parseColor(options.color.toString()) : null;
  saData.textColor = options.textColor ? parseColor(options.textColor.toString()) : null;
  saData.colorScheme = options.colorScheme ? parseColorScheme(options.colorScheme) : null;
  saData.cssClass = options.cssClass ? parseCssClass(options.cssClass.toString()) : null;
  saData.email = options.email ? parseEmail(options.email.toString()) : null;
  saData.hash = (options.hash ? options.hash.toString() : false) || (saData.email ? md5(saData.email) : null);
  saData.protocol = options.protocol ? parseProtocol(options.protocol.toString()) : 'secure';
  saData.format = options.format ? parseImgFormat(options.format.toString()) : 'jpg';
  saData.resolution = options.resolution ? parseImgRes(options.resolution.toString()) : '80';
  saData.src = options.src ? options.src.toString() : null;

  saData.unstyled = options.unstyled === true ? true : false;

  if (!saData.unstyled && options.setDefaults) {
    saData.color = saData.color || '#777';
    saData.size = saData.size || '48';
    saData.textColor = saData.textColor || '#FFF';
  }

  saData.gravatarUrl = saData.hash ? generateGravatarUrl(saData) : '';
  
  var asset = renderSA(element, saData);

  element.appendChild(asset);
}

module.exports = smartAvatar;
module.exports.default = smartAvatar;
