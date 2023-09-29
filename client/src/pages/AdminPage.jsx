import { useParams } from "react-router-dom";
import AdminNav from "../AdminNav"
import HostsPage from "./HostsPage.jsx";
import TenantsPage from "./TenantsPage.jsx";
import UsersPage from "./UsersPage.jsx";
import AdminProfile from "./AdminProfile.jsx";

export default function AdminPage() {
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  return (
    <div>
      <AdminNav />
      {subpage === "profile" && <AdminProfile />}
      {subpage === "users" && <UsersPage />}
      {subpage === "hosts" && <HostsPage />}
      {subpage === "tenants" && <TenantsPage />}
    </div>
  );
}
