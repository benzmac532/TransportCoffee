import { Link } from 'react-router-dom';

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className={`logo ${compact ? 'compact' : ''}`} aria-label="Transport Coffee Roasters home">
      <img
        className="logo-mark-img"
        src="/logo-mark.png"
        alt=""
        width={48}
        height={40}
      />
      <span>
        <strong>Transport</strong>
        <small>Coffee Roasters</small>
      </span>
    </Link>
  );
}
