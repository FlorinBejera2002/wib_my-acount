import { Car } from "lucide-react";
import { findMake, VehicleMakes } from "node-vehicle-logos";
import { cn } from "@/lib/utils";

import bmwLogo from "@/assets/car-brands/bmw.svg";
import volkswagenLogo from "@/assets/car-brands/volkswagen.svg";
import daciaLogo from "@/assets/car-brands/dacia.svg";
import mercedesLogo from "@/assets/car-brands/mercedes-benz.svg";
import toyotaLogo from "@/assets/car-brands/toyota.svg";
import audiLogo from "@/assets/car-brands/audi.svg";
import renaultLogo from "@/assets/car-brands/renault.svg";
import skodaLogo from "@/assets/car-brands/skoda.svg";
import hyundaiLogo from "@/assets/car-brands/hyundai.svg";
import fordLogo from "@/assets/car-brands/ford.svg";
import peugeotLogo from "@/assets/car-brands/peugeot.svg";
import citroenLogo from "@/assets/car-brands/citroen.svg";
import fiatLogo from "@/assets/car-brands/fiat.svg";
import hondaLogo from "@/assets/car-brands/honda.svg";
import mazdaLogo from "@/assets/car-brands/mazda.svg";
import nissanLogo from "@/assets/car-brands/nissan.svg";
import kiaLogo from "@/assets/car-brands/kia.svg";
import seatLogo from "@/assets/car-brands/seat.svg";
import volvoLogo from "@/assets/car-brands/volvo.svg";
import suzukiLogo from "@/assets/car-brands/suzuki.svg";
import mitsubishiLogo from "@/assets/car-brands/mitsubishi.svg";

const logoMap: Record<string, string> = {
  bmw: bmwLogo,
  volkswagen: volkswagenLogo,
  dacia: daciaLogo,
  "mercedes-benz": mercedesLogo,
  toyota: toyotaLogo,
  audi: audiLogo,
  renault: renaultLogo,
  skoda: skodaLogo,
  hyundai: hyundaiLogo,
  ford: fordLogo,
  peugeot: peugeotLogo,
  citroen: citroenLogo,
  fiat: fiatLogo,
  honda: hondaLogo,
  mazda: mazdaLogo,
  nissan: nissanLogo,
  kia: kiaLogo,
  seat: seatLogo,
  volvo: volvoLogo,
  suzuki: suzukiLogo,
  mitsubishi: mitsubishiLogo,
};

interface VehicleBrandLogoProps {
  vehicleText: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function VehicleBrandLogo({ vehicleText, className, size = "md" }: VehicleBrandLogoProps) {
  const make = findMake(vehicleText, VehicleMakes, "contains");
  const logoUrl = make ? logoMap[make.logo] : undefined;

  if (!logoUrl) {
    return <Car className={cn(sizeClasses[size], "text-gray-400", className)} />;
  }

  return (
    <img
      src={logoUrl}
      alt={make!.name}
      className={cn(sizeClasses[size], "object-contain", className)}
    />
  );
}
