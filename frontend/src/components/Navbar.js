import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX, FiGrid, FiBookOpen, FiClipboard, FiMonitor, FiSettings, FiBarChart2, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const navItems = useMemo(() => {
    if (!user) return [];
    if (user.role === 'kitchen') {
      return [{ to: '/kitchen', label: 'Kitchen', icon: FiMonitor }];
    }

    const base = [
      { to: '/tables', label: 'Tables', icon: FiGrid },
      { to: '/menu', label: 'Menu', icon: FiBookOpen },
      { to: '/orders', label: 'Orders', icon: FiClipboard },
    ];

    if (user.role === 'admin') {
      base.push(
        { to: '/kitchen', label: 'Kitchen', icon: FiMonitor },
        { to: '/admin', label: 'Admin', icon: FiSettings },
        { to: '/reports', label: 'Reports', icon: FiBarChart2 }
      );
    }

    return base;
  }, [user]);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const mobilePrimaryItems = useMemo(() => navItems.slice(0, 3), [navItems]);
  const mobileMoreItems = useMemo(() => navItems.slice(3), [navItems]);
  const hasMoreItems = mobileMoreItems.length > 0;
  const isMoreActive = hasMoreItems && mobileMoreItems.some((item) => location.pathname.startsWith(item.to));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!user) return null;

  return (
    <>
      <nav className="navbar">
      <div className="nav-brand-wrap">
        <div className="nav-brand">
          <img src="/logo-cafemanager.svg" alt="CafeManager" className="brand-logo" />
          <span>CafeManager</span>
        </div>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="nav-user">
        <span className="user-badge">{user.role}</span>
        <span>{user.name}</span>
        <button onClick={toggleTheme} className="btn-icon theme-toggle-btn" title="Toggle theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <button onClick={handleLogout} className="btn-icon" title="Logout">
          <FiLogOut />
        </button>
      </div>
      </nav>

      <div className="mobile-bottom-nav">
        {mobilePrimaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className="mobile-bottom-nav-item">
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {hasMoreItems && (
          <button
            className={`mobile-bottom-nav-item mobile-more-btn ${isMoreActive || moreOpen ? 'active' : ''}`}
            onClick={() => setMoreOpen((v) => !v)}
            type="button"
          >
            <FiMenu size={18} />
            <span>More</span>
          </button>
        )}
      </div>

      {hasMoreItems && (
        <>
          <div className={`mobile-more-overlay ${moreOpen ? 'open' : ''}`} onClick={() => setMoreOpen(false)} />
          <div className={`mobile-more-sheet ${moreOpen ? 'open' : ''}`}>
            <div className="mobile-more-header">
              <strong>More</strong>
              <button className="btn-icon" onClick={() => setMoreOpen(false)} type="button">
                <FiX />
              </button>
            </div>
            <div className="mobile-more-list">
              {mobileMoreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className="mobile-more-link">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <button className="mobile-more-link logout" type="button" onClick={handleLogout}>
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
              <button className="mobile-more-link" type="button" onClick={toggleTheme}>
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
