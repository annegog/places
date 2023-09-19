
import React from "react";
import { ReactComponent as LikeIcon } from "./assets/svg/like.svg";
import { ReactComponent as HomeIcon } from "./assets/svg/home.svg";


export default function CategoryShow({ selected }) {

  const categoriesList = [
    { label: "Single", name: "single", icon: <HomeIcon /> },
    { label: "Big", name: "big", icon: <LikeIcon /> },
    { label: "Very Big", name: "verybig", icon: <LikeIcon /> },
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
