import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccounNav.jsx";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading...";
  }

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center ">
          Logged in as {user.username} ({}) <br />
          <button onClick={logout} className="primary max-w-xs mt-10">
            {" "}
            Logout{" "}
          </button>
        </div>
      )}
      {subpage == "places" && <PlacesPage />}
    </div>
  );
}
