import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const getArticle = (slug: any) => {
  // eslint-disable-next-line no-console
  console.log('process.cwd(): ', process.cwd());
  const fileContents = fs.readFileSync(
    path.join(process.cwd(), `src/articles/${slug}.mdx`),
    'utf8',
  );
  const { data, content } = matter(fileContents);
  return {
    ...data,
    content,
  };
};

export default getArticle;
