import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Load file JSON từ public/locales
  .use(LanguageDetector) // Detect ngôn ngữ browser tự động
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    supportedLngs: ["vi", "en", "cz"],
    debug: false,
    interpolation: {
      escapeValue: false, // React đã bảo vệ XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
