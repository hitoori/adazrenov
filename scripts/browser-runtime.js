// The public build includes this small loader, while the assistant is a separate asset.
function setupLazyAdazaiWidget(scriptUrl) {
  setupAdazChatCacheExpiry();
  const launcher = document.querySelector("[data-adazai-launcher]");
  const button = launcher?.querySelector("button");
  if (!button) return;
  let loading = null;

  const load = () => {
    if (loading) return loading;
    button.setAttribute("aria-busy", "true");
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => {
        try {
          const restoreFocus = document.activeElement === button;
          window.ADAZ_INIT_WIDGET();
          launcher.remove();
          const toggle = document.querySelector(".adazai-widget .adazai-floating-cta");
          if (restoreFocus) toggle?.focus();
          resolve(toggle);
        } catch (error) {
          script.remove();
          reject(error);
        }
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("Assistant unavailable"));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      loading = null;
      button.removeAttribute("aria-busy");
      const title = button.querySelector(".adazai-floating-cta-title");
      if (title) title.textContent = "Réessayer";
      button.setAttribute("aria-label", "Réessayer d’ouvrir l’assistant");
      throw error;
    });
    return loading;
  };

  const warm = () => { load().catch(() => {}); };
  button.addEventListener("pointerenter", warm, { once: true });
  button.addEventListener("focus", warm, { once: true });
  button.addEventListener("touchstart", warm, { once: true, passive: true });
  button.addEventListener("click", () => {
    load().then((toggle) => toggle?.click()).catch(() => {});
  });
  document.querySelectorAll("[data-open-adazai-widget]").forEach((trigger) => {
    trigger.addEventListener("pointerenter", warm, { once: true });
    trigger.addEventListener("focus", warm, { once: true });
    trigger.addEventListener("click", () => {
      if (document.querySelector(".adazai-widget")) return;
      load().then((toggle) => toggle?.click()).catch(() => {});
    });
  });
}
