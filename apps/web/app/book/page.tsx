"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ActionLink, AddressField, BookingFrame, Button, Choices, Field, RoutePreview, RouteStops, SiteHeader, StatusChip, TripDetails } from "@alammobility/ui/components";
import { mockAddresses } from "./mock-addresses";
import { defaultPickup, PickupWheels } from "./pickup-wheels";

const titles = ["Who’s riding?", "Where are you going?", "When should we pick you up?", "Check your ride details"];
const stepSuccess = ["Rider details saved", "Route saved", "Pickup time saved"];
const riderOptions = [{ value: "self", label: "Book for myself" }, { value: "other", label: "Book for someone else" }];
const initial = { rider: "", name: "", phone: "", pickup: "", destination: "", instructions: "", date: "", time: "" };
type Details = typeof initial;
type Errors = Partial<Record<keyof Details, string>>;

function isValidPhone(value: string) {
  const phone = value.trim();
  if (!/^(?:\+?1[ .-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[ .-]?[2-9]\d{2}[ .-]?\d{4}$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.slice(1, 3) !== "11" && digits.slice(4, 6) !== "11" && !/^(\d)\1{9}$/.test(digits);
}

export default function BookPage() {
  const [trip, setTrip] = useState(initial);
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [returnRide, setReturnRide] = useState(false);
  const [outboundPickup, setOutboundPickup] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const isVerified = (address: string) => mockAddresses.some(option => option.address === address);

  useEffect(() => {
    if (!submitting) return;
    const timer = window.setTimeout(() => {
      setStep(4);
      setSubmitting(false);
      setSuccess("Demo request received");
    }, 450);
    return () => window.clearTimeout(timer);
  }, [submitting]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), 3200);
    return () => window.clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (step > 0 || returnRide) document.getElementById("booking-title")?.focus();
  }, [step, returnRide]);

  function update(key: keyof Details, value: string) {
    setTrip(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  }

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const nextErrors: Errors = {};
    if (step === 0) {
      if (!trip.rider) nextErrors.rider = "Choose who you’re booking for.";
      if (!trip.name.trim()) nextErrors.name = "Enter the rider’s name.";
      if (!isValidPhone(trip.phone)) nextErrors.phone = "Enter a valid Canadian or US number, such as (416) 555-0199.";
    }
    if (step === 1) {
      if (!isVerified(trip.pickup)) nextErrors.pickup = "Choose a pickup address from the suggestions.";
      if (!isVerified(trip.destination)) nextErrors.destination = "Choose a destination from the suggestions.";
      else if (trip.pickup === trip.destination) nextErrors.destination = "Choose a destination different from your pickup.";
    }
    if (step === 2) {
      if (new Date(`${trip.date}T${trip.time}`).getTime() <= Date.now()) {
        nextErrors.time = "Choose a date and time in the future.";
      } else if (returnRide && `${trip.date}T${trip.time}` <= outboundPickup) {
        nextErrors.time = "Choose a pickup after your outbound ride.";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSuccess("");
      const first = Object.keys(nextErrors)[0];
      (document.getElementById(first) ?? document.querySelector<HTMLInputElement>('input[name="rider"]'))?.focus();
      return;
    }
    if (step === 3) {
      setSuccess("");
      setSubmitting(true);
      return;
    }
    if (step === 1 && !editing && !trip.time) {
      const pickup = defaultPickup(outboundPickup);
      setTrip(current => ({ ...current, ...pickup }));
    }
    setSuccess(stepSuccess[step]);
    setStep(editing ? 3 : step + 1);
    setEditing(false);
  }

  function edit(index: number) {
    setSuccess("");
    setEditing(true);
    setStep(index);
  }

  function startReturn() {
    setSuccess("");
    setOutboundPickup(`${trip.date}T${trip.time}`);
    setTrip(current => ({ ...current, pickup: current.destination, destination: current.pickup, instructions: "", time: "" }));
    setReturnRide(true);
    setStep(1);
  }

  function back() {
    setSuccess("");
    setErrors({});
    setStep(editing ? 3 : Math.max(0, step - 1));
    setEditing(false);
  }

  const schedule = trip.date && trip.time ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(`${trip.date}T${trip.time}`)) : "";
  const canEdit = (step === 3 || step === 4) && !submitting;
  const groups = [
    { title: "Pickup time", lines: [schedule], onEdit: canEdit ? () => edit(2) : undefined },
    { title: "Trip", content: <RouteStops pickup={<><strong>Pickup</strong>{trip.pickup}</>} destination={<><strong>Destination</strong>{trip.destination}</>} />, lines: trip.instructions ? [`Pickup instructions: ${trip.instructions}`] : [], onEdit: canEdit ? () => edit(1) : undefined },
    { title: "Rider and contact", lines: [trip.name, trip.phone], onEdit: canEdit ? () => edit(0) : undefined },
  ];
  const field = (key: keyof Details) => ({ id: key, value: trip[key], error: errors[key], onChange: (event: React.ChangeEvent<HTMLInputElement>) => update(key, event.target.value) });
  const addressField = (key: "pickup" | "destination", label: string) => (
    <AddressField id={key} label={label} value={trip[key]} options={mockAddresses}
      verified={isVerified(trip[key])} error={errors[key]}
      onChange={value => update(key, value)} onSelect={value => update(key, value)} />
  );
  const route = <RoutePreview
    pickup={isVerified(trip.pickup) ? trip.pickup : ""}
    destination={isVerified(trip.destination) ? trip.destination : ""}
  />;

  return <div className="booking-page">
    <SiteHeader name="Alam Mobility" />
    <BookingFrame title={step === 4 ? "Demo request received" : titles[step]}
      progress={step < 4 ? `${returnRide ? "Return ride · " : ""}Step ${step + 1} of 4` : undefined}
      onBack={step > 0 && step < 4 ? back : undefined} aside={route} showMobileAside={step >= 2} busy={submitting}>
      {step === 4 ? <>
        <div className="booking-receipt">
          <p>Submitting this demo does not book a ride.</p>
        </div>
        <TripDetails groups={groups} />
        {!returnRide && <p className="booking-intro">Need a ride back? Book it separately when you know your pickup time.</p>}
        <div className="booking-actions">
          <ActionLink href="/">Done</ActionLink>
          {!returnRide && <Button variant="secondary" onClick={startReturn}>Book a return ride</Button>}
        </div>
      </> : <form className="booking-form" onSubmit={advance} noValidate>
        {step === 0 && <>
          <p className="booking-intro">Demo booking. Use sample information.</p>
          <Choices legend="Who’s riding?" name="rider" value={trip.rider} options={riderOptions} onChange={value => update("rider", value)} />
          {errors.rider && <p className="error" role="alert">{errors.rider}</p>}
          {trip.rider && <>
            <Field {...field("name")} label={trip.rider === "self" ? "Your name" : "Rider’s name"} autoComplete={trip.rider === "self" ? "name" : "off"} />
            <Field {...field("phone")} label="Your phone number" type="tel" autoComplete="tel" />
          </>}
        </>}
        {step === 1 && <>
          <RouteStops pickup={addressField("pickup", "Pickup address")} destination={addressField("destination", "Destination address")} />
          <p className="booking-intro">Choose from sample addresses for this demo.</p>
          <Field {...field("instructions")} label="Pickup instructions" placeholder="For example, use the side entrance" optional />
        </>}
        {step === 2 && <PickupWheels date={trip.date} time={trip.time} earliest={outboundPickup.slice(0, 10)}
          error={errors.time} onChange={(key, value) => {
            update(key, value);
            if (key === "date") setErrors(current => ({ ...current, time: undefined }));
          }} />}
        {step === 3 && <>
          <p className="booking-intro">Demo booking. Use sample information.</p>
          <TripDetails groups={groups} />
        </>}
        <div className="booking-action-bar">
          <Button type="submit" className="booking-submit" loading={submitting} loadingLabel="Submitting demo…">{step === 3 ? "Submit demo request" : editing ? "Save changes" : "Continue"}</Button>
        </div>
      </form>}
    </BookingFrame>
    {success && <div key={success} className="booking-success"><StatusChip>{success}</StatusChip></div>}
  </div>;
}
