import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        // debug: __IS_DEV__,
        debug: false,

        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        // This CRM only ships full Russian copy — most UI text is hardcoded Russian rather
        // than routed through t(). English is an incomplete, opt-in translation. Detecting
        // language from the OS/browser locale (the "navigator" source) silently flips the
        // handful of t()-driven strings to English for anyone with an English system locale,
        // producing a mixed-language UI. Only trust an explicit prior choice (cached from the
        // LangSwitcher) or query/cookie overrides; otherwise always default to Russian.
        detection: {
            order: ['querystring', 'cookie', 'localStorage'],
            caches: ['localStorage'],
        },
    });

export default i18n;
