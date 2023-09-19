
import React from "react";
import { ReactComponent as LikeIcon } from "./assets/svg/like.svg";
import { ReactComponent as HomeIcon } from "./assets/svg/home.svg";

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
    { label: "Single", name: "single", icon: <HomeIcon /> },
    { label: "Big", name: "big", icon: <LikeIcon /> },
    { label: "Very Big", name: "verybig", icon: <LikeIcon /> },
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
              onClick={handleCheckBox}
            />
            <div style={{ width: 30 }}>{category.icon}</div>
            <span>{category.label}</span>
          </label>
        ))}
    </>
  );
}
      