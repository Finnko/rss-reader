import * as yup from 'yup';

const makeValidationSchema = (feedUrls) => (
  yup.object().shape({
    url: yup.string().url().required().notOneOf(feedUrls),
  })
);

const validateForm = (schema, url) => (
  schema.validate({ url }, { abortEarly: false }).then(() => ({}))
);

export { makeValidationSchema, validateForm };
