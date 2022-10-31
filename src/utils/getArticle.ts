import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const getArticle = (slug: any) => {
  const fileContents = fs.readFileSync(
    path.join(process.cwd(), `articles/${slug}.mdx`),
    'utf8',
  );
  const { data, content } = matter(fileContents);
  return {
    ...data,
    content,
  };
};

export default getArticle;
