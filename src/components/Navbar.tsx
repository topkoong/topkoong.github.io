import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import logo from '../../public/images/smiley.png';

const Navbar = () => {
  const buttonShadowClass = `before:content-[''] before:top-1 before:left-5 before:-z-10 before:w-10/12 before:h-full before:transition-translate before:translate-x-px before:translate-y-px before:border-2 before:bg-white before:absolute before:block before:rounded-3xl before:border-black before:opacity-100 before:hover:opacity-0`;
  const buttonClass = `w-10/12 md:w-36 mx-4 border-2 bg-bright-yellow border-black rounded-3xl p-2 text-center z-20 hover:transition hover:transform hover:translate-y-1 hover:translate-x-1`;
  const [isOpen, setIsOpen] = useState(false);
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;
  return (
    <nav
      className={`flex flex-col ${
        isOpen ? 'h-screen' : 'h-24'
      } md:flex-row md:h-24 items-start md:items-center md:justify-between bg-bright-yellow py-3 px-8`}
    >
      <ul className='w-full md:w-100 flex items-center justify-between md:justify-start'>
        <li className='px-4'>
          <Link href='/'>
            <Image src={logo} alt='logo' width={60} height={60} />
          </Link>
        </li>
        <li className='px-4 font-apercu text-7xl font-extrabold uppercase'>
          <Link href='/'>Toppy</Link>
        </li>
        <button
          className='md:hidden flex flex-col h-12 w-12 rounded justify-center items-center group'
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={`${genericHamburgerLine} ${
              isOpen
                ? 'rotate-45 translate-y-3 opacity-50 group-hover:opacity-100'
                : 'opacity-100 group-hover:opacity-100'
            }`}
          />
          <div
            className={`${genericHamburgerLine} ${
              isOpen ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'
            }`}
          />
          <div
            className={`${genericHamburgerLine} ${
              isOpen
                ? '-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100'
                : 'opacity-100 group-hover:opacity-100'
            }`}
          />
        </button>
      </ul>
      <ul
        className={`${
          isOpen ? 'flex' : 'hidden'
        } mt-20 md:mt-0 md:flex flex-col md:flex-row w-full`}
      >
        <li className='relative z-0 hover:cursor-pointer my-8 md:my-auto'>
          <span
            className={`block hover:bg-red-orange ${buttonShadowClass} ${buttonClass}`}
          >
            <Link href='/about' className='font-apercu text-2xl font-extrabold uppercase'>
              About
            </Link>
          </span>
        </li>
        <li className='relative z-0 hover:cursor-pointer my-8 md:my-auto'>
          <span
            className={`block hover:bg-light-indigo ${buttonShadowClass} ${buttonClass}`}
          >
            <Link href='/blogs' className='font-apercu text-2xl font-extrabold uppercase'>
              Posts
            </Link>
          </span>
        </li>
        <li className='relative z-0 hover:cursor-pointer my-8 md:my-auto'>
          <span
            className={`block hover:bg-bright-green ${buttonShadowClass} ${buttonClass}`}
          >
            <Link
              href='/articles'
              className='font-apercu text-2xl font-extrabold uppercase'
            >
              Articles
            </Link>
          </span>
        </li>
        <li className='md:hidden xl:block relative z-0 hover:cursor-pointer my-8 md:my-auto'>
          <span
            className={`block hover:bg-darken-sky ${buttonShadowClass} ${buttonClass}`}
          >
            <Link href='/' className='font-apercu text-2xl font-extrabold uppercase'>
              Projects
            </Link>
          </span>
        </li>
        <li className='md:hidden xl:block relative z-0 hover:cursor-pointer my-8 md:my-auto'>
          <span className={`block hover:bg-white ${buttonShadowClass} ${buttonClass}`}>
            <Link
              href='https://theerut-top-resume.vercel.app/'
              className='font-apercu text-2xl font-extrabold uppercase'
            >
              Resume
            </Link>
          </span>
        </li>
      </ul>
      {/* <Link href='/'>
          <a className='inline-flex items-center p-2 mr-4 '>
            <svg
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              className='fill-current text-white h-8 w-8 mr-2'
            >
              <path d='M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z' />
            </svg>
            <span className='text-xl text-white font-bold uppercase tracking-wide'>
              TalwindCSS
            </span>
          </a>
        </Link> */}
    </nav>
  );
};

export default Navbar;
