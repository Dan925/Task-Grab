import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from './lang/en/translation.json';
import translationFR from './lang/fr/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

   

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;