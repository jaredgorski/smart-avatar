function renderSA(e,t){var r=create(e,t);if(r.finished)return r.asset;throw new Error("SmartAvatar ERROR: something went wrong.")}function create(e,t){var r=["mp","identicon","monsterid","wavatar","retro","robohash"],a={};switch(!0){case"smart"===t.priority.src1&&t.initials:a.asset=generateEl("initEl",t),a.finished=!0;break;case"smart"===t.priority.src1&&t.icon&&!r.includes(t.icon):a.asset=generateEl("iconEl",t),a.finished=!0;break;case"smart"===t.priority.src1&&t.icon&&r.includes(t.icon):a.asset=generateEl("iconImg",t),a.finished=!0;break;default:a.asset=generateComplexImage(e,t),a.finished=!0}return a}function generateEl(e,t){switch(e){case"iconImg":return generateIconImg(t);case"initEl":return generateInitEl(t);case"iconEl":return generateIconEl(t)}}function generateGravatarIconUrl(e){return"https://www.gravatar.com/avatar?d="+e+"&f=y"}function generateIconImg(e){var t=new Image,r=generateGravatarIconUrl(e.icon);if(t.src=r,e.unstyled||(t.style.cssText=(e.round?"border-radius: 50%;":"")+(e.size?"height:"+e.size+"px;width:"+e.size+"px;":"")+"object-fit:cover;"),t.classList.add("smart-avatar"),e.cssClass){const r=e.cssClass.length;for(let a=0;a<r;a++)t.classList.add(e.cssClass[a])}return e.timestamp&&t.setAttribute("sa_timestamp",Date.now()),e.alt&&(t.alt=e.alt),t}function generateInitEl(e){return generateElement("initEl",e)}function generateIconEl(e){return generateElement("iconEl",e)}function generateElement(e,t){var r;"initEl"===e?r=t.initials:"iconEl"===e&&(r=renderSmartFox(t));var a=document.createElement("div");if(t.unstyled||(a.style.cssText=(t.round?"border-radius: 50%;":"")+"align-items:center;"+(t.color?"background-color:"+t.color:"")+(t.textColor?";color:"+t.textColor:"")+';display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;'+(t.size?"font-size:"+t.size/2+"px;height:"+t.size+"px;":"")+"justify-content:center;margin:0;padding:0;"+(t.size?"width:"+t.size+"px;":"")),a.classList.add("smart-avatar"),t.cssClass){const e=t.cssClass.length;for(let r=0;r<e;r++)a.classList.add(t.cssClass[r])}return t.timestamp&&a.setAttribute("sa_timestamp",Date.now()),a.innerHTML="<span "+(t.unstyled?"":'style="display:flex;"')+">"+r+"</span>",a}function generateComplexImage(e,t){var r=parseComplexAssets(t),a=r.asset1,n=r.asset2,s=r.asset3,i=new Image;if(i.src=a.content,t.unstyled||(i.style.cssText=(t.round?"border-radius: 50%;":"")+(t.size?"height:"+t.size+"px;width:"+t.size+"px;":"")+"object-fit:cover;"),i.onerror=function(){handleErrFallback(e,i,n),"el"!==n.type&&(i.onerror=function(){handleErrFallback(e,i,s)})},i.classList.add("smart-avatar"),t.cssClass){const e=t.cssClass.length;for(let r=0;r<e;r++)i.classList.add(t.cssClass[r])}return t.timestamp&&i.setAttribute("sa_timestamp",Date.now()),t.alt&&(i.alt=t.alt),i}function handleErrFallback(e,t,r){if(t.style.opacity=0,"el"===r.type)delete t.onerror,e.appendChild(r.content),e.removeChild(t);else if(t.src=r.content,t.style.opacity=1,!t.src)throw new Error("SmartAvatar ERROR: internal error - img src recursively undefined")}function parseComplexAssets(e){var t=["mp","identicon","monsterid","wavatar","retro","robohash"],r={asset1:{},asset2:{},asset3:{}};r.asset1.content="gravatar"===e.priority.src1?e.gravatarUrl:e.src,r.asset1.type="url";for(var a=2;a<=3;a++){var n="src"+a,s="asset"+a;"gravatar"===e.priority[n]?(r[s].content=e.gravatarUrl,r[s].type="url"):"src"===e.priority[n]?(r[s].content=e.src,r[s].type="url"):"smart"===e.priority[n]&&(e.initials?(r[s].content=generateEl("initEl",e),r[s].type="el"):e.icon&&!t.includes(e.icon)?(r[s].content=generateEl("iconEl",e),r[s].type="el"):e.icon&&t.includes(e.icon)&&(r[s].content=generateGravatarIconUrl(e.icon),r[s].type="url"))}return r}function renderSmartFox(e){return'<svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="300" cy="300" r="144" fill="#DE8927" stroke="#333" stroke-width="12"/><rect x="236" y="231" width="24" height="36" rx="12" fill="#333"/><rect x="340" y="231" width="24" height="36" rx="12" fill="#333"/><mask id="a" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M431.255 339L300 362.374 168.745 339H167.5c16.039 57.017 69.286 98.888 132.5 98.888S416.461 396.017 432.5 339h-1.245z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M431.255 339L300 362.374 168.745 339H167.5c16.039 57.017 69.286 98.888 132.5 98.888S416.461 396.017 432.5 339h-1.245z" fill="#DEDEDE"/><path d="M300 362.374l-.526 2.953.526.094.526-.094-.526-2.953zM431.255 339v-3h-.265l-.261.046.526 2.954zm-262.51 0l.526-2.954-.261-.046h-.265v3zm-1.245 0v-3h-3.96l1.072 3.812L167.5 339zm265 0l2.888.812L436.46 336h-3.96v3zm-131.974 26.327l131.255-23.373-1.052-5.908-131.255 23.374 1.052 5.907zm-132.307-23.373l131.255 23.373 1.052-5.907-131.255-23.374-1.052 5.908zm.526-5.954H167.5v6h1.245v-6zm-4.133 3.812c16.403 58.31 70.829 101.076 135.388 101.076v-6c-61.869 0-113.937-40.976-129.612-96.7l-5.776 1.624zM300 440.888c64.559 0 118.985-42.766 135.388-101.076l-5.776-1.624c-15.675 55.724-67.743 96.7-129.612 96.7v6zM432.5 336h-1.245v6h1.245v-6z" fill="#B06B1C" mask="url(#a)"/><circle cx="300" cy="360" r="12" fill="#333"/></svg>'}export default function smartAvatar(e,t){var r={};if(arguments[1]||(t={}),!arguments.length)throw new Error("SmartAvatar ERROR: missing 'element' argument.");if("dispose"!==arguments[1]){if(arguments[1]&&"object"!=typeof arguments[1])throw new Error("SmartAvatar ERROR: 'options' argument must be an object.");var a=function(e){return e instanceof Element||e instanceof HTMLDocument};if(!a(e)){var n=typeof e;throw new Error("SmartAvatar ERROR: cannot append asset to "+n+".")}r.parent=e,r.priority=t.priority?parsePriority(t.priority):{src1:"gravatar",src2:"src",src3:"smart"},r.timestamp="boolean"==typeof t.timestamp&&t.timestamp,r.alt=t.alt?t.alt.toString():null,r.icon=t.icon?t.icon.toString():"smartfox",r.size=t.size?parseImgRes(t.size.toString()):null,r.round=!0===t.round,r.initials=t.initials?parseInitials(t.initials.toString()):null,r.color=t.color?parseColor(t.color.toString()):null,r.textColor=t.textColor?parseColor(t.textColor.toString()):null,r.colorScheme=t.colorScheme?parseColorScheme(t.colorScheme):null,r.cssClass=t.cssClass?parseCssClass(t.cssClass.toString()):null,r.email=t.email?parseEmail(t.email.toString()):null,r.hash=!!t.hash&&t.hash.toString()||(r.email?md5(r.email):null),r.protocol=t.protocol?parseProtocol(t.protocol.toString()):"secure",r.format=t.format?parseImgFormat(t.format.toString()):"jpg",r.resolution=t.resolution?parseImgRes(t.resolution.toString()):"80",r.src=t.src?t.src.toString():null,r.unstyled=!0===t.unstyled,!r.unstyled&&t.setDefaults&&(r.color=r.color||"#AAA",r.size=r.size||"48",r.textColor=r.textColor||"#FFF"),r.gravatarUrl=r.hash?generateGravatarUrl(r):"";var s=renderSA(e,r);e.appendChild(s)}else{const t=e.querySelectorAll(".smart-avatar");for(let r=0;r<t.length;r++)e.removeChild(t[r]);if(e.querySelectorAll(".smart-avatar").length>0)throw new Error("SmartAvatar ERROR: could not dispose SmartAvatar nodes."+e.querySelectorAll(".smart-avatar").length+"left.")}}function generateGravatarUrl(e){var t=parseProtocol(e.protocol),r=parseImgFormat(e.format),a="?d=404&"+parseGravatarURIRes(e.resolution);return t+"www.gravatar.com/avatar/"+e.hash+"."+r+a}function md5cycle(e,t){var r=e[0],a=e[1],n=e[2],s=e[3];r=ff(r,a,n,s,t[0],7,-680876936),s=ff(s,r,a,n,t[1],12,-389564586),n=ff(n,s,r,a,t[2],17,606105819),a=ff(a,n,s,r,t[3],22,-1044525330),r=ff(r,a,n,s,t[4],7,-176418897),s=ff(s,r,a,n,t[5],12,1200080426),n=ff(n,s,r,a,t[6],17,-1473231341),a=ff(a,n,s,r,t[7],22,-45705983),r=ff(r,a,n,s,t[8],7,1770035416),s=ff(s,r,a,n,t[9],12,-1958414417),n=ff(n,s,r,a,t[10],17,-42063),a=ff(a,n,s,r,t[11],22,-1990404162),r=ff(r,a,n,s,t[12],7,1804603682),s=ff(s,r,a,n,t[13],12,-40341101),n=ff(n,s,r,a,t[14],17,-1502002290),r=gg(r,a=ff(a,n,s,r,t[15],22,1236535329),n,s,t[1],5,-165796510),s=gg(s,r,a,n,t[6],9,-1069501632),n=gg(n,s,r,a,t[11],14,643717713),a=gg(a,n,s,r,t[0],20,-373897302),r=gg(r,a,n,s,t[5],5,-701558691),s=gg(s,r,a,n,t[10],9,38016083),n=gg(n,s,r,a,t[15],14,-660478335),a=gg(a,n,s,r,t[4],20,-405537848),r=gg(r,a,n,s,t[9],5,568446438),s=gg(s,r,a,n,t[14],9,-1019803690),n=gg(n,s,r,a,t[3],14,-187363961),a=gg(a,n,s,r,t[8],20,1163531501),r=gg(r,a,n,s,t[13],5,-1444681467),s=gg(s,r,a,n,t[2],9,-51403784),n=gg(n,s,r,a,t[7],14,1735328473),r=hh(r,a=gg(a,n,s,r,t[12],20,-1926607734),n,s,t[5],4,-378558),s=hh(s,r,a,n,t[8],11,-2022574463),n=hh(n,s,r,a,t[11],16,1839030562),a=hh(a,n,s,r,t[14],23,-35309556),r=hh(r,a,n,s,t[1],4,-1530992060),s=hh(s,r,a,n,t[4],11,1272893353),n=hh(n,s,r,a,t[7],16,-155497632),a=hh(a,n,s,r,t[10],23,-1094730640),r=hh(r,a,n,s,t[13],4,681279174),s=hh(s,r,a,n,t[0],11,-358537222),n=hh(n,s,r,a,t[3],16,-722521979),a=hh(a,n,s,r,t[6],23,76029189),r=hh(r,a,n,s,t[9],4,-640364487),s=hh(s,r,a,n,t[12],11,-421815835),n=hh(n,s,r,a,t[15],16,530742520),r=ii(r,a=hh(a,n,s,r,t[2],23,-995338651),n,s,t[0],6,-198630844),s=ii(s,r,a,n,t[7],10,1126891415),n=ii(n,s,r,a,t[14],15,-1416354905),a=ii(a,n,s,r,t[5],21,-57434055),r=ii(r,a,n,s,t[12],6,1700485571),s=ii(s,r,a,n,t[3],10,-1894986606),n=ii(n,s,r,a,t[10],15,-1051523),a=ii(a,n,s,r,t[1],21,-2054922799),r=ii(r,a,n,s,t[8],6,1873313359),s=ii(s,r,a,n,t[15],10,-30611744),n=ii(n,s,r,a,t[6],15,-1560198380),a=ii(a,n,s,r,t[13],21,1309151649),r=ii(r,a,n,s,t[4],6,-145523070),s=ii(s,r,a,n,t[11],10,-1120210379),n=ii(n,s,r,a,t[2],15,718787259),a=ii(a,n,s,r,t[9],21,-343485551),e[0]=add32(r,e[0]),e[1]=add32(a,e[1]),e[2]=add32(n,e[2]),e[3]=add32(s,e[3])}function cmn(e,t,r,a,n,s){return t=add32(add32(t,e),add32(a,s)),add32(t<<n|t>>>32-n,r)}function ff(e,t,r,a,n,s,i){return cmn(t&r|~t&a,e,t,n,s,i)}function gg(e,t,r,a,n,s,i){return cmn(t&a|r&~a,e,t,n,s,i)}function hh(e,t,r,a,n,s,i){return cmn(t^r^a,e,t,n,s,i)}function ii(e,t,r,a,n,s,i){return cmn(r^(t|~a),e,t,n,s,i)}function md51(e){var t,r=e.length,a=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=e.length;t+=64)md5cycle(a,md5blk(e.substring(t-64,t)));e=e.substring(t-64);var n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<e.length;t++)n[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(n[t>>2]|=128<<(t%4<<3),t>55)for(md5cycle(a,n),t=0;t<16;t++)n[t]=0;return n[14]=8*r,md5cycle(a,n),a}function md5blk(e){var t,r=[];for(t=0;t<64;t+=4)r[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return r}var hex_chr="0123456789abcdef".split("");function rhex(e){for(var t="",r=0;r<4;r++)t+=hex_chr[e>>8*r+4&15]+hex_chr[e>>8*r&15];return t}function hex(e){for(var t=0;t<e.length;t++)e[t]=rhex(e[t]);return e.join("")}function md5(e){return hex(md51(e))}function add32(e,t){return e+t&4294967295}function parseInitials(e){var t;if(e.length>1&&-1!=e.indexOf(" ")){var r=e.split(" ");t=r[0][0]+r[1][0]}else t=e.length>1?e[0]+e[1]:e;return t.toUpperCase()}function parsePriority(e){var t=["gravatar","src","smart"],r={};for(let a=0;a<e.length;a++)-1!=t.indexOf(e[a].toString())&&-1===Object.values(r).indexOf(e[a].toString())&&(r["src"+(a+1)]=e[a].toString());return r}function parseEmail(e){return-1!=e.indexOf("@")?e.trim().toLowerCase():null}function parseImgFormat(e){var t;switch(!0){case-1!=e.toLowerCase().indexOf("png"):t="png";break;case-1!=e.toLowerCase().indexOf("jpg")||-1!=e.toLowerCase().indexOf("jpeg"):t="jpg";break;case-1!=e.toLowerCase().indexOf("tiff"):t="tiff";break;default:t="jpg"}return t}function parseImgRes(e){var t,r=parseInt(e,10);switch(!0){case!isNaN(r):t=r.toString();break;default:t="80"}return t}function parseColor(e){return e}function parseColorScheme(e){return e}function parseCssClass(e){let t=[];return e&&(t=e.split(" ")),t}function parseProtocol(e){var t;switch(e){case"agnostic":t="//";break;case"secure":t="https://";break;case"unsecure":t="http://";break;default:t="https://"}return t}function parseGravatarURIRes(e){return"s="+parseImgRes(e.toString())}