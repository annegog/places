import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout(){
    return(
        <div className="px-10 py-4 flex-col min-h-screen max-w-1xl mx-auto"> 
            <Header/>
            <Outlet />
        </div>
    )
}