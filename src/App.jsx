import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Tiles from './components/Tiles';
import Social from './components/Social';
import TileModal from './components/TileModal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { tilesData } from './data/tilesData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTile, setSelectedTile] = useState(null);

  // Central tiles collection state (supports CRUD across Catalog & Dashboard)
  const [tiles, setTiles] = useState(tilesData);

  // Authentication state (persisted across session refreshes)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('terra_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /**
   * Evaluates the current URL route (pathname or hash).
   * Ensures /login and /dashboard paths are properly resolved.
   */
  const resolveRoute = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.replace('#', '').toLowerCase();

    // Check login path (via /login or #/login or #login)
    if (pathname === '/login' || hash === 'login' || hash === '/login') {
      return 'login';
    }

    // Check dashboard path (protected)
    if (pathname === '/dashboard' || hash === 'dashboard' || hash === '/dashboard') {
      return 'dashboard';
    }

    // Public collection / social / home routes
    if (hash === 'tiles' || hash === 'social' || hash === 'home') {
      return hash;
    }

    return 'home';
  }, []);

  // Synchronize route changes from browser navigation (back/forward/hash/url load)
  useEffect(() => {
    const handleLocationChange = () => {
      const targetPage = resolveRoute();

      // Route protection for Dashboard: redirect unauthenticated visits to login
      if (targetPage === 'dashboard' && !currentUser) {
        setCurrentPage('login');
        if (window.location.pathname === '/dashboard') {
          window.history.replaceState({}, '', '/login');
        }
        return;
      }

      setCurrentPage(targetPage);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    handleLocationChange();

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [resolveRoute, currentUser]);

  /**
   * Navigation handler for internal links and page transitions.
   */
  const navigateTo = (page) => {
    setSelectedTile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'login') {
      setCurrentPage('login');
      window.history.pushState({}, '', '/login');
      return;
    }

    if (page === 'dashboard') {
      if (!currentUser) {
        setCurrentPage('login');
        window.history.pushState({}, '', '/login');
        return;
      }
      setCurrentPage('dashboard');
      window.history.pushState({}, '', '/dashboard');
      return;
    }

    // Public pages: reset pathname to root if currently on /login or /dashboard
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState({}, '', `/#${page}`);
    } else {
      window.location.hash = page;
    }

    setCurrentPage(page);
  };

  /**
   * Handler for successful login submission.
   */
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      sessionStorage.setItem('terra_auth_user', JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
    // Redirect to dashboard upon successful authentication
    navigateTo('dashboard');
  };

  /**
   * Handler for user logout.
   */
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('terra_auth_user');
    } catch {
      // Ignore storage errors
    }
    navigateTo('login');
  };

  /**
   * CRUD Handlers for Dashboard tile management
   */
  const handleAddTile = (newTile) => {
    setTiles((prev) => [newTile, ...prev]);
  };

  const handleUpdateTile = (updatedTile) => {
    setTiles((prev) =>
      prev.map((t) => (t.id === updatedTile.id ? updatedTile : t))
    );
  };

  const handleDeleteTile = (tileId) => {
    setTiles((prev) => prev.filter((t) => t.id !== tileId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F4] text-[#3D3229] font-sans antialiased selection:bg-[#E8D5C4]">
      {/* Navigation */}
      <Navbar activePage={currentPage} onNavigate={navigateTo} />

      {/* Dynamic Content */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && <Home onNavigate={navigateTo} />}

        {currentPage === 'tiles' && (
          <Tiles
            tiles={tiles}
            onSelectTile={(tile) => setSelectedTile(tile)}
          />
        )}

        {currentPage === 'social' && <Social onNavigate={navigateTo} />}

        {currentPage === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard
            user={currentUser}
            tiles={tiles}
            onSelectTile={(tile) => setSelectedTile(tile)}
            onAddTile={handleAddTile}
            onUpdateTile={handleUpdateTile}
            onDeleteTile={handleDeleteTile}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Tile Detail Modal */}
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
