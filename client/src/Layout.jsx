import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout(){
    return(
        <div className="p-4 flex-col miin-h-screen max-w-4xl mx-auto"> 
            <Header/>
            <Outlet />
        </div>
    )
}