"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Journey({ label, chapters }: {
  label: string;
  chapters: readonly { id: string; label: string; title: string; body: string; visual?: ReactNode }[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const panes = Array.from(root.current?.querySelectorAll<HTMLElement>(".journey-pane") ?? []);
    let frame = 0;

    function update() {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = panes[0];
      for (const pane of panes) {
        if (pane.getBoundingClientRect().top > line) break;
        current = pane;
      }
      if (current) setActive(current.id);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [chapters]);

  return <div className="journey" ref={root}>
    <nav className="journey-rail" aria-label={label}>
      <ul>{chapters.map(chapter => <li key={chapter.id}>
        <a href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>{chapter.label}</a>
      </li>)}</ul>
    </nav>
    <div className="journey-panes">{chapters.map(chapter => (
      <section key={chapter.id} id={chapter.id} className="journey-pane" aria-labelledby={`${chapter.id}-title`}>
        <div className="journey-copy"><h2 id={`${chapter.id}-title`}>{chapter.title}</h2><p>{chapter.body}</p></div>
        {chapter.visual}
      </section>
    ))}</div>
  </div>;
}
