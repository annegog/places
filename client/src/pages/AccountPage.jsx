import { useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccounNav.jsx";
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
