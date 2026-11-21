import type { ReactNode } from "react";
import { ActionLink, Button } from "./primitives";
import { Pin } from "./address-field";

export function BookingFrame({ title, progress, onBack, children, aside, busy, showMobileAside }: { title: string; progress?: string; onBack?: () => void; children: ReactNode; aside?: ReactNode; busy?: boolean; showMobileAside?: boolean }) {
  return <main className={`booking shell${aside ? " booking-with-aside" : ""}`} id="main">
    <section className="booking-panel">
      <div className="booking-nav">
        {onBack ? <Button variant="quiet" onClick={onBack} disabled={busy}>← Back</Button> : <ActionLink variant="quiet" href="/">← Home</ActionLink>}
        {progress && <span>{progress}</span>}
      </div>
      <h1 id="booking-title" tabIndex={-1}>{title}</h1>
      {children}
    </section>
    {aside && <aside className="booking-aside" data-mobile-visible={showMobileAside} aria-label="Trip route">{aside}</aside>}
  </main>;
}

export function TripDetails({ groups }: { groups: { title: string; lines?: string[]; content?: ReactNode; onEdit?: () => void }[] }) {
  return <section className="trip-card" aria-label="Ride details">
    <h2>Ride details</h2>
    <dl className="trip-details">{groups.map(group => <div className="trip-row" key={group.title}>
    <dt>{group.title}</dt>
    <dd>{group.content}{group.lines?.map((line, index) => <span key={index}>{line}</span>)}</dd>
    {group.onEdit && <dd><Button className="edit-action" variant="quiet" aria-label={`Edit ${group.title.toLowerCase()}`} onClick={group.onEdit}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4M4 20l4.3-.9L20 7.4a2.8 2.8 0 0 0-4-4L4.9 15.7 4 20Z" /></svg></Button></dd>}
    </div>)}</dl>
  </section>;
}

export function RouteStops({ pickup, destination }: { pickup: ReactNode; destination: ReactNode }) {
  return <ol className="route-stops" aria-label="Pickup and destination">
    <li><Pin /><div>{pickup}</div></li>
    <li><Pin /><div>{destination}</div></li>
  </ol>;
}

export function RoutePreview({ pickup, destination }: { pickup: string; destination: string }) {
  return <figure className="route-preview">
    <div className="sample-map" aria-hidden="true">
      {pickup && <span className="map-marker map-start"><Pin /></span>}
      {pickup && destination && <span className="map-route" />}
      {destination && <span className="map-marker map-end"><Pin /></span>}
    </div>
    <figcaption>
      <h2>Sample route map</h2>
      {pickup || destination ? <RouteStops
        pickup={<><strong>Pickup</strong>{pickup || "Choose a pickup address"}</>}
        destination={<><strong>Destination</strong>{destination || "Choose a destination"}</>}
      /> : <p>Your selected stops will appear here.</p>}
    </figcaption>
  </figure>;
}
