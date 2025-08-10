# FDS – Form Data Saver

**FDS** is a zero-config, drop-in JavaScript utility that **saves and restores ALL form data automatically** in the browser, even after page refresh or browser restart.  
No backend needed. Just include the script and your users will never lose their typed data again.

---

## Features
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
  
  <script src="fds.js" defer></script>
</body>
</html>
```
For more example, see example.html.

---

## License
MIT License – free to use, modify, and distribute.

---

## Credits
Made with ❤️ and rage against lost form data.
