import getArticle from '@utils/getArticle';
import getArticles from '@utils/getArticles';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

function ArticleContent({ data, content }: any) {
  return (
    <section className='h-full bg-bright-green p-8 md:p-16'>
      <header>
        <h1 className='capitalize text-4xl md:text-6xl lg:text-7xl font-apercu'>
          {data.title}
        </h1>
      </header>
      <small className='text-sm font-apercu'>{data.date}</small>
      <MDXRemote {...content} />
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
