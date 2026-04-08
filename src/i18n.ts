import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhTW from "./locales/zh-TW";
import en from "./locales/en";

const STORAGE_KEY = "jiucai-lang";

const savedLang = localStorage.getItem(STORAGE_KEY);
const browserLang = navigator.language.startsWith("zh") ? "zh-TW" : "en";
const defaultLang = savedLang ?? browserLang;

i18n.use(initReactI18next).init({
  resources: {
    "zh-TW": { translation: zhTW },
    en: { translation: en },
  },
  lng: defaultLang,
  fallbackLng: "zh-TW",
  interpolation: { escapeValue: false },
});

// 切換語言時存入 localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
export type Lang = "zh-TW" | "en";
