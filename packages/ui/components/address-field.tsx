"use client";

import { useState, type KeyboardEvent } from "react";

export function Pin({ className }: { className?: string }) {
  return <svg className={className} aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" />
  </svg>;
}

export type AddressOption = { label: string; detail: string; address: string };

export function AddressField({ id, label, value, options, verified, error, onChange, onSelect }: {
  id: string; label: string; value: string; options: readonly AddressOption[]; verified: boolean; error?: string;
  onChange: (value: string) => void; onSelect: (address: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const list = id + "-suggestions";
  const query = value.toLowerCase().trim().split(/\s+/);
  const matches = options.filter(option => verified || query.every(part => option.address.toLowerCase().includes(part))).slice(0, 5);

  function select(option: AddressOption) {
    onSelect(option.address);
    setOpen(false);
    setActive(-1);
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (!matches.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActive(current => current < 0 ? (direction > 0 ? 0 : matches.length - 1) : (current + direction + matches.length) % matches.length);
    } else if (event.key === "Enter" && open && matches[active]) {
      event.preventDefault();
      select(matches[active]);
    }
  }

  return <div className="field address-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} name={id} role="combobox" autoComplete="off" placeholder="Search for an address"
      value={value} aria-autocomplete="list" aria-expanded={open && matches.length > 0}
      aria-controls={open && matches.length > 0 ? list : undefined}
      aria-activedescendant={open && matches[active] ? list + "-" + active : undefined}
      aria-invalid={!!error} aria-describedby={error ? id + "-error" : undefined}
      onFocus={() => setOpen(!verified)} onBlur={() => { setOpen(false); setActive(-1); }}
      onChange={event => { onChange(event.target.value); setActive(-1); setOpen(true); }} onKeyDown={handleKey} />
    {open && (matches.length ? <ul className="address-results" role="listbox" id={list} aria-label={label + " suggestions"}>
      {matches.map((option, index) => <li key={option.address} role="option" id={list + "-" + index}
        aria-selected={index === active} onPointerDown={event => event.preventDefault()} onClick={() => select(option)}>
        <Pin /><div><strong>{option.label}</strong><small>{option.detail}</small></div>
      </li>)}
    </ul> : <p className="address-empty" role="status">No sample addresses match. Try Maple, Riverside, or Oak.</p>)}
    {error && <p className="error" id={id + "-error"}>{error}</p>}
  </div>;
}
