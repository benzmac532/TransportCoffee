import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <main className="page about-page">
      <div className="about-mosaic">
        <PageHero eyebrow="About Transport Coffee Roasters" title="Coffee that moves you." />

        <section className="about-feature">
          <Reveal className="about-photo-col" variant="left" delaySteps={1}>
            <aside className="about-photo">
              <img
                src="/nature-coffee.png"
                alt="Holding a coffee mug overlooking a mountain valley at golden hour"
                loading="lazy"
                decoding="async"
              />
            </aside>
          </Reveal>

          <Reveal className="prose about-copy" variant="up" delaySteps={2}>
            <p className="about-lead">
              At Transport Coffee Roasters, we craft coffee with intention, designed to
              forge the path from here to there. Built for momentum and grounded in
              quality, we believe in coffee that moves you.
            </p>

            <p>
              Founded by Shane Moody and Easton Veal, Transport Coffee Roasters was
              born from a shared passion for exceptional coffee and the belief that
              every journey deserves a great cup. Whether it&apos;s the start of your
              morning, the middle of a busy workday, or the pursuit of something
              bigger, coffee has the power to fuel progress and create meaningful
              moments along the way.
            </p>

            <p>
              The name Transport represents movement, connection, and purpose. From the
              farmers who cultivate each coffee cherry to the communities that gather
              around a fresh brew, every cup is part of a larger journey. We honor that
              journey by sourcing quality coffees, roasting with precision, and focusing
              on consistency in every batch.
            </p>

            <p>
              Our mission is simple: to craft exceptional coffee that inspires
              connection, fuels ambition, and supports the momentum that carries people
              forward. We believe coffee should do more than taste good. It should
              elevate your day, spark conversation, and help you move toward what
              matters most.
            </p>

            <p>
              Whether you&apos;re chasing a goal, building something meaningful, or
              simply taking a moment to slow down, we&apos;re grateful to be part of
              your journey.
            </p>

            <div className="prose-signoff">
              <strong>Transport Coffee Roasters</strong>
              <span>Coffee that moves you.</span>
            </div>
          </Reveal>
        </section>

        <section className="values-strip" aria-label="Brand values">
          {[
            {
              title: 'Thoughtful Sourcing',
              body: 'Quality coffees from partners we trust, roasted with care.',
            },
            {
              title: 'Expert Roasting',
              body: 'Small-batch precision for consistency in every cup.',
            },
            {
              title: 'Real Connection',
              body: 'Coffee that sparks conversation and fuels ambition.',
            },
          ].map((value, index) => (
            <Reveal key={value.title} as="article" delaySteps={index} variant="up">
              <h2>{value.title}</h2>
              <p>{value.body}</p>
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}
