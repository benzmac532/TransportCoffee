import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

const locations = [
  {
    name: 'The Shoals area',
    area: 'Florence / Muscle Shoals, AL',
    note: 'More retail partners coming soon. Check back or email us for the latest list.',
  },
];

export default function Locations() {
  return (
    <main className="page locations-page">
      <div className="locations-mosaic">
        <PageHero eyebrow="Where to find us" title="Find Transport nearby." />

        <section className="locations-layout">
          <Reveal className="locations-list" variant="up" delaySteps={1}>
            <h2>Retail partners</h2>
            {locations.map((place, index) => (
              <Reveal key={place.name} as="article" className="location-card" delaySteps={index} variant="up">
                <h3>{place.name}</h3>
                <p>{place.area}</p>
                <p>{place.note}</p>
              </Reveal>
            ))}
            <p>
              Know a shop that should carry us? Email{' '}
              <a href="mailto:transportcoffeeroasters@gmail.com">
                transportcoffeeroasters@gmail.com
              </a>
              .
            </p>
          </Reveal>

          <Reveal className="map-frame" variant="scale" delaySteps={2}>
            <iframe
              title="The Shoals, Alabama map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-87.85%2C34.70%2C-87.50%2C34.90&amp;layer=mapnik&amp;marker=34.7998%2C-87.6773"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="map-link"
              href="https://www.openstreetmap.org/?mlat=34.7998&mlon=-87.6773#map=12/34.7998/-87.6773"
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
