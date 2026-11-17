import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({ variant = "primary", className = "", loading = false, loadingLabel = "Loading…", disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet"; loading?: boolean; loadingLabel?: string }) {
  return <button type="button" {...props} disabled={disabled || loading} aria-busy={loading || undefined}
    className={`action action-${variant} ${className}`}>
    {loading ? <><span className="action-spinner" aria-hidden="true" />{loadingLabel}</> : children}
  </button>;
}

export function StatusChip({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" }) {
  return <span className={`status-chip status-chip-${tone}`} role={tone === "error" ? "alert" : "status"}>
    <span aria-hidden="true">{tone === "error" ? "!" : "✓"}</span>{children}
  </span>;
}

export function ActionLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "quiet" }) {
  return <a className={`action action-${variant}`} href={href}>{children}</a>;
}

export function Field({ label, error, optional, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string; optional?: boolean }) {
  const errorId = `${props.id}-error`;
  return <div className="field">
    <label htmlFor={props.id}>{label}{optional && <span> (optional)</span>}</label>
    <input {...props} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
    {error && <p className="error" id={errorId}>{error}</p>}
  </div>;
}

export function Choices({ legend, name, options, value, onChange }: { legend: string; name: string; options: readonly { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="choices">
    <legend className="sr-only">{legend}</legend>
    <div className="choice-grid">{options.map(option => <label key={option.value} className="choice">
      <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
      <span>{option.label}</span>
    </label>)}</div>
  </fieldset>;
}
