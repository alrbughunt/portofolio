
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigation, ui } from '../../constants';

type NavbarProps = {
  activeSection: string;
};

export default function Navbar({ activeSection }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="nav-shell nav-shell-centered">
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={open ? ui.menuClose : ui.menuOpen}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" />
          ) : (
            <Menu aria-hidden="true" />
          )}
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav ${open ? 'is-open' : ''}`}
          aria-label={ui.primaryNavigation}
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${
                activeSection === item.id ? 'is-active' : ''
              }`}
              href={item.href}
              aria-current={
                activeSection === item.id ? 'location' : undefined
              }
              onClick={closeMenu}
            >
              {item.label}

              {activeSection === item.id && (
                <span
                  className="nav-active-dot"
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
