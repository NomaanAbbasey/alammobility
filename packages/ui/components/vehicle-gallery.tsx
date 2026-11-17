"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function VehicleGallery({ lead, items }: {
  lead: ReactNode;
  items: readonly { title: string; description: string; media: ReactNode }[];
}) {
  const gallery = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = gallery.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div className="vehicle-gallery">
    {lead}
    <div ref={gallery} className="vehicle-gallery-details" data-revealed={revealed}>
      {items.map(item => <section className="vehicle-gallery-card" key={item.title}>
        <div className="vehicle-gallery-media">{item.media}</div>
        <div className="vehicle-gallery-copy"><h2>{item.title}</h2><p>{item.description}</p></div>
      </section>)}
    </div>
  </div>;
}
