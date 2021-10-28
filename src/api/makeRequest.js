import axios from 'axios';
import errorTypes from '../const';

const END_POINT = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';
const TIMEOUT = 10000; // ms

const axiosInstance = axios.create({
  baseURL: END_POINT,
  timeout: TIMEOUT,
  withCredentials: true,
});

const makeRequest = (url, options = {}) => (
  axiosInstance.get(END_POINT + url, options)
    .then(({ data }) => data.contents)
    .catch((err) => {
      const wrapErr = new Error();
      wrapErr.name = errorTypes.network;
      wrapErr.cause = err;
      throw wrapErr;
    })
);

export default makeRequest;
