"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!id) return;
    function openFromLink() {
      if (location.hash === `#${id}` && ref.current) ref.current.open = true;
    }
    openFromLink();
    window.addEventListener("hashchange", openFromLink);
    return () => window.removeEventListener("hashchange", openFromLink);
  }, [id]);

  return <details ref={ref} id={id} className="disclosure">
    <summary>{title}</summary><div>{children}</div>
  </details>;
}
