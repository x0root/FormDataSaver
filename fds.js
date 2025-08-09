(function() {
  const STORAGE_PREFIX = "fds:";
  const SAVE_DEBOUNCE = 400;
  
  function getFormKey(form) {
    let id = form.getAttribute("id") || form.getAttribute("name") || Array.from(document.forms).indexOf(form);
    return `${STORAGE_PREFIX}${location.pathname}::${id}`;
  }
  
  function saveForm(form) {
    const data = {};
    Array.from(form.elements).forEach(el => {
      if (!el.name) return;
      if (el.type === "checkbox" || el.type === "radio") {
        data[el.name] = el.checked;
      } else {
        data[el.name] = el.value;
      }
    });
    localStorage.setItem(getFormKey(form), JSON.stringify(data));
    form.dispatchEvent(new CustomEvent("fds:saved", { detail: { key: getFormKey(form), data } }));
  }
  
  function restoreForm(form) {
    const saved = localStorage.getItem(getFormKey(form));
    if (!saved) return false;
    
    const data = JSON.parse(saved);
    Object.keys(data).forEach(name => {
      const el = form.elements[name];
      if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = !!data[name];
      } else {
        el.value = data[name];
      }
    });
    form.dispatchEvent(new CustomEvent("fds:restored", { detail: { key: getFormKey(form), data } }));
    return true;
  }
  
  function clearFormSave(form) {
    localStorage.removeItem(getFormKey(form));
    form.dispatchEvent(new CustomEvent("fds:cleared", { detail: { key: getFormKey(form) } }));
  }
  
  function showRestoreBanner(form) {
    const banner = document.createElement("div");
    banner.textContent = "Restore previous form data?";
    banner.style.cssText = `
      position:fixed;bottom:10px;left:50%;transform:translateX(-50%);
      background:#2563eb;color:#fff;padding:6px 12px;border-radius:6px;
      font-size:14px;z-index:9999;display:flex;gap:8px;align-items:center;
    `;
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore";
    restoreBtn.style.cssText = "background:#16a34a;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;";
    const discardBtn = document.createElement("button");
    discardBtn.textContent = "Discard";
    discardBtn.style.cssText = "background:#dc2626;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;";
    
    restoreBtn.onclick = () => {
      restoreForm(form);
      banner.remove();
    };
    discardBtn.onclick = () => {
      clearFormSave(form);
      banner.remove();
    };
    
    banner.appendChild(restoreBtn);
    banner.appendChild(discardBtn);
    document.body.appendChild(banner);
  }
  
  function attachForm(form) {
    let saveTimer;
    form.addEventListener("input", () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveForm(form), SAVE_DEBOUNCE);
    });
    
    // If saved data exists, show banner
    if (localStorage.getItem(getFormKey(form))) {
      showRestoreBanner(form);
    }
    
    form.addEventListener("submit", () => {
      clearFormSave(form);
    });
    form.addEventListener("reset", () => {
      clearFormSave(form);
    });
  }
  
  function init() {
    const forms = document.querySelectorAll("form:not([data-fds-exclude])");
    forms.forEach(attachForm);
    window.FDS = {
      save: saveForm,
      restore: restoreForm,
      clear: clearFormSave,
      list: () => Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
    };
  }
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
