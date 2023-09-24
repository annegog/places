import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "./AdminContext";
import AdminHeader from "./AdminHeader";

export default function Layout(){
    const {admin} = useContext(AdminContext);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(admin !== null);
    }, [admin]);

    return(
        <div className="px-10 py-4 flex-col min-h-screen max-w-1xl mx-auto"> 
            {isAdmin ? <AdminHeader /> : <Header />}
            <Outlet />
        </div>
    )
}