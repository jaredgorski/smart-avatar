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

module.exports.renderSA = renderSA;
