import { Link, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';

export default function NotFound({
  title = 'Page not found',
  message = "That page doesn't exist or may have moved. Let's get you back on the road.",
  primaryTo = '/',
  primaryLabel = 'Back home',
  secondaryTo = '/shop',
  secondaryLabel = 'Shop coffee',
  path,
}) {
  const location = useLocation();
  const seoPath = path || location.pathname || '/404';

  return (
    <main className="page not-found-page">
      <Seo title={title} description={message} path={seoPath} noindex />
      <div className="not-found-mosaic">
        <PageHero eyebrow="404" title={title} />
        <Reveal as="section" className="not-found-panel" variant="up" delaySteps={1}>
          <p className="eyebrow">Lost the trail</p>
          <p className="not-found-copy">{message}</p>
          <div className="not-found-actions">
            <Link className="button" to={primaryTo}>
              {primaryLabel}
            </Link>
            {secondaryTo ? (
              <Link className="button ghost-dark" to={secondaryTo}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
