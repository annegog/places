import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../AdminContext.jsx";
import AdminNav from "../AdminNav"
import HostsPage from "./HostsPage.jsx";
import TenantsPage from "./TenantsPage.jsx";
import UsersPage from "./UsersPage.jsx";
import AdminProfile from "./AdminProfile.jsx";

export default function AdminPage() {
  const { ready } = useContext(AdminContext);

  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }
  
  if (!ready) {
    return (
      <div className="flex justify-center items-center ">
        <div className="mt-20 text-lg text-white bg-gray-500 rounded-full w-fit px-4 py-1">
          Data Loading... Try to refresh!
        </div>
      </div>
    );
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
