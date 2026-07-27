import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';

const pageMeta = getStaticPageMeta('/locations');

function InstagramIcon({ size = 16, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

const locations = [
  {
    name: 'The Forge Coffeehouse',
    address: '2108 S Wilson Dam Rd',
    city: 'Muscle Shoals, AL 35661',
    href: 'https://www.theforgecoffeehouse.com/',
    socials: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/forgecoffeehouse/?hl=en',
        icon: InstagramIcon,
      },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/p/The-Forge-Coffeehouse-61558781245806/',
        icon: FacebookIcon,
      },
    ],
  },
];

function fullAddress(place) {
  return `${place.address}, ${place.city}`;
}

function directionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
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
                const address = fullAddress(place);
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
                    <div className="location-card-body">
                      <div className="location-card-heading">
                        <h3>{name}</h3>
                        <div className="location-card-actions">
                          <a
                            className="location-directions-link"
                            href={directionsUrl(address)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Get directions to ${place.name}`}
                            title="Get directions"
                          >
                            <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                          </a>
                          {place.socials?.map((social) => {
                            const Icon = social.icon;
                            return (
                              <a
                                key={social.label}
                                className="location-social-link"
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${place.name} on ${social.label}`}
                              >
                                <Icon size={16} strokeWidth={1.75} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
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
