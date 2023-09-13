import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccounNav.jsx";
import ImageProfile from "../ImageProfile";
import ProfilePage from "./ProfilePage.jsx";


export default function AccountPage() {

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && <ProfilePage />}
      {subpage == "places" && <PlacesPage />}
    </div>
  );
}
