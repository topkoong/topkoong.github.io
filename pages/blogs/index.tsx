import Head from 'next/head';
import type { NextPage } from 'next';
import { blogs } from '../../mockData/blogs';

const handleBlogBackgroundColor = (index: number) => {
  if (index % 5 === 0 && index !== 5) return 'bg-bright-green';
  else if (index % 5 === 1) return 'bg-pale-orange';
  else if (index % 5 === 2) return 'bg-light-blue';
  else if (index % 5 === 3) return 'bg-darken-pink';
  else if (index % 5 === 4) return 'bg-bright-yellow';
  return 'bg-darken-sky';
};
const Blogs: NextPage = () => {
  return (
    <>
      <Head>
        <title>THEERUTTOP BLOGS</title>
        <meta name='description' content='Toppy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='h-full bg-light-indigo p-8 md:p-16'>
        <header>
          <h1 className='capitalize text-4xl md:text-6xl lg:text-7xl font-apercu'>
            Blog
          </h1>
        </header>

        {
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 lg:gap-4'>
            {blogs.map((blog, idx) => (
              <li key={blog.title}>
                <article
                  className={`my-2 md:my-4 lg:my-8 p-8 border-2 border-black ${handleBlogBackgroundColor(
                    idx
                  )}`}
                >
                  <header>
                    <h3 className='text-xl font-bold font-apercu'>
                      {blog.title}
                    </h3>
                  </header>
                  <summary>{blog.spoiler}</summary>
                  <small className='text-sm font-apercu'>
                    {blog.createdAt}
                  </small>
                </article>
              </li>
            ))}
          </ul>
        }
      </section>
    </>
  );
};

export default Blogs;
