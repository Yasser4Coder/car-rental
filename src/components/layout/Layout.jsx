import { Outlet } from 'react-router-dom';
import ScrollToTop from '../common/ScrollToTop';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFab from './WhatsAppFab';
import MobileStickyCta from './MobileStickyCta';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <MobileStickyCta />
    </div>
  );
}
