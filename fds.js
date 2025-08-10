(function () {
  const STORAGE_PREFIX = "FDS_FORM_";
  const SAVE_DELAY = 500; // ms debounce

  // Util: create unique key for form
  function getFormKey(form) {
    const formId = form.getAttribute("id") || form.getAttribute("name") || Array.from(document.forms).indexOf(form);
    return STORAGE_PREFIX + location.pathname + "::" + formId;
  }

  // Util: save form data to localStorage
  function saveForm(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    localStorage.setItem(getFormKey(form), JSON.stringify(data));
    form.dispatchEvent(new CustomEvent("fds:saved", { detail: { key: getFormKey(form) } }));
  }

  // Util: restore form data from localStorage
  function restoreForm(form) {
    const raw = localStorage.getItem(getFormKey(form));
    if (!raw) return false;
    let restored = false;
    try {
      const data = JSON.parse(raw);
      for (const [name, value] of Object.entries(data)) {
        const fields = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
        fields.forEach(field => {
          if (field.type === "checkbox" || field.type === "radio") {
            field.checked = field.value === value || value === true || value === "on";
          } else {
            field.value = value;
          }
        });
      }
      restored = true;
    } catch (e) {}
    if (restored) {
      form.dispatchEvent(new CustomEvent("fds:restored", { detail: { key: getFormKey(form) } }));
    }
    return restored;
  }

  // Util: clear saved data
  function clearForm(form) {
    localStorage.removeItem(getFormKey(form));
    form.dispatchEvent(new CustomEvent("fds:cleared", { detail: { key: getFormKey(form) } }));
  }

  // Banner UI for restore, with classes and inline styles for default look
  function showRestoreBanner(form) {
    const banner = document.createElement("div");
    banner.className = "fds-restore-banner";
    banner.style.cssText = `
      position:fixed;bottom:10px;left:50%;transform:translateX(-50%);
      background:#222;color:#fff;padding:8px 12px;border-radius:6px;
      font-size:14px;z-index:9999;display:flex;gap:8px;align-items:center;
    `;

    const messageText = form.getAttribute("data-fds-restore-message") || "Restore unsaved form data?";
    const messageSpan = document.createElement("span");
    messageSpan.className = "fds-restore-message";
    messageSpan.textContent = messageText;

    const yesBtn = document.createElement("button");
    yesBtn.className = "fds-restore-yes";
    yesBtn.textContent = "Restore";
    yesBtn.style.cssText = "background:#4caf50;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;";

    const noBtn = document.createElement("button");
    noBtn.className = "fds-restore-no";
    noBtn.textContent = "Discard";
    noBtn.style.cssText = "background:#f44336;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;";

    yesBtn.onclick = () => {
      restoreForm(form);
      banner.remove();
    };

    noBtn.onclick = () => {
      clearForm(form);
      banner.remove();
    };

    banner.appendChild(messageSpan);
    banner.appendChild(yesBtn);
    banner.appendChild(noBtn);
    document.body.appendChild(banner);
  }

  // Attach to all forms except excluded ones
  function init() {
    document.querySelectorAll("form:not([data-fds-exclude])").forEach(form => {
      const key = getFormKey(form);
      let saveTimeout;

      // Show banner immediately on page load if saved data exists
      if (localStorage.getItem(key)) {
        showRestoreBanner(form);
      }

      // Save on input change (debounced)
      form.addEventListener("input", () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => saveForm(form), SAVE_DELAY);
      });

      // Clear on submit
      form.addEventListener("submit", () => {
        clearForm(form);
      });
    });
  }

  // Public API
  window.FDS = {
    save: saveForm,
    restore: restoreForm,
    clear: clearForm,
    list: function () {
      return Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
    }
  };

  // Init after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
