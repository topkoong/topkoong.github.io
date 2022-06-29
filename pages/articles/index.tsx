import Head from 'next/head';
import type { NextPage } from 'next';
import { articles } from '../../mockData/articles';

const handleArticleBackgroundColor = (index: number) => {
  if (index % 4 === 0) return 'bg-light-indigo';
  else if (index % 4 === 1) return 'bg-red-orange';
  else if (index % 4 === 2) return 'bg-bright-yellow';
  return 'bg-white';
};

const Articles: NextPage = () => {
  return (
    <>
      <Head>
        <title>THEERUTTOP ARTICLES</title>
        <meta name='description' content='Toppy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='h-full bg-bright-green p-8 md:p-16'>
        <header>
          <h1 className='capitalize text-4xl md:text-6xl lg:text-7xl font-apercu'>
            Articles
          </h1>
        </header>
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 lg:gap-4'>
          {articles.map((article, idx) => (
            <li key={article.title}>
              <article
                className={`my-8 p-8 border-2 border-black ${handleArticleBackgroundColor(
                  idx
                )}`}
              >
                <header>
                  <h3 className='text-xl font-bold font-apercu'>
                    {article.title}
                  </h3>
                </header>
                <summary>{article.spoiler}</summary>
                <small className='text-sm font-apercu'>
                  {article.createdAt}
                </small>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Articles;
