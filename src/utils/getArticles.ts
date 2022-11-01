import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const getArticles = () => {
  // eslint-disable-next-line no-console
  console.log('process.cwd(): ', process.cwd());
  const files = fs.readdirSync(path.join(process.cwd(), 'src/articles'));
  const allArticlesData = files.map((fileName) => {
    const slug = fileName.replace('.mdx', '');
    const fileContents = fs.readFileSync(
      path.join(process.cwd(), `src/articles/${slug}.mdx`),
      'utf8',
    );
    const { data } = matter(fileContents);
    return {
      slug,
      ...data,
    };
  });

  return allArticlesData;
};

export default getArticles;
