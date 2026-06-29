export default function ProductMockup({ color = 'navy', boxed = false, label = 'Waypoint', sublabel = 'Blend' }) {
  return (
    <div className={`mock-product ${color} ${boxed ? 'boxed' : ''}`}>
      <div className="seal">T</div>
      <div className="brand-lines">
        <span />
        <strong>Transport</strong>
        <small>Coffee Roasters</small>
      </div>
      <div className="product-label">
        <p>{label}</p>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}
