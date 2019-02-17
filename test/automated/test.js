const smartAvatar = require('../../dist/smart-avatar.js');

// No arguments
test('throws error if no args', () => {
  expect(() => {
    smartAvatar()
  }).toThrowError("SmartAvatar ERROR: missing 'element' argument.");
});

// Disposal
test('dispose smart-avatar elements in target element', () => {
  document.body.innerHTML = '<div id="target-element"></div>';
  const targetEl = document.getElementById("target-element");

  smartAvatar(targetEl, {});

  if (targetEl.querySelector(".smart-avatar")) {
    smartAvatar(targetEl, 'dispose');
  } else {
    throw new Error("SmartAvatar not added to DOM")
  }

  expect(targetEl.querySelector(".smart-avatar")).toBeFalsy();
});

// Type of 'options' argument
test('throws error if options arg is not an object', () => {
  document.body.innerHTML = '<div id="target-element"></div>';
  const targetEl = document.getElementById("target-element");

  expect(() => {
    smartAvatar(targetEl, 'a string')
  }).toThrowError("SmartAvatar ERROR: 'options' argument must be an object.");
});

// 'Element' is not an element
test('throws error if element arg is not an element', () => {
  const target = "a string";

  expect(() => {
    smartAvatar(target, {})
  }).toThrowError("SmartAvatar ERROR: cannot append asset to string.");
});

// Gravatar smart-avatar from hash
test('renders Gravatar smart-avatar from hash', () => {
  document.body.innerHTML = '<div id="target-element"></div>';
  const targetEl = document.getElementById("target-element");

  smartAvatar(targetEl, {
    hash: '93a5c828f0da09f0af10d2ac238724b5'
  })

  expect(targetEl.innerHTML)
    .toBe('<img src="https://www.gravatar.com/avatar/93a5c828f0da09f0af10d2ac238724b5.jpg?d=404&amp;s=80" style="object-fit: cover;" class="smart-avatar">');
});

// Gravatar smart-avatar from email
test('renders Gravatar smart-avatar from email', () => {
  document.body.innerHTML = '<div id="target-element"></div>';
  const targetEl = document.getElementById("target-element");

  smartAvatar(targetEl, {
    email: 'jared.gorski@liferay.com'
  })

  expect(targetEl.innerHTML)
    .toBe('<img src="https://www.gravatar.com/avatar/93a5c828f0da09f0af10d2ac238724b5.jpg?d=404&amp;s=80" style="object-fit: cover;" class="smart-avatar">');
});
