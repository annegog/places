import {Link, Navigate} from "react-router-dom";
import React, { useContext, useState } from 'react';
import './App.css';
import { AdminContext } from "./AdminContext";
import logo from "./logo.png"
import axios from "axios";

export default function AdminHeader(){
    const {admin, setAdmin} = useContext(AdminContext);

    const [redirect, setRedirect] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);

    const handleToggleMenu = () => {
        setToggleMenu(!toggleMenu);
    };

    async function logout() {
        await axios.post("/logout");
        setAdmin(null);
        setToggleMenu(false);
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={"/"} />;
    }
    
    return(
        <div>
            <header className="header"> 
                <Link to={'/'} className="text-center flex items-center"> 
                    <img src={logo} alt="logo" className="object-f w-12 rounded-lg mr-2"/> 
                    <span className="text-indigo-400 tracking-tighter font-bold text-xl logo-text">Find Your Place</span>
                </Link>

                <div className="flex gap-2 items-center border border-gray-300 rounded-full py-2 pr-4 pl-2 shadow-md shadow-gray-250">
                    {!!admin && 
                        <button 
                            className="flex bg-transparent "
                            onClick={handleToggleMenu}>
                            {toggleMenu ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            )} 
                            

                        </button>
                    }
                    {/*επειδη αρκετα ασχοληθηκα, αν προλαβουμε να του φτιαξουμε την θεση
                    αλλιως μπορουμε να αφησουμε σταθερα εκει το logout button*/}
                    {!!admin && toggleMenu && (
                        <button  
                            className="bg-primary text-white w-min rounded-2xl px-2 py-1 "
                            onClick={logout}>
                            Logout
                        </button>
                    )}
                    <Link to={'/admin/profile'} className="flex gap-2 items-center">
                        <div className="rounded-full item-button border border-gray-600 overflow-hidden">  
                            {admin && admin.profilephoto?.[0] ?  ( 
                                <ImageProfile
                                className="rounded-3xl w-8 object-cover aspect-square"
                                src={admin.profilephoto?.[0]}
                                alt=""
                            />
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative top-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        
                            )}
                        </div>
                        {!!admin && (
                            <div>
                                {admin.username}
                            </div>
                        )}

                    </Link> 
                </div>
            </header>
        </div>

    )
}