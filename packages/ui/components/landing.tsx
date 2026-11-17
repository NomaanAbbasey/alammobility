import type { ReactNode } from "react";
import { ActionLink } from "./primitives";

export function SiteHeader({ name, links = [] }: { name: string; links?: { href: string; label: string }[] }) {
  return <header className="site-header-bar">
    <div className="site-header shell">
      <a className="wordmark" href="/">{name}</a>
      {links.length > 0 && <nav aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>}
    </div>
  </header>;
}

export function SiteFooter({ name, facts = [] }: { name: string; facts?: readonly string[] }) {
  return <footer className="site-footer shell"><a href="/" className="wordmark">{name}</a>{facts.length > 0 && <ul aria-label="Service facts">{facts.map(fact => <li key={fact}>{fact}</li>)}</ul>}</footer>;
}

export function Hero({ eyebrow, title, description, bookingHref, phoneHref }: { eyebrow: string; title: string; description: string; bookingHref: string; phoneHref?: string }) {
  return <section className="hero shell" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="hero-title">{title}</h1>
      <p className="hero-description">{description}</p>
      <div className="hero-actions">
        <ActionLink href={bookingHref}>Book a ride</ActionLink>
        <ActionLink variant="quiet" href={phoneHref ?? "#phone-booking"}>Call to book</ActionLink>
      </div>
    </div>
  </section>;
}

export function ServiceInfo({ summary, children }: { summary: string; children: ReactNode }) {
  return <section aria-label="Service information" className="service-info shell">
    <p>{summary}</p>
    {children}
  </section>;
}

export function ContentPage({ title, intro, children, wide }: { title: string; intro: string; children: ReactNode; wide?: boolean }) {
  return <main id="main" className={wide ? "content-page content-page-wide shell" : "content-page shell"}>
    <h1>{title}</h1>
    <p className="content-intro">{intro}</p>
    {children}
  </main>;
}
