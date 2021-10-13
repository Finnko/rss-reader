import * as yup from 'yup';
import keyBy from 'lodash/keyBy';

// RSS уже существует

// yup.addMethod(yup.array, 'unique', function (message, mapper = a => a) {
//   return this.test('unique', message, (list) => {
//     return list.length === new Set(list.map(mapper)).size;
//   });
// });

const makeValidationSchema = (i18n) => yup.object().shape({
  url: yup.string()
    .url(i18n.t('errors.url'))
    .required(i18n.t('errors.required')),
});

const validateForm = (schema, fields) => (
  schema.validate(fields, { abortEarly: false })
    .then(() => ({}))
    .catch((e) => keyBy(e.inner, 'path'))
);

export { makeValidationSchema, validateForm };
