import axios from 'axios';
import errorTypes from '../const';

const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com';

const proxyUrl = (url) => `${PROXY_URL}/get?url=${url}&disableCache=true`;

const makeRequest = (url, options = {}) => (
  axios.get(proxyUrl(url), options)
    .then(({ data }) => data.contents)
    .catch((err) => {
      const wrapErr = new Error();
      wrapErr.name = errorTypes.network;
      wrapErr.cause = err;
      throw wrapErr;
    })
);

export default makeRequest;
