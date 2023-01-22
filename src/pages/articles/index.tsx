import getArticles from '@utils/getArticles';
import moment from 'moment';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const handleArticleBackgroundColor = (index: number) => {
  if (index % 4 === 0) return 'bg-light-indigo';
  if (index % 4 === 1) return 'bg-red-orange';
  if (index % 4 === 2) return 'bg-bright-yellow';
  return 'bg-white';
};

const Articles: NextPage = ({ articles }: any) => {
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
          {articles.map((article: any, idx: number) => (
            <li key={article.title}>
              <Link href={`/articles/${article.slug}`}>
                <article
                  className={`my-8 p-8 border-2 border-black ${handleArticleBackgroundColor(
                    idx,
                  )}`}
                >
                  <header>
                    <h3 className='text-xl font-bold font-apercu'>{article.title}</h3>
                  </header>
                  <summary>{article.description}</summary>
                  <small className='text-sm font-apercu'>
                    {moment(article.date).format('MMMM d, YYYY')}
                  </small>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export const getStaticProps = () => {
  const articles = getArticles();

  return {
    props: {
      articles,
    },
  };
};

export default Articles;
