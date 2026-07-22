import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

export default function ShippingPolicy() {
  return (
    <main className="page policy-page">
      <PageHero eyebrow="Policies" title="Shipping Policy" />
      <Reveal as="section" className="page-content prose" variant="up" delaySteps={1}>
        <p>
          We roast and ship from The Shoals, AL with care so your coffee arrives
          fresh and ready for the road ahead.
        </p>
        <h3>Standard orders</h3>
        <p>
          Shipping rates are calculated at checkout based on your location and
          order details.
        </p>
        <h3>Subscriptions</h3>
        <p>
          Subscription orders include a flat $5 shipping rate on every delivery.
        </p>
        <h3>Processing</h3>
        <p>
          Orders are typically roasted and prepared for shipment within a few
          business days. You&apos;ll receive tracking information once your
          package is on the way.
        </p>
        <h3>Questions</h3>
        <p>
          Need help with an order? Email{' '}
          <a href="mailto:transportcoffeeroasters@gmail.com">
            transportcoffeeroasters@gmail.com
          </a>{' '}
          and we&apos;ll take care of you.
        </p>
        <p>
          <em>
            Note: If you have a more detailed Shopify shipping document, we can
            swap this copy for that version anytime.
          </em>
        </p>
      </Reveal>
    </main>
  );
}
