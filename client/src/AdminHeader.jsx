import {Link} from "react-router-dom";
import React, { useContext, useState } from 'react';
import './App.css';
import { AdminContext } from "./AdminContext";
import logo from "./logo.png"

export default function AdminHeader(){
    const {admin} = useContext(AdminContext);
    
    return(
        <div>
            <header className="header"> 
                <Link to={'/admin'} className="text-center flex items-center"> 
                    <img src={logo} alt="logo" className="object-f w-12 rounded-lg mr-2"/> 
                    <span className="text-indigo-400 tracking-tighter font-bold text-xl logo-text">Find Your Place</span>
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