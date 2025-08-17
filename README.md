# FDS – Form Data Saver

<div align="center">
  <img src="https://raw.githubusercontent.com/x0root/FormDataSaver/refs/heads/main/logo.png" alt="FormDataSaver Logo" />
  
**FDS** is a Auto-save & restore form data. No backend, no hassle.

---

## Why FormDataSaver?
- **Automatic save** of ALL fields (including passwords, checkboxes, radios, selects, textareas, etc.).
- **Restore after refresh** or browser restart (uses `localStorage`).
- **Per-form isolation** – unique save keys for each form.
- **Exclude entire forms** with `data-fds-exclude`.
- **Restore banner** so users can decide to restore or discard.
- **Debounced saves** for performance.
- **Public API** for manual save/restore/clear.

---

## Installation

Download `fds.js` and include it in your HTML:

```html
<script src="fds.js" defer></script>
```
Or
```html
<script src="https://cdn.jsdelivr.net/gh/x0root/FormDataSaver@main/fds.js"></script>
```

Or serve from your own CDN.

---

## Usage

By default, **FDS** will scan **all `<form>` elements** on the page and save their data as the user types.

### Basic example
```html
<form id="contactForm">
  <input name="fullname" placeholder="Full Name">
  <input name="email" placeholder="Email">
  <input type="password" name="password" placeholder="Password">
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>

<script src="fds.js" defer></script>
```

That’s it. If the user refreshes, their data will be restored via the restore banner.

---

### Excluding a form from saving
```html
<form data-fds-exclude>
  <!-- This form will not be tracked by FDS -->
</form>
```

---

## API

FDS also exposes a global `window.FDS` object for programmatic control.

```javascript
const form = document.getElementById('contactForm');

// Save form manually
FDS.save(form);

// Restore form manually
FDS.restore(form);

// Clear saved draft
FDS.clear(form);

// List saved keys for this page
console.log(FDS.list());
```

---

## Events
You can listen for these events on your forms:
- `fds:saved` – fired after data is saved
- `fds:restored` – fired after data is restored
- `fds:cleared` – fired after saved data is cleared

Example:
```javascript
form.addEventListener('fds:saved', e => {
  console.log('Form saved:', e.detail.key);
});
```

---

## Security Notes
- **FDS saves everything** unless you exclude the form.
- If your form contains sensitive fields (e.g., passwords, personal IDs, credit card data) and you don’t want them saved, **use `data-fds-exclude`**.
- LocalStorage is accessible to any script running on the same domain.

---

## Example HTML (Quick Test)
Here’s a complete working example you can try instantly:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FDS Demo</title>
</head>
<body>
  <form id="demoForm">
    <input name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <textarea name="notes" placeholder="Notes"></textarea>
    <button type="submit">Submit</button>
  </form>
  
  <script src="https://cdn.jsdelivr.net/gh/x0root/FormDataSaver@main/fds.js"></script>
</body>
</html>
```
---
## Customize Restore Banner Text

Add `data-fds-restore-message` attribute on your `<form>` with custom text:

```html
<form id="myForm" data-fds-restore-message="⚠️ You have unsaved changes. Restore now?">
  <!-- form fields -->
</form>
```
Default message (if none provided):

Restore unsaved form data?


---

Customize Banner Styles

Target these CSS classes in your stylesheet to style the banner and buttons:

| CSS Class             | Description          |
|-----------------------|----------------------|
| `.fds-restore-banner`  | Banner container     |
| `.fds-restore-message` | Text message         |
| `.fds-restore-yes`     | Restore button       |
| `.fds-restore-no`      | Discard button       |

Example CSS
```
.fds-restore-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: navy;
  color: yellow;
  padding: 10px 15px;
  border-radius: 6px;
  font-family: monospace;
  box-shadow: 0 0 15px rgba(0,0,128,0.7);
  display: flex;
  gap: 12px;
  align-items: center;
  z-index: 9999;
}

.fds-restore-message {
  font-size: 16px;
  font-weight: bold;
}

.fds-restore-yes,
.fds-restore-no {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.3s ease;
}

.fds-restore-yes {
  background: orange;
  color: black;
}

.fds-restore-yes:hover {
  background: darkorange;
}

.fds-restore-no {
  background: gray;
  color: white;
}

.fds-restore-no:hover {
  background: dimgray;
}
```

---

Basic Usage Example
```
<form id="contactForm" data-fds-restore-message="You left unsaved data. Restore now?">
  <input type="text" name="email" placeholder="Email" />
  <input type="checkbox" name="subscribe" /> Subscribe
  <button type="submit">Send</button>
</form>

<script src="FDS.js"></script>
```
Add your CSS styles to customize the banner as you want.


---

Use data-fds-restore-message to change banner text.

Customize banner via .fds-restore-* CSS classes.

Banner appears only if saved data exists on page load.

For more example, see example.html.

---

## License
MIT License – free to use, modify, and distribute.

---

## Credits
Made with ❤️ and rage against lost form data.
