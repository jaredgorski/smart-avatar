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
  return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + (saData.size ? saData.size * 0.75 : '48') + '" height="' + (saData.size ? saData.size * 0.75 : '48') + '" viewBox="0 0 640 640"><path d="M482.82 372.91c0 104.04-73.14 188.5-163.22 188.5s-163.22-84.46-163.22-188.5S229.52 184.4 319.6 184.4s163.22 84.47 163.22 188.51z" fill="#222"></path><path d="M257 313.26L452.53 101l-.26 212.5-195.27-.24z" fill="#222"></path><path d="M382.53 313.26L187 101l.26 212.5 195.27-.24z" fill="#222"></path><path d="M194.79 119.68c0 14.23-11.55 25.78-25.79 25.78-14.23 0-25.78-11.55-25.78-25.78S154.77 93.89 169 93.89c14.24 0 25.79 11.56 25.79 25.79z" fill="#222"></path><path d="M495.69 119.68c0 14.23-11.55 25.78-25.78 25.78s-25.79-11.55-25.79-25.78 11.56-25.79 25.79-25.79c14.23 0 25.78 11.56 25.78 25.79z" fill="#222"></path><path d="M143.22 114.92h57.31v314.79h-57.31V114.92z" fill="#222"></path><path d="M438.38 119.68h57.31v314.78h-57.31V119.68z" fill="#222"></path><path d="M319.6 216.7l275.67 275.68H319.6V216.7z" fill="#222"></path><path d="M319.6 272.32l275.67 275.67H319.6V272.32z" fill="#222"></path><path d="M319.6 272.32L43.92 547.99H319.6V272.32z" fill="#222"></path><path d="M319.6 216.7L43.92 492.38H319.6V216.7z" fill="#222"></path><path d="M384.87 189.61L109.19 465.28h275.68V189.61z" fill="#e4e4e4"></path><path d="M254.03 246.36l275.68 275.68H254.03V246.36z" fill="#e4e4e4"></path><path d="M254.03 189.61l275.68 275.67H254.03V189.61z" fill="#e4e4e4"></path><path d="M170.85 126.78l275.68 275.68H170.85V126.78z" fill="#de7f27"></path><path d="M467.82 126.78L192.14 402.46h275.68V126.78z" fill="#de7f27"></path><path d="M297.46 277.07L125.05 449.48h172.41V277.07z" fill="#e4e4e4"></path><path d="M384.87 246.36L109.19 522.04h275.68V246.36z" fill="#e4e4e4"></path><path d="M341.37 277.07l172.41 172.41H341.37V277.07z" fill="#e4e4e4"></path><path d="M173.57 124.8l17.92-17.19 133.42 139.08-17.92 17.19L173.57 124.8z" fill="#222"></path><path d="M466.34 124.8l-17.92-17.19L315 246.69l17.92 17.19L466.34 124.8z" fill="#222"></path><path d="M451.53 355.79c0 82.04-59.49 148.65-132.77 148.65-73.27 0-132.76-66.61-132.76-148.65s59.49-148.64 132.76-148.64c73.28 0 132.77 66.6 132.77 148.64z" fill="#de7f27"></path><path d="M452.53 386.62c0 82.04-59.49 148.64-132.77 148.64-73.27 0-132.76-66.6-132.76-148.64 0-82.04 59.49-148.65 132.76-148.65 73.28 0 132.77 66.61 132.77 148.65z" fill="#e4e4e4"></path><path d="M171.88 126.78l275.67 275.68H171.88V126.78z" fill="#de7f27"></path><path d="M466.34 126.78L190.67 402.46h275.67V126.78z" fill="#de7f27"></path><path d="M370.61 272.32c0 28.15-22.86 51.01-51.01 51.01-28.16 0-51.02-22.86-51.02-51.01 0-28.16 22.86-51.02 51.02-51.02 28.15 0 51.01 22.86 51.01 51.02z" fill="#de7f27"></path><path d="M253.44 259.45l1.38.23 1.34.28 1.32.35 1.29.4 1.26.46 1.22.51 1.19.57 1.14.61 1.11.67 1.07.71 1.02.75.97.8.93.84.88.89.82.91.77.96.71.99.66 1.02.59 1.06.53 1.08.47 1.11.4 1.14.33 1.16.27 1.19.19 1.21.11 1.22.04 1.24h.11v46.42h-.14l-.01.15-.11 1.22-.19 1.21-.27 1.18-.33 1.16-.4 1.14-.47 1.11-.53 1.09-.59 1.05-.66 1.03-.71.99-.77.95-.82.92-.88.88-.93.84-.97.8-1.02.76-1.07.71-1.11.66-1.14.62-1.19.56-1.22.52-1.26.45-1.29.41-1.32.34-1.34.29-1.38.23-1.4.16-1.42.1-1.44.03-1.44-.03-1.42-.1-1.39-.16-1.38-.23-1.34-.29-1.32-.34-1.29-.41-1.26-.45-1.22-.52-1.19-.56-1.15-.62-1.1-.66-1.07-.71-1.02-.76-.97-.8-.93-.84-.88-.88-.82-.92-.77-.95-.71-.99-.66-1.03-.59-1.05-.53-1.09-.47-1.11-.4-1.14-.33-1.16-.27-1.18-.19-1.21-.11-1.22-.01-.15h-.03v-46.42l.04-1.24.11-1.22.19-1.21.27-1.19.33-1.16.4-1.14.47-1.11.53-1.08.59-1.06.66-1.02.71-.99.77-.96.82-.91.88-.89.93-.84.97-.8 1.02-.75 1.07-.71 1.1-.67 1.15-.61 1.19-.57 1.22-.51 1.26-.46 1.29-.4 1.32-.35 1.34-.28 1.38-.23 1.39-.16 1.42-.1 1.44-.04 1.44.04 1.42.1 1.4.16z" fill="#111"></path><path d="M394.88 259.45l1.37.23 1.35.28 1.32.35 1.28.4 1.26.46 1.22.51 1.19.57 1.15.61 1.1.67 1.07.71 1.02.75.98.8.92.84.88.89.82.91.77.96.71.99.66 1.02.59 1.06.54 1.08.46 1.11.4 1.14.34 1.16.26 1.19.19 1.21.11 1.22.04 1.24h.11v46.42h-.14l-.01.15-.11 1.22-.19 1.21-.26 1.18-.34 1.16-.4 1.14-.46 1.11-.54 1.09-.59 1.05-.66 1.03-.71.99-.77.95-.82.92-.88.88-.92.84-.98.8-1.02.76-1.07.71-1.1.66-1.15.62-1.19.56-1.22.52-1.26.45-1.28.41-1.32.34-1.35.29-1.37.23-1.4.16-1.42.1-1.44.03-1.44-.03-1.42-.1-1.4-.16-1.37-.23-1.35-.29-1.32-.34-1.29-.41-1.26-.45-1.22-.52-1.18-.56-1.15-.62-1.11-.66-1.07-.71-1.02-.76-.97-.8-.93-.84-.87-.88-.83-.92-.77-.95-.71-.99-.65-1.03-.6-1.05-.53-1.09-.47-1.11-.4-1.14-.33-1.16-.26-1.18-.19-1.21-.12-1.22v-.15h-.04v-46.42l.04-1.24.12-1.22.19-1.21.26-1.19.33-1.16.4-1.14.47-1.11.53-1.08.6-1.06.65-1.02.71-.99.77-.96.83-.91.87-.89.93-.84.97-.8 1.02-.75 1.07-.71 1.11-.67 1.15-.61 1.18-.57 1.22-.51 1.26-.46 1.29-.4 1.32-.35 1.35-.28 1.37-.23 1.4-.16 1.42-.1 1.44-.04 1.44.04 1.42.1 1.4.16z" fill="#111"></path><path d="M170.85 402.46l148.75 45.28v-45.28H170.85z" fill="#de7f27"></path><path d="M468.34 402.46L319.6 447.74v-45.28h148.74z" fill="#de7f27"></path><path d="M341.98 413.09l1.16.31 1.13.39 1.11.47 1.06.55 1.04.62.99.69.95.76.91.82.86.89.82.94.76 1 .71 1.05.66 1.11.59 1.15.54 1.2.47 1.23.4 1.28.34 1.31.27 1.35.19 1.38.12 1.4.04 1.43-.04 1.42-.12 1.41-.19 1.37-.27 1.35-.34 1.31-.4 1.28-.47 1.24-.54 1.19-.6 1.15-.65 1.11-.71 1.05-.76 1-.82.95-.86.88-.91.82-.95.76-1 .69-1.03.62-1.07.55-1.1.47-1.13.39-1.16.31-1.19.23-1.21.13-1.23.05v.09h-38.41v-.13l-.33-.01-1.21-.14-1.19-.22-1.16-.31-1.13-.39-1.1-.47-1.07-.55-1.03-.62-.99-.69-.96-.76-.9-.82-.87-.89-.81-.94-.77-1-.71-1.05-.65-1.11-.6-1.15-.53-1.2-.47-1.23-.41-1.28-.34-1.31-.26-1.35-.2-1.37-.12-1.41-.04-1.43.04-1.42.12-1.41.2-1.37.26-1.35.34-1.31.41-1.28.47-1.24.53-1.19.6-1.15.66-1.11.71-1.05.76-1 .81-.95.87-.88.91-.82.95-.76.99-.69 1.03-.62 1.07-.55 1.1-.47 1.14-.39 1.16-.31 1.18-.23 1.22-.13.32-.01v-.04h38.41l1.23.05 1.21.14 1.19.22z" fill="#111"></path><path d="M323.76 413.81l1.35.27 1.31.34 1.28.4 1.23.47 1.2.54 1.15.59 1.11.66 1.05.71 1 .76.94.82.89.86.82.91.76.95.69 1 .62 1.03.55 1.07.47 1.1.39 1.13.31 1.16.22 1.19.14 1.21.05 1.23h.09v38.41h-.13l-.01.33-.14 1.21-.22 1.18-.31 1.17-.39 1.13-.47 1.1-.55 1.07-.62 1.03-.69.99-.76.95-.82.91-.89.87-.94.81-1 .76-1.06.71-1.1.66-1.15.6-1.2.53-1.24.47-1.27.41-1.32.34-1.34.26-1.38.2-1.4.11-1.43.04-1.43-.04-1.4-.11-1.38-.2-1.34-.26-1.32-.34-1.27-.41-1.24-.47-1.2-.54-1.15-.59-1.1-.66-1.05-.71-1-.76-.95-.81-.88-.87-.83-.91-.75-.95-.7-.99-.62-1.03-.54-1.07-.47-1.1-.39-1.14-.31-1.16-.23-1.18-.14-1.22-.01-.32h-.03v-38.41l.05-1.23.13-1.21.23-1.19.31-1.16.39-1.13.47-1.11.55-1.06.62-1.04.69-.99.76-.95.82-.91.88-.86.95-.82 1-.76 1.05-.71 1.11-.66 1.15-.59 1.19-.54 1.24-.47 1.28-.4 1.31-.34 1.35-.27 1.37-.19 1.41-.12 1.42-.04 1.43.04 1.41.12 1.37.19z" fill="#111"></path></svg>';
}

module.exports.renderSA = renderSA;
