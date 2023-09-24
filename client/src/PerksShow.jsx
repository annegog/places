import React from "react";
import { ReactComponent as PartyIcon } from "./assets/svg/party.svg";
import { ReactComponent as LikeIcon } from "./assets/svg/like.svg";
import { ReactComponent as SmokingIcon } from "./assets/svg/smoke.svg";
import { ReactComponent as WifiIcon } from "./assets/svg/wifi.svg";
import { ReactComponent as ParkingIcon } from "./assets/svg/car.svg";
import { ReactComponent as AcIcon } from "./assets/svg/snowflakes.svg";
import { ReactComponent as EntersIcon } from "./assets/svg/portal-enter.svg";
import { ReactComponent as TVIcon } from "./assets/svg/tv.svg";
import { ReactComponent as FireplaceIcon } from "./assets/svg/fireplace.svg";
import { ReactComponent as PetsIcon } from "./assets/svg/paw.svg";

export default function PerksShow({ selected }) {
//   function handleCheckBox(ev) {
//     const { checked, name } = ev.target;
//     if (checked) {
//       onChange([...selected, name]);
//     } else {
//       onChange([...selected.filter((selectedName) => selectedName !== name)]);
//     }
//   }

  const perksList = [
    { label: "Wifi", name: "wifi", icon: <WifiIcon /> },
    { label: "Parking spot", name: "parking", icon: <ParkingIcon /> },
    { label: "Pets Allowed", name: "pets", icon: <PetsIcon /> },
    { label: "Air Condition", name: "ac", icon: <AcIcon /> },
    { label: "Private entrance", name: "enterns", icon: <EntersIcon /> },
    { label: "TV", name: "tv", icon: <TVIcon /> },
    { label: "Living Room", name: "livingRoom", icon: <FireplaceIcon /> },
    { label: "Smoking Area", name: "smoking", icon: <SmokingIcon /> },
    { label: "Parties Allowed", name: "party", icon: <PartyIcon /> },
  ];

  const checkedPerks = perksList.filter((perk) => selected.includes(perk.name));

  return (
    <>
      {checkedPerks.map((perk) => (
        <label
          key={perk.name}
          className="order p-3 flex rounded-2xl gap-1 items-center"
        >
          <output name={perk.name}/>
          <div style={{width: 30}}>{perk.icon}</div>
          <span>{perk.label}</span>
        </label>
      ))}
    </>
  );
}
