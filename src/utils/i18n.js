import { translations } from "./translations.js";

export function getCurrentLanguage() {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("asd_lang") || "en";
}

export function setLanguage(lang) {
  if (typeof window === "undefined") return;
  const targetLang = lang === "id" ? "id" : "en";
  localStorage.setItem("asd_lang", targetLang);
  document.documentElement.lang = targetLang;

  // Update text elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && translations[targetLang] && translations[targetLang][key] !== undefined) {
      el.textContent = translations[targetLang][key];
    }
  });

  // Update HTML elements (elements with stylized spans, bold text, etc.)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (key && translations[targetLang] && translations[targetLang][key] !== undefined) {
      el.innerHTML = translations[targetLang][key];
    }
  });

  // Update title / tooltip elements
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key && translations[targetLang] && translations[targetLang][key] !== undefined) {
      el.setAttribute("title", translations[targetLang][key]);
    }
  });

  // Update language toggle buttons in Navbar and Mobile menu
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const btnLang = btn.getAttribute("data-lang-btn");
    const isActive = btnLang === targetLang;
    if (isActive) {
      btn.classList.add("bg-primary", "text-white", "shadow-sm");
      btn.classList.remove("text-slate-500", "hover:text-primary", "bg-transparent");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("bg-primary", "text-white", "shadow-sm");
      btn.classList.add("text-slate-500", "hover:text-primary", "bg-transparent");
      btn.setAttribute("aria-pressed", "false");
    }
  });

  // Dispatch custom event for any listeners
  window.dispatchEvent(
    new CustomEvent("asd:languageChange", { detail: { lang: targetLang } })
  );
}

export function initLanguage() {
  if (typeof window === "undefined") return;

  // Add click handlers for buttons
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.removeEventListener("click", handleLangClick);
    btn.addEventListener("click", handleLangClick);
  });

  // Apply stored language
  const current = getCurrentLanguage();
  setLanguage(current);
}

function handleLangClick(e) {
  const target = e.currentTarget;
  if (!target) return;
  const lang = target.getAttribute("data-lang-btn");
  if (lang) {
    setLanguage(lang);
  }
}

// Auto-run on DOMContentLoaded and Astro page load
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initLanguage);
  document.addEventListener("astro:page-load", initLanguage);
}
