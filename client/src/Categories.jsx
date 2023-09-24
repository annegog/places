
import React from "react";
import { ReactComponent as HomeIcon } from "./assets/svg/home.svg";
import { ReactComponent as PrivateIcon} from "./assets/svg/hotel.svg";
import { ReactComponent as AppartmentIcon} from "./assets/svg/house-appartment.svg";
import { ReactComponent as VillaIcon} from "./assets/svg/fort.svg";
import { ReactComponent as LoftIcon} from "./assets/svg/house-day.svg";


export default function Categories({ selected, onChange }) {
  function handleCheckBox(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange(name); 
    } else {
      onChange(selected.replace(name, '')); // Remove the name
    }
  }

  const categoriesList = [
    { label: "House", name: "house", icon: <HomeIcon /> },
    { label: "Apartment", name: "apartment", icon: <AppartmentIcon /> },
    { label: "Private room", name: "privateRoom", icon: <PrivateIcon /> },
    { label: "Loft", name: "loft", icon: <LoftIcon /> },
    {label: "Villa", name: "villa", icon: <VillaIcon/>},
  ];

  return (
    <>
      {categoriesList.filter((category) => category.name).map((category) => (
          <label
            key={category.name}
            className="order p-4 flex rounded-2xl gap-2 items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected===category.name}
              name={category.name}
              onChange={handleCheckBox}
            />
            <div style={{ width: 30 }}>{category.icon}</div>
            <span>{category.label}</span>
          </label>
        ))}
    </>
  );
}
      