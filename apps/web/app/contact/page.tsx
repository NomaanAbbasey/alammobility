import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@alammobility/ui/components";
import { bookingPhone, contactEmail } from "../contact-details";
import { facts, links, name } from "../site-content";

export const metadata: Metadata = { title: "Contact | Alam Mobility" };

export default function ContactPage() {
  return <div className="contact-page">
    <SiteHeader name={name} links={links} />
    <main id="main" className="contact-main shell">
      <h1>Contact Alam Mobility</h1>
      {bookingPhone || contactEmail ? <>
        <p>Get in touch about booking a ride or your accessibility needs.</p>
        <dl className="contact-methods">
          {bookingPhone && <div><dt>Phone</dt><dd><a href={bookingPhone.href}>{bookingPhone.label}</a></dd></div>}
          {contactEmail && <div><dt>Email</dt><dd><a href={contactEmail.href}>{contactEmail.label}</a></dd></div>}
        </dl>
      </> : <p>Contact details are coming soon.</p>}
      <a className="contact-link" href="/how-it-works">See how booking works</a>
    </main>
    <SiteFooter name={name} facts={facts} />
  </div>;
}
