// .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
//   .then(data => {
//     console.log(data);
//     const items = data.querySelectorAll("item");
//     let html = ``;
//     items.forEach(el => {
//       html += `
//         <article>
//           <img src="${el.querySelector("link").innerHTML}/image/large.png" alt="">
//           <h2>
//             <a href="${el.querySelector("link").innerHTML}" target="_blank" rel="noopener">
//               ${el.querySelector("title").innerHTML}
//             </a>
//           </h2>
//         </article>
//       `;
//     });
//     document.body.insertAdjacentHTML("beforeend", html);
import _ from 'lodash';

// <div className="card border-0">
//   <div className="card-body"><h2 className="card-title h4">Посты</h2></div>
//   <ul className="list-group border-0 rounded-0">
//     <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
//       href="https://ru.hexlet.io/courses/rails-full/lessons/engines/theory_unit" className="fw-bold" data-id="2"
//       target="_blank" rel="noopener noreferrer">Engines / Ruby: Полный Rails</a>
//       <button type="button" className="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal"
//               data-bs-target="#modal">Просмотр
//       </button>
//     </li>
//   </ul>
// </div>

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

  const feedTitle = rssData.querySelector('title');
  const feedDesc = rssData.querySelector('description');
  const items = rssData.querySelectorAll('item');
  console.log(rssData);

  return {
    feed: {
      title: feedTitle,
      desc: feedDesc,
    },
    posts: items,
  };
};
