import getArticle from '@utils/getArticle';
import getArticles from '@utils/getArticles';
import moment from 'moment';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

function ArticleContent({ data, content }: any) {
  return (
    <section className='bg-bright-green p-8 md:p-16'>
      <header>
        <h1 className='capitalize text-4xl md:text-6xl lg:text-7xl font-apercu'>
          {data.title}
        </h1>
      </header>
      <div className='my-8'>
        <small className='text-sm font-apercu'>
          Published: {moment(data.date).format('MMMM d, YYYY')}
        </small>
      </div>
      <article className='prose marker:text-black md:prose-lg lg:prose-xl'>
        <MDXRemote {...content} />
      </article>
    </section>
  );
}

export const getStaticPaths = async () => {
  const articles = await getArticles();
  const paths = articles.map((article) => ({ params: { slug: article.slug } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const article = await getArticle(params.slug);
  const mdxSource = await serialize(article.content);
  return {
    props: {
      data: article,
      content: mdxSource,
    },
  };
};

export default ArticleContent;
