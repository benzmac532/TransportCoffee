import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';

const pageMeta = getStaticPageMeta('/locations');

const locations = [
  {
    name: 'The Forge Coffeehouse',
    address: '2108 S Wilson Dam Rd',
    city: 'Muscle Shoals, AL 35661',
    href: 'https://cash.app/$theforgecoffeehouse/pickup',
  },
];

function fullAddress(place) {
  return `${place.address}, ${place.city}`;
}

export default function Locations() {
  const mapAddress = fullAddress(locations[0]);
  const mapQuery = encodeURIComponent(mapAddress);

  return (
    <main className="page locations-page">
      <Seo title={pageMeta.title} description={pageMeta.description} path={pageMeta.path} />
      <div className="locations-mosaic">
        <PageHero eyebrow="Where to find us" title="Find Transport nearby" />

        <section className="locations-layout">
          <Reveal className="locations-list" variant="up" delaySteps={1}>
            <p className="eyebrow">Partners</p>
            <h2>Retail partners</h2>
            <p className="locations-lead">
              Find Transport Coffee at shops across the Shoals. More partners coming soon.
            </p>

            <div className="locations-grid">
              {locations.map((place, index) => {
                const name = place.href ? (
                  <a
                    className="location-name-link"
                    href={place.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{place.name}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <span>{place.name}</span>
                );

                return (
                  <Reveal
                    key={place.name}
                    as="article"
                    className="location-card"
                    delaySteps={index}
                    variant="up"
                  >
                    <div className="location-card-icon" aria-hidden="true">
                      <MapPin size={18} strokeWidth={1.75} />
                    </div>
                    <div className="location-card-body">
                      <h3>{name}</h3>
                      <p>{place.address}</p>
                      <p>{place.city}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <p className="locations-note">
              Know a shop that should carry us? Send us a{' '}
              <Link to="/contact">message</Link>.
            </p>
          </Reveal>

          <Reveal className="map-frame" variant="scale" delaySteps={2}>
            <iframe
              title={`${locations[0].name} map`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              Open full map
            </a>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
