import { ArticleFeed } from '../components/ArticleFeed';
import { BlogFeed } from '../components/BlogFeed';
import Head from 'next/head';
import { Hero } from '../components/Hero';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>THEERUTTOP</title>
        <meta name='description' content='Toppy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='grid grid-cols-1 lg:grid-cols-4 h-full'>
        <ArticleFeed />
        <Hero />
        <BlogFeed />
      </section>
    </>
  );
};

export default Home;
