import Link from 'next/link';
export const Hero = () => {
  return (
    <section className='col-span-2 bg-bright-green grid grid-row-2'>
      <article className='p-8 md:p-16 flex flex-col md:justify-between'>
        <header className='mb-4 md:mb-0'>
          <h1 className='text-5xl md:text-6xl font-extrabold font-apercu uppercase'>
            Hi, my name is
          </h1>
        </header>
        <Link href='https://www.linkedin.com/in/theerut-foongkiatcharoen/'>
          <a
            data-text='Theerut'
            className='w-fit font-apercu uppercase text-6xl md:text-7xl lg:text-8xl relative overflow-hidden pb-8 before:content-[attr(data-text)attr(data-text)] before:underline before:underline-offset-8 before:decoration-wavy before:decoration-yellow-300 before:absolute before:whitespace-nowrap before:text-transparent before:animate-wave'
          >
            Theerut
          </a>
        </Link>
        <h3 className='text-6xl md:text-7xl lg:text-8xl font-extrabold font-apercu uppercase'>
          &lt;{' '}
          <span className='text-6xl md:text-7xl lg:text-8xl text-darken-sky'>
            Top
          </span>{' '}
          /&gt;
          <span className='text-white animate-ping'>.</span>
        </h3>
      </article>
      <article className='bg-red-orange lg:bg-bright-yellow p-8 md:p-16'>
        <h4 className='text-6xl md:text-7xl lg:text-8xl font-extrabold font-apercu uppercase'>
          I make dumb stuff.
        </h4>
      </article>
    </section>
  );
};
