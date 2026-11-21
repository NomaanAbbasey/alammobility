"use client";

import { useLayoutEffect, useRef, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");
const hours = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minutes = Array.from({ length: 60 }, (_, index) => pad(index));
const periods = ["AM", "PM"];
const dateLabel = new Intl.DateTimeFormat("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

function localDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function defaultPickup(outbound: string) {
  const next = Math.max(Date.now() + 3600000, outbound ? new Date(outbound).getTime() + 60000 : 0);
  const date = new Date(Math.ceil(next / 60000) * 60000);
  return { date: localDate(date), time: `${pad(date.getHours())}:${pad(date.getMinutes())}` };
}

function Wheel({ id, label, options, index, onChange, invalid }: {
  id: string;
  label: string;
  options: readonly string[];
  index: number;
  onChange: (index: number) => void;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef(index);

  function rowHeight(element: HTMLDivElement) {
    return element.firstElementChild?.getBoundingClientRect().height || 1;
  }

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) element.scrollTop = initial.current * rowHeight(element);
  }, []);

  function select(element: HTMLDivElement, next: number) {
    const selected = Math.max(0, Math.min(options.length - 1, next));
    element.scrollTop = selected * rowHeight(element);
    onChange(selected);
  }

  return <div className="pickup-wheel">
    <span id={`${id}-label`} className="pickup-wheel-label">{label}</span>
    <div id={id} ref={ref} role="listbox" tabIndex={0} aria-labelledby={`${id}-label`}
      aria-activedescendant={`${id}-option-${index}`} aria-invalid={invalid || undefined}
      aria-describedby={invalid ? "pickup-time-error" : undefined}
      className="pickup-wheel-scroll"
      onScroll={event => {
        const element = event.currentTarget;
        const next = Math.max(0, Math.min(options.length - 1, Math.round(element.scrollTop / rowHeight(element))));
        if (next !== index) onChange(next);
      }}
      onKeyDown={event => {
        const next = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: options.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(event.currentTarget, next);
      }}>
      {options.map((option, position) => <div key={option} id={`${id}-option-${position}`}
        role="option" aria-selected={position === index}
        onClick={event => {
          const wheel = ref.current;
          if (!wheel) return;
          event.preventDefault();
          wheel.focus({ preventScroll: true });
          select(wheel, position);
        }}>{option}</div>)}
    </div>
  </div>;
}

export function PickupWheels({ date, time, earliest, error, onChange }: {
  date: string;
  time: string;
  earliest: string;
  error?: string;
  onChange: (key: "date" | "time", value: string) => void;
}) {
  const [dates] = useState(() => {
    const today = localDate(new Date());
    const firstAvailable = earliest > today ? earliest : today;
    const start = new Date(`${date < firstAvailable ? date : firstAvailable}T12:00`);
    // Keep the previous selection in the wheel when an existing pickup is edited.
    const end = new Date(start);
    end.setDate(end.getDate() + 365);
    const last = new Date(`${date}T12:00`);
    const options = [];
    while (start <= end || start <= last) {
      options.push({ value: localDate(start), label: dateLabel.format(start) });
      start.setDate(start.getDate() + 1);
    }
    return options;
  });
  const [hour, minute] = time.split(":").map(Number);
  const hourIndex = (hour + 11) % 12;
  const period = Math.floor(hour / 12);

  function selectTime(nextHour: number, nextMinute: number, nextPeriod: number) {
    onChange("time", `${pad((nextHour + 1) % 12 + nextPeriod * 12)}:${pad(nextMinute)}`);
  }

  return <fieldset className="pickup-picker">
    <legend className="sr-only">Pickup date and time</legend>
    <div className="pickup-wheels">
      <Wheel id="date" label="Date" options={dates.map(option => option.label)} index={dates.findIndex(option => option.value === date)}
        onChange={index => onChange("date", dates[index].value)} />
      <Wheel id="time" label="Hour" options={hours} index={hourIndex}
        onChange={index => selectTime(index, minute, period)} invalid={!!error} />
      <Wheel id="pickup-minute" label="Minute" options={minutes} index={minute}
        onChange={index => selectTime(hourIndex, index, period)} />
      <Wheel id="pickup-period" label="AM/PM" options={periods} index={period}
        onChange={index => selectTime(hourIndex, minute, index)} />
    </div>
    {error && <p className="error" id="pickup-time-error" role="alert">{error}</p>}
  </fieldset>;
}
