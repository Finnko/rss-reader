import * as yup from 'yup';
import keyBy from 'lodash/keyBy';

const makeValidationSchema = (i18n, state) => {
  yup.setLocale({
    string: {
      url: i18n.t('errors.url'),
      required: i18n.t('errors.required'),
    },
    mixed: {
      notOneOf: i18n.t('errors.doubles'),
    },
  });

  return yup.object().shape({
    url: yup.string().url().required().notOneOf(state.urls),
  });
};

const validateForm = (schema, fields) => (
  schema.validate(fields, { abortEarly: false })
    .then(() => ({}))
    .catch((e) => keyBy(e.inner, 'path'))
);

export { makeValidationSchema, validateForm };