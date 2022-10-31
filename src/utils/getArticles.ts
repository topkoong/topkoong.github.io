import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const getArticles = () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'pages/articles'));
  const allArticlesData = files.map((fileName) => {
    const slug = fileName.replace('.mdx', '');
    const fileContents = fs.readFileSync(
      path.join(process.cwd(), `pages/articles/${slug}.mdx`),
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
