import { blogs } from '../mockData/blogs';

const handleBlogBackgroundColor = (index: number) => {
  if (index % 5 === 0 && index !== 5) return 'bg-bright-green';
  else if (index % 5 === 1) return 'bg-pale-orange';
  else if (index % 5 === 2) return 'bg-light-blue';
  else if (index % 5 === 3) return 'bg-darken-pink';
  else if (index % 5 === 4) return 'bg-bright-yellow';
  return 'bg-darken-sky';
};

export const BlogFeed = () => {
  return (
    <aside className='hidden lg:block bg-red-orange p-16'>
      <h2 className='text-3xl text-center font-extrabold font-apercu uppercase'>
        Latest Posts
      </h2>
      <ul>
        {blogs.map((blog, idx) => (
          <li key={blog.title}>
            <article className='my-6'>
              <header>
                <h3 className='text-xl font-bold font-apercu'>{blog.title}</h3>
              </header>
              <summary>{blog.spoiler}</summary>
              <small className='text-sm font-apercu'>{blog.createdAt}</small>
            </article>
          </li>
        ))}
      </ul>
    </aside>
  );
};
