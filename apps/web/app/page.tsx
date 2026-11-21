import { Hero, SiteFooter, SiteHeader } from "@alammobility/ui/components";

import { name, links, facts } from "./site-content";
import { bookingPhone } from "./contact-details";
export default function Home() {
  return <div className="landing">
    <SiteHeader name={name} links={links} />
    <main id="main">
      <Hero eyebrow="Non-emergency medical transport" title="Wheelchair-accessible rides to medical appointments."
        description="Schedule a ride for yourself or someone you care for." bookingHref="/book"
        phoneHref={bookingPhone?.href ?? "/contact"} phoneLabel={bookingPhone ? "Call to book" : "Contact us"} />
    </main>
    <SiteFooter name={name} facts={facts} />
  </div>;
}
