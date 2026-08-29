import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Tiles from './components/Tiles';
import Social from './components/Social';
import TileModal from './components/TileModal';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTile, setSelectedTile] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'tiles', 'social'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedTile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F4] text-[#3D3229] font-sans antialiased selection:bg-[#E8D5C4]">
      {/* Navigation */}
      <Navbar activePage={currentPage} onNavigate={navigateTo} />

      {/* Dynamic Content */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && <Home onNavigate={navigateTo} />}
        {currentPage === 'tiles' && (
          <Tiles onSelectTile={(tile) => setSelectedTile(tile)} />
        )}
        {currentPage === 'social' && <Social onNavigate={navigateTo} />}
      </main>

      {/* Modal */}
      {selectedTile && (
        <TileModal
          tile={selectedTile}
          onClose={() => setSelectedTile(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
