import {Link} from "react-router-dom";
import React, { useContext, useState } from 'react';
import './App.css';
// import { UserContext } from "./UserContext";
import { AdminContext } from "./AdminContext";

export default function AdminHeader(){
    const {admin} = useContext(AdminContext);
    
    return(
        <div>
            <header className="header"> 
                <Link to={'/admin'} className="flex items-center gap-2"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="font-bold text-xl">Places</span>
                </Link>

                <Link to={'/admin'} className="flex gap-2 items-center border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-250">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 relative button-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg> */}
                    <div className="rounded-full item-button border border-gray-600 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative top-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    {!!admin && (
                        <div>
                            {admin.username}
                        </div>
                    )}
                </Link>
            </header>
        </div>

    )
}