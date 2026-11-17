import { Hero, SiteFooter, SiteHeader } from "@alammobility/ui/components";

import { name, links, facts } from "./site-content";
export default function Home() {
  const phone = process.env.NEXT_PUBLIC_BOOKING_PHONE;
  return <div className="landing">
    <SiteHeader name={name} links={links} />
    <main id="main">
      <Hero eyebrow="Non-emergency medical transport" title="Wheelchair-accessible rides to medical appointments."
        description="Schedule a ride for yourself or someone you care for." bookingHref="/book"
        phoneHref={phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined} />
      {!phone && <section id="phone-booking" className="phone-note shell" aria-label="Phone booking">Phone booking will be available when the booking number is added.</section>}
    </main>
    <SiteFooter name={name} facts={facts} />
  </div>;
}
