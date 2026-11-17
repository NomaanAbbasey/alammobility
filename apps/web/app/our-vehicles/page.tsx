import Image from "next/image";
import { VehicleGallery } from "@alammobility/ui/components";
import { InfoPage } from "../info-page";

const photo = "/accessible-van.png";
const items = [
  {
    title: "Side-entry ramp",
    description: "The accessible van has a ramp for boarding. If your pickup has more than one entrance, tell us where to meet you in the pickup instructions.",
    media: <Image src={photo} alt="Detail of the extended side ramp" width={1586} height={992} className="vehicle-ramp-detail" unoptimized />,
  },
  {
    title: "Manual and power wheelchairs",
    description: "The same van accommodates manual wheelchairs and power chairs. You can book a ride without selecting a vehicle or entering wheelchair dimensions.",
    media: <Image src={photo} alt="Detail of the van’s open side door and entry" width={1586} height={992} className="vehicle-door-detail" unoptimized />,
  },
];

export default function OurVehicles() {
  return <InfoPage title="Our accessible van" intro="Our wheelchair-accessible van accommodates both manual and power wheelchairs." wide>
    <VehicleGallery items={items} lead={<figure className="vehicle-photo">
      <Image src={photo} alt="Illustrative wheelchair-accessible van with the side ramp extended" width={1586} height={992} sizes="(max-width: 760px) 100vw, 1200px" unoptimized />
      <figcaption>Illustrative vehicle photo. Detail views show the ramp and side entry.</figcaption>
    </figure>} />
  </InfoPage>;
}
