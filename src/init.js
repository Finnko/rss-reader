// @ts-check
import 'bootstrap';
import i18next from 'i18next';
import resources from './locales';
import app from './app.js';

export default () => {
  const defaultLanguage = 'ru';

  const i18nextInstance = i18next.createInstance();
  const promise = i18nextInstance.init({
    lng: defaultLanguage,
    resources: {
      ru: resources.ru,
    },
  });

  promise.then(() => {
    app(i18nextInstance);
  });
};
