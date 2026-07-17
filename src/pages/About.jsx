export default function About() {
  return (
    <main className="page about-page">
      <div className="about-mosaic">
        <section className="page-hero">
          <p className="eyebrow">About Transport Coffee Roasters</p>
          <h1>Coffee that moves you.</h1>
        </section>

        <section className="about-feature">
          <div className="about-photo-col">
            <aside className="about-photo">
              <img
                src="/nature-coffee.png"
                alt="Holding a coffee mug overlooking a mountain valley at golden hour"
              />
            </aside>
          </div>

          <div className="prose about-copy">
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
          </div>
        </section>

        <section className="values-strip" aria-label="Brand values">
          <article>
            <h2>Thoughtful Sourcing</h2>
            <p>Quality coffees from partners we trust, roasted with care.</p>
          </article>
          <article>
            <h2>Expert Roasting</h2>
            <p>Small-batch precision for consistency in every cup.</p>
          </article>
          <article>
            <h2>Real Connection</h2>
            <p>Coffee that sparks conversation and fuels ambition.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
