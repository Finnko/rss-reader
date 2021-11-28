import axios from 'axios';

const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get';

const proxyUrl = (url) => {
  const proxy = new URL(PROXY_URL);
  proxy.searchParams.set('url', url);
  proxy.searchParams.set('disableCache', 'true');
  return proxy.toString();
};

const makeRequest = (url, options = {}) => (
  axios.get(proxyUrl(url), options).then(({ data }) => data.contents)
);

export default makeRequest;
