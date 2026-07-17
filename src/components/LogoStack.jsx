import { Link } from 'react-router-dom';

export default function LogoStack() {
  return (
    <Link to="/" className="logo-stack" aria-label="Transport Coffee Roasters home">
      <img
        className="logo-stack-mark"
        src="/logo-mark.png"
        alt=""
        width={72}
        height={60}
      />
      <strong className="logo-stack-name">Transport</strong>
      <small className="logo-stack-sub">Coffee Roasters</small>
    </Link>
  );
}
