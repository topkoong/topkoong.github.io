import type { NextPage } from 'next';
import Head from 'next/head';

const About: NextPage = () => {
  return (
    <div className='bg-red-orange h-full'>
      <Head>
        <title>THEERUTTOP</title>
        <meta name='description' content='Toppy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='h-full'>
        <article className='p-8 md:p-16'>
          <header>
            <h1 className='capitalize text-4xl md:text-6xl lg:text-7xl font-apercu text-lime-400'>
              About me
            </h1>
          </header>
          <div className='flex flex-col items-center md:items-start md:flex-row'>
            <aside className='py-8 md:py-24 space-x-8 w-fit'>
              <div className='animate-spin-slow w-36 h-36 md:w-96 md:h-96 bg-bright-yellow rounded-full transition-transform' />
            </aside>
            <div className='md:px-8'>
              <p className='font-apercu text-lg md:text-xl lg:text-3xl my-8 md:my-16'>
                I&apos;m a software engineer based in Bangkok, Thailand, currently working
                at Accenture, where I&apos;m leading the AI Chatbot project, a
                conversational AI Platform for Financial Services.
              </p>
              <p className='font-apercu text-lg md:text-xl lg:text-3xl my-8 md:my-16 text-emerald-400'>
                I&apos;m passionate about bringing groundbreaking technical solutions to
                people through intuitive experiences as well as creating scalable and
                maintainable applications.
              </p>
              <p className='font-apercu text-lg text-yellow-300 md:text-xl lg:text-3xl my-8 md:my-16'>
                I also enjoy spending my weekends to build weird and wonderful side
                projects.
              </p>
              <p className='font-apercu text-lg md:text-xl lg:text-3xl my-8 md:my-16 text-sky-400'>
                Besides coding, I have an eclectic taste in music and am passionate about
                action figures, RC cars, coding, the Internet of Things, and photography.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default About;
