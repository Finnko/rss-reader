import * as yup from 'yup';

const makeValidationSchema = (i18n, feedUrls) => {
  yup.setLocale({
    string: {
      required: i18n.t('errors.required'),
      url: i18n.t('errors.url'),
    },
    mixed: {
      notOneOf: i18n.t('errors.doubles'),
    },
  });

  return yup.object().shape({
    url: yup.string().url().required().notOneOf(feedUrls),
  });
};

const validateForm = (schema, fields) => (
  schema.validate(fields, { abortEarly: false })
    .then(() => ({}))
);

export { makeValidationSchema, validateForm };
