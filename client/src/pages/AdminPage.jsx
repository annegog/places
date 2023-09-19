import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../AdminContext.jsx";
import AdminNav from "../AdminNav"
import HostsPage from "./HostsPage.jsx";
import TenantsPage from "./TenantsPage.jsx";
import UsersPage from "./UsersPage.jsx";

export default function AdminPage() {
  const { ready } = useContext(AdminContext);

  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "users";
  }
  
  if (!ready) {
    return "Loading...";
  }

  return (
    <div>
      <AdminNav />
      {subpage === "users" && <UsersPage />}
      {subpage === "hosts" && <HostsPage />}
      {subpage === "tenants" && <TenantsPage />}
    </div>
  );
}
