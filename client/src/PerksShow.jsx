import React from 'react';
import { ReactComponent as PartyIcon } from "./assets/svg/party.svg";
import { ReactComponent as LikeIcon } from "./assets/svg/like.svg";
import { ReactComponent as SmokingIcon } from "./assets/svg/smoking.svg";
import { ReactComponent as WifiIcon } from "./assets/svg/wifi.svg";
import { ReactComponent as ParkingIcon } from "./assets/svg/parking.svg";
import { ReactComponent as AcIcon } from "./assets/svg/ac.svg";
import { ReactComponent as EntersIcon } from "./assets/svg/enterns.svg";
import { ReactComponent as TVIcon } from "./assets/svg/tv.svg";

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
    { label: "Parties Allowed", name: "party", icon: <PartyIcon /> },
    { label: "Living Room", name: "livingRoom", icon: <LikeIcon /> },
    { label: "Smoking Area", name: "smoking", icon: <SmokingIcon/> },
    { label: "Wifi", name: "wifi", icon: <WifiIcon/> },
    { label: "Parking spot", name: "parking", icon: <ParkingIcon/> },
    { label: "Pets Allowed", name: "pets", icon: <LikeIcon/> },
    { label: "AC", name: "ac", icon: <AcIcon/> },
    { label: "Private enterns", name: "enterns", icon: <EntersIcon/> },
    { label: "TV", name: "tv", icon: <TVIcon/> },
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
