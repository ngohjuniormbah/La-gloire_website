import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { WhoWeAreView } from './views/WhoWeAreView';
import { FollowUsView } from './views/FollowUsView';
import { DonateView } from './views/DonateView';
import { MembershipView } from './views/MembershipView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { activePage } = useApp();
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'who-we-are':
        return <WhoWeAreView />;
      case 'follow-us':
        return <FollowUsView />;
      case 'donate':
        return <DonateView />;
      case 'membership':
        return <MembershipView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminView />;
      case 'login':
        return <LoginView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative">
      {/* Dynamic Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/40 pointer-events-none">
        <div
          className="h-full bg-[#1C295E] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navbar rendered on public pages */}
      {activePage !== 'admin' && <Navbar />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer rendered on public pages */}
      {activePage !== 'admin' && <Footer />}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
