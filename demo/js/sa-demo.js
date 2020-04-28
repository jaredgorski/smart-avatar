function renderSA(element, saData) {
  var creation = create(element, saData);

  if (creation.finished) {
    return creation.asset;
  } else {
    throw new Error("SmartAvatar ERROR: something went wrong.");
  }
}

function create(element, saData) {
  var gravatarIcons = ['mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash'];
  var creation = {};
  switch (true) {
    case (saData.priority.src1 === 'smart' && saData.initials):
      creation.asset = generateEl('initEl', saData);
      creation.finished = true;
      break;
    case (saData.priority.src1 === 'smart' 
      && saData.icon 
      && !gravatarIcons.includes(saData.icon)):
      creation.asset = generateEl('iconEl', saData);
      creation.finished = true;
      break;
    case (saData.priority.src1 === 'smart' 
      && saData.icon 
      && gravatarIcons.includes(saData.icon)):
      creation.asset = generateEl('iconImg', saData);
      creation.finished = true;
      break;
    default:
      creation.asset = generateComplexImage(element, saData);
      creation.finished = true;
  }

  return creation;
}

function generateEl(type, saData) {
  switch (type) {
    case 'iconImg':
      return generateIconImg(saData);
    case 'initEl':
      return generateInitEl(saData);
    case 'iconEl':
      return generateIconEl(saData);
  }
}

function generateGravatarIconUrl(gravatarIcon) {
  var url = 'https://www.gravatar.com/avatar?d=' + gravatarIcon + '&f=y';
  return url;
}

function generateIconImg(saData) {
  var img = new Image();
  var iconUrl = generateGravatarIconUrl(saData.icon);
  img.src = iconUrl;

  if (!saData.unstyled) {
    img.style.cssText = (saData.round ? 'border-radius: 50%;' : '') + 
      (saData.size ? 'height:' + saData.size + 'px;width:' + saData.size +'px;' : '')
       + 'object-fit:cover;';
  }

  img.classList.add('smart-avatar');

  if (saData.cssClass) {
    const length = saData.cssClass.length;
    for (let i = 0; i < length; i++) {
      img.classList.add(saData.cssClass[i]);
    }
  }

  if (saData.timestamp) {
    img.setAttribute('sa_timestamp', Date.now());
  }

  if (saData.alt) {
    img.alt = saData.alt;
  }

  return img;
}

function generateInitEl(saData) {
  var el = generateElement('initEl', saData);
  return el;
}

function generateIconEl(saData) {
  var el = generateElement('iconEl', saData);
  return el;
}

function generateElement(type, saData) {
  var content;
  if (type === 'initEl') {
    content = saData.initials;
  } else if (type === 'iconEl') {
    content = renderSmartFox(saData);
  }

  var div = document.createElement("div");

  if (!saData.unstyled) {
    div.style.cssText = (saData.round ? 'border-radius: 50%;' : '') + 
      'align-items:center;' + (saData.color ? 'background-color:' + saData.color : '') + 
      (saData.textColor ? ';color:' + saData.textColor : '') + 
      ';display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",'
       + 'Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;' + 
      (saData.size ? 'font-size:' + (saData.size / 2) + 'px;height:' + saData.size + 
      'px;' : '') + 'justify-content:center;margin:0;padding:0;' + 
      (saData.size ? 'width:' + saData.size +'px;' : '');
  }

  div.classList.add('smart-avatar');

  if (saData.cssClass) {
    const length = saData.cssClass.length;
    for (let i = 0; i < length; i++) {
      div.classList.add(saData.cssClass[i]);
    }
  }

  if (saData.timestamp) {
    div.setAttribute('sa_timestamp', Date.now());
  }
  div.innerHTML = '<span ' + (saData.unstyled ? '' : 'style="display:flex;"')
     + '>' + content + '</span>';

  return div;
}

function generateComplexImage(element, saData) {
  var assets = parseComplexAssets(saData);
  var a1 = assets.asset1;
  var a2 = assets.asset2;
  var a3 = assets.asset3;

  var img = new Image();
  img.src = a1.content;

  if (!saData.unstyled) {
    img.style.cssText = (saData.round ? 'border-radius: 50%;' : '') + 
      (saData.size ? 'height:' + saData.size + 
      'px;width:' + saData.size +'px;' : '') + 
      'object-fit:cover;';
  }

    img.onerror = function() {
    handleErrFallback(element, img, a2);

    if (a2.type !== 'el') {
      img.onerror = function() {
        handleErrFallback(element, img, a3);
      };
    }
  };

  img.classList.add('smart-avatar');

  if (saData.cssClass) {
    const length = saData.cssClass.length;
    for (let i = 0; i < length; i++) {
      img.classList.add(saData.cssClass[i]);
    }
  }

  if (saData.timestamp) {
    img.setAttribute('sa_timestamp', Date.now());
  }

  if (saData.alt) {
    img.alt = saData.alt;
  }

  return img;
}

function handleErrFallback(element, img, asset) {
  img.style.opacity = 0;

    if (asset.type === 'el') {
    delete img.onerror;
    element.appendChild(asset.content);
    element.removeChild(img);
  } else {
    img.src = asset.content;
    img.style.opacity = 1;

    if (!img.src) {
      throw new Error("SmartAvatar ERROR: internal error - img src recursively undefined")
    }
  }
}

