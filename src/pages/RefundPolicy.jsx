import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

export default function RefundPolicy() {
  return (
    <main className="page policy-page">
      <PageHero eyebrow="Policies" title="Refund Policy" />
      <Reveal as="section" className="page-content prose" variant="up" delaySteps={1}>
        <p>
          Hello everyone! We unfortunately cannot accept returns on coffee since
          it is a food product. However, if you aren&apos;t pleased with the
          product that you received, please let us know, and we will make it right
          with you. If you have an issue with a product other than our coffee, get
          in touch with us, and we&apos;ll get it taken care of.
        </p>
        <p>
          Reach us anytime at{' '}
          <a href="mailto:transportcoffeeroasters@gmail.com">
            transportcoffeeroasters@gmail.com
          </a>
          .
        </p>
      </Reveal>
    </main>
  );
}
