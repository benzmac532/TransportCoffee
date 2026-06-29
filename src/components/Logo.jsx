import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Transport Coffee home">
      <span className="logo-mark" aria-hidden="true">
        <span className="logo-wings left">
          <span />
          <span />
          <span />
        </span>
        <span className="logo-t">T</span>
        <span className="logo-wings right">
          <span />
          <span />
          <span />
        </span>
      </span>
      <span>
        <strong>Transport</strong>
        <small>Coffee Roasters</small>
      </span>
    </Link>
  );
}
