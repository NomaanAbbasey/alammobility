import Image from "next/image";
import { Journey, RouteStops } from "@alammobility/ui/components";
import { InfoPage } from "../info-page";

const chapters = [
  {
    id: "rider", label: "Rider", title: "Start with who’s riding.",
    body: "Book for yourself or someone else. Enter the rider’s name and the phone number we should use to reach the person booking.",
    visual: <div className="journey-example"><span>Book for myself</span><span>Book for someone else</span></div>,
  },
  {
    id: "pickup", label: "Pickup", title: "Choose where and when.",
    body: "Enter the pickup and destination addresses, then choose a pickup date and time. Add a note if there’s a specific entrance to use.",
    visual: <div className="journey-example"><RouteStops pickup="Pickup address" destination="Destination address" /></div>,
  },
  {
    id: "review", label: "Review", title: "Check your ride details.",
    body: "Review the addresses, pickup time, and rider details. You can edit any of them before submitting your request.",
    visual: <Image className="journey-photo" src="/accessible-van.png" alt="Illustrative accessible van with the side ramp extended" width={1586} height={992} unoptimized />,
  },
  {
    id: "return", label: "Return", title: "Book the ride back when you’re ready.",
    body: "After submitting your outbound request, choose Book a return ride on the receipt. We’ll reverse the addresses and carry over the date. You choose the pickup time. If your appointment end time is unknown, you can start a new booking later.",
  },
];

export default function HowItWorks() {
  return <InfoPage title="How booking works" intro="From your first pickup to the ride home, here’s how to schedule wheelchair-accessible transportation." wide>
    <Journey chapters={chapters} label="Booking journey" />
  </InfoPage>;
}