function parseComplexAssets(saData) {
  var gravatarIcons = ['mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash'];
  var assets = {
    asset1: {},
    asset2: {},
    asset3: {},
  };

  assets.asset1.content = saData.priority.src1 === 'gravatar' 
    ? saData.gravatarUrl 
    : saData.src;

  assets.asset1.type = 'url';

  for (var i = 2; i <= 3; i++) {
    var srcKey = 'src' + i;
    var assetKey = 'asset' + i;

    if (saData.priority[srcKey] === 'gravatar') {
      assets[assetKey].content = saData.gravatarUrl;
      assets[assetKey].type = 'url';
    } else if (saData.priority[srcKey] === 'src') {
      assets[assetKey].content = saData.src;
      assets[assetKey].type = 'url';
    } else if (saData.priority[srcKey] === 'smart') {
      if (saData.initials) {
        assets[assetKey].content = generateEl('initEl', saData);
        assets[assetKey].type = 'el';
      } else if (saData.icon && !gravatarIcons.includes(saData.icon)) {
        assets[assetKey].content = generateEl('iconEl', saData);
        assets[assetKey].type = 'el';
      } else if (saData.icon && gravatarIcons.includes(saData.icon)) {
        assets[assetKey].content = generateGravatarIconUrl(saData.icon);
        assets[assetKey].type = 'url';
      }
    }
  }

  return assets;
}

function renderSmartFox(saData) {
  return '<svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="300" cy="300" r="144" fill="#DE8927" stroke="#333" stroke-width="12"/><rect x="236" y="231" width="24" height="36" rx="12" fill="#333"/><rect x="340" y="231" width="24" height="36" rx="12" fill="#333"/><mask id="a" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M431.255 339L300 362.374 168.745 339H167.5c16.039 57.017 69.286 98.888 132.5 98.888S416.461 396.017 432.5 339h-1.245z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M431.255 339L300 362.374 168.745 339H167.5c16.039 57.017 69.286 98.888 132.5 98.888S416.461 396.017 432.5 339h-1.245z" fill="#DEDEDE"/><path d="M300 362.374l-.526 2.953.526.094.526-.094-.526-2.953zM431.255 339v-3h-.265l-.261.046.526 2.954zm-262.51 0l.526-2.954-.261-.046h-.265v3zm-1.245 0v-3h-3.96l1.072 3.812L167.5 339zm265 0l2.888.812L436.46 336h-3.96v3zm-131.974 26.327l131.255-23.373-1.052-5.908-131.255 23.374 1.052 5.907zm-132.307-23.373l131.255 23.373 1.052-5.907-131.255-23.374-1.052 5.908zm.526-5.954H167.5v6h1.245v-6zm-4.133 3.812c16.403 58.31 70.829 101.076 135.388 101.076v-6c-61.869 0-113.937-40.976-129.612-96.7l-5.776 1.624zM300 440.888c64.559 0 118.985-42.766 135.388-101.076l-5.776-1.624c-15.675 55.724-67.743 96.7-129.612 96.7v6zM432.5 336h-1.245v6h1.245v-6z" fill="#B06B1C" mask="url(#a)"/><circle cx="300" cy="360" r="12" fill="#333"/></svg>';
}





export default function smartAvatar(element, options) {
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
    saData.color = saData.color || '#AAA';
    saData.size = saData.size || '48';
    saData.textColor = saData.textColor || '#FFF';
  }

  saData.gravatarUrl = saData.hash ? generateGravatarUrl(saData) : '';

    var asset = renderSA(element, saData);

  element.appendChild(asset);
}






function generateGravatarUrl(saData) {
  var imgProtocol = parseProtocol(saData.protocol);
  var imgFormat = parseImgFormat(saData.format);
  var imgRes = parseGravatarURIRes(saData.resolution);
  var queryString = '?d=404&' + imgRes;
  var gravatarUrl = imgProtocol + 'www.gravatar.com/avatar/' + saData.hash + '.' + imgFormat + queryString;

  return gravatarUrl;
}


function md5cycle(x, k) {
  var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17,  606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12,  1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7,  1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7,  1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22,  1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14,  643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9,  38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5,  568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20,  1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14,  1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16,  1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11,  1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4,  681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23,  76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16,  530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10,  1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6,  1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6,  1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21,  1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15,  718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);

  }

  function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

  function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

  function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

  function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

  function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

  function md51(s) {
  var n = s.length,
  state = [1732584193, -271733879, -1732584194, 271733878], i;
  for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(s.substring(i-64, i)));
  }
  s = s.substring(i-64);
  var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
  for (i=0; i<s.length; i++)
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
    tail[i>>2] |= 0x80 << ((i%4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
  }
  tail[14] = n*8;
  md5cycle(state, tail);
  return state;
}

  function md5blk(s) {
  var md5blks = [], i;
  for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i)
    + (s.charCodeAt(i+1) << 8)
    + (s.charCodeAt(i+2) << 16)
    + (s.charCodeAt(i+3) << 24);
  }
  return md5blks;
}

  var hex_chr = '0123456789abcdef'.split('');

  function rhex(n) {
  var s='', j=0;
  for(; j<4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
    + hex_chr[(n >> (j * 8)) & 0x0F];
  return s;
}

  function hex(x) {
  for (var i=0; i<x.length; i++)
    x[i] = rhex(x[i]);
  return x.join('');
}

  function md5(s) {
  return hex(md51(s));
}

  function add32(a, b) {
  return (a + b) & 0xFFFFFFFF;
}



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

function parseCssClass(cssClass) {
  let cssClassArray = [];

  if (cssClass) {
    cssClassArray = cssClass.split(' ');
  }

  return cssClassArray;
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











