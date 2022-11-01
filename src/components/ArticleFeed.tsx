import Link from 'next/link';

const handleArticleBackgroundColor = (index: number) => {
  if (index % 4 === 0) return 'bg-darken-pink';
  if (index % 4 === 1) return 'bg-red-orange';
  if (index % 4 === 2) return 'bg-bright-yellow';
  return 'bg-white';
};

const ArticleFeed = ({ articles }: any) => {
  return (
    <aside className='hidden lg:block bg-light-indigo font-apercu p-16'>
      <h2 className='text-3xl text-center font-extrabold font-apercu uppercase'>
        Latest Articles
      </h2>
      <ul>
        {articles.map((article: any, idx: number) => (
          <li key={article.title}>
            <Link href={`/articles/${article.slug}`}>
              <article className='my-6'>
                <header>
                  <h3 className='text-xl font-bold font-apercu'>{article.title}</h3>
                </header>
                <summary>{article.description}</summary>
                <small className='text-sm font-apercu'>{article.date}</small>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ArticleFeed;
