import Reveal from './Reveal';

/**
 * Shared inner-page hero band.
 * Height is controlled by --page-hero-height in CSS so all pages match.
 */
export default function PageHero({ eyebrow, title, titleLines, children, className = '' }) {
  const lines = Array.isArray(titleLines) && titleLines.length > 0 ? titleLines : null;

  return (
    <Reveal
      as="section"
      className={['page-hero', className].filter(Boolean).join(' ')}
      variant="soft"
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>
        {lines
          ? lines.map((line) => <span key={line}>{line}</span>)
          : title}
      </h1>
      {children}
    </Reveal>
  );
}
