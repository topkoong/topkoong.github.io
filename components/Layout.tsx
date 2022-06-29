import { Footer } from './Footer';
import { Navbar } from './Navbar';

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main className='h-screen'>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
