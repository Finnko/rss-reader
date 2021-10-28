import errorTypes from './const';

const parser = new DOMParser();

export default (rss) => {
  const rssData = parser.parseFromString(rss, 'application/xml');
  const errorBlock = rssData.querySelector('parsererror');

  if (errorBlock) {
    const wrapErr = new Error();
    wrapErr.name = errorTypes.parse;
    throw wrapErr;
  }

  const feedTitle = rssData.querySelector('title').textContent;
  const feedDesc = rssData.querySelector('description').textContent;
  const items = rssData.querySelectorAll('item');

  const posts = Array.from(items).map((item) => ({
    link: item.querySelector('link').textContent,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
  }));

  return {
    feed: {
      title: feedTitle,
      desc: feedDesc,
    },
    posts,
  };
};
