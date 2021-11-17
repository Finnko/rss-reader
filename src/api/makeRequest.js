import axios from 'axios';
import errorTypes from '../const';

const END_POINT = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

const makeRequest = (url, options = {}) => {
  const proxyUrl = `${END_POINT}${encodeURIComponent(url)}`;

  return axios.get(proxyUrl, options)
    .then(({ data }) => data.contents)
    .catch((err) => {
      const wrapErr = new Error();
      wrapErr.name = errorTypes.network;
      wrapErr.cause = err;
      throw wrapErr;
    });
};

export default makeRequest;
