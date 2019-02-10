# smart-avatar <img align="left" height="100" src="https://raw.githubusercontent.com/jaredgorski/smart-avatar/master/.media/smartfox%40640.png">
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
* [Available Icon Options](#available-icon-options)
  * [Gravatar-hosted Icons](#gravatar-hosted-icons-from-their-website)
  * [SmartAvatar Icons](#smartavatar-icons)
* [Develop and Test](#develop-and-test)
    
---

# Live Demo

A live demo is hosted at the following link. This demo allows for experimentation with all of the configuration settings smart-avatar provides. This demo may help you to determine whether this package is right for your needs. Demo will be updated with major changes to functionality.

### Link: [demo-smartavatar.wedeploy.io](https://demo-smartavatar.wedeploy.io/)

---

# Usage

## Basic Example
```javascript
import smartAvatar from 'smart-avatar';

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
`size` | **Number or String** - Defines output element width in `px`. | `80`
`timestamp` | **Boolean** - Adds `sa_timestamp` attribute with milliseconds elapsed since the UNIX epoch. | `false`

These settings apply to the rendered element in general. One can add CSS classes for use by custom stylesheets, define the size and shape of the rendered element, add a timestamp for debugging or use as a unique id (obviously this value is not permanent), and add an `alt` attribute for accessibility purposes.

## Gravatar Settings
Key | Definition | Default
--- | --- | ---
`email` | **String** - Relative or absolute path to desired asset. | N/A
`format` | **String** - Image format to request from Gravatar: *jpg, png, or tiff.* | `jpg`
`hash` | **String** - md5 hash of Gravatar email address. | N/A
`protocol` | **String** - Protocol to use for Gravatar request: *secure (https), unsecure (http), or agnostic (//).* | `secure`
`resolution` | **Number or String** - Defines gravatar resolution (width) in `px`. Does not affect size. | `120`, or `size` * 1.5

Defining these settings enables rendering a Gravatar user image by requesting a resource from Gravatar for a given user's email address. Many aspects of this request and output can be customized, including the request protocol, resource format, and image resolution. Keep in mind that higher resolutions result in more data transfer, meaning larger requests.

## User-defined Source
Key | Definition | Default
--- | --- | ---
`src` | **String** - Relative or absolute path to desired asset. | N/A

Providing a path to a custom resource allows for proprietary icons and user images to be used as primary avatars or fallback resources.

## Smart Resource Settings
Key | Definition | Default
--- | --- | ---
`color` | **String** - Background color of smart icon as Hex, RGB, or RGBA value. | `#777`
`icon` | **String** - Defines smart icon style. | `smartfox`
`initials` | **String** - 1 or 2 letters to use as initials. | N/A
`textColor` | **String** - Font color of initials icon as Hex, RGB, or RGBA value. | `#FFF`

The "smart" resource is so-called because it provides an easy API for quality fallback in the worst-case scenario. If the given **gravatar** data doesn't return a valid image and the **src** path is broken, an asset with a given user's initials or a general, non-specific icon makes for a great avatar. If an icon is preferred, there are plenty of options to choose from, with more to come. See the list of available icons below.


# Available Icon Options

## SmartAvatar Icons

**smartfox** - the best default fox ever (uses `color` as background)
<p align="left">
  <img height="80" src="https://raw.githubusercontent.com/jaredgorski/smart-avatar/master/.media/smartfox%40640.png">
</p>

## Gravatar-hosted Icons ([from their website](https://en.gravatar.com/site/implement/images/)):

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

*navigate to http://127.0.0.1:7878/ to manually test changes*
