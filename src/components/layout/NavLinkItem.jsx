import { Link, useLocation, useNavigate } from 'react-router-dom';

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  if (to.startsWith('/#')) return pathname === '/' && typeof window !== 'undefined' && window.location.hash === `#${to.split('#')[1]}`;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function NavLinkItem({ to, children, className = '', activeClassName = '', onNavigate, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = isActive(location.pathname, to);
  const classes = `${className} ${active ? activeClassName : ''}`.trim();

  if (to.includes('#')) {
    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    return (
      <a
        href={to.startsWith('#') ? to : `${targetPath}#${hash}`}
        className={classes}
        aria-current={active ? 'page' : undefined}
        onClick={(event) => {
          event.preventDefault();
          onNavigate?.();

          if (location.pathname === targetPath) {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.replaceState(null, '', `${targetPath}#${hash}`);
              return;
            }
          }

          navigate({ pathname: targetPath, hash });
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={classes}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate?.()}
      {...props}
    >
      {children}
    </Link>
  );
}
