// <div className="card border-0">
//   <div className="card-body"><h2 className="card-title h4">Фиды</h2></div>
//   <ul className="list-group border-0 rounded-0">
//     <li className="list-group-item border-0 border-end-0"><h3 className="h6 m-0">Новые уроки на Хекслете</h3><p
//       className="m-0 small text-black-50">Практические уроки по программированию</p></li>
//   </ul>
// </div>

// <item>
//   <title>Engines / Ruby: Полный Rails</title>
//   <guid isPermaLink="false">2182</guid>
//   <link>https://ru.hexlet.io/courses/rails-full/lessons/engines/theory_unit</link>
//   <description>Цель: Познакомиться с энжинами</description>
//   <pubDate>Fri, 22 Oct 2021 11:02:18 +0000</pubDate>
// </item>

const parser = new DOMParser();



export default (rss) => {
  const rssData = parser.parseFromString(rss, 'application/xml');

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
