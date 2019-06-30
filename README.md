# smart-avatar [![Build Status](https://travis-ci.com/jaredgorski/smart-avatar.svg?branch=master)](https://travis-ci.com/jaredgorski/smart-avatar) ![David](https://img.shields.io/david/peer/jaredgorski/smart-avatar.svg) ![npm bundle size](https://img.shields.io/bundlephobia/min/smart-avatar.svg)   <img align="left" height="100" src="https://raw.githubusercontent.com/jaredgorski/smart-avatar/master/.media/smartfox%40640.png">
Render avatars with dynamic, defined fallback


![](https://github.com/jaredgorski/smart-avatar/raw/master/.media/smart-avatar_demo.gif)

---

# Table of Contents

* [Live Demo](#live-demo)
* [Usage](#usage)
  * [Basic Example](#basic-example)
  * [Detailed Example](#detailed-example)
* [Guide to Settings](#guide-to-settings)
  * [Priority Setting](#priority-setting)
  * [General Settings](#general-settings)
  * [Gravatar Settings](#gravatar-settings)
  * [User-defined Source](#user-defined-source)
  * [Smart Resource Settings](#smart-resource-settings)
  * ["unstyled" Flag](#unstyled-flag)
  * ["setDefaults" Flag](#setdefaults-flag)
* [Available Icon Options](#available-icon-options)
  * [SmartAvatar Icons](#smartavatar-icons)
  * [Gravatar-hosted Icons](#gravatar-hosted-icons)
* [Develop and Test](#develop-and-test)
    
---

# Live Demo

A live demo is hosted at the following link. This demo allows for experimentation with all of the configuration settings smart-avatar provides. This demo may help you to determine whether this package is right for your needs. Demo will be updated with major changes to functionality.

### https://smart-avatar-demo.jaredgorski6.now.sh/

---

# Usage

## Basic Example
#### JS:
```javascript
import smartAvatar from 'smart-avatar'
const targetElement = document.querySelector('.topbar-user');

smartAvatar(targetElement, {
  "email": "jared.gorski@liferay.com",
  "initials": "JG",
  "src": "./user-imgs/jared.jpg",
  "icon": "identicon"
  "round": true,
  "size": 48,
  "color": "#00AE55",
  "textColor": "#FFF",
  "cssClass": "we-user",
});
```
#### ES Module:
```html
<script type="module">
  import smartAvatar from 'path-to-module/dist/smart-avatar.browser.js';
 
  const targetElements = document.querySelectorAll('.avatar');
  
  targetElements.forEach(element => {
    smartAvatar(element, {
      "email": element.getAttribute('email'),
      "initials": element.getAttribute('initials'),
      "src": `./user-imgs/${element.getAttribute('name')}.jpg`,
      "icon": "retro"
      "round": true,
      "size": element.getAttribute('size'),
    });
  }
</script>
```

## Detailed Example
```javascript
import smartAvatar from 'smart-avatar';

// define target element to append with smart-avatar
const targetElement = document.querySelector(.topbar-user);

// run smartAvatar function, passing target element and desired configuration
smartAvatar(targetElement, {
  
  // fallback priority definition
  "priority": [
    "gravatar",
    "src",
    "smart"
  ],
  
  // general settings
  "cssClass": "site-avatar",                        // user-defined CSS classes
  "round": true,                                    // shape of asset (square if false)
  "size": 80,                                       // size of asset (width in px)
  "timestamp": true                                 // adds timestamp attribute (for unique id)
  "alt": "User jaredgorski profile image"           // adds alt attribute for accessibility (if not initials or smartfox)
  
  // gravatar settings
  "email": "jared.gorski@liferay.com",              // gravatar email address
  "format": "png",                                  // gravatar image format (jpg, png, or tiff)
  "hash": "93a5c828f0da09f0af10d2ac238724b5",       // md5 hash of gravatar email address
  "protocol": "secure",                             // protocol of gravatar request (secure, unsecure, or agnostic)
  "resolution": 120,                                // resolution of gravatar (width in px)
  
  // user-defined src
  "src": "./img/src.jpg",                           // path to custom fallback asset, relative or absolute
  
  // initials settings
  "initials": "J",                                  // 1 or 2 letters
  "color": "#777777",                               // color of background (affects both initials and built-in icon)
  "textColor": "#FFFFFF",                           // color of initials font
  
  // built-in icon
  "icon": "smartfox",                               // see below for available icon styles
  
  // customization and defaults
  "unstyled": false,                                // renders smart-avatar with no inline styles (for stylesheets)
  "setDefaults": true,                              // sets styled defaults for size, color, and textColor
});
```


# Guide to Settings

## Priority Setting
Key | Definition | Default
--- | --- | ---
`priority` | **Array** - Defines fallback order. | `['gravatar', 'src', 'smart']`

The priority setting consists of up to 3 items:
 - **gravatar**: Attempts to render a gravatar asset if `email` address and/or `hash` is provided.
 - **src**: Attempts to render a user-defined asset.
 - **smart**: Attempts to render an initials avatar if `initials` is provided, or an icon if not. If no [valid icon option](#available-icon-options) is provided, the `smartfox` icon will be rendered.

In the case of **gravatar** and **src**, these options will fall back to the next option in the priority array. So, **gravatar** will fall back to **src** (and vice-versa) and/or will finally fall back to **smart** of no valid data was provided to render a **gravatar** or **src** asset.

Once **smart** is reached, the smart-avatar will look for `initials`. If none are provided, it will fall back to any defined `icon`, and finally to the `smartfox`. This means that, if **smart** is included *before* **gravatar** or **src**, any data for the latter option will not be reached in the priority queue and will therefore not be rendered. Also, even if **smart** is not included in the array, the `smartfox` icon will serve as a final fallback.

## General Settings
Key | Definition | Default
--- | --- | ---
`alt` | **String** - Adds `alt` attribute to img element output. | N/A
`cssClass` | **String** - Adds custom CSS classes. | N/A
`round` | **Boolean** - Generates output with border-radius of 50%. | `false`
`size` | **Number or String** - Defines output element width in `px`. | N/A
`timestamp` | **Boolean** - Adds `sa_timestamp` attribute with milliseconds elapsed since the UNIX epoch. | `false`

These settings apply to the rendered element in general. One can add CSS classes for use by custom stylesheets, define the size and shape of the rendered element, add a timestamp for debugging or use as a unique id (obviously this value is not permanent), and add an `alt` attribute for accessibility purposes.

## Gravatar Settings
Key | Definition | Default
--- | --- | ---
`email` | **String** - Relative or absolute path to desired asset. | N/A
`format` | **String** - Image format to request from Gravatar: *jpg, png, or tiff.* | `jpg`
`hash` | **String** - md5 hash of Gravatar email address. | N/A
`protocol` | **String** - Protocol to use for Gravatar request: *secure (https), unsecure (http), or agnostic (//).* | `secure`
`resolution` | **Number or String** - Defines gravatar resolution (width) in `px`. Does not affect size. Best at 150% of size. | `80`

Defining these settings enables rendering a Gravatar user image by requesting a resource from Gravatar for a given user's email address. Many aspects of this request and output can be customized, including the request protocol, resource format, and image resolution. Keep in mind that higher resolutions result in more data transfer, meaning larger requests.

## User-defined Source
Key | Definition | Default
--- | --- | ---
`src` | **String** - Relative or absolute path to desired asset. | N/A

Providing a path to a custom resource allows for proprietary icons and user images to be used as primary avatars or fallback resources.

## Smart Resource Settings
Key | Definition | Default
--- | --- | ---
`color` | **String** - Background color of smart icon as Hex, RGB, or RGBA value. | N/A
`icon` | **String** - Defines smart icon style. | `smartfox`
`initials` | **String** - 1 or 2 letters to use as initials. | N/A
`textColor` | **String** - Font color of initials icon as Hex, RGB, or RGBA value. | N/A

The "smart" resource is so-called because it provides an easy API for quality fallback in the worst-case scenario. If the given **gravatar** data doesn't return a valid image and the **src** path is broken, an asset with a given user's initials or a general, non-specific icon makes for a great avatar. If an icon is preferred, there are plenty of options to choose from, with more to come. See the list of available icons below.

_Note: `color` and `textColor` only matter in the case of a non-Gravatar icon or an initials avatar._
_Also note: in the future, the initials avatar will be made more available, rather than simply being a fallback option._

## "unstyled" Flag
Even with no settings defined, a non-Image smart-avatar will _still_ have the following inline styles:

```html
<div style="
    align-items: center;
    display: flex;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",
        sans-serif;
">
    <span style="
        display: flex;
    ">
        ${content}
    </span>
</div>
```

This means that, if you wish to customize the font of your initials avatar or change the layout styles for some reason, simply leaving all of the settings undefined will still get in the way of stylesheet customizations for the properties defined inline above (unless you use `!important`, but that defies best-practices).

This is where the `unstyled` flag comes in handy. If you want your smart-avatar asset to be completely raw and unstyled to make room for your stylesheets, you should pass `unstyled: true`. This will override any settings for that smart-avatar asset, always returning pure HTML. This means that images will render at their natural sizes, there will be no layout structure, and background colors, text colors, and font styles will all default to User-Agent unless styled otherwise. This makes smart-avatar a flexible solution for nearly any application.

## "setDefaults" Flag
If you're looking for quick and dirty results, passing `setDefaults: true` in your configuration will change the default behavior of `color`, `size`, and `textColor` to the following:

Key | Definition | Default
--- | --- | ---
`color` | **String** - Background color of smart icon as Hex, RGB, or RGBA value. | `#777777`
`size` | **Number or String** - Defines output element width in `px`. | `48`
`textColor` | **String** - Font color of initials icon as Hex, RGB, or RGBA value. | `#FFFFFF`

Since the `setDefaults` flag _only changes the default behavior_ of these settings, that means that defining these settings yourself will still override these defaults. For example, a smart-avatar asset with `setDefaults: true` and `size: 120` will render with a size of 120px, a background color of `#777`, and a font color of `#FFF`.

_Note: `color` and `textColor` only matter in the case of a non-Gravatar icon or an initials avatar._

## Disposal
```javascript
import smartAvatar from 'smart-avatar';

const targetElement = document.querySelector(.topbar-user);

// ... code ...

smartAvatar(targetEl, 'dispose');
```

There may come a time where you want to dispose of all smart-avatar assets that are child-nodes of a given element. By passing a parent element alongside the string `dispose` in place of the configuration object, you can remove all smart-avatar nodes from the given parent element.

# Available Icon Options

## SmartAvatar Icons

**smartfox** - the best default fox ever (uses `color` as background)
<p align="left">
  <img height="80" src="https://raw.githubusercontent.com/jaredgorski/smart-avatar/master/.media/smartfox%40640.png">
</p>

## Gravatar-hosted Icons 
_([from their website](https://en.gravatar.com/site/implement/images/))_

**mp** - (mystery-person) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y">
</p>

**identicon** - a geometric pattern based on an email hash
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y">
</p>

**monsterid** - a generated 'monster' with different colors, faces, etc
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=monsterid&f=y">
</p>

**wavatar** - generated faces with differing features and backgrounds
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&f=y">
</p>

**retro** - awesome generated, 8-bit arcade-style pixelated faces
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y">
</p>

**robohash** - a generated robot with different colors, faces, etc
<p align="left">
  <img height="80" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y">
</p>

---

# Develop and Test:

`npm i`

*(write code)*

`npm run test`


# Coming Soon:
 - General improvements: whatever I find necessary, and whatever you suggest! Make issues and send PRs please :smiley:
