import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';

const pageMeta = getStaticPageMeta('/about');

export default function About() {
  return (
    <main className="page about-page">
      <Seo title={pageMeta.title} description={pageMeta.description} path={pageMeta.path} />
      <div className="about-mosaic">
        <PageHero eyebrow="About Transport Coffee Roasters" title="Coffee that moves you." />

        <section className="about-feature">
          <Reveal className="about-photo-col" variant="left" delaySteps={1}>
            <aside className="about-photo">
              <img
                src="/founders-stand.jpg"
                alt="Transport Coffee Roasters founders Shane Moody and Easton Veal at an outdoor coffee stand"
                loading="lazy"
                decoding="async"
              />
            </aside>
          </Reveal>

          <Reveal className="prose about-copy" variant="up" delaySteps={2}>
            <p className="about-lead">
              At Transport Coffee Roasters, we want to share our love of coffee with
              everyone through carefully crafted roasts built on quality and consistency.
            </p>

            <p>
              Founded in 2026 by Shane Moody and Easton Veal, Transport Coffee Roasters
              began with a shared passion for exceptional coffee and countless
              conversations about what great coffee could mean to everyday people. More
              than creating another coffee company, we wanted to build a brand that
              celebrates the moments coffee creates. Whether it&apos;s the start of your
              morning, the middle of a busy workday, or the pursuit of something bigger,
              coffee has the ability to bring people together, sharpen focus, and create
              meaningful moments with family, friends, and even strangers. We would be
              honored for our coffee to become part of your daily ritual.
            </p>

            <p>
              For us, Transport is more than a name; it&apos;s a way of life. Whether Shane
              is making deliveries, Easton is working on his next project, or we&apos;re
              both chasing the next opportunity to improve our craft, we&apos;re always
              moving forward. That mindset shapes everything we do and reminds us that
              the best coffee is meant to accompany people wherever life takes them.
            </p>

            <p>
              Our mission is simple and intentional: to roast exceptional coffee that
              inspires connection, fuels ambition, and helps move people forward. We
              believe coffee should do more than taste great. It should honor the people
              who grow it, create opportunities for meaningful relationships, and
              encourage each of us to pursue what matters most.
            </p>

            <p>
              Whether you&apos;re chasing a dream, building something meaningful, or simply
              slowing down to enjoy a quiet moment, we&apos;re grateful to be part of your
              journey. Thank you for letting us be a part of it.
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
