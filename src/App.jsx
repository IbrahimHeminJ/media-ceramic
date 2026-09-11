import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Tiles from './components/Tiles';
import Social from './components/Social';
import TileModal from './components/TileModal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { getAllTiles, createTile, updateTile, deleteTile } from './api/tilesApi';
import { getAllSocialLinks, createSocialLink, deleteSocialLink } from './api/socialLinksApi';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTile, setSelectedTile] = useState(null);

  // Tile id parsed from a deep-linked URL (e.g. #tiles/13), resolved against `tiles`
  // once the catalog has loaded — see the effect below.
  const [pendingTileId, setPendingTileId] = useState(null);

  // Central tiles collection state (supports CRUD across Catalog & Dashboard)
  const [tiles, setTiles] = useState([]);

  // Central social links state (supports Add/Delete across Social page & Dashboard)
  const [socialLinks, setSocialLinks] = useState([]);

  // Fetch live catalog data from the backend on mount
  useEffect(() => {
    (async () => {
      try {
        const [tilesResult, socialLinksResult] = await Promise.all([
          getAllTiles(),
          getAllSocialLinks(),
        ]);
        setTiles(tilesResult);
        setSocialLinks(socialLinksResult);
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      }
    })();
  }, []);

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
   * A tiles route may carry a deep-linked tile id, e.g. `#tiles/13`.
   */
  const resolveRoute = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.replace('#', '').toLowerCase();

    // Check login path (via /login or #/login or #login)
    if (pathname === '/login' || hash === 'login' || hash === '/login') {
      return { page: 'login' };
    }

    // Check dashboard path (protected)
    if (pathname === '/dashboard' || hash === 'dashboard' || hash === '/dashboard') {
      return { page: 'dashboard' };
    }

    // Deep-linked tile detail, e.g. #tiles/13
    const tileDetailMatch = hash.match(/^tiles\/(\d+)$/);
    if (tileDetailMatch) {
      return { page: 'tiles', tileId: Number(tileDetailMatch[1]) };
    }

    // Public collection / social / home routes
    if (hash === 'tiles' || hash === 'social' || hash === 'home') {
      return { page: hash };
    }

    return { page: 'home' };
  }, []);

  // Synchronize route changes from browser navigation (back/forward/hash/url load)
  useEffect(() => {
    const handleLocationChange = () => {
      const { page: targetPage, tileId } = resolveRoute();

      // Route protection for Dashboard: redirect unauthenticated visits to login
      if (targetPage === 'dashboard' && !currentUser) {
        setCurrentPage('login');
        if (window.location.pathname === '/dashboard') {
          window.history.replaceState({}, '', '/login');
        }
        return;
      }

      setCurrentPage(targetPage);
      setPendingTileId(tileId ?? null);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    handleLocationChange();

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [resolveRoute, currentUser]);

  // The tile to show in the detail modal: a directly-clicked tile takes priority,
  // otherwise fall back to resolving a deep-linked id (e.g. from a shared/refreshed
  // #tiles/13 URL) against the catalog once it has loaded.
  const modalTile =
    selectedTile ?? (pendingTileId != null ? tiles.find((t) => t.id === pendingTileId) ?? null : null);

  /**
   * Navigation handler for internal links and page transitions.
   */
  const navigateTo = (page) => {
    setSelectedTile(null);
    setPendingTileId(null);
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
   * Navigates directly (rather than via navigateTo) since `currentUser` in this
   * closure is still stale until the setCurrentUser state update is applied —
   * navigateTo('dashboard') would otherwise see the pre-login value and bounce
   * back to /login.
   */
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      sessionStorage.setItem('terra_auth_user', JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
    setSelectedTile(null);
    setPendingTileId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('dashboard');
    window.history.pushState({}, '', '/dashboard');
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
   * Opens a tile's detail modal from the public catalog and pushes a shareable,
   * deep-linkable URL (#tiles/{id}) so copying/reloading it reopens the same tile.
   */
  const handleSelectTile = (tile) => {
    setSelectedTile(tile);
    const hashUrl = `#tiles/${tile.id}`;
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState({}, '', `/${hashUrl}`);
    } else {
      window.history.pushState({}, '', hashUrl);
    }
  };

  /**
   * Closes the tile detail modal. Only reverts the URL back to the plain #tiles
   * route when actually on the public catalog page — this modal is also reused by
   * the Dashboard's "View Details" button, where the URL shouldn't change.
   */
  const closeTileModal = () => {
    setSelectedTile(null);
    setPendingTileId(null);
    if (currentPage !== 'tiles') return;
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState({}, '', '/#tiles');
    } else {
      window.history.pushState({}, '', '#tiles');
    }
  };

  /**
   * CRUD Handlers for Dashboard tile management
   */
  const handleAddTile = async (formData) => {
    const res = await createTile(formData);
    setTiles((prev) => [res.data, ...prev]);
    return res.data;
  };

  const handleUpdateTile = async (id, formData) => {
    const res = await updateTile(id, formData);
    setTiles((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  const handleDeleteTile = async (tileId) => {
    await deleteTile(tileId);
    setTiles((prev) => prev.filter((t) => t.id !== tileId));
  };

  /**
   * CRUD Handlers for Social Links management
   */
  const handleAddSocialLink = async (payload) => {
    const res = await createSocialLink(payload);
    setSocialLinks((prev) => [...prev, res.data]);
    return res.data;
  };

  const handleDeleteSocialLink = async (linkId) => {
    await deleteSocialLink(linkId);
    setSocialLinks((prev) => prev.filter((link) => link.id !== linkId));
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
            onSelectTile={handleSelectTile}
          />
        )}

        {currentPage === 'social' && (
          <Social
            socialLinks={socialLinks}
            onNavigate={navigateTo}
          />
        )}

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
            socialLinks={socialLinks}
            onSelectTile={(tile) => setSelectedTile(tile)}
            onAddTile={handleAddTile}
            onUpdateTile={handleUpdateTile}
            onDeleteTile={handleDeleteTile}
            onAddSocialLink={handleAddSocialLink}
            onDeleteSocialLink={handleDeleteSocialLink}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Tile Detail Modal */}
      {modalTile && (
        <TileModal
          tile={modalTile}
          onClose={closeTileModal}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
