
import React from "react";
import { ReactComponent as HomeIcon } from "./assets/svg/home.svg";
import { ReactComponent as PrivateIcon} from "./assets/svg/hotel.svg";
import { ReactComponent as AppartmentIcon} from "./assets/svg/house-appartment.svg";
import { ReactComponent as VillaIcon} from "./assets/svg/fort.svg";
import { ReactComponent as LoftIcon} from "./assets/svg/house-day.svg";

export default function CategoryShow({ selected }) {

  const categoriesList = [
    { label: "House", name: "house", icon: <HomeIcon /> },
    { label: "Apartment", name: "apartment", icon: <AppartmentIcon /> },
    { label: "Private room", name: "privateRoom", icon: <PrivateIcon /> },
    { label: "Loft", name: "loft", icon: <LoftIcon /> },
    {label: "Villa", name: "villa", icon: <VillaIcon/>},
  ];

  const selectedCategory = categoriesList.filter((category) => selected==category.name);

  return (
    <>
      {selectedCategory.map((category) => (
        <label
          key={category.name}
          className="order p-3 flex rounded-2xl gap-1 items-center"
        >
          <output name={category.name}/>
          <div style={{width: 30}}>{category.icon}</div>
          <span>{category.label}</span>
        </label>
      ))}
    </>
  );
}
