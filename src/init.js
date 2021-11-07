// @ts-check
import 'regenerator-runtime/runtime.js';
import 'bootstrap';
import i18next from 'i18next';
import resources from './locales';
import app from './app.js';

export default async () => {
  const defaultLanguage = 'ru';

  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources: {
      ru: resources.ru,
    },
  });

  app(i18nextInstance);
};
